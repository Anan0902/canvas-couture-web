import { createFileRoute } from "@tanstack/react-router";
import { MyOrders } from "./customer.orders";

export const Route = createFileRoute("/_authenticated/designer/orders")({
  head: () => ({ meta: [{ title: "My Orders — Designer — Atelier Aura" }] }),
  component: MyOrders,
});
