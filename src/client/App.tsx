import { useState } from "react";
import "./index.css";
import { MainApp } from "./components/MainApp";
import { Onboarding } from "./components/Onboarding";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div style={{ height: "100%" }}>
      {!isAuthenticated ? (
        <Onboarding onComplete={() => setIsAuthenticated(true)} />
      ) : (
        <MainApp onLogout={() => setIsAuthenticated(false)} />
      )}
    </div>
  );
}

export default App;
