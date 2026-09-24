export function inr(amount: number): string {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

export const UPI_ID = "ananthikaananthika4@oksbi";
export const UPI_PAYEE = "Atelier Aura";

export function upiLink(amount: number, note: string, ref: string): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
    tr: ref,
  });
  return `upi://pay?${params.toString()}`;
}

export function bookingFee(total: number): number {
  return Math.round(total * 0.1);
}

export function orderNumber(): string {
  return "AT-" + Date.now().toString().slice(-8);
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
