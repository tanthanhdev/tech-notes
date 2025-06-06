export type SiteConfig = {
  name: string;
  description: string;
  mainNav: {
    title: string;
    href: string;
    key: string;
  }[];
};

export const siteConfig: SiteConfig = {
  name: "Tech Notes Hub",
  description: "Center for sharing tech knowledge and technical guides",
  mainNav: [
    {
      title: "Home",
      href: "/",
      key: "home"
    },
    {
      title: "Blog",
      href: "/blog",
      key: "blog"
    },
    {
      title: "About",
      href: "/about",
      key: "about"
    }
  ]
};
