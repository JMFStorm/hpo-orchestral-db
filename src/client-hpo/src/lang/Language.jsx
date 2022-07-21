import React, { useContext } from "react";

import LanguageContext from "./languageContext";

const Language = () => {
  const { languageContent } = useContext(LanguageContext);
  const lng = (key) => {
    const keyValue = languageContent[key];
    if (!keyValue && process.env.NODE_ENV != "production") {
      console.error(`Invalid lng key for: ${key}`);
      return "**ERROR_INVALID_LNG_KEY**";
    }
    if (!keyValue) {
      return "";
    }
    return keyValue;
  };
  return { lng };
};

export default Language;
