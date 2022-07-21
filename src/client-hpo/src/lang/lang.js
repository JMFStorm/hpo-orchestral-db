import english from "./en.json";
import finnish from "./fi.json";

export const getLanguageText = (language) => {
  switch (language) {
    case "fi":
      return finnish;
    case "en":
      return english;
    default:
      return english;
  }
};
