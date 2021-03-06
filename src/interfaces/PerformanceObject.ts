import SoloistPerformanceObject from "./SoloistPerformanceObject";

export default interface PerformanceObject {
  order: string;
  concertId: string;
  symphonyId: string;
  composers: string[];
  soloist_performances: Partial<SoloistPerformanceObject>[];
  premiere_tag: string;
  is_encore: boolean;
}
