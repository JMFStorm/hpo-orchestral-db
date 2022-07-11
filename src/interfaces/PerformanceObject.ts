import SoloistPerformanceObject from "./SoloistPerformanceObject";

export default interface PerformanceObject {
  order: string;
  concertId: string;
  symphonyId: string;
  conductors: string[];
  composers: string[];
  arrangers: string;
  soloist_performances: SoloistPerformanceObject[];
  footnote: string;
  archive_info: string;
  premiere_tag: string;
}
