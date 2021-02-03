const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/PageHome.vue'), name: 'home'},
      {
        path: '/messages',
        component: () => import('pages/PageMessages.vue'),
        name: 'messages'
      },
      {path: '/chat/:pubkey', component: () => import('pages/PageChat.vue')},
      {
        path: '/user/:pubkey',
        component: () => import('pages/PageProfile.vue')
      },
      {
        path: '/notifications',
        component: () => import('pages/PageNotifications.vue')
      },
      {
        path: '/settings',
        component: () => import('pages/PageSettings.vue'),
        name: 'settings'
      },
      {
        path: '/help',
        component: () => import('pages/PageHelp.vue'),
        name: 'help'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
