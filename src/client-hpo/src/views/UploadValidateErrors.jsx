import React from "react";

import Language from "../lang/Language";

const UpdateValidateErrors = ({ uploadErrors }) => {
  if (uploadErrors.length < 1) {
    return <></>;
  }
  const { lng } = Language();

  const errorStrings = uploadErrors.map((x) => {
    switch (x.errorType) {
      case "value_missing":
        return lng("upload_error.value_missing", { cell: x.cellName, row: x.rowNumber });
      case "invalid_format":
        return lng("upload_error.invalid_format", { cell: x.cellName, row: x.rowNumber, value: x.cellValue });
      case "value_not_number":
        return lng("upload_error.value_not_number", { cell: x.cellName, row: x.rowNumber, value: x.cellValue });
      case "column_missing":
        return lng("upload_error.column_missing", { value: x.cellValue });
      default:
        return "";
    }
  });
  return (
    <>
      <ul>
        {errorStrings.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </>
  );
};

export default UpdateValidateErrors;
