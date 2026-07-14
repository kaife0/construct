/**
 * Client-side calls to the admin API. All paths are relative (/api/*) so they
 * go through the same-origin proxy carrying the httpOnly session cookie.
 */

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error ?? `Request failed (${res.status}).`;
  } catch {
    return `Request failed (${res.status}).`;
  }
}

async function jsonRequest<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Bust the public site's ISR cache for the given tags right after a mutation,
 * so edits show up immediately instead of waiting out the revalidate window.
 * Best-effort: a failure here must not block the admin flow — the write
 * already succeeded, and the cache will still catch up on its own timer.
 */
async function revalidate(tags: string[]): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });
  } catch {
    // ignore — see doc comment
  }
}

/** Upload an image, returns its stored URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  form.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseError(res));
  const data: { url: string } = await res.json();
  return data.url;
}

// ---- Services --------------------------------------------------------------

export type ServiceInput = {
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  image: string;
};

export type ServiceRecord = ServiceInput & { _id: string; slug: string; order: number };

export const listServices = () => jsonRequest<ServiceRecord[]>("/api/services", "GET");
export const getService = (id: string) => jsonRequest<ServiceRecord>(`/api/services/${id}`, "GET");

export async function createService(data: ServiceInput): Promise<ServiceRecord> {
  const result = await jsonRequest<ServiceRecord>("/api/services", "POST", data);
  await revalidate(["services"]);
  return result;
}

export async function updateService(id: string, data: ServiceInput): Promise<ServiceRecord> {
  const result = await jsonRequest<ServiceRecord>(`/api/services/${id}`, "PUT", data);
  await revalidate(["services"]);
  return result;
}

export async function deleteService(id: string): Promise<{ ok: true }> {
  const result = await jsonRequest<{ ok: true }>(`/api/services/${id}`, "DELETE");
  await revalidate(["services"]);
  return result;
}

// ---- Ready-made Plans -------------------------------------------------------

export type PlanInput = {
  title: string;
  config: string;
  area: number;
  beds: number;
  baths: number;
  floors: number;
  facing: string;
  tag?: string;
  image: string;
  description: string;
};

export type PlanRecord = PlanInput & { _id: string; slug: string; order: number };

export const listPlans = () => jsonRequest<PlanRecord[]>("/api/plans", "GET");
export const getPlan = (id: string) => jsonRequest<PlanRecord>(`/api/plans/${id}`, "GET");

export async function createPlan(data: PlanInput): Promise<PlanRecord> {
  const result = await jsonRequest<PlanRecord>("/api/plans", "POST", data);
  await revalidate(["plans"]);
  return result;
}

export async function updatePlan(id: string, data: PlanInput): Promise<PlanRecord> {
  const result = await jsonRequest<PlanRecord>(`/api/plans/${id}`, "PUT", data);
  await revalidate(["plans"]);
  return result;
}

export async function deletePlan(id: string): Promise<{ ok: true }> {
  const result = await jsonRequest<{ ok: true }>(`/api/plans/${id}`, "DELETE");
  await revalidate(["plans"]);
  return result;
}

// ---- Inquiries ---------------------------------------------------------

export type InquiryStatus = "new" | "contacted" | "closed";

export type InquiryRecord = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

export const listInquiries = () => jsonRequest<InquiryRecord[]>("/api/inquiries", "GET");

export const setInquiryStatus = (id: string, status: InquiryStatus) =>
  jsonRequest<InquiryRecord>(`/api/inquiries/${id}`, "PATCH", { status });

export const deleteInquiry = (id: string) => jsonRequest<{ ok: true }>(`/api/inquiries/${id}`, "DELETE");
