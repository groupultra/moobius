import DocSidebar from "@theme-original/DocSidebar";
import DocSearch from "@theme/SearchBar";
import React from "react";
import styles from "./style.module.css";

export default function DocSidebarWrapper(props) {
  console.log("doc sidebar wrapper:", props);
  return (
    <div className={styles.slideWapper}>
      <div style={{ height: 70 }}></div>
      <div className={styles.searchWrapper}>
        <DocSearch />
      </div>
      <div className={styles.slidebarContainer}>
        <DocSidebar {...props} />
      </div>
    </div>
  );
}
