"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { getSiteSettings, updateSiteSettings, type SiteSettingsRecord } from "@/lib/admin-api";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { TextField, TextAreaField, NumberField } from "@/components/fields";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function SiteSettingsForm() {
  const { data, error } = useResource<SiteSettingsRecord>("singleton", getSiteSettings, "Could not load site settings.");
  return (
    <ResourceLoader data={data} error={error}>
      {(initial) => <SettingsForm initial={initial} />}
    </ResourceLoader>
  );
}

function SettingsForm({ initial }: { initial: SiteSettingsRecord }) {
  const [settings, setSettings] = useState(initial);
  const [bio, setBio] = useState(initial.profile.bio.join("\n"));
  const [credentials, setCredentials] = useState(initial.profile.credentials.join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        ...settings,
        profile: {
          ...settings.profile,
          bio: bio.split("\n").map((s) => s.trim()).filter(Boolean),
          credentials: credentials.split("\n").map((s) => s.trim()).filter(Boolean),
        },
      };
      setSettings(await updateSiteSettings(payload));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save site settings.");
    } finally {
      setSaving(false);
    }
  }

  const addAchievement = () =>
    update("achievements", [...settings.achievements, { year: "", title: "", desc: "" }]);
  const updateAchievement = (i: number, field: "year" | "title" | "desc", value: string) =>
    update(
      "achievements",
      settings.achievements.map((a, idx) => (idx === i ? { ...a, [field]: value } : a))
    );
  const removeAchievement = (i: number) =>
    update("achievements", settings.achievements.filter((_, idx) => idx !== i));

  return (
    <AdminFormShell
      backHref="/admin"
      backLabel="Dashboard"
      heading="Site Settings"
      onSubmit={handleSubmit}
      error={error}
      success={success ? "Settings saved." : null}
      saving={saving}
      submitLabel="Save settings"
      cancelHref="/admin"
    >
      <span className="label text-[10px] text-accent-strong">PROFILE</span>
      <TextField label="Name" value={settings.profile.name} onChange={(v) => update("profile", { ...settings.profile, name: v })} required />
      <TextField label="Role" value={settings.profile.role} onChange={(v) => update("profile", { ...settings.profile, role: v })} required />
      <TextAreaField label="Intro" value={settings.profile.intro} onChange={(v) => update("profile", { ...settings.profile, intro: v })} rows={3} required />
      <TextAreaField label="Bio" value={bio} onChange={setBio} rows={6} hint="One paragraph per line." />
      <TextAreaField label="Credentials" value={credentials} onChange={setCredentials} rows={4} hint="One per line." />
      <div className="grid grid-cols-3 gap-4">
        <NumberField
          label="Projects"
          value={settings.profile.stats.projects}
          onChange={(v) => update("profile", { ...settings.profile, stats: { ...settings.profile.stats, projects: v } })}
        />
        <NumberField
          label="Experience"
          suffix="yrs"
          value={settings.profile.stats.experienceYears}
          onChange={(v) => update("profile", { ...settings.profile, stats: { ...settings.profile.stats, experienceYears: v } })}
        />
        <NumberField
          label="Cities"
          value={settings.profile.stats.cities}
          onChange={(v) => update("profile", { ...settings.profile, stats: { ...settings.profile.stats, cities: v } })}
        />
      </div>

      <span className="label mt-2 text-[10px] text-accent-strong">ACHIEVEMENTS</span>
      <div className="grid gap-4">
        {settings.achievements.map((a, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_3fr_auto] items-end gap-3 border border-line p-4">
            <TextField label="Year" value={a.year} onChange={(v) => updateAchievement(i, "year", v)} />
            <TextField label="Title" value={a.title} onChange={(v) => updateAchievement(i, "title", v)} />
            <TextField label="Description" value={a.desc} onChange={(v) => updateAchievement(i, "desc", v)} />
            <button
              type="button"
              onClick={() => removeAchievement(i)}
              className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-accent hover:text-accent-strong"
              aria-label="Remove achievement"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAchievement}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-graphite hover:text-ink"
        >
          <Plus size={15} /> Add achievement
        </button>
      </div>

      <span className="label mt-2 text-[10px] text-accent-strong">CONTACT</span>
      <TextField label="Phone" value={settings.contact.phone} onChange={(v) => update("contact", { ...settings.contact, phone: v })} required />
      <TextField label="Email" value={settings.contact.email} onChange={(v) => update("contact", { ...settings.contact, email: v })} required />
      <TextField
        label="WhatsApp number"
        value={settings.contact.whatsappNumber}
        onChange={(v) => update("contact", { ...settings.contact, whatsappNumber: v })}
        hint="International format, digits only — e.g. 918797786067"
        required
      />
      <TextField label="Location" value={settings.contact.location} onChange={(v) => update("contact", { ...settings.contact, location: v })} required />

      <span className="label mt-2 text-[10px] text-accent-strong">SOCIALS</span>
      <TextField label="Instagram" value={settings.socials.instagram} onChange={(v) => update("socials", { ...settings.socials, instagram: v })} placeholder="https://instagram.com/…" />
      <TextField label="LinkedIn" value={settings.socials.linkedin} onChange={(v) => update("socials", { ...settings.socials, linkedin: v })} placeholder="https://linkedin.com/…" />
      <TextField label="YouTube" value={settings.socials.youtube} onChange={(v) => update("socials", { ...settings.socials, youtube: v })} placeholder="https://youtube.com/…" />
    </AdminFormShell>
  );
}
