/**
 * @typedef {'Satisfactory' | 'Pending' | 'Failed'} InspectionStatus
 */

/**
 * @typedef {{
 *   date: string;
 *   taskName: string;
 *   taskDescription: string;
 *   status: InspectionStatus;
 * }} InspectionItem
 */

/**
 * @typedef {{
 *   equipment: { name: string; id: string; tag: string };
 *   inspections: InspectionItem[];
 * }} InspectionData
 */

/** @type {InspectionData} */
export const inspectionData = {
  equipment: {
    name: "Fire Pump",
    id: "TECFI00009",
    tag: "FIR00009",
  },
  inspections: [
    {
      date: "2025-01-24",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-24",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2025-01-25",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2025-01-23",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Failed",
    },
    // A couple extra items to better match the long list in the reference UI.
    {
      date: "2025-01-22",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-21",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-20",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-19",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-18",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-17",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-16",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2025-01-15",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-14",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Failed",
    },
    {
      date: "2025-01-13",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2025-01-12",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-11",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-10",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-09",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2025-01-08",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-07",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-06",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Failed",
    },
    {
      date: "2025-01-05",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-04",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2025-01-03",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-02",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },
    {
      date: "2025-01-01",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Satisfactory",
    },

    // Extra month samples to test month navigation.
    {
      date: "2025-02-02",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Pending",
    },
    {
      date: "2024-12-29",
      taskName: "Task Name",
      taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      status: "Failed",
    },
  ],
};

/**
 * Filters local inspections by month/year.
 * @param {number} year
 * @param {number} month 1-12
 * @returns {InspectionItem[]}
 */
export function getInspectionsByMonth(year, month) {
  const monthIndex = month - 1;
  return inspectionData.inspections.filter((item) => {
    const d = new Date(item.date);
    return d.getFullYear() === year && d.getMonth() === monthIndex;
  });
}
