import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "activity-outline",
    link: "/admin/dashboard",
    home: true,
  },
  {
    title: "Users",
    icon: "person-outline",
    link: "/admin/users",
  },
  {
    title: "Objectives",
    icon: "calendar-outline",
    link: "/admin/objectives",
  },
];
