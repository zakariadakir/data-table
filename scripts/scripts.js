"use strict";

// Data:
import { projectStatusesArr, defaultProjectsArr } from "./data.js";

// Components:
import { openAddProjectForm, createProjectRow } from "./components.js";

// DOM Elements:
const totalProjectsCount = document.getElementById("total-projects-count");
const searchProjectInput = document.getElementById("search-project-input");
const addProjectBtn = document.getElementById("add-project-btn");
const filterStatusTabsWrapper = document.getElementById("filter-status-tabs");
const projectsWrapper = document.getElementById("projects-wrapper");
const sortBtns = document.querySelectorAll(".sort-btn");

// States:
export let storedProjectsArr =
  JSON.parse(localStorage.getItem("projects")) || defaultProjectsArr;
let activeSearchTerm = "";
let activeStatusFilter = "All";
let sortKey = "";
let sortOrder = "";

// Functions:
const updateTotalProjectsCount = () => {
  totalProjectsCount.textContent = storedProjectsArr.length;
};

export const removeProjectAndUpdateUI = (projectId) => {
  storedProjectsArr = storedProjectsArr.filter(
    (project) => project.id !== projectId
  );
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  refreshUI();
};

export const archiveProjectAndUpdateUI = (project) => {
  project.isArchived = !project.isArchived;
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  refreshUI();
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
    renderFilteredAndSortedProjects();
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

const renderFilteredAndSortedProjects = () => {
  const filteredProjects = filterProjectsByStatus(activeStatusFilter).filter(
    (project) =>
      project.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
  );
  renderProjects(
    filteredProjects.sort((a, b) => {
      return compareValues(a[sortKey], b[sortKey], sortOrder === "asc");
    })
  );
};

const renderProjects = (arr) => {
  projectsWrapper.innerHTML = "";
  if (arr.length === 0) {
    projectsWrapper.innerHTML = `<tr><td class="text-sm text-gray-900 py-3 px-2.5" colspan="100%">No projects found.</td></tr>`;
  } else {
    arr.forEach((project) => {
      const row = createProjectRow(project);
      projectsWrapper.appendChild(row);
    });
  }
};

const compareValues = (a, b, ascending) => {
  if (typeof a === "number" && typeof b === "number") {
    return ascending ? a - b : b - a;
  }
  if (typeof a === "string" && typeof b === "string") {
    return ascending ? a.localeCompare(b) : b.localeCompare(a);
  }
};

const sortProjectsByButton = () => {
  sortBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sortBtns.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.dataset.clickCount = "0";
          otherBtn.dataset.active = "false";
          otherBtn.dataset.order = "none";
        }
      });
      let clickCount = parseInt(btn.dataset.clickCount, 10) + 1;
      btn.dataset.clickCount = clickCount.toString();
      sortKey = btn.dataset.sortKey;
      if (clickCount % 3 === 1) {
        btn.dataset.active = "true";
        btn.dataset.order = "asc";
        sortOrder = "asc";
      } else if (clickCount % 3 === 2) {
        btn.dataset.order = "desc";
        sortOrder = "desc";
      } else {
        btn.dataset.clickCount = "0";
        btn.dataset.active = "false";
        btn.dataset.order = "none";
        sortKey = "";
        sortOrder = "";
      }
      renderFilteredAndSortedProjects();
    });
  });
};

const refreshUI = () => {
  updateTotalProjectsCount();
  renderFilterStatusTabs();
  renderFilteredAndSortedProjects();
};

// Initial Setup:
sortProjectsByButton();
refreshUI();

// Event Listeners:
searchProjectInput.addEventListener("input", (e) => {
  activeSearchTerm = e.target.value.toLowerCase();
  renderFilteredAndSortedProjects();
});

addProjectBtn.addEventListener("click", () => {
  openAddProjectForm();
});
