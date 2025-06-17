import { createRouter, RouterProvider } from "@tanstack/react-router";

import "./App.css";
import { routeTree } from "./routeTree.gen";
import NotFound from "./components/ui/custom/404";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
  defaultPreloadStaleTime: 0, // Make sure loader is called when route is preloaded or visited
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
