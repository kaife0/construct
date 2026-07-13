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
export const createService = (data: ServiceInput) => jsonRequest<ServiceRecord>("/api/services", "POST", data);
export const updateService = (id: string, data: ServiceInput) =>
  jsonRequest<ServiceRecord>(`/api/services/${id}`, "PUT", data);
export const deleteService = (id: string) => jsonRequest<{ ok: true }>(`/api/services/${id}`, "DELETE");
