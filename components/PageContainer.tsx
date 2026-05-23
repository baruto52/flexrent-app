"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
}: Props) {
  return (
    <div
      className="
        w-full
        max-w-[1600px]
        mx-auto
      "
    >
      {children}
    </div>
  );
}