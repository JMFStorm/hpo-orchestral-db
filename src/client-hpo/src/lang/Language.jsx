import { useContext } from "react";

import LanguageContext from "./languageContext";

const Language = () => {
  const { languageContent } = useContext(LanguageContext);
  const lng = (langKey, variables) => {
    let keyValue = languageContent[langKey];
    if (!keyValue && process.env.NODE_ENV !== "production") {
      console.error(`Invalid lng key for: ${langKey}`);
      return "**ERROR_INVALID_LNG_KEY**";
    }
    if (!keyValue) {
      return langKey;
    }
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        const regEx = new RegExp(`{${key}}`, "g");
        const found = regEx.test(keyValue);
        if (found) {
          keyValue = keyValue.replaceAll(regEx, value);
        }
      }
    }
    return keyValue;
  };
  return { lng };
};

export default Language;
