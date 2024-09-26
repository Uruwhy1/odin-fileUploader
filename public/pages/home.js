document.addEventListener("DOMContentLoaded", () => {
  const folderItems = document.querySelectorAll(".folder-item");
  let previouslySelectedFolder = null;

  folderItems.forEach((folderItem) => {
    folderItem.addEventListener("click", async () => {
      const folderId = folderItem.getAttribute("data-folder-id");

      try {
        const response = await fetch(`/folders/${folderId}/files`);
        if (response.ok) {
          const files = await response.json();

          if (previouslySelectedFolder) {
            previouslySelectedFolder.style.backgroundColor = "";
          }
          folderItem.style.backgroundColor = "var(--selected-folder)";
          previouslySelectedFolder = folderItem;

          displayFiles(files);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

function displayFiles(files) {
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = ""; // Clear the previous list

  if (files.length === 0) {
    fileList.innerHTML = "<p>No files found in this folder.</p>";
  } else {
    files.forEach((file) => {
      const fileElement = document.createElement("div");
      fileElement.className = "file-item";
      fileElement.innerText = `${file.name} - ${file.size} KB`;
      fileList.appendChild(fileElement);
    });
  }
}
