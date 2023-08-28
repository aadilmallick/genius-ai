"use client";

import React from "react";
import { PrismCodeBlock, PrismCodeBlockProps } from "react-prism-code-block";

interface CodeBlockProps extends PrismCodeBlockProps {}

const CodeBlock = ({ children, ...props }: CodeBlockProps) => {
  return (
    <PrismCodeBlock language="javascript">{`${children || ""}`}</PrismCodeBlock>
  );
};

export default CodeBlock;
