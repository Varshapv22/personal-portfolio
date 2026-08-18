import ChildhoodScene from "./ChildhoodScene";
import SchoolScene from "./SchoolScene";
import CollegeScene from "./CollegeScene";
import CodingScene from "./CodingScene";
import CertsScene from "./CertsScene";
import BtracScene from "./BtracScene";
import InfiniteOpenSourceScene from "./InfiniteOpenSourceScene";
import ProjectsScene from "./ProjectsScene";
import ContactScene from "./ContactScene";

// Maps chapter id -> the scene component that renders its world segment.
export const sceneRegistry: Record<string, React.ComponentType> = {
  childhood:        ChildhoodScene,
  school:           SchoolScene,
  college:          CollegeScene,
  "first-code":     CodingScene,
  certifications:   CertsScene,
  btrac:            BtracScene,
  ioss:             InfiniteOpenSourceScene,
  projects:         ProjectsScene,
  contact:          ContactScene,
};
