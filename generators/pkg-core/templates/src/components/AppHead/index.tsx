import React, { memo } from "react";
import Head from "next/head";

type AppHeadProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
};

export const AppHead = memo(
  ({ title, description, keywords, canonical }: AppHeadProps) => {
    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {canonical && (
          <link
            rel="canonical"
            href={`${process.env.NEXT_PUBLIC_WEBSITE_BASE_URL}${canonical}`}
          />
        )}
      </Head>
    );
  },
);
AppHead.displayName = "AppHead";
