import ChildhoodScene from "./ChildhoodScene";
import SchoolScene from "./SchoolScene";
import CollegeScene from "./CollegeScene";
import CodingScene from "./CodingScene";
import CertsScene from "./CertsScene";
import BtracScene from "./BtracScene";
import MomentumScene from "./MomentumScene";
import InfiniteOpenSourceScene from "./InfiniteOpenSourceScene";
import SkillsScene from "./SkillsScene";
import ProjectsScene from "./ProjectsScene";
import DatabaseScene from "./DatabaseScene";
import ApiScene from "./ApiScene";
import PaymentScene from "./PaymentScene";
import AiScene from "./AiScene";
import EngineeringScene from "./EngineeringScene";
import CurrentScene from "./CurrentScene";
import FutureScene from "./FutureScene";
import ContactScene from "./ContactScene";

// Maps chapter id -> the scene component that renders its world segment.
export const sceneRegistry: Record<string, React.ComponentType> = {
  childhood: ChildhoodScene,
  school: SchoolScene,
  college: CollegeScene,
  "first-code": CodingScene,
  certifications: CertsScene,
  btrac: BtracScene,
  momentum: MomentumScene,
  ioss: InfiniteOpenSourceScene,
  skills: SkillsScene,
  projects: ProjectsScene,
  database: DatabaseScene,
  api: ApiScene,
  payment: PaymentScene,
  ai: AiScene,
  engineering: EngineeringScene,
  current: CurrentScene,
  future: FutureScene,
  contact: ContactScene,
};
