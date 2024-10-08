import { themes as prismThemes } from "prism-react-renderer";
import versions from "./versions.json";

function isPrerelease(version) {
  return (
    version.includes("-") ||
    version.includes("alpha") ||
    version.includes("beta") ||
    version.includes("rc")
  );
}
function getLastStableVersion() {
  const lastStableVersion = versions.find((version) => !isPrerelease(version));
  if (!lastStableVersion) {
    throw new Error("unexpected, no stable Docusaurus version?");
  }
  return lastStableVersion;
}
function getLastStableVersionTuple() {
  const lastStableVersion = getLastStableVersion();
  const parts = lastStableVersion.split(".");
  if (parts.length !== 3) {
    throw new Error(`Unexpected stable version name: ${lastStableVersion}`);
  }
  return [parts[0], parts[1], parts[2]];
}
function getAnnouncedVersion() {
  const [major, minor] = getLastStableVersionTuple();
  return `${major}.${minor}`;
}
const announcedVersion = getAnnouncedVersion();
const isDev = process.env.NODE_ENV === "development";

const isDeployPreview =
  !!process.env.NETLIFY && process.env.CONTEXT === "deploy-preview";
const config = {
  title: "Moobius Documentation",
  tagline:
    "Moobius is a group-driven social interaction platform which resembles Discord but has more features and flexibility.",
  favicon: "img/favicon.ico",
  githubHost: "github.com-yhcss2",
  // Set the production url of your site here
  url: "https://groupultra.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/moobius",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "groupultra", // Usually your GitHub org/user name.
  projectName: "moobius", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          path: "./docs",
          routeBasePath: "/",
          editUrl: "https://github.com/groupultra/moobius/edit/main/",
          versions: {
            current: {
              label: "current",
            },
          },
          lastVersion: "current",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  customFields: {
    announcedVersion,
  },
  themeConfig: {
    colorMode: {
      defaultMode: "light",
    },
    navbar: {
      hideOnScroll: false,
      title: "",
      logo: {
        alt: "Moobius Logo",
        src: "img/logo-light.png",
        srcDark: `/img/logo-dark.png`,
        width: 164,
        href: "/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Basic",
        },
        {
          type: "docSidebar",
          sidebarId: "Advanced",
          position: "left",
          label: "Advanced",
        },

        // {
        //   to: "https://moobius.ai/login",
        //   label: "Get Started",
        //   position: "right",
        //   className: "get-started-button",
        // },
        // {
        //   to: "https://moobius.readthedocs.io/en/latest/index.html",
        //   label: "Book Demo",
        //   position: "right",
        //   className: "book-demo-button",
        // },
        {
          to: "https://moobius.ai/login",
          label: "Sign In",
          position: "right",
          className: "sing-in-button",
        },
      ],
    },
    algolia: {
      appId: "AK0W51D1JL",
      apiKey: "d8da3b4ceb3bba991b1ba7162b337f0b",
      indexName: "moobius",
      contextualSearch: true,
      replaceSearchResultPathname:
        isDev || isDeployPreview
          ? {
              from: /^\/docs\/next/g.source,
              to: "/docs",
            }
          : undefined,
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} GroupUltra Ltd.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
