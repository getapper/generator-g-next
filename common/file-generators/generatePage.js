module.exports = ({
  componentName,
  useGetStaticPaths,
  useGetStaticProps,
  userGetServerSideProps,
  useCookieAuth,
  cookieRole,
  dynamic,
  multipleParameters,
  paramName,
}) => `import React, { memo } from "react";
import { AppHead } from "@/components/AppHead";${
  useGetStaticProps
    ? `
import { GetStaticPropsResult, GetStaticPropsContext } from "next";`
    : ""
}${
  useGetStaticPaths
    ? `
import { GetStaticPathsResult } from "next";`
    : ""
}${
  userGetServerSideProps
    ? `
import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";`
    : ""
}${
  useCookieAuth
    ? `
import { withIronSessionSsr } from "iron-session/next";
import { ${cookieRole}SessionOptions } from "@/lib/session";`
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
          : `
        ${paramName}: [],
`
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

export async function getStaticProps({${
        dynamic ? `params: { ${paramName} },` : ""
      }}: GetStaticPropsContext<${
        dynamic
          ? `{ ${paramName}: string${multipleParameters ? "[]" : ""} }`
          : "{}"
      }>): Promise<GetStaticPropsResult<${componentName}Props>> {
  return {
    props: {},
  };
}

`
    : ""
}${
  userGetServerSideProps
    ? `

export ${
        useCookieAuth
          ? `const getServerSideProps = withIronSessionSsr(
  `
          : ``
      }async function getServerSideProps({${
        dynamic
          ? `
      params: { ${paramName} },`
          : ""
      }${
        useCookieAuth
          ? `
      req: { session, cookies, headers},`
          : ""
      }
    }: GetServerSidePropsContext<${
      dynamic
        ? `{ ${paramName}: string${multipleParameters ? "[]" : ""} }`
        : "{}"
    }>): Promise<GetServerSidePropsResult<${componentName}Props>> {
  return {
    props: {},
  };
}${
        useCookieAuth
          ? `,
    ${cookieRole}SessionOptions
);`
          : ""
      }

`
    : ""
}`;
