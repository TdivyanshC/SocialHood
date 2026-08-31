import { ImageResponse } from "next/og";

// The site referenced /og-image.jpg on every page and the file never existed,
// so every link shared to WhatsApp, LinkedIn or Slack unfurled without a card.
// Generating it here means there is no asset to keep in sync with the copy.
export const alt = "The SocialHood — AI Systems Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060608",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#00B98E",
            }}
          >
            AI Systems Studio
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 82,
              lineHeight: 1.05,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Systems that
          </div>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: -2,
            }}
          >
            do the work.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 32,
          }}
        >
          <div style={{ fontSize: 28, color: "#D4AF37" }}>The SocialHood</div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }}>
            Voice &middot; WhatsApp &middot; Automation &middot; Software
          </div>
        </div>
      </div>
    ),
    size
  );
}
