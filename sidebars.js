const sidebars = {
  docs: [
    {
      type: "doc",
      id: "Home",
      label: "Home",
      customProps: {
        icon: "Home",
      },
    },
    {
      type: "html",
      value: '<div class="h2-title">Guide</div>',
    },
    {
      type: "doc",
      label: "Introduction",
      id: "tutorial-basics/Introduction",
    },
    {
      type: "doc",
      id: "tutorial-basics/GettingStarted",
      label: "Getting Started",
    },
    {
      type: "doc",
      id: "tutorial-basics/CustomChannelService",
      label: "Custom Channel Service",
    },
    {
      type: "category",
      label: "Build Your First GBA",
      link: {
        type: "doc",
        id: "tutorial-basics/Preparation",
      },
      items: [
        "tutorial-basics/Run Demo",
        "tutorial-basics/Characters",
        "tutorial-basics/Messages",
        {
          type: "doc",
          id: "tutorial-basics/CanvasButton",
          label: "Canvas & Button & Context Menu",
        },
        "tutorial-basics/Miscellaneous Actions",
        "tutorial-basics/Life Cycle",
      ],
    },
    {
      type: "doc",
      id: "tutorial-basics/AdvancedReference",
      label: "Advanced Reference",
    },
  ],
  Advanced: [
    {
      type: "doc",
      id: "Advanced",
      label: "Advanced",
    },
  ],
};

export default sidebars;
