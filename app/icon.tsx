import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Dynamic text-based HK favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 6,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 900,
          fontSize: 16,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#FFFFFF" }}>H</span>
        <span style={{ color: "#E53935" }}>K</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
