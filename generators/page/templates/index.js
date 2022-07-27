module.exports = (
  componentName,
  useGetStaticPaths,
  useGetStaticProps,
  userGetServerSideProps,
  multipleParameters,
  paramName
) => `import React, { memo } from "react";
import { AppHead } from "components/AppHead";${
  useGetStaticProps
    ? `
import { GetStaticPropsResult } from "next";`
    : ""
}${
  useGetStaticPaths
    ? `
import { GetStaticPathsResult } from "next";`
    : ""
}${
  userGetServerSideProps
    ? `
import { GetServerSidePropsResult } from "next";`
    : ""
}

type ${componentName}Props = {}

const ${componentName} = memo(({}: ${componentName}Props) => {
  return (
    <>
      <AppHead title="${componentName}" description="" />
    </>
  );
});
${componentName}.displayName = "${componentName}";

export default ${componentName};${
  useGetStaticPaths
    ? `

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<{${
    !multipleParameters
      ? `
    ${paramName}: string;
`
      : ""
  }}>
> {
  return {
    paths: [{
      params: {${
        !multipleParameters
          ? `
        ${paramName}: "",
`
          : ""
      }     },
    }],
    fallback: true,
  };
}
`
    : ""
}${
  useGetStaticProps
    ? `

export async function getStaticProps({}): Promise<GetStaticPropsResult<${componentName}Props>> {
  return {
    props: {},
  };
}

`
    : ""
}${
  userGetServerSideProps
    ? `

export async function getServerSideProps({}): Promise<GetServerSidePropsResult<${componentName}Props>> {
  return {
    props: {},
  };
}

`
    : ""
}`;
