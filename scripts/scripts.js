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
const pageInfo = document.getElementById("page-info");
const rowsPerPageSelect = document.getElementById("rows-per-page-select");
const prevPageBtn = document.getElementById("previous-page");
const nextPageBtn = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("current-page");

// States:
export let storedProjectsArr =
  JSON.parse(localStorage.getItem("projects")) || defaultProjectsArr;
let activeSearchTerm = "";
let activeStatusFilter = "All";
let sortKey = "";
let sortOrder = "";
let currentPage = 1;
let rowsPerPage = JSON.parse(localStorage.getItem("rowsPerPage")) || 10;
rowsPerPageSelect.value = rowsPerPage;

// Functions:
export const validateProjectName = (name, originalName) => {
  if (!name) return "Project name is required.";
  if (!/^[a-zA-Z ]+$/.test(name)) return "Only letters and spaces allowed.";
  if (name.length < 5) return "Must be at least 5 characters.";
  if (isDuplicateProjectName(name, originalName)) return "Name already exists.";
  return "";
};

export const handleCancelBtn = (btn, form, overlay) => {
  btn.addEventListener("click", () => {
    form.remove();
    overlay.remove();
  });
};

export const formatLastUpdatedDate = (date) =>
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

export const formatTimelineDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

export const addProject = (name, manager, resources, estimation) => {
  const newProject = {
    isSelected: false,
    rowIndex: 1,
    projectId: Date.now(),
    name: name,
    pm: manager,
    isArchived: false,
    status: "On Track",
    lastUpdated: formatLastUpdatedDate(new Date()),
    resources: resources,
    timeLine: {
      start: "2021-04-15",
      end: "2021-06-15",
    },
    estimation: estimation,
  };
  storedProjectsArr.unshift(newProject);
  storedProjectsArr.forEach((p, i) => (p.rowIndex = i + 1));
  currentPage = 1;
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  showToastNotification("Project added successfully.");
  refreshUI();
};

export const editProject = (project, name, manager, resources, estimation) => {
  project.name = name;
  project.pm = manager;
  project.lastUpdated = formatLastUpdatedDate(new Date());
  project.resources = resources;
  project.estimation = estimation;
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  showToastNotification("Project updated successfully.");
  refreshUI();
};

export const enableSubmitOnNameValidation = (
  input,
  submitBtn,
  originalName
) => {
  input.addEventListener("input", () => {
    const trimmedValue = input.value.trim();
    const isTooShort = trimmedValue.length < 5;
    const isInvalidFormat = !/^[a-zA-Z ]+$/.test(trimmedValue);
    const isDuplicate = isDuplicateProjectName(trimmedValue, originalName);
    const isSameAsOriginal = trimmedValue === originalName;
    const shouldDisable =
      isTooShort || isInvalidFormat || isDuplicate || isSameAsOriginal;
    submitBtn.disabled = shouldDisable;
  });
};

export const enableSubmitOnManagerValidation = (project, submitBtn) => {
  const pmInputs = document.querySelectorAll('input[name="projectManager"]');
  const handleChange = () => {
    const selectedInput = document.querySelector(
      'input[name="projectManager"]:checked'
    );
    const selectedPm = selectedInput.value;
    submitBtn.disabled = selectedPm === project.pm;
  };
  pmInputs.forEach((input) => input.addEventListener("change", handleChange));
};

export const enableSubmitOnResourcesValidation = (project, submitBtn) => {
  const resourceInputs = document.querySelectorAll('input[name="resource"]');
  const handleChange = () => {
    const selectedInputs = Array.from(
      document.querySelectorAll('input[name="resource"]:checked')
    ).map((checkbox) => checkbox.value);
    submitBtn.disabled =
      JSON.stringify(selectedInputs.sort()) ===
      JSON.stringify(project.resources.sort());
  };
  resourceInputs.forEach((input) =>
    input.addEventListener("change", handleChange)
  );
};

export const enableSubmitOnEstimationValidation = (project, submitBtn) => {
  const estimationInput = document.getElementById("projectEstimation");
  estimationInput.addEventListener("input", () => {
    submitBtn.disabled = Number(estimationInput.value) === project.estimation;
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
  project.lastUpdated = formatLastUpdatedDate(new Date());
  localStorage.setItem("projects", JSON.stringify(storedProjectsArr));
  refreshUI();
  showToastNotification("Project status updated successfully");
};

export const formatEstimationForDisplay = (estimationValue) => {
  if (estimationValue >= 1_000_000_000_000) {
    return `US$ ${(estimationValue / 1_000_000_000_000).toFixed(1)}t`;
  } else if (estimationValue >= 1_000_000_000) {
    return `US$ ${(estimationValue / 1_000_000_000).toFixed(1)}b`;
  } else if (estimationValue >= 1_000_000) {
    return `US$ ${(estimationValue / 1_000_000).toFixed(1)}m`;
  } else if (estimationValue >= 1_000) {
    return `US$ ${(estimationValue / 1_000).toFixed(1)}k`;
  }
  return `US$ ${estimationValue}`;
};

export const refreshUI = () => {
  updateTotalProjectsCount();
  renderFilterStatusTabs();
  renderFilteredAndSortedProjects();
};

const updateTotalProjectsCount = () => {
  totalProjectsCount.textContent = storedProjectsArr.length;
};

const isDuplicateProjectName = (name, originalName) =>
  storedProjectsArr.some((p) => p.name === name && p.name !== originalName);

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
    currentPage = 1;
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
  const totalProjects = sorted.length;
  const totalPages = Math.ceil(totalProjects / rowsPerPage);
  if (totalPages === 0) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  renderProjects(sorted, currentPage, rowsPerPage);
  updatePaginationInfo(currentPage, rowsPerPage, totalProjects);
};

const renderProjects = (arr, currentPage, rowsPerPage) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, arr.length);
  const projectsToRender = arr.slice(startIndex, endIndex);
  projectsWrapper.innerHTML = "";
  if (projectsToRender.length === 0) {
    projectsWrapper.innerHTML = `<tr><td class="text-sm text-gray-900 py-3 px-2.5" colspan="100%">No projects found.</td></tr>`;
  } else {
    projectsToRender.forEach((project) => {
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
  if (Array.isArray(a) && Array.isArray(b)) {
    return ascending ? a.length - b.length : b.length - a.length;
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

const updatePaginationInfo = (currentPage, rowsPerPage, totalProjects) => {
  const startProject =
    totalProjects === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endProject = Math.min(currentPage * rowsPerPage, totalProjects);
  pageInfo.textContent = `${startProject}-${endProject} of ${totalProjects}`;
  const totalPages = Math.ceil(totalProjects / rowsPerPage);
  currentPageDisplay.innerHTML = `
  <span class="${totalPages === 0 ? "text-gray-500" : "text-gray-900"}"
  >${totalProjects === 0 ? 0 : currentPage}</span>
  /
  <span class="${
    totalPages !== currentPage ? "text-gray-500" : "text-gray-900"
  }">${totalPages}</span>`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalProjects === 0;
};

const goToPage = (newPage) => {
  currentPage = newPage;
  renderFilteredAndSortedProjects();
};

// Initial Setup:
sortProjectsByButton();
refreshUI();

// Event Listeners:
searchProjectInput.addEventListener("input", (e) => {
  activeSearchTerm = e.target.value.toLowerCase();
  currentPage = 1;
  renderFilteredAndSortedProjects();
});

addProjectBtn.addEventListener("click", () => {
  openAddProjectModal();
});

rowsPerPageSelect.addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value, 10);
  localStorage.setItem("rowsPerPage", JSON.stringify(rowsPerPage));
  renderFilteredAndSortedProjects();
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) goToPage(currentPage - 1);
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(storedProjectsArr.length / rowsPerPage);
  if (currentPage < totalPages) goToPage(currentPage + 1);
});
