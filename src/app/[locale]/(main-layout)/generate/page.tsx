"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Loader2,
  Maximize2Icon,
  RotateCcw,
  SaveIcon,
  ArrowLeftCircle,
  Sparkles,
} from "lucide-react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import { useAtom, useSetAtom } from "jotai";
import {
  selectedLoraAtom,
  promptAtom,
  displayPromptAtom,
  originalPromptAtom,
  autoTranslateAtom,
  negativePromptAtom,
  displayNegativePromptAtom,
  originalNegativePromptAtom,
  widthAtom,
  heightAtom,
  stepsAtom,
  guidanceAtom,
  loraScaleAtom,
  elapsedTimeAtom,
  syncSelectedLoraWithUrl,
  resetGenerateState,
  isGeneratingAtom,
  resultAtom,
  startTimeAtom,
  updateElapsedTime,
} from "@/stores/slices/generate_store";
import { generateImage } from "@/api/generate";
import { emitter } from "@/utils/mitt";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import { addHistoryRecord } from "@/stores/slices/history_store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { randomPrompts } from "@/data/prompts";
import { useLocale } from "next-intl";
import { translate } from "@/services/trans";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createScopedLogger } from "@/utils";

const logger = createScopedLogger("generate");

const getRandomPrompt = (
  category: string,
  locale: string
): { display: string; original: string; index: number } => {
  const categoryPrompts =
    randomPrompts[category as keyof typeof randomPrompts] ||
    randomPrompts.custom;

  const randomIndex = Math.floor(Math.random() * categoryPrompts.en.length);

  let displayPrompt = "";
  if (locale === "zh" && categoryPrompts.zh) {
    displayPrompt = categoryPrompts.zh[randomIndex];
  } else if (locale === "ja" && categoryPrompts.ja) {
    displayPrompt = categoryPrompts.ja[randomIndex];
  } else {
    displayPrompt = categoryPrompts.en[randomIndex];
  }

  const originalPrompt = categoryPrompts._original[randomIndex];

  return {
    display: displayPrompt,
    original: originalPrompt,
    index: randomIndex,
  };
};

export default function GeneratePage() {
  const t = useTranslations("generate");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const loraId = searchParams.get("lora");
  const router = useRouter();

  // Sync URL with store
  const syncWithUrl = useSetAtom(syncSelectedLoraWithUrl);
  React.useEffect(() => {
    syncWithUrl(loraId);
  }, [syncWithUrl, loraId]);

  // Generation state
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAtom);
  const [result, setResult] = useAtom(resultAtom);

  // Form state
  const [selectedLora] = useAtom(selectedLoraAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [displayPrompt, setDisplayPrompt] = useAtom(displayPromptAtom);
  const [originalPrompt, setOriginalPrompt] = useAtom(originalPromptAtom);
  const [negativePrompt, setNegativePrompt] = useAtom(negativePromptAtom);
  const [displayNegativePrompt, setDisplayNegativePrompt] = useAtom(
    displayNegativePromptAtom
  );
  const [originalNegativePrompt, setOriginalNegativePrompt] = useAtom(
    originalNegativePromptAtom
  );
  const [width, setWidth] = useAtom(widthAtom);
  const [height, setHeight] = useAtom(heightAtom);
  const [steps, setSteps] = useAtom(stepsAtom);
  const [guidance, setGuidance] = useAtom(guidanceAtom);
  const [loraScale, setLoraScale] = useAtom(loraScaleAtom);
  const [elapsedTime] = useAtom(elapsedTimeAtom);
  const [, setStartTime] = useAtom(startTimeAtom);
  const updateTimer = useSetAtom(updateElapsedTime);
  const handleReset = useSetAtom(resetGenerateState);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const { handleDownload } = useMonitorMessage();
  const saveToHistory = useSetAtom(addHistoryRecord);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [autoTranslate, setAutoTranslate] = useAtom(autoTranslateAtom);

  const handleRandomPrompt = React.useCallback(() => {
    const category = selectedLora?.category || "style";

    const { display: localizedPrompt, original: engPrompt } = getRandomPrompt(
      category,
      locale
    );

    setDisplayPrompt(localizedPrompt);

    if (locale === "en") {
      setOriginalPrompt(engPrompt);
    } else {
      setOriginalPrompt("");
    }

    setPrompt(engPrompt);

    toast(t("randomPrompts.success"), {
      description: t("randomPrompts.basedOnLora") + `: ${localizedPrompt}`,
    });
  }, [selectedLora, setPrompt, setDisplayPrompt, setOriginalPrompt, t, locale]);

  const translatePrompt = React.useCallback(
    async (
      textToTranslate: string
    ): Promise<{ success: boolean; text: string }> => {
      if (!textToTranslate || textToTranslate.trim() === "") {
        return { success: true, text: textToTranslate };
      }

      try {
        logger.info("Translating text:", textToTranslate);

        const { text: translatedText } = await translate({
          text: textToTranslate,
        });

        logger.info("Translation result:", translatedText);

        return { success: true, text: translatedText };
      } catch (error) {
        logger.error("Translation failed:", error);
        return { success: false, text: textToTranslate };
      }
    },
    []
  );

  // Timer effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      setStartTime(Date.now());
      timer = setInterval(() => {
        updateTimer();
      }, 1000);
    } else {
      setStartTime(null);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating, setStartTime, updateTimer]);

  // Function to navigate to LoRA list and highlight selected LoRA
  const handleNavigateToLoraList = React.useCallback(() => {
    router.push(
      `/loras?category=${selectedLora.category || "style"}&highlight=${selectedLora.id}`
    );
  }, [router, selectedLora]);

  // Handle image generation
  const handleGenerate = React.useCallback(async () => {
    try {
      setIsGenerating(true);
      setResult(null); // Clear previous result

      let userPrompt = displayPrompt || prompt;
      let userNegativePrompt = displayNegativePrompt || negativePrompt;

      if (autoTranslate && locale !== "en") {
        toast(t("prompt.translatingBoth"));

        let allTranslationsSuccessful = true;

        const translationResults = [];

        translationResults.push(
          translatePrompt(userPrompt).then((result) => {
            if (!result.success) {
              allTranslationsSuccessful = false;
            }
            setOriginalPrompt(result.text);
            userPrompt = result.text;
          })
        );

        if (userNegativePrompt && userNegativePrompt.trim() !== "") {
          translationResults.push(
            translatePrompt(userNegativePrompt).then((result) => {
              if (!result.success) {
                allTranslationsSuccessful = false;
              }
              setOriginalNegativePrompt(result.text);
              userNegativePrompt = result.text;
            })
          );
        }

        await Promise.all(translationResults);

        if (allTranslationsSuccessful) {
          toast.success(t("prompt.translationSuccess"));
        } else {
          toast.error(t("prompt.translationFailed"));
        }
      } else {
        userPrompt = originalPrompt || userPrompt;
        userNegativePrompt = originalNegativePrompt || userNegativePrompt;
      }

      logger.info("Using prompt for generation:", userPrompt);
      logger.info("Using negative prompt for generation:", userNegativePrompt);

      const actualPrompt = selectedLora.prompt
        ? `${selectedLora.prompt}, ${userPrompt}`
        : userPrompt;

      logger.info("Final prompt with trigger word:", actualPrompt);

      const response = await generateImage({
        prompt: actualPrompt,
        negative_prompt: userNegativePrompt,
        image_size: {
          width,
          height,
        },
        guidance_scale: guidance,
        num_inference_steps: steps,
        loras: [
          {
            path: selectedLora.url,
            scale: loraScale,
          },
        ],
      });
      setResult(response);
      // Save to history
      if (response.images?.[0]) {
        saveToHistory({
          imageUrl: response.images[0].url,
          prompt: actualPrompt,
          negativePrompt: userNegativePrompt,
          parameters: {
            width,
            height,
            steps,
            guidance,
            loraScale,
          },
          lora: selectedLora,
        });
      }
    } catch (error) {
      logger.error("Generation failed:", error);
      emitter.emit("ToastError", {
        code: -1,
        message: "Image generation failed",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    prompt,
    displayPrompt,
    originalPrompt,
    negativePrompt,
    displayNegativePrompt,
    originalNegativePrompt,
    width,
    height,
    guidance,
    steps,
    selectedLora,
    loraScale,
    setIsGenerating,
    setResult,
    translatePrompt,
    autoTranslate,
    locale,
    setOriginalPrompt,
    setOriginalNegativePrompt,
    t,
  ]);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-1 flex-col overflow-auto",
        "bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background",
        "relative isolate"
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/10 to-primary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      <main className="flex-1 px-2 py-4 sm:px-6 sm:py-8">
        <div className="mx-auto grid h-full max-w-[1800px] grid-cols-1 gap-4 @container lg:grid-cols-[1fr,1.5fr] lg:gap-6">
          {/* Left column - Form controls */}
          <div className="flex flex-col space-y-4 @lg:space-y-6">
            <div className="flex-1 rounded-xl bg-card p-4 shadow-sm @lg:p-6">
              {/* Prompts */}
              <div className="space-y-3 @lg:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("prompt.label")}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Switch
                          checked={autoTranslate}
                          onCheckedChange={(checked) => {
                            setAutoTranslate(checked);
                          }}
                          id="auto-translate"
                          disabled={isGenerating}
                        />
                        <Label
                          htmlFor="auto-translate"
                          className="cursor-pointer text-xs"
                        >
                          {t("prompt.autoTranslate")}
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={handleRandomPrompt}
                        disabled={isGenerating}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {t("actions.randomPrompt")}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {selectedLora?.prompt && (
                        <>
                          <span className="text-xs font-medium text-muted-foreground">
                            {t("prompt.triggerWord")}:
                          </span>
                          <div
                            className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm"
                            title={t("prompt.triggerWordHint")}
                          >
                            {selectedLora.prompt}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {t("prompt.willBeAdded")}
                          </span>
                        </>
                      )}
                    </div>

                    <Textarea
                      placeholder={t("prompt.placeholder")}
                      value={displayPrompt || prompt}
                      onChange={(e) => {
                        const newText = e.target.value;
                        setDisplayPrompt(newText);
                        setPrompt(newText);

                        if (!newText.trim()) {
                          setOriginalPrompt("");
                          return;
                        }

                        if (originalPrompt && !autoTranslate) {
                          setOriginalPrompt("");
                        }
                      }}
                      className="min-h-[100px] resize-none @lg:min-h-[120px]"
                      disabled={isGenerating}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t("negativePrompt.label")}
                  </label>
                  <Textarea
                    placeholder={t("negativePrompt.placeholder")}
                    value={displayNegativePrompt || negativePrompt}
                    onChange={(e) => {
                      const newText = e.target.value;
                      setDisplayNegativePrompt(newText);
                      setNegativePrompt(newText);

                      if (!newText.trim()) {
                        setOriginalNegativePrompt("");
                        return;
                      }

                      if (originalNegativePrompt && !autoTranslate) {
                        setOriginalNegativePrompt("");
                      }
                    }}
                    className="min-h-[100px] resize-none @lg:min-h-[120px]"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Parameters */}
              <div className="mt-4 space-y-4 @lg:mt-6 @lg:space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none">
                        {t("parameters.width")}
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(Number(e.target.value))}
                          className="w-20"
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[width]}
                      onValueChange={([value]) => setWidth(value)}
                      min={256}
                      max={2048}
                      step={8}
                      className="py-2"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none">
                        {t("parameters.height")}
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-20"
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[height]}
                      onValueChange={([value]) => setHeight(value)}
                      min={256}
                      max={2048}
                      step={8}
                      className="py-2"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none">
                        {t("parameters.steps")}
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={steps}
                          onChange={(e) => setSteps(Number(e.target.value))}
                          className="w-20"
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[steps]}
                      onValueChange={([value]) => setSteps(value)}
                      min={1}
                      max={50}
                      step={1}
                      className="py-2"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none">
                        {t("parameters.guidance")}
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={guidance}
                          onChange={(e) => setGuidance(Number(e.target.value))}
                          className="w-20"
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[guidance]}
                      onValueChange={([value]) => setGuidance(value)}
                      min={1.0}
                      max={10.0}
                      step={0.1}
                      className="py-2"
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 @lg:mt-6">
                <Button
                  variant="outline"
                  className="flex-none"
                  onClick={handleReset}
                  disabled={isGenerating}
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t("actions.reset")}
                </Button>
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!displayPrompt && !prompt)}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("actions.generate")}
                </Button>
              </div>
            </div>
          </div>

          {/* Right column - Preview */}
          <div className="flex h-full flex-col space-y-4 @lg:space-y-6">
            <div className="group relative flex h-[calc(100%-120px)] min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
              {/* Preview image */}
              <AnimatePresence mode="wait">
                {result?.images?.[0] && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center p-4"
                    >
                      <img
                        src={result.images[0].url}
                        alt="Generated"
                        className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        onLoad={() => setIsImageLoading(false)}
                        onLoadStart={() => setIsImageLoading(true)}
                      />
                      <div className="absolute right-3 top-3 z-10 flex translate-y-1 gap-1.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-background/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-background hover:shadow-xl"
                            onClick={() => {
                              if (result?.images?.[0]) {
                                handleDownload(
                                  result.images[0].url,
                                  "generated-image.png"
                                );
                              }
                            }}
                          >
                            <SaveIcon className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-background/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-background hover:shadow-xl"
                            onClick={() => setIsGalleryOpen(true)}
                          >
                            <Maximize2Icon className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Loading overlay or placeholder */}
              <AnimatePresence>
                {(isGenerating || isImageLoading) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                  >
                    <motion.div
                      className="flex flex-col items-center gap-3"
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                    >
                      <div className="relative">
                        <motion.div
                          className="h-12 w-12 rounded-full border-2 border-primary"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-white"
                          animate={{ rotate: -360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground/80">
                        {t("preview.generating")}
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {!isGenerating && !result?.images?.[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-3 text-muted-foreground"
                  >
                    <div className="rounded-full bg-muted/30 p-4">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <span className="text-sm">{t("preview.placeholder")}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 right-4 z-10 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-lg backdrop-blur-sm"
                >
                  {t("preview.elapsedTime", { time: elapsedTime })}
                </motion.div>
              )}

              {/* Lightbox gallery */}
              {isGalleryOpen && result?.images?.[0] && (
                <LightGallery
                  onInit={(ref) => {
                    ref?.instance?.openGallery?.(0);
                  }}
                  onBeforeClose={() => {
                    setIsGalleryOpen(false);
                  }}
                  plugins={[lgZoom, lgThumbnail]}
                  speed={500}
                  elementClassNames="hidden"
                >
                  <a
                    href={result.images[0].url}
                    data-src={result.images[0].url}
                  >
                    <img
                      src={result.images[0].url}
                      alt="Generated"
                      className="hidden"
                    />
                  </a>
                </LightGallery>
              )}
            </div>

            {/* LoRA model info */}
            <div
              className={cn(
                "h-[100px] shrink-0 cursor-pointer rounded-xl bg-card p-4 shadow-sm @lg:p-6",
                "mb-16 sm:mb-0", // 在移动端添加底部边距，确保不被遮挡
                "group/lora-card relative",
                "transition-all duration-300 hover:scale-[1.01] hover:bg-card/90 hover:shadow-md",
                "motion-safe:active:scale-[0.99]"
              )}
              onClick={handleNavigateToLoraList}
              title={t("loraCard.clickToViewInCatalog")}
            >
              {/* Back button indicator */}
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-all duration-300 group-hover/lora-card:opacity-100">
                <ArrowLeftCircle className="h-5 w-5 text-primary" />
              </div>

              <div className="flex flex-col gap-4 @md:flex-row @md:items-center @md:justify-between">
                <div className="flex items-center gap-3 @lg:gap-4">
                  <div
                    className="h-10 w-10 rounded-lg bg-cover bg-center bg-no-repeat @lg:h-12 @lg:w-12"
                    style={{ backgroundImage: `url(${selectedLora.imageUrl})` }}
                  />
                  <div>
                    <h3 className="font-medium">{selectedLora.name}</h3>
                    <p className="text-xs text-muted-foreground @lg:text-sm">
                      {selectedLora.description}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1 @md:w-48">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">
                      <span className="hidden sm:inline">
                        {t("parameters.loraScale")}
                      </span>
                      <span className="sm:hidden">权重</span>
                    </label>
                    <Input
                      type="number"
                      value={loraScale}
                      onChange={(e) => setLoraScale(Number(e.target.value))}
                      className="w-20"
                      disabled={isGenerating}
                      onClick={(e) => e.stopPropagation()} // Prevent click propagation
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                    />
                  </div>
                  <Slider
                    value={[loraScale]}
                    onValueChange={([value]) => setLoraScale(value)}
                    min={0.0}
                    max={3.0}
                    step={0.1}
                    className="py-2"
                    disabled={isGenerating}
                    onPointerDown={(e) => e.stopPropagation()} // Prevent click propagation
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
