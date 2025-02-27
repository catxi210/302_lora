// 定义 LoRA 项的类型
export type LoraItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  prompt?: string;
  weight: number;
  guidance?: string;
  imageUrl: string;
  category: string;
  // 默认参数
  defaultParams?: {
    steps?: number;
    guidance?: number;
    loraScale?: number;
  };
  civitaiKey?: string;
  civitaiModelId?: string;
  sizeKb?: number;
};

// 真实数据
export const loras: LoraItem[] = [
  {
    id: "anime-style",
    name: "Anime-Style",
    description: "动漫风格，色彩十分丰富，画面强调光影感",
    url: "https://huggingface.co/Nishitbaria/Anime-style-flux-lora-Large/blob/main/lora.safetensors",
    prompt: "ANMCH",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/ec0dc838a91e41c889679065e20641ba.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "fae-anime",
    name: "fae_anime",
    description: "时尚的动漫灵感艺术，画风细腻，生成女性时效果较好",
    url: "https://huggingface.co/jae-xe/fae_anime_flux_lora/resolve/main/fae_anime.safetensors",
    prompt: "fae_anime, anime-style",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/0dd0b0af820f40248390415adbebb8ad.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "real-anime",
    name: "Real-Anime",
    description: "对环境、人物细节描述越具体，画风就越真实",
    url: "https://huggingface.co/prithivMLmods/Flux-Dev-Real-Anime-LoRA/resolve/main/Flux-Dev-Real-Anime-LoRA.safetensors",
    prompt: "Real Anime",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/c5ea2404263946a59510723296e57de2.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "gundam-rx78-2",
    name: "Gundam RX78-2 outfit",
    description: "呈现高达RX78-2的外观风格",
    url: "https://civitai.com/api/download/models/790870?type=Model&format=SafeTensor",
    prompt: "gundam, RX-78",
    weight: 0.8,
    guidance: "0.6-1.0",
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/6d64335cc00c491b8b2b164ada938ae5.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.8,
    },
  },
  {
    id: "ink-style",
    name: "Ink Style",
    description: "呈现国画水墨的艺术风格",
    url: "https://civitai.com/api/download/models/890482?type=Model&format=SafeTensor",
    prompt: "zydInk",
    weight: 0.9,
    guidance: "0.6-1.2",
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/1f65d2328c754a6084b2258d988acde0.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.9,
    },
  },
  {
    id: "ultra-realistic",
    name: "UltraRealistic",
    description: "超写实相片风格",
    url: "https://civitai.com/api/download/models/890545?type=Model&format=SafeTensor",
    prompt:
      "amateurish photo, low lighting, in motion, overexposed, underexposed, GoPro lens, eerie atmosphere, smeared background, smeared foreground",
    weight: 0.9,
    guidance: "0.8-1.0",
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/f03a37c3c5384c478fabe0e70f106ea8.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.9,
    },
  },
  {
    id: "realistic-skin-texture",
    name: "Realistic Skin Texture",
    description: "皮肤纹理细腻逼真，细节丰富",
    url: "https://civitai.com/api/download/models/789811?type=Model&format=SafeTensor",
    prompt: "skin texture style, sharp detailed edges",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/70e0eaad6e11490ba1a3c06764181bb3.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "cinematic-shot",
    name: "Cinematic Shot",
    description: "色彩构图接近电影中的镜头风格",
    url: "https://civitai.com/api/download/models/857668?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/2be1399f31c940cb91437d142e93c933.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    description: "像素风格，偏向于二次元风格",
    url: "https://civitai.com/api/download/models/921804?type=Model&format=SafeTensor",
    prompt: "Pixel Art",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/c9fde4db6c7149c7a40ad931c8792f9b.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "retro-anime-90s",
    name: "Retro Anime 90s Style",
    description: "色彩和线条上偏向复古动画风格",
    url: "https://civitai.com/api/download/models/756636?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/70f3c7fb28e7469782c6f7bfd5b5b53a.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "fantasy-wizard-witches",
    name: "Fantasy Wizard & Witches",
    description: "色彩奇幻，人物拥有巫师/女巫的风格特征",
    url: "https://civitai.com/api/download/models/767132?type=Model&format=SafeTensor",
    prompt: "hkmagic",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/a82e503d15694d67a32622ad34cd17c8.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "painted-world",
    name: "Painted World",
    description: "厚涂绘画风格",
    url: "https://civitai.com/api/download/models/748832?type=Model&format=SafeTensor",
    prompt: "painted world",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/3053276eccab43cc87352412138c7e9d.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "comic-book",
    name: "Comic Book",
    description: "漫画书中插画的风格",
    url: "https://civitai.com/api/download/models/954701?type=Model&format=SafeTensor",
    prompt: "Comic book style",
    guidance: "1.5",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/6a31ad9706af47b5ab0ae5f076648bf1.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "new-incase-style",
    name: "New Incase Style",
    description: "新英凯斯风格",
    url: "https://civitai.com/api/download/models/857267?type=Model&format=SafeTensor",
    prompt: "art by incase",
    guidance: "0.8-1.0",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/22d98d7aa6dc4e5f8c1dd0a99bcefe92.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "1950s-technicolor",
    name: "1950's (Technicolor) style",
    description: "20世纪50年代的彩色打印照片风格",
    url: "https://civitai.com/api/download/models/789955?type=Model&format=SafeTensor",
    prompt: "Technicolor style, 1950, 1950's",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/14af9d24fa7e413faec358fe1749dc84.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "mjanime",
    name: "MJanime",
    description: "经典卡通动漫风格",
    url: "https://civitai.com/api/download/models/837239?type=Model&format=SafeTensor",
    prompt: "Anime style",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/c284f0dcd5694b3286f33460ae0ccd46.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "anime-style-large",
    name: "Anime-style-Large",
    description: "突出了日漫动画中的光影感，偏向新海诚风格",
    url: "https://huggingface.co/Nishitbaria/Anime-style-flux-lora-Large/resolve/main/lora.safetensors",
    prompt: "anm",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/928a521c6c994372becc0787b4418106.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "anime-test-02",
    name: "anime-test-02",
    description: "色彩线条十分简单干净的动漫风",
    url: "https://huggingface.co/Disra/lora-anime-test-02/resolve/main/pytorch_lora_weights.safetensors",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/8bc0785223054d5eb531f24c882f93c2.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "ultra-realism-2",
    name: "UltraRealism-2.0",
    description: "逼真的图像生成、高保真艺术、纹理细节和增强",
    url: "https://huggingface.co/prithivMLmods/Canopus-LoRA-Flux-UltraRealism-2.0/resolve/main/Canopus-LoRA-Flux-UltraRealism.safetensors",
    prompt: "Ultra realistic",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/071b522c013e4718bbe5c6aceb04f97a.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "children-simple-sketch",
    name: "Children-Simple-Sketch",
    description: "儿童简笔画风格",
    url: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Children-Simple-Sketch/resolve/main/FLUX-dev-lora-children-simple-sketch.safetensors",
    prompt: "sketched style",
    guidance: "0.8-1.5",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/7c197230dd274d1ca05fc53ceb58c8d2.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "dark-fantasy",
    name: "Dark-Fantasy",
    description: "流畅的金属纹理，神奇或科技的灯光效果，具有黑暗氛围的图像",
    url: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Dark-Fantasy/resolve/main/FLUX.1-dev-lora-Dark-Fantasy.safetensors",
    guidance: "0.6-0.8",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/5f69a2b7c093417296530222055877b5.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "watercolor",
    name: "watercolor",
    description: "水彩绘画风格，最好采用推荐的提示词模板",
    url: "https://huggingface.co/SebastianBodza/flux_lora_aquarel_watercolor/resolve/main/lora.safetensors",
    prompt:
      "A painting of ... In a watercolor style, AQUACOLTOK. White background.",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/bc0e1f19f6c64ad9aade7b8448081f4e.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "canopus-pixar-3d",
    name: "Canopus-Pixar-3D",
    description: "3d卡通形象风格",
    url: "https://huggingface.co/prithivMLmods/Canopus-Pixar-3D-Flux-LoRA/resolve/main/Canopus-Pixar-3D-FluxDev-LoRA.safetensors",
    prompt: "Pixar 3D",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/190f8fc208eb47b1aaee1601aa7ef2f7.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "film-noir",
    name: "film-noir",
    description: "黑白电影风格图片",
    url: "https://huggingface.co/dvyio/flux-lora-film-noir/resolve/main/5ee2c3c6409f4618a134b883da64d04e_pytorch_lora_weights.safetensors",
    prompt: "in the style of FLMNR",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/c327754811754cd39d22c43d326dbd71.png",
    category: "style",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "nwsj-realistic",
    name: "nwsj_realistic",
    description: "模型训练的真人脸模为娜乌斯嘉，图片风格偏向真实",
    url: "https://civitai.com/api/download/models/886251?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/98f716cc883f4b4fbf008b5b34b66f43.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "korean-gone",
    name: "Korean Gone",
    description: "生成韩国女性人物形象，偏真实感，五官精致",
    url: "https://civitai.com/api/download/models/758214?type=Model&format=SafeTensor",
    prompt: "korean",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/feb2c0a80df64575bd915dcb1b2ed6a1.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "chinese-girl",
    name: "Chinese Girl",
    description: "擅长生成中国美女的人物形象，图片偏真实感",
    url: "https://civitai.com/api/download/models/976201?type=Model&format=SafeTensor",
    prompt: "Chinese girl,Chinese woman,Asian girl,Asian woman",
    weight: 0.85,
    guidance: "0.8-1.2",
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/32a1aa80a1c8479e84787d3c307a122f.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "jinx-arcane",
    name: "Jinx - Arcane",
    description: "英雄联盟中金克丝的形象",
    url: "https://civitai.com/api/download/models/1011812?type=Model&format=SafeTensor",
    prompt: "Jinx",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/08907926613148b48b51219b4e6c36b9.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "yae-miko",
    name: "Yae Miko",
    description: "游戏《原神》中的八重神子角色形象",
    url: "https://civitai.com/api/download/models/759255?type=Model&format=SafeTensor",
    prompt: "FluxYaeMiko",
    guidance: "0.5-1",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/6d329140651f4748888478f1e4bf9df3.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "spongebob",
    name: "SpongeBob SquarePants",
    description: "从大量海绵宝宝电影和动画中训练出来的",
    url: "https://civitai.com/api/download/models/878096?type=Model&format=SafeTensor",
    prompt: "spongebob",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/7e6a9dca09764a23915af2be1d257090.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "tifa-lockhart",
    name: "Tifa Lockhart",
    description: "设生成游戏《最终幻想VII》女主角蒂法·洛克哈特",
    url: "https://civitai.com/api/download/models/740105?type=Model&format=SafeTensor",
    prompt: "TifaLockhart, croptop, skirt, suspenders, fingerless gloves",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/de905bb3b8f644f0ab0847a69a0ed641.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "lucianna",
    name: "Lucianna",
    description: "一位美丽的女子，具有斯堪地纳维亚和罗马人民的特征",
    url: "https://civitai.com/api/download/models/1114924?type=Model&format=SafeTensor",
    prompt: "luc14nn4",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/b99e0d77c1a84a40b22238b8270e19a5.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "realistic-mona-lisa",
    name: "Realistic Mona Lisa",
    description: "生成神似蒙娜丽莎的外貌",
    url: "https://civitai.com/api/download/models/895148?type=Model&format=SafeTensor",
    prompt: "moonal1saa",
    guidance: "1.5",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/247935da40d14e2887c8c7abd7ad479a.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "tinker-bell",
    name: "Tinker bell",
    description: "小叮当是《彼得・潘》中著名的迪斯尼角色",
    url: "https://civitai.com/api/download/models/755521?type=Model&format=SafeTensor",
    prompt:
      "fairy wings, blue eyes, green dress, sexy, single hair bun,TinkerWaifu",
    guidance: "0.8-1.0",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/d038a053e8c2425ba3d733c1afc78f6c.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "frieren",
    name: "Frieren フリーレン",
    description: "动画《葬送的芙莉莲》中的主角",
    url: "https://civitai.com/api/download/models/728562?type=Model&format=SafeTensor",
    prompt:
      "nereirfpnxl, frieren, elf, pointy ears, green eyes, white hair, twintails,source anime",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/07e1d855557a4c5582c4b0778bc621a5.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "zavys-elsa",
    name: "Zavy's Elsa",
    description: "迪士尼《冰雪奇缘》中的卡通人物形象艾莎",
    url: "https://civitai.com/api/download/models/798908?type=Model&format=SafeTensor",
    prompt:
      "elsa, casual elsa, princess elsa, queen elsa, snow queen,disney style",
    guidance: "0.7-1.3",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/5d0b2ffea9194b6eb7459cc08e88670c.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "kelly-taylor",
    name: "Kelly Taylor",
    description: "美国女演员珍妮・加斯",
    url: "https://civitai.com/api/download/models/860814?type=Model&format=SafeTensor",
    prompt: "blonde female",
    guidance: "1.3",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/be15f289070548f5b35ebf2f82dc6cb0.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "asian-woman",
    name: "asian woman",
    description: "美丽的亚洲女性形象",
    url: "https://civitai.com/api/download/models/868017?type=Model&format=SafeTensor",
    prompt: "asian woman",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/5f7207d4453748749db7f83f124ff24f.png",
    category: "character",
    defaultParams: {
      steps: 28,
      guidance: 3.5,
      loraScale: 0.85,
    },
  },
  {
    id: "taylor-swift",
    name: "Taylor Swift",
    description: "泰勒斯威夫特的形象",
    url: "https://civitai.com/api/download/models/722866?type=Model&format=SafeTensor",
    prompt: "taySwift",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/c8abd2f2fc0d46d492600f49fbd7caa1.png",
    category: "character",
  },
  {
    id: "kanna-hashimoto",
    name: "Kanna Hashimoto",
    description: "桥本环奈的形象",
    url: "https://civitai.com/api/download/models/771059?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/75412c4748cb4073801a1dd5c3455e84.png",
    category: "character",
  },
  {
    id: "lora-lyf",
    name: "lora-lyf",
    description: "刘亦菲的形象",
    url: "https://huggingface.co/vincenthugging/flux-dev-lora-lyf/resolve/main/flux-dev-lora-lyf.safetensors",
    prompt: "lyf",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/28e678e98133416ab2ab7bbb32683516.png",
    category: "character",
  },
  {
    id: "hyperflux-accelerator",
    name: "HyperFLUX-Accelerator",
    description:
      "FLUX-dev 的加速器，可以将步数从 20 个减少到 8 个，并且具有相同的质量",
    url: "https://civitai.com/api/download/models/901795?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/a2760010ecbb4dfba8f6889125f9df93.png",
    category: "tool",
  },
  {
    id: "detail-slider",
    name: "Detail Slider",
    description:
      "负权重会减少细节，获得具有更光滑表面和简单性的简约图像；正权重会使用丰富的纹理和复杂的细节增强图像，增加深度和复杂性，而不会丢失原始对象。",
    url: "https://civitai.com/api/download/models/887849?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/5057fbca88bc425391518c68203dd8b0.png",
    category: "tool",
  },
  {
    id: "no-shine",
    name: "No Shine",
    description: "旨在去除图像的光泽，减少热点",
    url: "https://civitai.com/api/download/models/843966?type=Model&format=SafeTensor",
    prompt: "noshine",
    guidance: "0.5",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/5578dc3bd0ce4af89833f7cccb41a447.png",
    category: "tool",
  },
  {
    id: "big-eyes",
    name: "Big Eyes",
    description: "权重越大，眼睛越大，值为0时是正常大小",
    url: "https://civitai.com/api/download/models/905622?type=Model&format=SafeTensor",
    guidance: "0-2.0，初始建议设置为0",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/2c33fe68a5764e0b8a1ae652ce27899d.png",
    category: "tool",
  },
  {
    id: "small-eyes",
    name: "Small Eyes",
    description: "权重越大，眼睛越小，值为0时是正常大小",
    url: "https://civitai.com/api/download/models/917327?type=Model&format=SafeTensor",
    guidance: "0-2.0，初始建议设置为0",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/2d7f1fa6f2524666aceda549f9813d88.png",
    category: "tool",
  },
  {
    id: "chin-fixer",
    name: "Chin Fixer",
    description: "值越高光泽越低，下巴裂缝修复得越好",
    url: "https://civitai.com/api/download/models/928996?type=Model&format=SafeTensor",
    guidance: "0.5-1.0",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/2df3b729226e400791a905d0fcf941e3.png",
    category: "tool",
  },

  {
    id: "add-details",
    name: "add-details",
    description: "会为图片丰富更多细节，更加逼真",
    url: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-add-details/resolve/main/FLUX-dev-lora-add_details.safetensors",
    guidance: "1",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/d8998e23c93a4ac282615f35e29fa26b.png",
    category: "tool",
  },
  {
    id: "outfit-generator",
    name: "Outfit Generator",
    description: "通过详细说明颜色、图案、合身度、风格、材料和类型来设计服装",
    url: "https://huggingface.co/tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator/resolve/main/outfit-generator.safetensors",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/066fb8cd39a64e3eb48b8f2361fbedf7.png",
    category: "tool",
  },
  {
    id: "anti-blur",
    name: "AntiBlur",
    description: "权重越低背景越模糊虚化，越高则背景越清晰具体",
    url: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-AntiBlur/resolve/main/FLUX-dev-lora-AntiBlur.safetensors",
    guidance: "0-1.5",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/435fc51db26c4abf95c09be79da91fd9.png",
    category: "tool",
  },
  {
    id: "white-background",
    name: "White-Background",
    description: "生成的物品、人物居中，且背景是白色的",
    url: "https://huggingface.co/gokaygokay/Flux-White-Background-LoRA/resolve/main/80cfbf52faf541d49c6abfe1ac571112_lora.safetensors",
    prompt: "in the middle, white background",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/5a976e216c164cdb8843112959e38d34.png",
    category: "tool",
  },
  {
    id: "purple-dreamy",
    name: "Purple-Dreamy",
    description: "生成图片带有紫色的梦幻滤镜",
    url: "https://huggingface.co/prithivMLmods/Purple-Dreamy-Flux-LoRA/resolve/main/Purple-Dreamy.safetensors",
    prompt: "Purple Dreamy",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/32504bb4294c4d309c2acf0f39bebc5e.png",
    category: "tool",
  },
  {
    id: "panorama-lora-2",
    name: "panorama-lora-2",
    description: "生成全景图，推荐比例 2048x1024",
    url: "https://huggingface.co/jbilcke-hf/flux-dev-panorama-lora-2/resolve/main/flux_train_replicate.safetensors",
    prompt: "HDRI, TOK",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/ad86f47588de4d16b73151f1902cbadc.png",
    category: "landscape",
  },
  {
    id: "pixel-background",
    name: "Pixel-Background",
    description: "生成像素风背景图，推荐推理步30~35",
    url: "https://huggingface.co/strangerzonehf/Flux-Pixel-Background-LoRA/resolve/main/Pixel-Background.safetensors",
    prompt: "Pixel Background",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/6585539febdc40518496f21530c4cffa.png",
    category: "landscape",
  },
  {
    id: "flux-lora-kuji",
    name: "flux-lora-kuji",
    description: "生成相机摄影的景观和自然环境，风格唯美",
    url: "https://huggingface.co/ludocomito/flux-lora-kuji/resolve/main/lora.safetensors",
    prompt: "flmft, in the style of KUJI",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/84cdd64653d448f3a60387f8b2555ebd.png",
    category: "landscape",
  },
  {
    id: "fantasypool",
    name: "Fantasypool",
    description: "后室恐怖风格场景，以泳池为主",
    url: "https://huggingface.co/IcelosAI/Fantasypool_LoRA_FLUX1_Dev/resolve/main/1b5068e5e3a34c64bef55366eb363fbb_pytorch_lora_weights.safetensors",
    prompt: "fantasypool",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/2bcf5336a8e44001824f62b8f725bd3c.png",
    category: "landscape",
  },
  {
    id: "ghibli-art",
    name: "Ghibli-Art",
    description: "吉卜力艺术风格的风景",
    url: "https://huggingface.co/strangerzonehf/Flux-Ghibli-Art-LoRA/resolve/main/Ghibli-Art.safetensors",
    prompt: "Ghibli Art",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/0e6f356190d24ae19b693756ca510f18.png",
    category: "landscape",
  },
  {
    id: "modern-pixel-art",
    name: "Modern_Pixel_art",
    description: "风格更现代的像素艺术风景图",
    url: "https://huggingface.co/UmeAiRT/FLUX.1-dev-LoRA-Modern_Pixel_art/resolve/main/ume_modern_pixelart.safetensors",
    prompt: "umempart",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/f49e880541bd47a58fba57b0145670b9.png",
    category: "landscape",
  },
  {
    id: "castor-gta6-theme",
    name: "Castor-Gta6-Theme",
    description: "《侠盗猎车6》游戏中的风景建筑",
    url: "https://huggingface.co/prithivMLmods/Castor-Gta6-Theme-Flux-LoRA/resolve/main/Gta6.safetensors",
    prompt: "GTA 6 Theme,World of GTA 6",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/fb6eb75feeac447dbd4e0486f1dcedff.png",
    category: "landscape",
  },
  {
    id: "sci-fi-environments",
    name: "Sci-fi Environments",
    description: "科幻风场景",
    url: "https://civitai.com/api/download/models/800592?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/6b9b3b6937fd4cac86021ffdaa029c1a.png",
    category: "landscape",
  },
  {
    id: "cyber-background",
    name: "Cyber background",
    description: "赛博朋克风背景",
    url: "https://civitai.com/api/download/models/842088?type=Model&format=SafeTensor",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/02be6f8361bf4092bbc897f9018c99f6.png",
    category: "landscape",
  },
  {
    id: "smol-animals",
    name: "Smol Animals",
    description: "卡通可爱的萌宠动物形象",
    url: "https://civitai.com/api/download/models/824247?type=Model&format=SafeTensor",
    prompt: "small zhibi, cute",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/120dfd2f44484460a81a0c939cb15d91.png",
    category: "animal",
  },
  {
    id: "crying-cat",
    name: "Crying cat",
    description: "memes中常见的流泪猫猫头",
    url: "https://civitai.com/api/download/models/739589?type=Model&format=SafeTensor",
    prompt: "crying cat",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/3a9d2b7c88754b49be78a7ace90ec855.png",
    category: "animal",
  },
  {
    id: "smicat",
    name: "smicat",
    description: "生成微笑的小猫，也可以适用于生成meme",
    url: "https://civitai.com/api/download/models/859129?type=Model&format=SafeTensor",
    prompt: "smicat",
    guidance: "0.8",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/2be963659ad849c7a5b4ff065f3e5ee8.png",
    category: "animal",
  },
  {
    id: "animals123",
    name: "Animals123",
    description: "生成戴着各种各样的眼镜的动物",
    url: "https://huggingface.co/Diegocipion/ANIMALS123-lora/resolve/main/lora.safetensors",
    prompt: "TOK",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/63000f8904af4700b9627e8d9279856e.png",
    category: "animal",
  },
  {
    id: "furry-lora",
    name: "furry_lora",
    description: "动物拟人",
    url: "https://huggingface.co/XLabs-AI/flux-lora-collection/resolve/main/anime_lora.safetensors",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/cafc360286054ea49af88313d670af2e.png",
    category: "animal",
  },
  {
    id: "super-capybara",
    name: "Super-Capybara",
    description: "简约可爱的卡皮巴拉",
    url: "https://huggingface.co/strangerzonehf/Flux-Super-Capybara-HF/resolve/main/capybara-hf.safetensors",
    prompt: "capybara h",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/669a92549e8b41bcb146944209b06284.png",
    category: "animal",
  },
  {
    id: "dev-ctoon",
    name: "Dev-Ctoon",
    description: "生成风格可爱的卡通动物",
    url: "https://huggingface.co/prithivMLmods/Flux.1-Dev-Ctoon-LoRA/resolve/main/ctoon.safetensors",
    prompt: "ctoon, A cartoon drawing of",
    weight: 0.85,
    imageUrl:
      "https://file.302.ai/gpt/imgs/20250219/a585619b178c4c6aa6ca330ca5ba5c4e.png",
    category: "animal",
  },
];
