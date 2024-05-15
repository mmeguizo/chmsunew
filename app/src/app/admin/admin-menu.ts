import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard Monitoring",
    icon: { icon: "list-alt", pack: "fa" },
    children: [
      {
        title: "Dashboard",
        icon: { icon: "list", pack: "fa" },
        link: "/admin/dashboard",
      },
      {
        title: "Goals",
        icon: { icon: "bullseye", pack: "fa" },
        link: "/admin/objectives",
      },
      {
        title: "Research",
        icon: { icon: "search-location", pack: "fa" },
        link: "/admin/research",
      },
    ],
  },
  {
    title: "Users",
    icon: { icon: "user-cog", pack: "fa" },
    link: "/admin/users",
  },
];

/*

link: "/admin/dashboard",
    home: true,

    <i class="fab fa-searchengin"></i>
*/
