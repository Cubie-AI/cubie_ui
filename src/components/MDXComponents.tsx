import { ComponentProps } from "react";

export const Pre = (props: ComponentProps<"pre">) => (
  <pre
    className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4"
    {...props}
  />
);

export const Code = (props: ComponentProps<"code">) => (
  <code className="bg-gray-100 text-gray-800 px-1 rounded" {...props} />
);

export const InlineCode = (props: ComponentProps<"code">) => (
  <code className="bg-gray-100 text-gray-800 px-1 rounded" {...props} />
);

export const H1 = (props: ComponentProps<"h1">) => (
  <h1 className="text-4xl font-bold mb-6 mt-2" {...props} />
);

export const components = {
  pre: Pre,
  code: Code,
  inlineCode: InlineCode,
  h1: H1,
};
