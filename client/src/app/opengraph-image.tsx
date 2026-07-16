import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded default social-share card, matching the site's ink/paper/ochre palette. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f3ee",
          color: "#17181c",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #17181c",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ width: 72, height: 6, background: "#bd6a1f" }} />
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 900 }}>
            Civil engineering, house planning &amp; smart material calculators.
          </div>
          <div style={{ fontSize: 30, color: "#55565a", maxWidth: 820 }}>
            House plans, structural design, interiors, 2D/3D elevations, estimation &amp; ready-made naksha.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#55565a" }}>
          <span>{siteConfig.tagline}</span>
          <span style={{ color: "#9c5514", fontWeight: 600 }}>Sahibganj · Jharkhand · India</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
