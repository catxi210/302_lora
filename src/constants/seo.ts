export type SEOData = {
  supportLanguages: string[];
  fallbackLanguage: string;
  languages: Record<
    string,
    { title: string; description: string; image: string }
  >;
};

export const SEO_DATA: SEOData = {
  // TODO: Change to your own support languages
  supportLanguages: ["zh", "en", "ja"],
  fallbackLanguage: "en",
  // TODO: Change to your own SEO data
  languages: {
    zh: {
      title: "Lora风格创意站",
      description: "训练和使用Lora模型生成不同风格的创意图片",
      image: "/images/global/desc_zh.png",
    },
    en: {
      title: "Lora Style Creative Hub",
      description:
        "Train and use Lora models to generate creative images in different styles",
      image: "/images/global/desc_en.png",
    },
    ja: {
      title: "Loraスタイルクリエイティブステーション",
      description:
        "Loraモデルをトレーニングして、異なるスタイルのクリエイティブな画像を生成します",
      image: "/images/global/desc_ja.png",
    },
  },
};
