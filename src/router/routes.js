const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PageHome.vue") },
      { path: "/messages", component: () => import("pages/PageMessages.vue") },
      { path: "/chat/:id", component: () => import("pages/PageChat.vue") },
      {
        path: "/user/:id",
        component: () => import("pages/PageProfile.vue"),
      },
      {
        path: "/notifications",
        component: () => import("pages/PageNotifications.vue"),
      },
      { path: "/settings", component: () => import("pages/PageSettings.vue") },
      { path: "/help", component: () => import("pages/PageHelp.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
