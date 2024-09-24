// instead of refreshing the page after removing,
// just delete the DOM element.
document.addEventListener("DOMContentLoaded", () => {
  const folderList = document.getElementById("folder-list");

  folderList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-folder-btn")) {
      const folderId = event.target.getAttribute("data-id");

      if (!confirm("Are you sure you want to delete this folder?")) return;

      try {
        const response = await fetch(`/folders/${folderId}/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const folderElement = document.getElementById(`folder-${folderId}`);
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
    }
  });
});
