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
    <div className="flex h-screen bg-[var(--r-bg)] overflow-hidden">
      {/* Left Navigation (52px) */}
      <LeftNav />

      {/* Secondary Panel (280px, conditional) */}
      {showSecondary && (
        <div className="w-70 bg-[var(--r-sf)] border-r border-[var(--r-bd)] flex flex-col overflow-hidden">
          {secondaryContent}
        </div>
      )}

      {/* Main Content (flex: 1) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {mainContent}
      </div>
    </div>
  );
}
