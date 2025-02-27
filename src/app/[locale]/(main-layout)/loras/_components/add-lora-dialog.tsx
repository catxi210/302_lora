"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSetAtom, useAtomValue } from "jotai";
import {
  addCustomLora,
  editCustomLora,
  customLorasAtom,
} from "@/stores/slices/lora_store";
import { configLoraStateAtom } from "@/stores/slices/config_lora_store";
import { useToast } from "@/hooks/global/use-toast";
import { useUnifiedFileUpload } from "@/hooks/global/use-unified-file-upload";
import { AlertCircleIcon, ImageIcon, KeyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LoraItem } from "@/data/loras";
import { useConfig } from "@/hooks/use-remote-config";
import { getCivitaiModelInfo } from "@/api";
import { nanoid } from "nanoid";
import { createScopedLogger } from "@/utils";

const logger = createScopedLogger("add-lora-dialog");

interface AddLoraFormData {
  name: string;
  url: string;
  description: string;
  sizeKb?: number;
  imageUrl?: string;
}

interface AddLoraDialogProps {
  open: boolean;
  onClose: () => void;
  editingLora?: LoraItem;
}

export function AddLoraDialog({
  open,
  onClose,
  editingLora,
}: AddLoraDialogProps) {
  const t = useTranslations("loras");
  const handleAddLora = useSetAtom(addCustomLora);
  const handleEditLora = useSetAtom(editCustomLora);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [hasNewImage, setHasNewImage] = React.useState(false);
  const [isCivitaiUrl, setIsCivitaiUrl] = React.useState(false);
  const [civitaiKey, setCivitaiKey] = React.useState("");
  const [civitaiModelId, setCivitaiModelId] = React.useState<
    string | undefined
  >(undefined);
  const [isLargeModel, setIsLargeModel] = React.useState(false);
  const configLora = useAtomValue(configLoraStateAtom);
  const setConfigLora = useSetAtom(configLoraStateAtom);
  const customLoras = useAtomValue(customLorasAtom);
  const { fetchConfig, updateConfigValues, isReady } = useConfig();
  const [syncingConfig, setSyncingConfig] = React.useState(false);
  const [isLoadingModelInfo, setIsLoadingModelInfo] = React.useState(false);
  const [modelInfoFetched, setModelInfoFetched] = React.useState(false);
  const MAX_MODEL_SIZE_KB = 1024 * 1024; // 1GB

  const [formData, setFormData] = React.useState<AddLoraFormData>({
    name: "",
    url: "",
    description: "",
  });

  React.useEffect(() => {
    if (configLora.civitaiKey) {
      setCivitaiKey(configLora.civitaiKey);
    }
  }, [configLora.civitaiKey]);

  // Reset form data when dialog opens/closes or editingLora changes
  React.useEffect(() => {
    if (editingLora) {
      setFormData({
        name: editingLora.name,
        url: editingLora.url,
        description: editingLora.description,
      });
      setHasNewImage(false);
      // Check if current URL is from civitai
      checkCivitaiUrl(editingLora.url);
      logger.info("editingLora.sizeKb", editingLora.sizeKb);
      setIsLargeModel(
        editingLora.sizeKb ? editingLora.sizeKb > 1024 * 1024 : false
      );
      setModelInfoFetched(true);
    } else {
      setFormData({
        name: "",
        url: "",
        description: "",
      });
      setHasNewImage(false);
      setIsCivitaiUrl(false);
      setIsLargeModel(false);
      setModelInfoFetched(false);
      setCivitaiModelId(undefined);
    }

    // Load stored civitai key if available
    if (configLora.civitaiKey) {
      setCivitaiKey(configLora.civitaiKey);
    }
  }, [editingLora, open, configLora.civitaiKey, setCivitaiKey]);

  const extractCivitaiModelVersionId = (url: string): string | undefined => {
    // https://civitai.com/models/12345/modelname?modelVersionId=67890
    const modelVersionIdMatch = url.match(/modelVersionId=(\d+)/i);
    if (modelVersionIdMatch) {
      return modelVersionIdMatch[1];
    }

    // https://civitai.com/models/12345/modelname/v2
    const versionPathMatch = url.match(/\/models\/\d+\/[^/]+\/v(\d+)/i);
    if (versionPathMatch) {
      return undefined;
    }

    // https://civitai.com/api/download/models/12345
    const apiDownloadMatch = url.match(/\/api\/download\/models\/(\d+)/i);
    if (apiDownloadMatch) {
      return apiDownloadMatch[1];
    }

    return undefined;
  };

  const fetchCivitaiModelInfo = async (modelVersionId: string) => {
    if (!modelVersionId || !civitaiKey) return;

    if (modelInfoFetched) return;

    setIsLoadingModelInfo(true);

    try {
      const data = await getCivitaiModelInfo(modelVersionId, civitaiKey);

      if (data.images && data.images.length > 0 && data.images[0].url) {
        const imageUrl = data.images[0].url;
      }

      setFormData((prev) => ({
        ...prev,
        name: prev.name || data.name,
        description:
          prev.description ||
          (data.description ? stripHtmlTags(data.description) : ""),
        sizeKb: (data.files && data.files[0]?.sizeKB) || 0,
        imageUrl:
          data.images && data.images.length > 0
            ? data.images[0].url
            : undefined,
      }));

      setIsLargeModel(data.files[0]?.sizeKB > 1024 * 1024);
      setModelInfoFetched(true);
    } catch (error) {
      setModelInfoFetched(false);
      logger.error("Error fetching model info:", error);
    } finally {
      setIsLoadingModelInfo(false);
    }
  };

  // Function to check if URL is from Civitai
  const checkCivitaiUrl = (url: string) => {
    const isCivitai = url.toLowerCase().includes("civitai.com");
    setIsCivitaiUrl(isCivitai);

    if (isCivitai) {
      const modelId = extractCivitaiModelVersionId(url);
      setCivitaiModelId(modelId || undefined);
    } else {
      setCivitaiModelId(undefined);
      setIsLargeModel(false);
    }
  };

  const stripHtmlTags = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const { handleFileSelect, uploadedFiles, isUploading } = useUnifiedFileUpload(
    {
      validationConfig: {
        maxFiles: 1,
        acceptedTypes: {
          "image/": [".jpg", ".jpeg", ".png", ".webp"],
        },
      },
      onUploadSuccess: (files) => {
        if (files[0]) {
          setHasNewImage(true);
          toast({
            description: t("addDialog.imageUploadSuccess"),
          });
        }
      },
      onUploadError: (error) => {
        toast({
          description: t("addDialog.imageUploadError"),
          variant: "destructive",
        });
      },
      autoUpload: true, // Enable autoUpload
    }
  );

  // Get the effective image URL
  const imageUrl = React.useMemo(() => {
    if (hasNewImage && uploadedFiles[0]?.url) {
      return uploadedFiles[0].url;
    } else if (formData.imageUrl) {
      return formData.imageUrl;
    }
    return editingLora?.imageUrl;
  }, [editingLora?.imageUrl, hasNewImage, uploadedFiles, formData.imageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!imageUrl) {
        toast({
          description: t("addDialog.noImageError"),
          variant: "destructive",
        });
        return;
      }

      // Check if we need a Civitai key and if it's provided
      if (isCivitaiUrl && !civitaiKey) {
        toast({
          description: t("addDialog.civitaiKeyRequired"),
          variant: "destructive",
        });
        return;
      }

      if (
        isCivitaiUrl &&
        civitaiModelId &&
        civitaiKey &&
        !formData.sizeKb &&
        !modelInfoFetched
      ) {
        toast({
          description: t("addDialog.fetchingModelInfo"),
          variant: "default",
        });
        await fetchCivitaiModelInfo(civitaiModelId);
      }

      if (formData.sizeKb && formData.sizeKb > MAX_MODEL_SIZE_KB) {
        toast({
          description: t("addDialog.modelTooLarge"),
          variant: "destructive",
        });
        return;
      }

      if (isCivitaiUrl && civitaiKey) {
        setConfigLora({
          ...configLora,
          civitaiKey: civitaiKey,
        });
      }

      const loraData = {
        ...formData,
        imageUrl,
        weight: 0.85,
        defaultParams: {
          steps: 28,
          guidance: 3.5,
          loraScale: 0.85,
        },
        ...(isCivitaiUrl && { civitaiKey, civitaiModelId }),
        ...(formData.sizeKb && { sizeKb: formData.sizeKb }),
      };

      let updatedItems: LoraItem[] = [];

      if (editingLora) {
        handleEditLora({
          id: editingLora.id,
          ...loraData,
        });

        const currentItems = [...customLoras.items];
        updatedItems = currentItems.map((item) =>
          item.id === editingLora.id
            ? { ...item, ...loraData, id: editingLora.id }
            : item
        );

        toast({
          title: t("editDialog.success"),
          description: t("editDialog.successDescription"),
        });
      } else {
        const newLoraId = nanoid();

        const newLoraItem: LoraItem = {
          id: newLoraId,
          ...loraData,
          category: "custom",
        };

        handleAddLora(newLoraItem);
        updatedItems = [...customLoras.items, newLoraItem];

        toast({
          title: t("addDialog.success"),
          description: t("addDialog.successDescription"),
        });
      }

      toast({
        title: t("addDialog.syncing"),
        description: t("addDialog.syncingDescription"),
      });

      if (isReady) {
        try {
          setSyncingConfig(true);
          const configData = await fetchConfig();
          await updateConfigValues(
            { customLoras: { items: updatedItems } },
            configData.version
          );
          logger.info("LoRA config synced to remote server successfully");
          toast({
            title: t("addDialog.syncSuccess"),
            description: t("addDialog.syncSuccessDescription"),
          });
        } catch (error) {
          logger.error("Failed to sync LoRA config to remote server:", error);
          toast({
            title: t("addDialog.syncError"),
            description: t("addDialog.syncErrorDescription"),
            variant: "destructive",
          });
        } finally {
          setSyncingConfig(false);
        }
      }

      onClose();
    } catch (error) {
      toast({
        title: editingLora ? t("editDialog.error") : t("addDialog.error"),
        description: editingLora
          ? t("editDialog.errorDescription")
          : t("addDialog.errorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if URL is from Civitai when URL field changes
    if (name === "url") {
      checkCivitaiUrl(value);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        sizeKb: undefined,
      }));

      setModelInfoFetched(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    if (civitaiKey && civitaiModelId && isCivitaiUrl && !modelInfoFetched) {
      fetchCivitaiModelInfo(civitaiModelId);
    }
  }, [civitaiKey, civitaiModelId, isCivitaiUrl, modelInfoFetched]);

  React.useEffect(() => {
    if (formData.sizeKb && formData.sizeKb > MAX_MODEL_SIZE_KB) {
      setIsLargeModel(true);
      toast({
        description: t("addDialog.modelTooLarge"),
      });
    }
  }, [formData.sizeKb, t, toast, MAX_MODEL_SIZE_KB]);

  const modelSizeInGB = formData.sizeKb
    ? (formData.sizeKb / (1024 * 1024)).toFixed(2)
    : null;

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      logger.info("Files dropped:", files); // Changed log level to info
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <DialogTitle>
            {editingLora ? t("editDialog.title") : t("addDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url" className="text-xs sm:text-sm">
                {t("addDialog.url")} *
              </Label>
              <Link
                href="https://civitai.com/models"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                {t("addDialog.civitaiModels")}
              </Link>
            </div>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://civitai.com/api/download/models/xxxxx"
              className="bg-muted/50"
            />
          </div>

          {isCivitaiUrl && (
            <div className="space-y-2">{renderCivitaiKeyInput()}</div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>{t("addDialog.uploadImage")}</Label>
            <div
              className={cn(
                "group relative h-40 overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:h-48",
                isUploading ? "opacity-50" : "hover:border-primary"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div className="relative h-full">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-contain group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white/90">
                      {t("addDialog.clickToChange")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t("addDialog.dragTip")}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) handleFileSelect(e.target.files[0]);
                }}
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">
              {t("addDialog.name")} *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-muted/50"
            />
          </div>

          {isLargeModel && (
            <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/30">
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {t("addDialog.largeModelWarning")}
                </h3>
              </div>
              {modelSizeInGB && (
                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  {t("addDialog.modelSize", {
                    size: modelSizeInGB,
                  })}{" "}
                  {t("addDialog.modelTooLargeDescription")}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">
              {t("addDialog.description")} *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="min-h-[100px] bg-muted/50"
            />
          </div>

          {/* Actions */}
          <div className="-mx-4 -mb-4 mt-auto flex justify-end gap-2 border-t bg-muted/50 px-4 py-3 sm:-mx-6 sm:px-6 sm:py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="sm:text-sm"
              onClick={onClose}
            >
              {t("addDialog.cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="sm:text-sm"
              disabled={isUploading || isLoadingModelInfo || isLargeModel}
            >
              {editingLora ? t("editDialog.submit") : t("addDialog.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  function renderCivitaiKeyInput() {
    return (
      <>
        <div className="flex items-center justify-between">
          <Label htmlFor="civitaiKey" className="text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <KeyIcon className="h-3.5 w-3.5" />
              {t("config.civitaiKeyLabel")}
            </div>
          </Label>
          <span className="text-xs text-muted-foreground">
            {t("config.civitaiKeyTooltip")}
          </span>
        </div>
        <Input
          id="civitaiKey"
          name="civitaiKey"
          value={civitaiKey}
          onChange={(e) => setCivitaiKey(e.target.value)}
          placeholder={t("config.civitaiKeyPlaceholder")}
          className="bg-muted/50"
        />
      </>
    );
  }
}
