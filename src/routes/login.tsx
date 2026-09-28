import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Atelier Aura" },
      { name: "description", content: "Customer and designer login and sign up." },
      { property: "og:title", content: "Login — Atelier Aura" },
      { property: "og:description", content: "Customer and designer login and sign up." },
    ],
  }),
  component: () => <AuthForm />,
});
