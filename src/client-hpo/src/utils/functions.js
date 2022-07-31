export const sortConcertsByDate = (a, b, isDescending = false) => {
  const aDate = Date.parse(a.date);
  const bDate = Date.parse(b.date);
  if (aDate === bDate) {
    return 0;
  }
  let mult = isDescending ? -1 : 1;
  return aDate < bDate ? -1 * mult : 1 * mult;
};

export const parsePgDateToString = (pgDate) => {
  const regex = /\d{4}-\d{2}-\d{2}/;
  if (!pgDate.match(regex)) {
    console.log(`Cannot parse '${pgDate}' from date to display string`);
    return pgDate;
  }
  const year = pgDate.substring(0, 4);
  let month = pgDate.substring(5, 7);
  let day = pgDate.substring(8, 10);

  if (month.match(/0\d/)) {
    month = month.substring(1, 2);
  }
  if (day.match(/0\d/)) {
    day = day.substring(1, 2);
  }

  const displayString = `${day}.${month}.${year}`;
  return displayString;
};
