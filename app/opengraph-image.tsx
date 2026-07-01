import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "InsulinIQ — Evidence-based metabolic health education";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          backgroundColor: "#103421",
          backgroundImage: "radial-gradient(circle at 25% 25%, #185031 0%, #103421 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: "#277a4a",
            marginBottom: 40,
          }}
        >
          <span style={{ color: "white", fontSize: 56, fontWeight: 900 }}>IQ</span>
        </div>
        <div style={{ color: "white", fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
          InsulinIQ
        </div>
        <div
          style={{
            color: "#a6d2b2",
            fontSize: 32,
            marginTop: 16,
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          Evidence-based metabolic health education
        </div>
      </div>
    ),
    { ...size }
  );
}
