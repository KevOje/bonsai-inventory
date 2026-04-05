import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: "/",
        lazy: () => import("./pages/DashboardPage").then((m) => ({ Component: m.default })),
      },
      {
        path: "/bonsai/new",
        lazy: () => import("./pages/BonsaiCreatePage").then((m) => ({ Component: m.default })),
      },
      {
        path: "/bonsai/:id",
        lazy: () => import("./pages/BonsaiDetailPage").then((m) => ({ Component: m.default })),
      },
      {
        path: "/bonsai/:id/edit",
        lazy: () => import("./pages/BonsaiEditPage").then((m) => ({ Component: m.default })),
      },
      {
        path: "/calendar",
        lazy: () => import("./pages/CalendarPage").then((m) => ({ Component: m.default })),
      },
      {
        path: "*",
        lazy: () => import("./pages/NotFoundPage").then((m) => ({ Component: m.default })),
      },
    ],
  },
]);
