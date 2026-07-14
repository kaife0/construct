/** Public inquiry submission (used by the home contact section and service detail pages). */

export type InquiryPayload = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
};

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = "Could not send your message. Please try again.";
    try {
      const data = await res.json();
      if (data.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
}
