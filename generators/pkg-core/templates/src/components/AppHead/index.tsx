import React, { memo } from "react";
import { useAppHead } from "src/components/AppHead/index.hooks";
import Head from "next/head";

type AppHeadProps = {
  title: string;
  description: string;
};

export const AppHead = memo(({ title, description }: AppHeadProps) => {
  const {} = useAppHead();

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
});

AppHead.displayName = "AppHead";
