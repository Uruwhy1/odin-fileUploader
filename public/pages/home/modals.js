import { hideModal, showModal } from "../../utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.querySelector(".modal-container");
  const uploadModal = document.getElementById("upload-modal");
  const createFolderModal = document.getElementById("create-folder-modal");

  document.getElementById("uploadButton").addEventListener("click", () => {
    showModal(modalContainer, uploadModal);
  });

  document
    .getElementById("createFolderButton")
    .addEventListener("click", () => {
      showModal(modalContainer, createFolderModal);
    });

  document
    .querySelectorAll('.modal button[type="button"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        hideModal(modalContainer, uploadModal, createFolderModal);
      });
    });
});
