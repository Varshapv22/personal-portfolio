import { Canvas } from "@react-three/fiber";
import { ScrollControls, PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";
import Journey3D from "./scenes/Journey3D";
import ScrollBridge from "./components/three/ScrollBridge";
import IntroScreen from "./components/ui/IntroScreen";
import JourneyNav from "./components/ui/JourneyNav";
import ProgressIndicator from "./components/ui/ProgressIndicator";
import NarrativeOverlay from "./components/ui/NarrativeOverlay";
import ProjectPanel from "./components/ui/ProjectPanel";
import ProjectBubbles from "./components/ui/ProjectBubbles";
import PortalPopup from "./components/ui/PortalPopup";
import ContactSection from "./components/ui/ContactSection";
import AccessibilityControls from "./components/ui/AccessibilityControls";
import KeyboardHint from "./components/ui/KeyboardHint";
import { useDeviceCapability } from "./hooks/useDeviceCapability";
import { useKeyboardWalk } from "./hooks/useKeyboardWalk";
import { useJourneyStore } from "./state/journeyStore";
import { chapters } from "./data/chapters";

const SCROLL_PAGES = Math.round(chapters.length * 1.5);

export default function App() {
  useDeviceCapability();
  useKeyboardWalk();
  const quality = useJourneyStore((s) => s.quality);
  const setQuality = useJourneyStore((s) => s.setQuality);
  const [dpr, setDpr] = useState<[number, number]>([1, quality === "low" ? 1 : 2]);

  return (
    <div className="app-root">
      <Canvas
        shadows={quality !== "low"}
        dpr={dpr}
        gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 2, -4] }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setQuality("low");
            setDpr([1, 1]);
          }}
        />
        <ScrollControls pages={SCROLL_PAGES} damping={0.2} style={{ scrollbarWidth: "none" }}>
          <ScrollBridge />
          <Journey3D />
        </ScrollControls>
      </Canvas>

      <IntroScreen />
      <JourneyNav />
      <ProgressIndicator />
      <NarrativeOverlay />
      <ProjectBubbles />
      <PortalPopup />
      <ProjectPanel />
      <ContactSection />
      <AccessibilityControls />
      <KeyboardHint />
    </div>
  );
}
