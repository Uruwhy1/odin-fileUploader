document.addEventListener("DOMContentLoaded", () => {
  let removeButtons = document.querySelectorAll("#delete-folder-btn");
  let renameButtons = document.querySelectorAll("#rename-folder-btn");

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
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      const folderId = button.getAttribute("data-id");
      const folderElement = document.getElementById(`${folderId}`);

      const folderNameElement = folderElement.querySelector("span");
      const currentFolderName = folderNameElement.textContent;

      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.value = currentFolderName;
      inputField.classList.add("rename-input");
      folderElement.replaceChild(inputField, folderNameElement);

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.classList.add("save-rename-btn");
      folderElement.appendChild(saveButton);

      saveButton.addEventListener("click", async () => {
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
            const updatedFolderNameElement = document.createElement("span");
            updatedFolderNameElement.textContent = newFolderName;
            folderElement.replaceChild(updatedFolderNameElement, inputField);
            folderElement.removeChild(saveButton);
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
});
