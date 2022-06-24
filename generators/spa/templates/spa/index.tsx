import React from "react";
import dynamic from "next/dynamic";

const <%= spaName %>Spa = dynamic(
  () => import("./AppWrapper").then((module) => module.default),
  {
    ssr: false,
  },
);

export default <%= spaName %>Spa;
