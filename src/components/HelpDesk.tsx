import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchOrders } from "@/lib/queries";
import { inr, UPI_ID } from "@/lib/format";

interface Msg { from: "bot" | "me"; text: string }

const OPTIONS = ["Order details", "Track my order", "Payment help", "Customization help", "Delivery information", "Other help"];

export function HelpDesk() {
  const { user } = useAuth();
  const { data: orders = [] } = useQuery({ queryKey: ["orders", user?.id], queryFn: () => fetchOrders(user!.id), enabled: !!user });
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "How can I help you?" }]);

  function answer(opt: string): string {
    const latest = orders[0];
    switch (opt) {
      case "Order details":
        return orders.length
          ? orders.slice(0, 5).map((o) => `${o.order_no} — ${o.product_name}, ${inr(o.total)} (booking fee ${inr(o.booking_fee)}, payment ${o.payment_status})`).join("\n")
          : "You have no orders yet. Browse Dresses to start designing.";
      case "Track my order":
        return latest ? orders.slice(0, 5).map((o) => `${o.order_no}: ${o.status}`).join("\n") + "\nOpen My Orders to see the full timeline." : "No orders to track yet.";
      case "Payment help":
        return `Payments are by UPI only, to ${UPI_ID}. Dress bookings need a 10% booking fee — the rest is paid on delivery. Tap "Open UPI app" (or scan the QR), pay, then press "I have paid". We never ask for your PIN or bank details.`;
      case "Customization help":
        return "Pick a dress, then choose fabric (colours change with the fabric), a colour combination, pattern and add-ons like lace or flower work. Choose a standard size or enter your measurements in inches. The preview and price update instantly.";
      case "Delivery information":
        return "Stitched dresses usually take 7–14 days after measurements are confirmed. You'll see Packed and Out for Delivery on your order timeline. The remaining amount is paid on delivery.";
      default:
        return "For anything else, please mention your tracking ID and reach out to the atelier. We're happy to help!";
    }
  }

  return (
    <div className="glass-card mx-auto flex max-w-2xl flex-col rounded-2xl">
      <div className="max-h-[55vh] space-y-3 overflow-y-auto p-5">
        {msgs.map((m, i) => (
          <div key={i} className={"soft-in flex " + (m.from === "me" ? "justify-end" : "")}>
            <p className={"max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm " + (m.from === "me" ? "bg-primary text-primary-foreground" : "bg-secondary")}>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border p-4">
        {OPTIONS.map((o) => (
          <button key={o} onClick={() => setMsgs((s) => [...s, { from: "me", text: o }, { from: "bot", text: answer(o) }])} className="rounded-full border border-border px-3 py-1.5 text-xs transition hover:border-foreground">
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
