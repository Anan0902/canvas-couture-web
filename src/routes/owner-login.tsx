import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/owner-login")({
  head: () => ({
    meta: [
      { title: "Owner Login — Atelier Aura" },
      { name: "description", content: "Secure login for the atelier owner." },
      { property: "og:title", content: "Owner Login — Atelier Aura" },
      { property: "og:description", content: "Secure login for the atelier owner." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AuthForm owner />,
});
