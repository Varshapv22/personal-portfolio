import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { journeyProgress } from "../../state/journeyStore";
import { scrollHandle } from "../../state/scrollControl";

export default function ScrollBridge() {
  const scroll = useScroll();

  useEffect(() => {
    scrollHandle.el = scroll.el;
  }, [scroll.el]);

  useFrame(() => {
    journeyProgress.value = scroll.offset;
  });
  return null;
}
