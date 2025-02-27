"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/global/use-toast";
import { useUnifiedFileUpload } from "@/hooks/global/use-unified-file-upload";
import { ImageIcon, Sparkles, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  trainingStateAtom,
  submitTraining,
  checkTrainingStatus,
  resetTrainingState,
} from "@/stores/slices/train_store";
import { addCustomLora } from "@/stores/slices/lora_store";
import { trainService } from "@/services/train";
import { useRouter } from "@/i18n/routing";
import { createScopedLogger } from "@/utils";

const logger = createScopedLogger("train");

export default function TrainPage() {
  const t = useTranslations("train");
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const pollIntervalRef = React.useRef<NodeJS.Timeout>();
  const isPollingRef = React.useRef(false);

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    trigger_word: "",
    steps: 1000,
    is_style: false,
    create_masks: true,
  });
  const [hasUploadedFile, setHasUploadedFile] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isLoraAdded, setIsLoraAdded] = React.useState(false);

  const [showLineArtDialog, setShowLineArtDialog] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const lineArtImageUrl =
    "https://file.302.ai/gpt/imgs/20250225/0d01d25847be4075846fe0e711f19aea.zip";
  const lineArtPreviewImageUrl =
    "https://file.302.ai/gpt/imgs/20250225/eaad3c610ea34c5eabfdb2ee9026239f.png";

  const [directUrl, setDirectUrl] = React.useState("");
  const [useDirectUrl, setUseDirectUrl] = React.useState(false);

  const handleShowDatasetDetails = React.useCallback(() => {
    setShowLineArtDialog(true);
  }, []);

  const [trainingState, setTrainingState] = useAtom(trainingStateAtom);
  const handleSubmitTraining = useSetAtom(submitTraining);
  const handleCheckStatus = useSetAtom(checkTrainingStatus);
  const handleResetState = useSetAtom(resetTrainingState);
  const handleAddCustomLora = useSetAtom(addCustomLora);

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearTimeout(pollIntervalRef.current);
      }
      isPollingRef.current = false;
    };
  }, []);

  const { handleFileSelect, uploadedFiles, isUploading } = useUnifiedFileUpload(
    {
      validationConfig: {
        maxFiles: 1,
        acceptedTypes: {
          "application/zip": [".zip"],
          "application/x-zip-compressed": [".zip"],
        },
      },
      onUploadSuccess: (files) => {
        if (files[0]) {
          setHasUploadedFile(true);
          toast({
            description: t("imageUploadSuccess"),
          });
        }
      },
      onUploadError: (error) => {
        toast({
          description: t("imageUploadError"),
          variant: "destructive",
        });
      },
      autoUpload: true,
    }
  );

  // Get the effective file URL
  const fileUrl = React.useMemo(() => {
    if (useDirectUrl && directUrl) {
      return directUrl;
    }
    if (hasUploadedFile && uploadedFiles[0]?.url) {
      return uploadedFiles[0].url;
    }
    return null;
  }, [hasUploadedFile, uploadedFiles, useDirectUrl, directUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleStepsChange = (value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      steps: value[0],
    }));
  };

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startPolling = React.useCallback(async () => {
    if (!isPollingRef.current) return;

    try {
      const result = await handleCheckStatus();

      if (result && trainService.isTrainingResult(result)) {
        // Stop polling
        isPollingRef.current = false;

        // Add LoRA only if not already added
        if (!isLoraAdded) {
          handleAddCustomLora({
            name: formData.name,
            description: formData.description,
            url: result.diffusers_lora_file.url,
            imageUrl: previewImage!,
            weight: 0.85,
            defaultParams: {
              steps: 28,
              guidance: 3.5,
              loraScale: 0.85,
            },
          });

          setIsLoraAdded(true);
          toast({
            description: t("trainingSuccess"),
          });

          router.push("/loras?category=custom");
        }
      } else {
        // Schedule next poll only if we're still polling
        if (isPollingRef.current) {
          pollIntervalRef.current = setTimeout(startPolling, 5000);
        }
      }
    } catch (error) {
      // Stop polling on error
      isPollingRef.current = false;
      logger.error("Training status check failed:", error);
      toast({
        description: t("trainingError"),
        variant: "destructive",
      });
    }
  }, [
    handleCheckStatus,
    isLoraAdded,
    formData,
    previewImage,
    handleAddCustomLora,
    t,
    router,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileUrl) {
      toast({
        description: useDirectUrl
          ? t("lineArt.pleaseEnterUrl")
          : t("noImagesError"),
        variant: "destructive",
      });
      return;
    }

    if (!previewImage) {
      toast({
        description: t("noPreviewImageError"),
        variant: "destructive",
      });
      return;
    }

    // Reset states
    setIsLoraAdded(false);
    handleResetState();

    // Stop any existing polling
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current);
    }
    isPollingRef.current = false;

    try {
      const requestId = await handleSubmitTraining({
        name: formData.name,
        description: formData.description,
        images_data_url: fileUrl as string,
        ...(formData.trigger_word && { trigger_word: formData.trigger_word }),
        is_style: formData.is_style,
        create_masks: formData.create_masks,
        steps: formData.steps,
      });

      // Start new polling
      isPollingRef.current = true;
      startPolling();
    } catch (error) {
      toast({
        description: t("trainingError"),
        variant: "destructive",
      });
    }
  };

  // Function to handle line drawing example data
  const handleLoadLineDrawingExample = React.useCallback(() => {
    // Set the form data with line drawing specific values
    setFormData({
      name: t("lineArt.name"),
      description: t("lineArt.description"),
      trigger_word: t("lineArt.triggerWord"),
      steps: 1500,
      is_style: true,
      create_masks: true,
    });

    setDirectUrl(lineArtImageUrl);
    setUseDirectUrl(true);
    setPreviewImage(lineArtPreviewImageUrl);

    toast({
      title: t("lineArt.loadedTitle"),
      description: t("lineArt.loadedDescription"),
    });
  }, [t, toast]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        description: t("lineArt.copySuccess"),
      });
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        description: t("lineArt.copyError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadLineDrawingExample}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t("lineArt.buttonText")}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">{t("loraName")}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t("loraNamePlaceholder")}
            className="bg-muted/50"
          />
        </div>

        <Dialog open={showLineArtDialog} onOpenChange={setShowLineArtDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("lineArt.dialogTitle")}</DialogTitle>
              <DialogDescription>
                {t("lineArt.dialogDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="trainingUrl">
                  {t("lineArt.trainingUrlLabel")}
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="trainingUrl"
                    value={lineArtImageUrl}
                    readOnly
                    className="flex-1 bg-muted/30"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(lineArtImageUrl)}
                    className="flex-shrink-0"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {t("lineArt.instructionsTitle")}
                </h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>
                    {t("lineArt.instruction1")}{" "}
                    <span className="font-mono">
                      {t("lineArt.triggerWord")}
                    </span>
                  </li>
                  <li>{t("lineArt.instruction2")}</li>
                  <li>{t("lineArt.instruction3")}</li>
                  <li>{t("lineArt.instruction4")}</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setShowLineArtDialog(false)}>
                {t("lineArt.closeButton")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          <Label htmlFor="description">{t("modelDescription")}</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder={t("modelDescriptionPlaceholder")}
            className="min-h-[100px] bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t("trainingImages")}</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="use_direct_url"
                checked={useDirectUrl}
                onCheckedChange={setUseDirectUrl}
              />
              <Label
                htmlFor="use_direct_url"
                className="cursor-pointer text-sm"
              >
                {t("lineArt.useUrlLink")}
              </Label>
            </div>
          </div>

          {useDirectUrl ? (
            <div className="space-y-2">
              <Input
                placeholder={t("lineArt.enterUrlPlaceholder")}
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                className="bg-muted/50"
              />
              {directUrl === lineArtImageUrl && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-green-500">
                    {t("lineArt.urlSetSuccessfully")}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    className="text-xs text-primary"
                    onClick={handleShowDatasetDetails}
                  >
                    {t("lineArt.viewDataDetails")}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "group relative h-40 overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:h-48",
                isUploading ? "opacity-50" : "hover:border-primary"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {fileUrl && !useDirectUrl ? (
                <div className="relative h-full">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {uploadedFiles[0]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white/90">
                      {t("clickToChange")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t("dragTip")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("zipFileNote")}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".zip"
                onChange={(e) => {
                  if (e.target.files) handleFileSelect(e.target.files[0]);
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="trigger_word">{t("triggerWord")}</Label>
          <Input
            id="trigger_word"
            name="trigger_word"
            value={formData.trigger_word}
            onChange={handleChange}
            placeholder={t("triggerWordPlaceholder")}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("trainingSteps")}</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.steps]}
                onValueChange={handleStepsChange}
                min={100}
                max={5000}
                step={100}
                className="flex-1"
              />
              <span className="w-16 text-right text-sm">{formData.steps}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_style">{t("styleTraining")}</Label>
            <Switch
              id="is_style"
              checked={formData.is_style}
              onCheckedChange={handleSwitchChange("is_style")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="create_masks">{t("createMasks")}</Label>
            <Switch
              id="create_masks"
              checked={formData.create_masks}
              onCheckedChange={handleSwitchChange("create_masks")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("previewImage")}</Label>
          <div
            className={cn(
              "group relative h-60 overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:h-72",
              "hover:border-primary"
            )}
            onClick={() =>
              document.getElementById("preview-image-input")?.click()
            }
          >
            {previewImage ? (
              <div className="relative h-full">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <p className="text-sm text-white/90">{t("clickToChange")}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t("uploadPreviewImage")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("previewImageNote")}
                </p>
              </div>
            )}
            <input
              id="preview-image-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePreviewImageChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isUploading || trainingState.status === "training"}
        >
          {trainingState.status === "training"
            ? t("training")
            : t("startTraining")}
        </Button>
      </form>
    </div>
  );
}
