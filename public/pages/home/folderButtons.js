import { showPopup } from "../../utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const removeButtons = document.querySelectorAll("#delete-folder-btn");
  const renameButtons = document.querySelectorAll("#rename-folder-btn");

  const renameInputs = document.querySelectorAll(".rename-input");
  renameInputs.forEach((input) => {
    const folderId = input.id;
    const folderNameSpan = document.querySelector(`#name-${folderId}`);

    input.value = folderNameSpan.textContent;
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      const folderId = button.getAttribute("data-id");

      try {
        const response = await fetch(`/folders/${folderId}/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `Failed with status ${response.status}: ${errorMessage}`
          );
        }

        const folderElement = document.getElementById(folderId);
        if (folderElement) {
          folderElement.remove();
        } else {
          console.warn(`Folder element with ID ${folderId} not found.`);
        }

        showPopup("Folder deleted successfully.", true);
      } catch (error) {
        console.error("Error deleting folder:", error);
        showPopup("Failed to delete the folder.", false);
      }
    });
  });

  renameButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const folderId = button.getAttribute("data-id");
      const renameContainer = document.querySelector(`#rename-${folderId}`);

      const input = renameContainer.querySelector("input");
      input.tabIndex = "";

      // place cursor at the end of the input
      input.focus();
      let val = input.value;
      input.value = "";
      input.value = val;

      renameContainer.querySelector("button").tabIndex = "";

      renameContainer.classList.remove("hidden");
    });
  });

  const saveButtons = document.querySelectorAll(".save-rename-btn");
  saveButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const folderId = button.id;
      const renameContainer = document.querySelector(`#rename-${folderId}`);
      renameContainer.classList.add("hidden");

      const inputField = renameContainer.querySelector(".rename-input");
      const newFolderName = inputField?.value.trim();
      if (!newFolderName) {
        showPopup("Folder name cannot be empty.", false);
        return;
      }

      renameContainer.classList.add("hidden");

      try {
        const response = await fetch(`/folders/${folderId}/rename`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newName: newFolderName }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `Rename failed with status ${response.status}: ${errorMessage}`
          );
        }

        const nameElement = document.querySelector(`#name-${folderId}`);
        if (nameElement) {
          nameElement.textContent = newFolderName;
        } else {
          console.warn(`Name element not found for folder ID: ${folderId}`);
        }

        showPopup("Folder successfully renamed.", true);
      } catch (error) {
        console.error("Error renaming folder:", error);
        showPopup("Failed to rename the folder.", false);
      }
    });
  });
});
