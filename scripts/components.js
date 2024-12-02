"use strict";

// DOM elements:

// Functions:


export const createProjectCheckboxCell = (
  isSelected,
  projectId,
  handleProjectSelection
) => {
  const cell = document.createElement("td");
  cell.classList.add("py-3", "px-2.5", "text-center");
  cell.innerHTML = `
    <input type="checkbox" class="checkbox-btn checkbox-btn-single" ${
      isSelected ? "checked" : ""
    } />
  `;
  cell.querySelector("input").addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    handleProjectSelection(projectId, isChecked);
  });
  return cell;
};

export const createProjectIdCell = (projectId) => {
  const cell = document.createElement("td");
  cell.classList.add("py-3", "px-2.5", "text-center");
  cell.textContent = projectId;
  return cell;
};

export const createProjectNameCell = (projectName) => {
  const cell = document.createElement("td");
  cell.classList.add("py-3", "px-2.5");
  cell.innerHTML = `
  <a href="#" target="_blank" class="text-indigo-500 text-sm font-medium hover:underline inline-flex items-center gap-2 group ">
    ${projectName}
    <svg width="13.999756" height="14.000000" viewBox="0 0 13.9998 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="hidden group-hover:block">
      <path id="icon" d="M7.75 0C7.33 0 7 0.33 7 0.75C7 1.16 7.33 1.5 7.75 1.5L11.43 1.5L6.46 6.46C6.17 6.76 6.17 7.23 6.46 7.53C6.76 7.82 7.23 7.82 7.53 7.53L12.49 2.56L12.49 6.25C12.49 6.66 12.83 7 13.24 7C13.66 7 13.99 6.66 13.99 6.25L13.99 0.75C13.99 0.33 13.66 0 13.24 0L7.75 0ZM6 2.25C6 1.83 5.66 1.5 5.25 1.5L2 1.5C0.89 1.5 0 2.39 0 3.5L0 12C0 13.1 0.89 14 2 14L10.5 14C11.6 14 12.5 13.1 12.5 12L12.5 8.75C12.5 8.33 12.16 8 11.75 8C11.33 8 11 8.33 11 8.75L11 12C11 12.27 10.77 12.5 10.5 12.5L2 12.5C1.72 12.5 1.5 12.27 1.5 12L1.5 3.5C1.5 3.22 1.72 3 2 3L5.25 3C5.66 3 6 2.66 6 2.25Z" fill="#868FA0" fill-opacity="1.000000" fill-rule="evenodd"/>
    </svg>
  </a>
  `;
  return cell;
};

export const createProjectManagerCell = (projectManager) => {
  const cell = document.createElement("td");
  cell.classList.add(
    "py-3",
    "px-2.5",
    "flex",
    "items-center",
    "justify-center"
  );
  const projectManagerName = projectManager.replace(/\s+/g, "-").toLowerCase();
  const img = new Image();
  img.src = `./images/${projectManagerName}.png`;
  img.alt = projectManager;
  img.classList.add("w-6", "h-6", "rounded-md");
  img.onerror = () => {
    const initials = projectManager
      .split(" ")
      .map((name) => name[0].toUpperCase())
      .join("");
    cell.innerHTML = `<span class="w-6 h-6 rounded-md flex items-center justify-center bg-[#EDEDFC] text-indigo-500 font-semibold text-[10px] border border-[#D2D5DC80]">${initials}</span>`;
  };
  cell.appendChild(img);
  return cell;
};

export const createProjectLastUpdatedCell = (lastUpdated) => {
  const cell = document.createElement("td");
  cell.classList.add(
    "py-3",
    "px-2.5",
    "flex",
    "items-center",
    "justify-center",
    "gap-1.5"
  );
  cell.innerHTML = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.75 12C1.75 13.2426 2.75736 14.25 4 14.25H10.2485C10.5513 14.25 10.8438 14.1401 11.0717 13.9407L13.8231 11.5332C14.0944 11.2958 14.25 10.9529 14.25 10.5925V4C14.25 2.75736 13.2426 1.75 12 1.75H4C2.75736 1.75 1.75 2.75736 1.75 4V12Z" stroke="#5E5ADB" stroke-width="1.5"/>
    <path d="M5.25 6.5H10.75" stroke="#5E5ADB" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M5.25 9.5H8.75" stroke="#5E5ADB" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <span class="text-sm text-gray-900 text-nowrap">${lastUpdated}</span>
  `;
  return cell;
};

export const createProjectResourcesCell = (projectResources) => {
  const cell = document.createElement("td");
  cell.classList.add("py-3", "px-2.5", "text-center");
  cell.innerHTML = `<span class="text-sm text-gray-900 text-center rounded-md bg-[#E9EDF5] px-[7px] py-1">${projectResources.length}</span>`;
  return cell;
};

// Event listeners:
