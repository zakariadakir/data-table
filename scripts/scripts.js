"use strict";

// Data:
import { projectStatusesArr, defaultProjectsArr } from "./data.js";

// DOM Elements:
const totalProjectsCount = document.getElementById("total-projects-count");
const searchProjectInput = document.getElementById("search-project-input");
const addProjectBtn = document.getElementById("add-project-btn");
const filterStatusTabsWrapper = document.getElementById("filter-status-tabs");

// States:
export const storedProjectsArr =
  JSON.parse(localStorage.getItem("projects")) || defaultProjectsArr;
let activeSearchTerm = "";
let activeStatusFilter = "All";

// Functions:
const updateTotalProjectsCount = () => {
  totalProjectsCount.textContent = storedProjectsArr.length;
};

const filterProjectsByStatus = (status) => {
  if (status === "All") return storedProjectsArr;
  if (status === "Archived")
    return storedProjectsArr.filter((project) => project.isArchived);
  return storedProjectsArr.filter((project) => project.status === status);
};

const countProjectsByStatus = (status) => filterProjectsByStatus(status).length;

const handleFilterTabClick = (tabButton, status) => {
  tabButton.addEventListener("click", () => {
    const allTabs = document.querySelectorAll(".filter-status-tab");
    allTabs.forEach((tab) => {
      tab.setAttribute("data-active", "false");
    });
    tabButton.setAttribute("data-active", "true");
    activeStatusFilter = status;
    console.table(filterProjectsByStatus(status));
  });
};

const renderFilterStatusTabs = () => {
  filterStatusTabsWrapper.innerHTML = "";
  projectStatusesArr.forEach((status) => {
    const isActive = status === activeStatusFilter;
    const listItem = document.createElement("li");
    listItem.innerHTML = `<button type="button" class="filter-status-tab" data-active="${isActive}">${status}<span>${countProjectsByStatus(
      status
    )}</span></button>`;
    const filterTabButton = listItem.querySelector("button");
    handleFilterTabClick(filterTabButton, status);
    filterStatusTabsWrapper.appendChild(listItem);
  });
};

const renderFilteredProjects = () => {
  const filteredProjects = filterProjectsByStatus(activeStatusFilter).filter(
    (project) =>
      project.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
  );
  console.table(filteredProjects);
};

const refreshUI = () => {
  updateTotalProjectsCount();
  renderFilterStatusTabs();
  renderFilteredProjects();
};

// Initial Setup:
refreshUI();

// Event Listeners:
searchProjectInput.addEventListener("input", (e) => {
  activeSearchTerm = e.target.value.toLowerCase();
  renderFilteredProjects();
});
