import API from "../api.js";
import { showNotification } from "../noti.js";

const COMPANY_ID = 1; // temporal, luego esto debe venir del usuario logueado

const tableBody = document.querySelector("#files-table tbody");
const fileModal = document.getElementById("fileModal");
const closeModalBtn = document.getElementById("btnCloseFileModal");
const updateForm = document.getElementById("update-file-form");
const fileInput = document.getElementById("file-upload");

let currentFileId = null;

// ================================
// CARGAR ARCHIVOS
// ================================
async function loadFiles() {
  try {
    const files = await API.getFiles(COMPANY_ID);

    tableBody.innerHTML = "";

    if (!files || files.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3">No hay archivos disponibles.</td>
        </tr>
      `;
      return;
    }

    files.forEach((file) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${file.name || "Sin nombre"}</td>
        <td>${file.uploadDate || "Sin fecha"}</td>
        <td>
          <div class="flex gap-2 justify-center">
            <button type="button" class="btn btn-outline btn-update" data-id="${file.id}">
              Actualizar
            </button>
            <button type="button" class="btn btn-primary btn-download" data-url="${file.downloadUrl || "#"}">
              Descargar
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });

    bindTableEvents();
  } catch (error) {
    console.error("Error al cargar archivos:", error);
    showNotification("No se pudo cargar el historial de archivos", "error");
  }
}

// ================================
// EVENTOS DE LA TABLA
// ================================
function bindTableEvents() {
  const updateButtons = document.querySelectorAll(".btn-update");
  const downloadButtons = document.querySelectorAll(".btn-download");

  updateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const fileId = button.dataset.id;
      openModal(fileId);
    });
  });

  downloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.dataset.url;
      downloadFile(url);
    });
  });
}

// ================================
// MODAL
// ================================
function openModal(fileId) {
  currentFileId = fileId;
  fileInput.value = "";
  fileModal.classList.remove("hidden");
}

function closeModal() {
  currentFileId = null;
  fileInput.value = "";
  fileModal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);

fileModal.addEventListener("click", (event) => {
  if (event.target === fileModal) {
    closeModal();
  }
});

// ================================
// ACTUALIZAR ARCHIVO
// ================================
updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];

  if (!file) {
    showNotification("Selecciona un archivo para actualizar", "error");
    return;
  }

  if (file.type !== "application/pdf") {
    showNotification("Solo se permiten archivos PDF", "error");
    return;
  }

  try {
    await API.updateFile(currentFileId, file);
    showNotification("Archivo actualizado con éxito", "success");
    closeModal();
    loadFiles();
  } catch (error) {
    console.error("Error al actualizar archivo:", error);
    showNotification("Error al actualizar el archivo", "error");
  }
});

// ================================
// DESCARGA
// ================================
function downloadFile(url) {
  if (!url || url === "#") {
    showNotification("No hay URL de descarga disponible", "error");
    return;
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ================================
// INICIO
// ================================
document.addEventListener("DOMContentLoaded", () => {
  loadFiles();
});