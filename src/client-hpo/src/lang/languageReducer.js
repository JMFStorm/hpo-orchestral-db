import { getLanguageText } from "./lang";

export const languageReducer = (state, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      const languageContent = getLanguageText(action.payload.language);
      return { languageContent };
    default:
      return state;
  }
};
