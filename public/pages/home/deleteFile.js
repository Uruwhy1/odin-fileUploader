import { createElement, hideModal, showModal, showPopup } from "../../utils.js";

export function openDeleteModal(publicID, fileID, element) {
  let modalContainer = document.querySelector(".modal-container");

  // title
  let confirmationText = createElement("h4", {
    textContent: "Are you sure you want to delete this file?",
  });

  // buttons
  let cancelButton = createElement("button", {
    textContent: "Cancel",
    id: "cancel-delete-btn",
    className: "back",
  });
  let confirmButton = createElement("button", {
    textContent: "Confirm",
    id: "confirm-delete-btn",
    className: "submit",
  });

  let buttonContainer = createElement(
    "div",
    {
      className: "buttons",
    },
    cancelButton,
    confirmButton
  );

  // modal div
  let modal = createElement(
    "div",
    {
      className: "modal active",
      id: "delete-confirmation-modal",
    },
    confirmationText,
    buttonContainer
  );
  modalContainer.appendChild(modal);

  showModal(modalContainer);

  cancelButton.addEventListener("click", () => {
    hideModal(modalContainer, modal);
  });

  confirmButton.addEventListener("click", () => {
    deleteFile(publicID, fileID, element);
    hideModal(modalContainer, modal);
  });
}

async function deleteFile(publicId, fileId, element) {
  try {
    const response = await fetch(`/delete/${publicId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete the file.");
    }

    showPopup("File deleted successfully!", true);
    element.remove();
  } catch (error) {
    console.error("Error deleting file:", error);
    showPopup("Error deleting file. Please try again.", false);
  }
}
