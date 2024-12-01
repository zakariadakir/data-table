"use strict";

/*
todo:
const allFilterCount = allFilterButton.querySelector('.tab-count');
*/

// Data:
let projectsArray = [
  {
    id: 1,
    name: "Project 1",
    status: "On Track",
    isArchived: false,
    isSelected: false,
    manager: "Roger Vaccaro",
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

// Variables:
let selectedFilter = "All";

// Functions:
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
    console.log(filteredProjects);
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
  console.log(searchFilteredProjects);
};

// Event listeners:
searchInput.addEventListener("input", () => {
  let currentSearchTerm = searchInput.value.trim().toLowerCase();
  handleProjectSearch(currentSearchTerm);
});
