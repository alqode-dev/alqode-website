import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "alqode — Digital Systems Agency, Cape Town + UAE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.18) 0%, transparent 55%), radial-gradient(circle at 90% 90%, rgba(16,185,129,0.10) 0%, transparent 50%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "system-ui, sans-serif",
          padding: "70px 80px",
          position: "relative",
        }}
      >
        {/* Top row: small brand tag + free mockup badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#10b981",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Digital Systems Agency
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              border: "1px solid #10b981",
              borderRadius: 999,
              color: "#10b981",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: "#10b981",
                borderRadius: 999,
                display: "flex",
              }}
            />
            Free mockup in 24h
          </div>
        </div>

        {/* Middle: brand + headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* {alqode} */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 0,
            }}
          >
            <span style={{ color: "#10b981", fontSize: 110, fontWeight: 800 }}>
              {"{"}
            </span>
            <span style={{ color: "#ffffff", fontSize: 110, fontWeight: 800, letterSpacing: -2 }}>
              alqode
            </span>
            <span style={{ color: "#10b981", fontSize: 110, fontWeight: 800 }}>
              {"}"}
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div style={{ color: "#ffffff", fontSize: 50, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
              We don&apos;t build websites.
            </div>
            <div style={{ color: "#10b981", fontSize: 50, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
              We build machines that make you money.
            </div>
          </div>
        </div>

        {/* Bottom: capabilities + location */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 24,
            borderTop: "1px solid #2a2a2a",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 28,
              color: "#666666",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            <span style={{ display: "flex" }}>Web Apps</span>
            <span style={{ display: "flex", color: "#10b981" }}>·</span>
            <span style={{ display: "flex" }}>Automation</span>
            <span style={{ display: "flex", color: "#10b981" }}>·</span>
            <span style={{ display: "flex" }}>WhatsApp Systems</span>
            <span style={{ display: "flex", color: "#10b981" }}>·</span>
            <span style={{ display: "flex" }}>E-commerce</span>
          </div>
          <div
            style={{
              color: "#666666",
              fontSize: 20,
              fontWeight: 500,
              display: "flex",
            }}
          >
            Cape Town · UAE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
