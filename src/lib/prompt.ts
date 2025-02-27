type ExtractVariables<T extends string> =
  T extends `${string}{${infer Param}}${infer Rest}`
    ? Param | ExtractVariables<Rest>
    : never;

type InferVariables<T extends string> = {
  [K in ExtractVariables<T>]: string;
};

class PromptTemplate<T extends string> {
  constructor(private template: T) {}

  compile(variables: InferVariables<T>): string {
    let result = this.template as string;
    (Object.entries(variables) as [ExtractVariables<T>, string][]).forEach(
      ([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
      }
    );
    return result;
  }
}

const createPrompt = <T extends string>(template: T) => {
  return new PromptTemplate(template);
};

export default createPrompt;
