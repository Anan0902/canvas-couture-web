import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr, upiLink, UPI_ID } from "@/lib/format";

export function UpiPay({
  orderId,
  orderNo,
  amount,
  label,
  onPaid,
}: {
  orderId: string;
  orderNo: string;
  amount: number;
  label: string;
  onPaid: () => void;
}) {
  const link = upiLink(amount, `${label} ${orderNo}`, orderNo);
  const [qr, setQr] = useState("");
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void QRCode.toDataURL(link, { width: 220, margin: 1 }).then(setQr);
  }, [link]);

  async function confirm() {
    setBusy(true);
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "paid", payment_ref: ref.trim().slice(0, 60) })
      .eq("id", orderId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Payment noted — your booking is confirmed!");
    onPaid();
  }

  return (
    <div className="glass-card soft-in space-y-4 rounded-2xl p-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="display text-4xl">{inr(amount)}</p>
        <p className="text-xs text-muted-foreground">Pay to {UPI_ID}</p>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {qr && <img src={qr} alt="UPI QR code" width={160} height={160} className="rounded-lg border border-border" />}
        <div className="flex-1 space-y-2 text-sm">
          <a
            href={link}
            className="block rounded-full bg-primary px-4 py-2.5 text-center text-primary-foreground transition hover:opacity-90"
          >
            Open UPI app to pay
          </a>
          <p className="text-xs text-muted-foreground">
            On mobile this opens Google Pay, PhonePe, Paytm or BHIM. On a laptop, scan the QR with your phone.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Payment happens only inside your UPI app. We never ask for your UPI PIN, card or bank details.
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="UPI transaction ID (optional)"
          className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm"
        />
        <button
          disabled={busy}
          onClick={confirm}
          className="rounded-full border border-foreground px-4 py-2 text-sm transition hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          I have paid
        </button>
      </div>
    </div>
  );
}
