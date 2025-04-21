"use strict";

// Data:
import {
  projectStatusesArr,
  projectManagersArr,
  projectResourcesArr,
} from "./data.js";

// Scripts:
import {
  validateProjectName,
  handleCancelBtn,
  enableSubmitOnNameValidation,
  enableSubmitOnManagerValidation,
  enableSubmitOnResourcesValidation,
  enableSubmitOnEstimationValidation,
  formatEstimationForDisplay,
  addProject,
  editProject,
  removeProject,
  toggleArchiveProject,
  updateProjectStatus,
} from "./scripts.js";

const createOverlay = (context) => {
  const overlay = document.createElement("div");
  overlay.className = `fixed top-0 left-0 w-full h-full z-[99]  ${
    context === "add" || context === "edit"
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
const buildModalHeader = (type) => {
  const header = document.createElement("h2");
  header.className =
    "text-gray-900 bg-white text-base font-medium leading-5 px-5 py-4";
  header.textContent = type === "add" ? "Add New Project" : "Edit Project";
  return header;
};

const buildProjectNameField = (formType, project) => {
  const container = document.createElement("div");
  container.className = "flex flex-col gap-2";
  const defaultName = formType === "add" ? "" : project.name;
  container.innerHTML = `
    <label for="projectName" class="text-sm font-medium leading-5 text-gray-700 cursor-pointer">
      Project name <span class="text-indigo-500">*</span>
    </label>
    <input type="text" id="projectName" class="primary-input" value="${defaultName}">
    <p class="text-red-500 text-xs error-msg"></p>
  `;
  const inputName = container.querySelector("#projectName");
  const errorMsg = container.querySelector(".error-msg");
  inputName.addEventListener("input", () => {
    const currentName = inputName.value.trim();
    errorMsg.textContent = validateProjectName(currentName, defaultName);
  });
  return container;
};

const buildProjectManagerRadioGroup = (formType, project) => {
  const container = document.createElement("div");
  container.className = "flex flex-col gap-2";
  const label = document.createElement("label");
  label.className = "text-sm font-medium leading-5 text-gray-700";
  label.textContent = "Project Manager (PM)";
  container.appendChild(label);
  const radioGroup = document.createElement("ul");
  radioGroup.className =
    "flex flex-col min-[537px]:flex-row min-[537px]:w-fit gap-1 rounded-md bg-gray-1 p-1";
  projectManagersArr.forEach((pm) => {
    const item = document.createElement("li");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "projectManager";
    input.id = pm;
    input.value = pm;
    input.className = "hidden peer";
    input.checked =
      formType === "add" ? pm === "Roger Vaccaro" : project.pm === pm;
    const label = document.createElement("label");
    label.htmlFor = pm;
    label.textContent = pm;
    label.className =
      "cursor-pointer block text-gray-700 text-sm font-medium tracking-[0.28px] py-1 px-2.5 transition duration-300 hover:text-indigo-500 peer-checked:bg-white peer-checked:rounded peer-checked:pm-radio-checked peer-checked:text-indigo-500";
    item.appendChild(input);
    item.appendChild(label);
    radioGroup.appendChild(item);
  });
  container.appendChild(radioGroup);
  return container;
};

const buildProjectResourceCheckboxGroup = (formType, project) => {
  const container = document.createElement("div");
  container.className = "flex flex-col gap-2";
  const label = document.createElement("label");
  label.className =
    "text-sm font-medium leading-5 text-gray-700 cursor-pointer";
  label.textContent = "Resources";
  container.appendChild(label);
  const checkboxList = document.createElement("ul");
  checkboxList.className = "flex items-center gap-2.5 flex-wrap";
  projectResourcesArr.forEach((resource) => {
    const listItem = document.createElement("li");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "resource";
    input.value = resource;
    input.id = resource;
    input.className = "hidden peer";
    input.checked = formType === "edit" && project.resources.includes(resource);
    const inputLabel = document.createElement("label");
    inputLabel.htmlFor = resource;
    inputLabel.textContent = resource;
    inputLabel.className = "resource-checkbox";
    listItem.append(input, inputLabel);
    checkboxList.appendChild(listItem);
  });
  container.appendChild(checkboxList);
  return container;
};

const buildProjectEstimationField = (formType, project) => {
  const container = document.createElement("div");
  container.className = "flex flex-col gap-2 ";
  const estimationValue = formType === "add" ? "" : project.estimation;
  container.innerHTML = `
  <label for="projectEstimation" class="text-sm font-medium leading-5 text-gray-700 cursor-pointer">Estimation</label>
  <div class="relative">
  <span class="font-medium text-sm text-gray-400 absolute top-2/4 -translate-y-2/4 left-3">US$</span>
  <input type="number" id="projectEstimation" style="padding-left: 48px;" placeholder="00.00" min="0" class="primary-input estimation-input placeholder:text-gray-300 w-full " value="${estimationValue}">
  </div>
`;
  return container;
};

const buildModalBody = (formType, project) => {
  const body = document.createElement("div");
  body.className = "flex flex-col gap-8 px-5 py-4 bg-gray-0";
  body.append(
    buildProjectNameField(formType, project),
    buildProjectManagerRadioGroup(formType, project),
    buildProjectResourceCheckboxGroup(formType, project),
    buildProjectEstimationField(formType, project)
  );
  return body;
};

const buildModalFooter = (formType) => {
  const footer = document.createElement("div");
  footer.className =
    "bg-white px-5 py-4 flex gap-5 justify-end items-center rounded-bl-xl rounded-br-xl";
  const btnText = formType === "add" ? "Add project" : "Save changes";
  footer.innerHTML = `
    <button type="button" class="btn secondary-btn cancel-btn">Cancel</button>
    <button type="submit" disabled class="btn primary-btn submit-btn">${btnText}</button>
  `;
  return footer;
};

const buildModalForm = (formType, project = {}) => {
  const form = document.createElement("form");
  form.className =
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] min-[497px]:max-w-[440px] w-full shadow-project-form rounded-xl z-[100] overflow-hidden";
  const header = buildModalHeader(formType);
  const body = buildModalBody(formType, project);
  const footer = buildModalFooter(formType);
  form.append(header, body, footer);
  const overlay = createOverlay(formType);
  document.body.append(overlay, form);
  const nameInput = form.querySelector("#projectName");
  const cancelBtn = form.querySelector(".cancel-btn");
  const submitBtn = form.querySelector(".submit-btn");
  handleCancelBtn(cancelBtn, form, overlay);
  enableSubmitOnNameValidation(nameInput, submitBtn, project.name);
  if (formType === "edit") {
    enableSubmitOnManagerValidation(project, submitBtn);
    enableSubmitOnResourcesValidation(project, submitBtn);
    enableSubmitOnEstimationValidation(project, submitBtn);
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = nameInput.value.trim();
    const selectedPm = form.querySelector(
      'input[name="projectManager"]:checked'
    ).value;
    const selectedResources = Array.from(
      form.querySelectorAll('input[name="resource"]:checked')
    ).map((checkbox) => checkbox.value);
    const projectEstimation =
      form.querySelector("#projectEstimation");
    const parsedEstimation = parseInt(projectEstimation.value || 0, 10);
    if (formType === "add") {
      addProject(projectName, selectedPm, selectedResources, parsedEstimation);
    } else {
      editProject(
        project,
        projectName,
        selectedPm,
        selectedResources,
        parsedEstimation
      );
    }
    form.remove();
    overlay.remove();
  });
};

export const openAddProjectModal = () => {
  buildModalForm("add");
};

const openEditProjectModal = (project) => {
  buildModalForm("edit", project);
};

const openDeleteProjectModal = (project) => {
  const form = document.createElement("form");
  const overlay = createOverlay("delete");
  form.className =
    "w-full max-w-[calc(100%-32px)] min-[537px]:max-w-[440px] fixed rounded-xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-white shadow-project-deletion-form";
  form.innerHTML = `
  <div class="px-5 py-4">
    <h2 class="text-xl font-bold mb-2.5">Delete project</h2>
    <p class="text-gray-700">
      Are you sure you want to delete <span class="font-semibold text-gray-900">${project.name}</span>? This action is permanent.
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
    removeProject(project.id);
    overlay.remove();
    form.remove();
  });
  document.body.append(overlay, form);
};

// Table:
export const buildProjectRow = (project) => {
  const row = document.createElement("tr");
  row.className =
    "project-row border-y border-gray-1 transition-all hover:bg-gray-0";
  row.append(
    buildRowIndexCell(project),
    buildProjectNameCell(project),
    buildProjectManagerCell(project),
    buildProjectStatusCell(project),
    buildProjectLastUpdatedCell(project),
    buildProjectResourcesCell(project),
    buildProjectEstimationCell(project),
    buildProjectActionsCell(project)
  );
  return row;
};

const buildRowIndexCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "px-2.5 py-3 text-center text-sm text-gray-900";
  cell.textContent = project.rowIndex;
  return cell;
};

const buildProjectNameCell = (project) => {
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

const buildProjectManagerCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "py-3 px-2.5 flex items-center justify-center relative";
  const managerName = project.pm.replace(/\s+/g, "-").toLowerCase();
  const tooltip = buildManagerTooltip(project);
  const showTooltip = () => cell.appendChild(tooltip);
  const hideTooltip = () => {
    const tip = cell.querySelector(".manager-tooltip");
    if (tip) tip.remove();
  };
  const img = new Image();
  img.src = `./images/${managerName}.png`;
  img.alt = project.pm;
  img.className = "w-6 h-6 rounded-md";
  img.onerror = () => {
    const initials = project.pm
      .split(" ")
      .map((name) => name[0].toUpperCase())
      .join("");
    cell.innerHTML = `<span class="w-6 h-6 rounded-md flex items-center justify-center bg-gray-0 text-indigo-500 font-semibold text-[10px] border border-[#D2D5DC80]">${initials}</span>`;
    const span = cell.querySelector("span");
    span.addEventListener("mouseover", showTooltip);
    span.addEventListener("mouseout", hideTooltip);
  };
  img.addEventListener("mouseover", showTooltip);
  img.addEventListener("mouseout", hideTooltip);
  cell.appendChild(img);
  return cell;
};

const buildManagerTooltip = (project) => {
  const container = document.createElement("div");
  container.className = "manager-tooltip";
  container.innerHTML = `<h3 class="text-sm text-white font-medium">${project.pm}</h3>`;
  return container;
};

const buildProjectStatusCell = (project) => {
  const cell = document.createElement("td");
  const container = document.createElement("div");
  const statusClass = project.status.replace(/\s+/g, "-").toLowerCase();
  cell.className = "project-status-cell";
  container.className = "px-2.5 py-3 flex justify-center relative";
  container.innerHTML = `
  <button type="button" 
    class="status-btn py-0.5 px-2 text-xs font-medium rounded flex gap-1.5 items-center justify-center border-none group ${statusClass}">
    <span class="${statusClass}-indicator block w-1.5 h-1.5 rounded-sm"></span>
    ${project.status}
    <i class="status-dropdown-icon ph-bold ph-caret-down hidden group-hover:block"></i>
  </button>
`;
  cell.appendChild(container);
  const statusBtn = container.querySelector(".status-btn");
  statusBtn.addEventListener("click", () => {
    const existingForm = container.querySelector(".status-update-form");
    const updateForm = buildProjectStatusUpdateForm(
      project,
      container,
      statusBtn
    );
    if (existingForm) {
      existingForm.remove();
    } else {
      container.appendChild(updateForm);
    }
  });
  return cell;
};

const buildProjectStatusUpdateForm = (project, container) => {
  const form = document.createElement("form");
  form.className = "status-update-form";
  form.innerHTML = `
    <div class="form-body px-1.5 py-3">
      <h2 class="font-medium text-sm text-gray-700 ml-2.5 mb-1.5">Update Project Status</h2>
    </div>
    <div class="form-actions bg-white px-4 py-3 flex justify-end gap-5 rounded-b-lg">
      <button type="button" class="cancel-btn text-sm font-medium text-gray-700">Cancel</button>
      <button type="submit" class="submit-btn text-sm font-medium text-indigo-500 disabled:text-indigo-300" disabled="true">Submit</button>
    </div>
  `;
  const formBody = form.querySelector(".form-body");
  const cancelBtn = form.querySelector(".cancel-btn");
  const submitBtn = form.querySelector(".submit-btn");
  formBody.appendChild(buildStatusOptionsList(project, submitBtn));
  const closeForm = (event) => {
    if (!container.contains(event.target)) {
      form.remove();
    }
  };
  cancelBtn.addEventListener("click", () => form.remove());
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateProjectStatus(project);
    form.remove();
  });
  document.addEventListener("click", closeForm);
  return form;
};

const buildStatusOptionsList = (project, submitBtn) => {
  const list = document.createElement("ul");
  list.className = "status-options-list";
  projectStatusesArr.slice(1, 5).forEach((status) => {
    const statusClass = status.replace(/\s+/g, "-").toLowerCase();
    const inputId = `${statusClass}-${project.id}`;
    const isCurrent = status === project.status;
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <label for="${inputId}" class="status-option ${inputId} font-medium text-sm text-gray-700 rounded flex items-baseline cursor-pointer gap-2.5 w-full py-1 px-3 transition-all duration-300 ease-in-out hover:bg-indigo-0 has-[:checked]:bg-indigo-500 has-[:checked]:text-white">
        <span class="${statusClass}-indicator w-2.5 h-2.5 rounded-sm block"></span>
        ${status}
        <input
          type="radio"
          class="status-radio hidden"
          name="project-status"
          value="${status}"
          id="${inputId}"
          ${isCurrent ? "checked" : ""}/>
      </label>
    `;
    listItem.querySelector(".status-radio").addEventListener("click", () => {
      submitBtn.disabled = status === project.status;
    });
    list.appendChild(listItem);
  });
  return list;
};

const buildProjectLastUpdatedCell = (project) => {
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

const buildProjectResourcesCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "py-3 px-2.5 text-center relative";
  cell.innerHTML = `<span class="text-sm text-gray-900 text-center rounded-md bg-indigo-0 px-[7px] py-1">${project.resources.length}</span>`;
  const span = cell.querySelector("span");
  const tooltip = buildResourcesTooltip(project);
  const showTooltip = () => cell.appendChild(tooltip);
  const hideTooltip = () => {
    const tip = cell.querySelector(".resource-tooltip");
    if (tip) tip.remove();
  };
  span.addEventListener("mouseover", showTooltip);
  span.addEventListener("mouseout", hideTooltip);
  return cell;
};

const buildResourcesTooltip = (project) => {
  const container = document.createElement("div");
  container.className = "resource-tooltip";
  const list = document.createElement("ul");
  list.className = "flex flex-col gap-3 mt-3";
  if(project.resources.length === 0) list.innerHTML = `<li class="text-sm text-white text-left font-medium">No resources</li>`
  project.resources.forEach((resource) => {
    const listItem = document.createElement("li");
    listItem.className = "text-sm text-white text-left font-medium";
    listItem.textContent = resource;
    list.appendChild(listItem);
  });
  container.innerHTML = `
  <h2 class="text-xs text-indigo-200 font-medium uppercase text-left">Resources</h2>
  `;
  container.appendChild(list);
  return container;
};

const buildProjectEstimationCell = (project) => {
  const cell = document.createElement("td");
  cell.className = "px-2.5 py-3 text-center text-sm text-gray-900";
  cell.textContent = formatEstimationForDisplay(project.estimation);
  return cell;
};

const buildProjectActionsCell = (project) => {
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
    const actionsMenu = buildProjectActionsMenu(project, menuContainer);
    menuContainer.appendChild(actionsMenu);
  });
  return cell;
};

const buildProjectActionsMenu = (project, container) => {
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
  const addListener = (selector, action) => {
    const button = menu.querySelector(selector);
    button.addEventListener("click", () => {
      action();
      menu.remove();
    });
  };
  addListener(".edit-btn", () => openEditProjectModal(project));
  addListener(".archive-btn", () => toggleArchiveProject(project));
  addListener(".delete-btn", () => openDeleteProjectModal(project));
  const closeDropdown = (event) => {
    if (!container.contains(event.target)) {
      menu.remove();
      document.removeEventListener("click", closeDropdown);
    }
  };
  document.addEventListener("click", closeDropdown);
  return menu;
};
