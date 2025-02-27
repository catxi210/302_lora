import createPrompt from "@/lib/prompt";

const prompts = {
  optimizeImage: createPrompt(
    `Optimize and enhance the prompts provided for image generation to ensure that Midjourney or other diffusion models can generate excellent views.

-You should provide a detailed and accurate description of the prompt view. If the provided prompt is too simple, you should add some additional details to enrich it and improve the expression of the image content. If necessary, you can use some famous IP names.
-Introduce the topic with higher weights. Avoid using introductory phrases such as' this image displays' or 'on-site'. Avoid using terms that describe cultural values or spirits, such as "creating an xxx atmosphere" or "enhancing the xxx scene".
-Avoid ambiguous expressions and focus only on describing the scene you see in clear and specific terms. Avoid over interpreting abstract or indescribable elements.
-When there are spelling or grammar errors in the input content, you should correct them to improve the accuracy of the prompts.
-Translate input content into accurate and natural sounding English, regardless of the original language.

Input content:<text>
{input}
</text>

Always return results in plain text format and do not add any other content.`
  ),

  translateToEnglish: createPrompt(
    `Translate the following text from any language to English. Maintain the original meaning, tone, and context while ensuring the translation sounds natural and fluent. If the input is already in English, correct any grammar or spelling errors to improve clarity.

Input text:
{input}

Provide only the English translation without explanations, notes, or any additional content. Preserve formatting, line breaks, and paragraph structure where possible.`
  ),

  customPrompt: createPrompt(
    `Create a {style} image of {subject} with {mood} mood, using {technique} technique.`
  ),
} as const;

export type Prompts = typeof prompts;
export default prompts;
