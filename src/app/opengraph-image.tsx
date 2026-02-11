import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "{alqode} | Digital Systems Agency, Cape Town";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#10b981", fontSize: 72, fontWeight: 700 }}>
            {"{"}
          </span>
          <span style={{ color: "#ffffff", fontSize: 72, fontWeight: 700 }}>
            alqode
          </span>
          <span style={{ color: "#10b981", fontSize: 72, fontWeight: 700 }}>
            {"}"}
          </span>
        </div>
        <div
          style={{
            color: "#666666",
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          Digital Systems Agency. Cape Town.
        </div>
        <div
          style={{
            color: "#10b981",
            fontSize: 18,
            fontWeight: 500,
            marginTop: 16,
            letterSpacing: 2,
          }}
        >
          WEB APPS &bull; AUTOMATION &bull; AI SYSTEMS
        </div>
      </div>
    ),
    { ...size }
  );
}
