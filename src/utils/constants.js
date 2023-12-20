export function calculateAge(dob) {
  // Parse the provided date of birth string into a Date object
  const birthDate = new Date(dob);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in years
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} Years`;
}
export const getStartAndEndDates = (filterType) => {
  const currentDate = new Date();

  switch (filterType) {
    case "This Week":
      return {
        fromDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay()
        ),
        toDate: currentDate,
      };

    case "This Month":
      return {
        fromDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ),
        toDate: currentDate,
      };

    case "Last 3 Months":
      const last3MonthsStartDate = new Date(currentDate);
      last3MonthsStartDate.setMonth(currentDate.getMonth() - 2); // Subtract 2 because getMonth is zero-based
      last3MonthsStartDate.setDate(1); // Set to the first day of the month
      return {
        fromDate: last3MonthsStartDate,
        toDate: currentDate,
      };

    case "This Year":
      return {
        fromDate: new Date(currentDate.getFullYear(), 0, 1),
        toDate: currentDate,
      };

    default:
      return null;
  }
};

export const filterTypes = [
  {
    label: "This Week",
    value: getStartAndEndDates("This Week"),
  },
  {
    label: "This Month",
    value: getStartAndEndDates("This Month"),
  },
  {
    label: "Last 3 Months",
    value: getStartAndEndDates("Last 3 Months"),
  },
  {
    label: "This Year",
    value: getStartAndEndDates("This Year"),
  },
];
