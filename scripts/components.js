"use strict";

// Scripts:
import {
  validateProjectName,
  handleCancelBtn,
  enableSubmitOnNameValidation,
  removeProjectAndUpdateUI,
  archiveProjectAndUpdateUI,
} from "./scripts.js";

const createOverlay = (type) => {
  const overlay = document.createElement("div");
  overlay.className = `fixed top-0 left-0 w-full h-full z-[99]  ${
    type === "add" || type === "edit"
      ? "opacity-50 bg-black"
      : "opacity-10 bg-red-500"
  }`;
  return overlay;
};

export const showToastNotification = (message) => {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5ZM10.427 5.39255C10.7106 5.0916 11.2362 5.14816 11.5278 5.39255C11.8534 5.66547 11.7932 6.11611 11.5278 6.39768L7.56268 10.6053C7.30802 10.8756 6.71524 10.8875 6.46185 10.6053L4.46953 8.38686C4.19295 8.07889 4.16113 7.68848 4.46953 7.38172C4.73477 7.1179 5.31108 7.09302 5.57035 7.38172L7.02551 9.00207L10.427 5.39255Z" fill="#A9EBCA"/>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Forms:
const openDeleteProjectModal = (project) => {
  const form = document.createElement("form");
  const overlay = createOverlay("delete");
  form.className =
    "w-full max-w-[calc(100%-32px)] min-[537px]:max-w-[440px] fixed rounded-xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-white shadow-project-deletion-form";
  form.innerHTML = `
  <div class="px-5 py-4">
    <h2 class="text-xl font-bold mb-2.5">Delete project</h2>
    <p class="text-gray-700">
      Are you sure you want to delete <span class="font-semibold text-gray-900">${project.name}</span>? If you delete, it
      will be permanently lost.
    </p>
  </div>
  <span class="block w-full h-px bg-gray-1"></span>
  <div class="px-5 py-4 flex justify-end gap-5">
    <button type="button" class="btn secondary-btn cancel-btn">Cancel</button>
    <button type="submit" class="btn danger-btn">Delete</button>
  </div>
  `;
  const cancelBtn = form.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", () => {
    overlay.remove();
    form.remove();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    removeProjectAndUpdateUI(project.id);
    overlay.remove();
    form.remove();
  });
  document.body.append(overlay, form);
};

const createFormHeader = (formType) => {
  const header = document.createElement("h2");
  header.className =
    "text-gray-900 bg-white text-base font-medium leading-5 px-5 py-4";
  header.textContent = formType === "add" ? "Add New Project" : "Edit Project";
  return header;
};

const createProjectNameField = (formType, project) => {
  const container = document.createElement("div");
  container.className = "flex flex-col gap-2";
  const projectName = formType === "add" ? "" : project.name;
  container.innerHTML = `
    <label for="projectName" class="text-sm font-medium leading-5 text-gray-700 cursor-pointer">
      Project name <span class="text-indigo-500">*</span>
    </label>
    <input type="text" id="projectName" class="primary-input input-project-name" value="${projectName}">
    <p class="text-red-500 text-xs error-msg"></p>
  `;
  const inputName = container.querySelector(".input-project-name");
  const errorMsg = container.querySelector(".error-msg");
  inputName.addEventListener("input", () => {
    const inputNameValue = inputName.value.trim();
    errorMsg.textContent = validateProjectName(inputNameValue, projectName);
  });
  return container;
};

const createFormBody = (formType, project) => {
  const body = document.createElement("div");
  body.className = "flex flex-col gap-8 px-5 py-4 bg-gray-0";
  const projectNameField = createProjectNameField(formType, project);
  body.appendChild(projectNameField);
  return body;
};

const createFormFooter = (formType) => {
  const footer = document.createElement("div");
  footer.className =
    "bg-white px-5 py-4 flex gap-5 justify-end items-center rounded-bl-xl rounded-br-xl";
  const btnText = formType === "add" ? "Add project" : "Save changes";
  footer.innerHTML = `
    <button type="button" class="btn secondary-btn cancel-btn">Cancel</button>
    <button type="submit" ${
      formType === "edit" ? "" : "disabled"
    } class="btn primary-btn submit-btn">${btnText}</button>
  `;
  return footer;
};

const createProjectForm = (formType, project = {}) => {
  const form = document.createElement("form");
  form.className =
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] min-[497px]:max-w-[440px] w-full shadow-project-form rounded-xl z-[100] overflow-hidden";
  const header = createFormHeader(formType);
  const body = createFormBody(formType, project);
  const footer = createFormFooter(formType);
  form.append(header, body, footer);
  const overlay = createOverlay(formType);
  const cancelBtn = form.querySelector(".cancel-btn");
  handleCancelBtn(cancelBtn, form, overlay);
  const input = form.querySelector(".input-project-name");
  const submitBtn = form.querySelector(".submit-btn");
  enableSubmitOnNameValidation(input, submitBtn, project.name);
  document.body.append(overlay, form);
};

export const openAddProjectForm = () => {
  createProjectForm("add");
};

const openEditProjectForm = (project) => {
  createProjectForm("edit", project);
};

// Table:
export const createProjectRow = (project) => {
  const row = document.createElement("tr");
  row.className =
    "project-row border-y border-gray-1 transition-all hover:bg-gray-0";
  const rowIndexCell = createRowIndexCell(project);
  const nameCell = createProjectNameCell(project);
  const lastUpdatedCell = createProjectLastUpdatedCell(project);
  const actionsCell = createProjectActionsCell(project);
  row.append(rowIndexCell, nameCell, lastUpdatedCell, actionsCell);
  return row;
};

const createRowIndexCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "px-2.5 py-3 text-center text-sm text-gray-900";
  cell.textContent = project.rowIndex;
  return cell;
};

const createProjectNameCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "px-2.5 py-3";
  cell.innerHTML = `
  <a href="#"
    class="text-indigo-500 text-sm font-medium inline-flex items-center gap-2 hover:underline group"
    target="_blank">
    ${project.name}
    <svg class="hidden group-hover:block fill-indigo-500" width="13.999756" height="14.000000" viewBox="0 0 13.9998 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path id="icon" d="M7.75 0C7.33 0 7 0.33 7 0.75C7 1.16 7.33 1.5 7.75 1.5L11.43 1.5L6.46 6.46C6.17 6.76 6.17 7.23 6.46 7.53C6.76 7.82 7.23 7.82 7.53 7.53L12.49 2.56L12.49 6.25C12.49 6.66 12.83 7 13.24 7C13.66 7 13.99 6.66 13.99 6.25L13.99 0.75C13.99 0.33 13.66 0 13.24 0L7.75 0ZM6 2.25C6 1.83 5.66 1.5 5.25 1.5L2 1.5C0.89 1.5 0 2.39 0 3.5L0 12C0 13.1 0.89 14 2 14L10.5 14C11.6 14 12.5 13.1 12.5 12L12.5 8.75C12.5 8.33 12.16 8 11.75 8C11.33 8 11 8.33 11 8.75L11 12C11 12.27 10.77 12.5 10.5 12.5L2 12.5C1.72 12.5 1.5 12.27 1.5 12L1.5 3.5C1.5 3.22 1.72 3 2 3L5.25 3C5.66 3 6 2.66 6 2.25Z" fill="CurrentColor" fill-opacity="1.000000" fill-rule="evenodd"/>
    </svg>
  </a>`;
  return cell;
};

const createProjectLastUpdatedCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "px-2.5 py-3";
  cell.innerHTML = `
  <div class="flex items-center justify-center gap-2">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.75 12C1.75 13.2426 2.75736 14.25 4 14.25H10.2485C10.5513 14.25 10.8438 14.1401 11.0717 13.9407L13.8231 11.5332C14.0944 11.2958 14.25 10.9529 14.25 10.5925V4C14.25 2.75736 13.2426 1.75 12 1.75H4C2.75736 1.75 1.75 2.75736 1.75 4V12Z" stroke="#5E5ADB" stroke-width="1.5"/>
    <path d="M5.25 6.5H10.75" stroke="#5E5ADB" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M5.25 9.5H8.75" stroke="#5E5ADB" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="text-sm text-gray-900 text-nowrap">${project.lastUpdated}</span>
  </div>
  `;
  return cell;
};

const createProjectActionsCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "py-3 px-2.5";
  cell.innerHTML = `
  <div class="menu-container w-fit mx-auto relative">
    <button type="button" class="menu-toggle-btn ph-bold ph-dots-three-vertical text-gray-400 p-1 rounded transition-all duration-300 ease-in-out hover:bg-indigo-0 hover:text-gray-700 hidden" aria-label="More options"></button>
  </div>
  `;
  const menuContainer = cell.querySelector(".menu-container");
  const menuToggleBtn = cell.querySelector(".menu-toggle-btn");
  menuToggleBtn.addEventListener("click", () => {
    const actionsMenu = createProjectActionsMenu(project, menuContainer);
    menuContainer.appendChild(actionsMenu);
  });
  return cell;
};

const createProjectActionsMenu = (project, container) => {
  const menu = document.createElement("ul");
  menu.className =
    "project-actions-menu absolute top-0 right-0 bg-white py-2 px-1.5 rounded-md z-10 shadow-project-actions-menu";
  menu.innerHTML = `
  <li>
    <button type="button" class="edit-btn px-2.5 py-1 w-full hover:bg-indigo-0 rounded-md text-left font-medium text-sm text-gray-700">Edit</button>
  </li>
  <li>
    <button type="button" class="archive-btn px-2.5 py-1 w-full hover:bg-indigo-0 rounded-md text-left font-medium text-sm text-orange-500">
    ${project.isArchived ? "Unarchive" : "Archive"}
    </button>
  </li>
  <li>
    <button type="button" class="delete-btn px-2.5 py-1 w-full hover:bg-indigo-0 rounded-md text-left font-medium text-sm text-red-500">Delete</button>
  </li>
  `;
  const addEventListenerToButton = (selector, action) => {
    const button = menu.querySelector(selector);
    button.addEventListener("click", () => {
      action();
      menu.remove();
    });
  };
  addEventListenerToButton(".edit-btn", () => openEditProjectForm(project));
  addEventListenerToButton(".archive-btn", () =>
    archiveProjectAndUpdateUI(project)
  );
  addEventListenerToButton(".delete-btn", () =>
    openDeleteProjectModal(project)
  );
  const closeDropdown = (event) => {
    if (!container.contains(event.target)) {
      menu.remove();
      document.removeEventListener("click", closeDropdown);
    }
  };
  document.addEventListener("click", closeDropdown);
  return menu;
};
