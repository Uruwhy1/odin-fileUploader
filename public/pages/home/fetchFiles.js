import { openDeleteModal } from "./deleteFile.js";
import { createElement } from "../../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const folderItems = document.querySelectorAll(".folder-item");

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
        } else {
          console.error("Failed to fetch files");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

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

function displayFiles(files) {
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";

  if (files.length === 0) {
    fileList.innerHTML = "<p>No files found.</p>";
  } else {
    files.forEach((file) => {
      const downloadUrl = sanitizeUrl(file.name, file.path);

      const imgPreview = createElement("img", {
        src: getPreview(file.path),
        alt: `${file.name} preview`,
        className: "file-preview",
      });
      imgPreview.addEventListener("click", () => {
        window.open(file.path, "_blank");
      });

      const titleElement = createElement("p", {
        className: "file-title",
        textContent: file.name,
      });

      const sizeElement = createElement("p", {
        className: "file-size",
        textContent: formatSize(file.size),
      });

      const downloadLink = createElement("a", {
        className: "download-button",
        href: downloadUrl,
        title: "Download File",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline class="animate" points="7 10 12 15 17 10"></polyline><line class="animate" x1="12" y1="15" x2="12" y2="3"></line></svg>`,
      });

      const deleteButton = createElement("button", {
        className: "delete-button",
        title: "Delete File",
        innerHTML: `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="24" height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  class="feather feather-trash"
>
  <!-- Trash Can Lid -->
  <line class="animate"  x1="8" y1="1" x2="16" y2="1" /> 

  <!-- Handle (Lid Grip) -->
  <line class="animate" x1="8" y1="2" x2="8" y2="5" />
  <line class="animate" x1="16" y1="2" x2="16" y2="5" />

  <!-- Trash Can Body -->
  <path d="M19 7v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />

  <!-- Lid Attachment Line -->  
  <polyline class="animate" points="3 6 21 6" />
</svg>
`,
      });
      deleteButton.addEventListener("click", async () => {
        openDeleteModal(file.publicId, file.id, fileElement);
      });

      const buttonContainer = createElement(
        "div",
        {
          className: "file-buttons",
        },
        downloadLink,
        deleteButton
      );

      const fileElement = createElement(
        "div",
        { className: "file-item" },
        imgPreview,
        titleElement,
        sizeElement,
        buttonContainer
      );

      fileList.appendChild(fileElement);
    });
  }
}

function formatSize(bytes) {
  if (bytes >= 1e9) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  } else if (bytes >= 1e6) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  return (bytes / 1024).toFixed(2) + " KB";
}

function sanitizeUrl(name, url) {
  const sanitizedFileName = name.replace(/[^\w-]/g, "_");
  const downloadUrl = url.replace(
    "/upload/",
    `/upload/fl_attachment:${sanitizedFileName}/`
  );
  return downloadUrl;
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
    css: "assets/css-placeholder.png",
    html: "assets/html-placeholder.png",
  };

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
  const videoExtensions = ["mp4", "mkv"];

  if (imageExtensions.includes(extension)) {
    return path;
  } else if (videoExtensions.includes(extension)) {
    return path.replace(/\.mp4$/, ".jpg");
  }

  if (placeholders[extension]) {
    return placeholders[extension];
  } else {
    return "assets/default-placeholder.png";
  }
}
