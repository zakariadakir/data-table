"use strict";

export const projectStatusesArr = [
  "All",
  "At Risk",
  "On Hold",
  "Potential Risk",
  "On Track",
  "Archived",
];

export const defaultProjectsArr = [
  {
    isSelected: false,
    rowIndex: 1,
    id: 1,
    name: "Allosaurus web app",
    pm: "Leo Gouse",
    isArchived: false,
    status: "On Track",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend", "Full Stack"],
    timeLine: {
      start: "2021-04-15",
      end: "2024-06-15",
    },
    estimation: 10000,
  },
  {
    isSelected: false,
    rowIndex: 2,
    id: 2,
    name: "MicroRaptor website",
    pm: "Leo Gouse",
    isArchived: false,
    status: "On Track",
    lastUpdated: "15 Mar 2021, 12:48 PM",
    resources: ["UX/UI Design"],
    timeLine: {
      start: "2021-04-15",
      end: "2027-06-15",
    },
    estimation: 20000,
  },
  {
    isSelected: false,
    rowIndex: 3,
    id: 3,
    name: "Tarius landing page",
    pm: "Leo Gouse",
    isArchived: false,
    status: "On Track",
    lastUpdated: "15 Mar 2021, 12:46 PM",
    resources: ["UX/UI Design", "Frontend", "Full Stack"],
    timeLine: {
      start: "2021-04-15",
      end: "2026-06-15",
    },
    estimation: 1000000,
  },
  {
    isSelected: false,
    rowIndex: 4,
    id: 4,
    name: "Rugops App",
    pm: "Tatiana Dias",
    isArchived: true,
    status: "On Hold",
    lastUpdated: "15 Mar 2023, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend", "Full Stack"],
    timeLine: {
      start: "2021-04-15",
      end: "2021-06-15",
    },
    estimation: 50,
  },
  {
    isSelected: false,
    rowIndex: 5,
    id: 5,
    name: "Erketu",
    pm: "Tatiana Dias",
    isArchived: false,
    status: "On Hold",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend", "Full Stack"],
    timeLine: {
      start: "2013-04-15",
      end: "2031-06-15",
    },
    estimation: 600,
  },
];

export const projectManagersArr = [
  "Roger Vaccaro",
  "Tatiana Dias",
  "Leo Gouse",
];

export const projectResourcesArr = [
  "UX/UI Design",
  "Frontend",
  "Backend",
  "Full Stack",
  "Graphic Designer",
  "Web Designer",
  "QA",
];
