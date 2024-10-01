document.addEventListener("DOMContentLoaded", (e) => {
  let removeButtons = document.querySelectorAll("#delete-folder-btn");

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
});
