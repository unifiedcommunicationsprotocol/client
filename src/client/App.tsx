import { useEffect, useState } from "react";
import "./index.css";
import { AppProvider, useAppContext } from "./AppContext";
import { ComposeModal } from "./components/ComposeModal";
import { MainApp } from "./components/MainApp";
import { Onboarding } from "./components/Onboarding";

const darkModeTheme = {
  "--r-bg": "#09090B",
  "--r-sf": "#111113",
  "--r-sf2": "#18181B",
  "--r-bd": "#1E1E22",
  "--r-bd2": "#28282C",
  "--r-t1": "#FAFAFA",
  "--r-t2": "#A1A1AA",
  "--r-t3": "#52525B",
  "--r-acc": "#6366F1",
  "--r-accd": "rgba(99,102,241,0.15)",
  "--r-br": "#D97706",
  "--r-brbg": "rgba(217,119,6,0.08)",
  "--r-ag": "#8B5CF6",
  "--r-safe": "#22C55E",
  "--r-sel": "rgba(99,102,241,0.09)",
  "--r-hov": "rgba(255,255,255,0.03)",
};

const lightModeTheme = {
  "--r-bg": "#F0F0F4",
  "--r-sf": "#FFFFFF",
  "--r-sf2": "#F5F5F8",
  "--r-bd": "#E4E4E9",
  "--r-bd2": "#D4D4DA",
  "--r-t1": "#18181B",
  "--r-t2": "#71717A",
  "--r-t3": "#A1A1AA",
  "--r-acc": "#4F46E5",
  "--r-accd": "rgba(79,70,229,0.10)",
  "--r-br": "#B45309",
  "--r-brbg": "rgba(180,83,9,0.06)",
  "--r-ag": "#7C3AED",
  "--r-safe": "#16A34A",
  "--r-sel": "rgba(79,70,229,0.08)",
  "--r-hov": "rgba(0,0,0,0.028)",
};

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { state } = useAppContext();

  useEffect(() => {
    const theme = state.darkMode ? darkModeTheme : lightModeTheme;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [state.darkMode]);

  return (
    <div style={{ height: "100%" }}>
      {!isAuthenticated ? (
        <Onboarding onComplete={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <MainApp onLogout={() => setIsAuthenticated(false)} />
          <ComposeModal />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
