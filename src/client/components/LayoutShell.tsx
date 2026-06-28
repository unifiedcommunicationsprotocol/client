import { LeftNav } from "./LeftNav";

interface LayoutShellProps {
  showSecondary: boolean;
  secondaryContent?: React.ReactNode;
  mainContent: React.ReactNode;
}

export function LayoutShell({
  showSecondary,
  secondaryContent,
  mainContent,
}: LayoutShellProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--r-bg)",
        overflow: "hidden",
      }}
    >
      {/* Left Navigation (52px) */}
      <LeftNav />

      {/* Secondary Panel (280px, conditional) */}
      {showSecondary && (
        <div
          style={{
            width: "280px",
            backgroundColor: "var(--r-sf)",
            borderRight: "1px solid var(--r-bd)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {secondaryContent}
        </div>
      )}

      {/* Main Content (flex: 1) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {mainContent}
      </div>
    </div>
  );
}
