export default function sitemap() {
  return [
    {
      url: "https://redsearate.com",
      alternates: {
        languages: {
          en: "https://redsearate.com",
          "zh-CN": "https://redsearate.com/zh",
        },
      },
    },
    ...["/rates", "/zh/rates"].map((path) => ({
      url: `https://redsearate.com${path}`,
      alternates: {
        languages: {
          en: "https://redsearate.com/rates",
          "zh-CN": "https://redsearate.com/zh/rates",
        },
      },
    })),
    {
      url: "https://redsearate.com/zh",
      alternates: {
        languages: {
          en: "https://redsearate.com",
          "zh-CN": "https://redsearate.com/zh",
        },
      },
    },
  ];
}
