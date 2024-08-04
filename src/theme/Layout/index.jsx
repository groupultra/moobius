import ErrorBoundary from "@docusaurus/ErrorBoundary";
import styles from "@docusaurus/theme-classic/src/theme/Layout/styles.module.css";
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import { useKeyboardNavigation } from "@docusaurus/theme-common/internal";
import Footer from "@theme/Footer";
import Navbar from "@theme/Navbar";
import clsx from "clsx";

import AnnouncementBar from "@theme/AnnouncementBar";
import ErrorPageContent from "@theme/ErrorPageContent";
import LayoutProvider from "@theme/Layout/Provider";
import SkipToContent from "@theme/SkipToContent";

import React from "react";
export default function Layout(props) {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;

  useKeyboardNavigation();
  return (
    <LayoutProvider>
      <Navbar />
      <PageMetadata title={title} description={description} />
      <SkipToContent />
      <AnnouncementBar />

      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.wrapper.main,
          styles.mainWrapper,
          wrapperClassName
        )}
      >
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>
      {!noFooter && <Footer />}
    </LayoutProvider>
  );
}
