import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/DashboardShell";
import { OrderList } from "@/components/OrderList";
import { useAuth } from "@/lib/auth";
import { fetchOrders } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/customer/orders")({
  head: () => ({ meta: [{ title: "My Orders — Atelier Aura" }] }),
  component: MyOrders,
});

export function MyOrders() {
  const { user } = useAuth();
  const { data = [] } = useQuery({ queryKey: ["orders", user?.id], queryFn: () => fetchOrders(user!.id), enabled: !!user, refetchInterval: 20000 });
  return (
    <div>
      <PageTitle title="My Orders" sub="Tap an order to see its tracking timeline." />
      <OrderList orders={data} />
    </div>
  );
}
