import * as React from "react";
import { Outlet, HeadContent, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster position="top-right" expand={true} richColors closeButton />
    </React.Fragment>
  );
}
