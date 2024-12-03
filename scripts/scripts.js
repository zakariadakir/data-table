"use strict";

import {
  createProjectCheckboxCell,
  createProjectIdCell,
  createProjectNameCell,
  createProjectManagerCell,
  createProjectLastUpdatedCell,
  createProjectResourcesCell,
} from "./components.js";

// Data:
let projectsArray = JSON.parse(localStorage.getItem("projectsArray")) || [
  {
    id: 1,
    name: "Project 1",
    status: "On Track",
    isArchived: false,
    isSelected: false,
    manager: "Leo Gouse",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend"],
  },
  {
    id: 2,
    name: "Project 2",
    status: "On Track",
    isArchived: false,
    isSelected: false,
    manager: "Leo Gouse",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend"],
  },
  {
    id: 3,
    name: "Project 3",
    status: "On Track",
    isArchived: false,
    isSelected: false,
    manager: "Leo Gouse",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend"],
  },
  {
    id: 4,
    name: "Project 4",
    status: "On Track",
    isArchived: false,
    isSelected: false,
    manager: "Leo Gouse",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend"],
  },
  {
    id: 5,
    name: "Project 5",
    status: "On Track",
    isArchived: false,
    isSelected: false,
    manager: "Leo Gouse",
    lastUpdated: "15 Mar 2021, 12:47 PM",
    resources: ["UX/UI Design", "Frontend", "Backend"],
  },
];

let projectStatusArray = [
  "All",
  "At Risk",
  "On Hold",
  "Potential Risk",
  "On Track",
  "Archived",
];

// DOM elements:
const body = document.body;
const projectsCount = document.getElementById("projects-count");
const searchInput = document.getElementById("search-input");
const createNewProjectButton = document.getElementById(
  "create-new-project-button"
);
const filterTabsList = document.getElementById("filter-tabs-list");
const selectAllCheckbox = document.getElementById("select-all-projects");
const projectsList = document.getElementById("projects-list");
const pageInfo = document.getElementById("page-info");
const previousPageButton = document.getElementById("previous-page");
const nextPageButton = document.getElementById("next-page");
const currentPageSpan = document.getElementById("current-page");
const rowsPerPageSelect = document.getElementById("rows-per-page-select");

// Variables:
let currentSearchTerm = "";
let selectedFilter = "All";

// Functions:
const saveProjectsToLocalStorage = () => {
  localStorage.setItem("projectsArray", JSON.stringify(projectsArray));
};

const findProjectById = (projectId) => {
  return projectsArray.find((project) => project.id === projectId);
};

const isDuplicateProjectName = (projectName) => {
  return projectsArray.some((project) => project.name === projectName);
};

const updateProjectsCount = () => {
  projectsCount.textContent = projectsArray.length;
};
updateProjectsCount();

const filterProjectsByStatus = (status) => {
  switch (status) {
    case "All":
      return projectsArray;
    case "Archived":
      return projectsArray.filter((project) => project.isArchived);
    default:
      return projectsArray.filter((project) => project.status === status);
  }
};

const countFilteredProjects = (status) => {
  return filterProjectsByStatus(status).length;
};

const handleFilterButtonClick = (filterButton, filterStatus) => {
  filterButton.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab").forEach((button) => {
      button.classList.remove("active");
    });
    filterButton.classList.add("active");
    selectedFilter = filterStatus;
    const filteredProjects = filterProjectsByStatus(selectedFilter);
    renderProjects(filteredProjects);
    handleProjectSearch(currentSearchTerm);
  });
};

const renderFilterTabs = () => {
  filterTabsList.innerHTML = "";
  projectStatusArray.forEach((status) => {
    let statusElement = document.createElement("li");
    statusElement.innerHTML = `
    <button type="button" class="filter-tab ${
      status === selectedFilter ? "active" : ""
    }">
    ${status}
    <span>${countFilteredProjects(status)}</span>
    </button>
    `;
    const filterButton = statusElement.querySelector(".filter-tab");
    filterTabsList.appendChild(statusElement);
    handleFilterButtonClick(filterButton, status);
  });
};
renderFilterTabs();

const handleProjectSearch = (searchTerm) => {
  const searchFilteredProjects = filterProjectsByStatus(selectedFilter).filter(
    (project) => project.name.toLowerCase().includes(searchTerm)
  );
  renderProjects(searchFilteredProjects);
};

const handleProjectSelection = (projectId, isSelected) => {
  const projectToUpdate = findProjectById(projectId);
  if (projectToUpdate) {
    projectToUpdate.isSelected = isSelected;
    handleProjectCheckboxToggle();
  }
};

const handleSelectAllProjects = () => {
  projectsArray.forEach((project) => {
    project.isSelected = selectAllCheckbox.checked;
  });
  const checkboxes = document.querySelectorAll(".checkbox-btn-single");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAllCheckbox.checked;
  });
handleProjectCheckboxToggle();
};

const handleProjectCheckboxToggle = () => {
  const allSelected = projectsArray.every(project => project.isSelected);
  const anySelected = projectsArray.some(project => project.isSelected);
  console.log(allSelected, anySelected);
  console.log(selectAllCheckbox.checked);
  selectAllCheckbox.checked = anySelected;
  console.log(selectAllCheckbox.checked);
  selectAllCheckbox.classList.toggle("checked:after:content-['✓']", allSelected);
  selectAllCheckbox.classList.toggle("checked:after:content-['-']", !allSelected && anySelected);
};

const createCell = () => {
  const cell = document.createElement("td");
  return cell;
};

const renderProjects = (filteredProjects = projectsArray) => {
  projectsList.innerHTML = "";
  if (filteredProjects.length > 0) {
    filteredProjects.forEach((project) => {
      const projectRow = document.createElement("tr");
      projectRow.classList.add("hover:bg-[#F7F9FC]", "project-row");
      projectRow.appendChild(
        createProjectCheckboxCell(
          project.isSelected,
          project.id,
          handleProjectSelection
        )
      );
      projectRow.appendChild(createProjectIdCell(project.id));
      projectRow.appendChild(createProjectNameCell(project.name));
      projectRow.appendChild(createProjectManagerCell(project.manager));
      projectRow.appendChild(createCell());
      projectRow.appendChild(createProjectLastUpdatedCell(project.lastUpdated));
      projectRow.appendChild(createProjectResourcesCell(project.resources));
      projectsList.appendChild(projectRow);
    });
  } else {
    projectsList.innerHTML = `<tr class="w-full"><td class="text-center text-sm text-gray-900 py-3" colspan="100%">No projects found.</td></tr>`;
  }
};
renderProjects();

// Event listeners:
searchInput.addEventListener("input", () => {
  currentSearchTerm = searchInput.value.trim().toLowerCase();
  handleProjectSearch(currentSearchTerm);
});
selectAllCheckbox.addEventListener("change", handleSelectAllProjects);
