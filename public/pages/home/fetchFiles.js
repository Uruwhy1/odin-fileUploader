document.addEventListener("DOMContentLoaded", async () => {
  const folderItems = document.querySelectorAll(".folder-item");
  const fileHeader = document.querySelector("#folder-name");

  let previouslySelectedFolder = null;
  fetchLastTen();

  folderItems.forEach((folderItem) => {
    folderItem.addEventListener("click", async (event) => {
      const folderId = folderItem.getAttribute("data-folder-id");
      if (event.target.closest("button") || event.target.closest("input")) {
        return;
      }

      if (previouslySelectedFolder) {
        previouslySelectedFolder.style.backgroundColor = "";
      }
      try {
        if (previouslySelectedFolder == folderItem) {
          fetchLastTen();
          fileHeader.textContent = "Recent files...";
          previouslySelectedFolder = null;
          previouslySelectedFolder.style.backgroundColor = "";

          return;
        }

        const response = await fetch(`/folders/${folderId}/files`);
        if (response.ok) {
          const files = await response.json();

          displayFiles(files);
          folderItem.style.backgroundColor = "var(--selected-folder)";
          previouslySelectedFolder = folderItem;

          fileHeader.textContent = `${
            folderItem.querySelector("span").textContent
          }...`;
        } else {
          console.error("Failed to fetch files");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

function displayFiles(files) {
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";

  if (files.length === 0) {
    fileList.innerHTML = "<p>No files found.</p>";
  } else {
    files.forEach((file) => {
      const fileElement = document.createElement("div");
      fileElement.className = "file-item";

      const titleElement = document.createElement("p");
      titleElement.className = "file-title";
      titleElement.innerText = `${file.name}`;

      const sizeElement = document.createElement("p");
      sizeElement.className = "file-size";
      sizeElement.innerText = `${file.size} KB`;

      const sanitizedFileName = file.name.replace(/[^\w-]/g, "_");
      const downloadUrl = file.path.replace(
        "/upload/",
        `/upload/fl_attachment:${sanitizedFileName}/`
      );
      const urlElement = document.createElement("a");
      urlElement.href = downloadUrl;
      urlElement.textContent = "Download";

      const imgPreview = document.createElement("img");
      imgPreview.src = getPreview(file.path);
      imgPreview.alt = `${file.name} preview`;
      imgPreview.className = "file-preview";

      fileElement.appendChild(imgPreview);
      fileElement.appendChild(titleElement);
      fileElement.appendChild(sizeElement);
      fileElement.appendChild(urlElement);

      fileList.appendChild(fileElement);
    });
  }
}

function getPreview(path) {
  const extension = path.split(".").pop().toLowerCase();

  const placeholders = {
    pdf: "assets/pdf-placeholder.png",
    doc: "assets/word-placeholder.png",
    docx: "assets/word-placeholder.png",
    ppt: "assets/ppt-placeholder.png",
    pptx: "assets/ppt-placeholder.png",
    txt: "assets/txt-placeholder.png",
  };

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
  if (imageExtensions.includes(extension)) {
    return path;
  } else if (placeholders[extension]) {
    return placeholders[extension];
  } else {
    return "assets/default-placeholder.png";
  }
}

async function fetchLastTen() {
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";
  try {
    const response = await fetch("/files/recent");
    if (response.ok) {
      const files = await response.json();
      displayFiles(files);
    } else {
      console.error("Failed to fetch recent files");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
