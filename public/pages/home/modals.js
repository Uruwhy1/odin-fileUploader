document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.querySelector(".modal-container");
  const uploadModal = document.getElementById("upload-modal");
  const createFolderModal = document.getElementById("create-folder-modal");

  document.getElementById("uploadButton").addEventListener("click", () => {
    modalContainer.classList.add("active");
    uploadModal.classList.add("active");
  });

  document
    .getElementById("createFolderButton")
    .addEventListener("click", () => {
      modalContainer.classList.add("active");
      createFolderModal.classList.add("active");
    });

  document
    .querySelectorAll('.modal button[type="button"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        modalContainer.classList.remove("active");
        uploadModal.classList.remove("active");
        createFolderModal.classList.remove("active");
      });
    });
});
