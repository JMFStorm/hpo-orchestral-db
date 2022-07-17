export const sortStringsFunction = (a: string, b: string) => {
  const nameA = a.toUpperCase();
  const nameB = b.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

// Parse date and time
// Recommended date: 1999-01-08 -> January 8, 1999
export const parseStringToDate = (date: string) => {
  const dateArr = date.split(".");
  return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
};

// Filter uniques from object array by 'id' field
export const filterUniquesById = (array: any[]) => {
  const filtered = array.filter(
    (current, index, self) => index === self.findIndex((x) => x.id === current.id)
  );
  return filtered;
};
