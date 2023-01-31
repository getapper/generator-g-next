import dynamic from "next/dynamic";
import React from "react";

const NoSsrComponent = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export const NoSsr = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});
