import Main from "@theme-original/DocRoot/Layout/Main";
import Footer from "@theme/Footer";
import React from "react";
export default function MainWrapper(props) {
  console.log("main wrapper");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 10px",
        width: "100%",
      }}
    >
      <Main {...props} />
      <div className="my-footer">
        <Footer />
      </div>
    </div>
  );
}
