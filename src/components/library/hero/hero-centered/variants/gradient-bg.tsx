"use client";

export function GradientBg(): React.ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: "var(--color-background)" }} />
      <div
        className="absolute -top-1/2 -left-1/4 h-full w-3/4 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-primary) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -right-1/4 -bottom-1/3 h-3/4 w-2/3 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-secondary) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute top-1/4 right-1/3 h-1/2 w-1/2 opacity-15"
        style={{
          background: "radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
