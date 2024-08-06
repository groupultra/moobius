import { useLocation } from "@docusaurus/router";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Main from "@theme-original/DocRoot/Layout/Main";
import Footer from "@theme/Footer";
import React from "react";
export default function MainWrapper(props) {
  const location = useLocation();
  const context = useDocusaurusContext();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 10px",
        width: "100%",
      }}
      className={
        location.pathname === context?.siteConfig?.baseUrl ? "my-home" : ""
      }
    >
      <Main {...props} />
      <div className="my-footer">
        <Footer />
      </div>
    </div>
  );
}
