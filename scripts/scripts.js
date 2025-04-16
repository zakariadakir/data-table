"use strict";

// Data:
import { projectStatusesArr, defaultProjectsArr } from "./data.js";

// Components:
import {
  showToastNotification,
  openAddProjectModal,
  buildProjectRow,
} from "./components.js";

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

export const validateProjectName = (name, originalName) => {
  if (!name) return "Project name is required.";
  if (name.length < 5) return "Must be at least 5 characters.";
  if (!/^[a-zA-Z ]+$/.test(name)) return "Only letters and spaces allowed.";
  if (isDuplicateProjectName(name, originalName)) return "Name already exists.";
  return "";
};

const isDuplicateProjectName = (name, originalName) =>
  storedProjectsArr.some((p) => p.name === name && p.name !== originalName);

export const handleCancelBtn = (btn, form, overlay) => {
  btn.addEventListener("click", () => {
    form.remove();
    overlay.remove();
  });
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(/am|pm/i, (m) => m.toUpperCase());

export const addProject = (name) => {
  const newProject = {
    isSelected: false,
    rowIndex: 1,
    projectId: Date.now(),
    name: name,
    pm: "Leo Gouse",
    status: "On Track",
    lastUpdated: formatDate(new Date()),
  };
  storedProjectsArr.unshift(newProject);
  storedProjectsArr.forEach((p, i) => (p.rowIndex = i + 1));
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  refreshUI();
};

export const editProject = (name, project) => {
  project.name = name;
  project.lastUpdated = formatDate(new Date());
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  refreshUI();
};

export const enableSubmitOnNameValidation = (
  input,
  submitBtn,
  originalName
) => {
  input.addEventListener("input", () => {
    const value = input.value.trim();
    const invalid = value.length < 5 || !/^[a-zA-Z ]+$/.test(value);
    const duplicate = isDuplicateProjectName(value, originalName);
    submitBtn.disabled = invalid || duplicate;
  });
};

export const removeProject = (id) => {
  storedProjectsArr = storedProjectsArr.filter((p) => p.id !== id);
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  showToastNotification("Project deleted successfully");
  refreshUI();
};

export const toggleArchiveProject = (project) => {
  project.isArchived = !project.isArchived;
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  showToastNotification(
    project.isArchived
      ? "Project archived successfully"
      : "Project unarchived successfully"
  );
  refreshUI();
};

export const updateProjectStatus = (project) => {
  const selectedStatus = document.querySelector(".status-radio:checked");
  project.status = selectedStatus.value;
  project.lastUpdated = formatDate(new Date());
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  refreshUI();
  showToastNotification("Project status updated successfully");
};

const filterProjectsByStatus = (status) => {
  if (status === "All") return storedProjectsArr;
  if (status === "Archived")
    return storedProjectsArr.filter((p) => p.isArchived);
  return storedProjectsArr.filter((p) => p.status === status);
};

const countProjectsByStatus = (status) => filterProjectsByStatus(status).length;

const handleFilterTabClick = (btn, status) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-status-tab")
      .forEach((tab) => tab.setAttribute("data-active", "false"));
    btn.setAttribute("data-active", "true");
    activeStatusFilter = status;
    renderFilteredAndSortedProjects();
  });
};

const renderFilterStatusTabs = () => {
  filterStatusTabsWrapper.innerHTML = "";
  projectStatusesArr.forEach((status) => {
    const isActive = status === activeStatusFilter;
    const count = countProjectsByStatus(status);
    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="filter-status-tab" data-active="${isActive}">
        ${status}<span>${count}</span>
      </button>
    `;
    const btn = li.querySelector("button");
    handleFilterTabClick(btn, status);
    filterStatusTabsWrapper.appendChild(li);
  });
};

const renderFilteredAndSortedProjects = () => {
  const filtered = filterProjectsByStatus(activeStatusFilter).filter((p) =>
    p.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
  );
  const sorted = filtered.sort((a, b) =>
    compareValues(a[sortKey], b[sortKey], sortOrder === "asc")
  );
  renderProjects(sorted);
};

const renderProjects = (arr) => {
  projectsWrapper.innerHTML = "";
  if (arr.length === 0) {
    projectsWrapper.innerHTML = `<tr><td class="text-sm text-gray-900 py-3 px-2.5" colspan="100%">No projects found.</td></tr>`;
  } else {
    arr.forEach((project) => {
      const row = buildProjectRow(project);
      projectsWrapper.appendChild(row);
    });
  }
};

const compareValues = (a, b, ascending) => {
  if (typeof a === "number" && typeof b === "number") {
    return ascending ? a - b : b - a;
  }
  if (typeof a === "string" && typeof b === "string") {
    const dateA = new Date(a);
    const dateB = new Date(b);
    const isValidDateA = !isNaN(dateA);
    const isValidDateB = !isNaN(dateB);
    if (isValidDateA && isValidDateB) {
      return ascending ? dateA - dateB : dateB - dateA;
    }
    return ascending ? a.localeCompare(b) : b.localeCompare(a);
  }
};

const sortProjectsByButton = () => {
  sortBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sortBtns.forEach((b) => {
        if (b !== btn) {
          b.dataset.clickCount = "0";
          b.dataset.active = "false";
          b.dataset.order = "none";
        }
      });
      let clickCount = parseInt(btn.dataset.clickCount, 10) + 1;
      btn.dataset.clickCount = clickCount.toString();
      sortKey = btn.dataset.sortKey;
      switch (clickCount % 3) {
        case 1:
          btn.dataset.active = "true";
          btn.dataset.order = "asc";
          sortOrder = "asc";
          break;
        case 2:
          btn.dataset.order = "desc";
          sortOrder = "desc";
          break;
        default:
          btn.dataset.clickCount = "0";
          btn.dataset.active = "false";
          btn.dataset.order = "none";
          sortKey = "";
          sortOrder = "";
          break;
      }
      renderFilteredAndSortedProjects();
    });
  });
};

export const refreshUI = () => {
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
  openAddProjectModal();
});
