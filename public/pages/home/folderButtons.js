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

        if (response.ok) {
          const folderElement = document.getElementById(`${folderId}`);
          folderElement.remove();
        } else if (response.status === 403) {
          alert("You are a bad person. Or the page is broken.");
        } else {
          alert("Failed to delete the folder.");
        }
      } catch (error) {
        console.error("Error deleting folder:", error);
        alert("An unexpected error occurred.");
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
      const newFolderName = inputField.value;

      try {
        const response = await fetch(`/folders/${folderId}/rename`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newName: newFolderName }),
        });

        if (response.ok) {
          let nameElement = document.querySelector(`#name-${folderId}`);
          nameElement.textContent = newFolderName;
        } else {
          alert("Failed to rename the folder.");
        }
      } catch (error) {
        console.error("Error renaming folder:", error);
        alert("An unexpected error occurred.");
      }
    });
  });
});
