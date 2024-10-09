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

      const titleElement = createElement("p", {
        className: "file-title",
        textContent: file.name,
      });

      const sizeElement = createElement("p", {
        className: "file-size",
        textContent: formatSize(file.size),
      });
      const downloadLink = createElement("a", {
        href: downloadUrl,
        title: "Download File",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
      });

      const deleteButton = createElement("button", {
        className: "delete-button",
        title: "Delete File",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
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

function createElement(tag, options = {}, ...children) {
  const element = document.createElement(tag);

  for (let [key, value] of Object.entries(options)) {
    if (key === "className") {
      element.className = value;
    } else if (key === "innerHTML") {
      element.innerHTML = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else {
      element[key] = value;
    }
  }

  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });

  return element;
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

function openDeleteModal(publicID, fileID, element) {
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

    alert("File deleted successfully.");
    element.remove();
  } catch (error) {
    console.error("Error deleting file:", error);
    alert("Error deleting file. Please try again.");
  }
}

function hideModal(...modals) {
  modals.forEach((modal) => {
    modal.classList.remove("active");
  });
}
function showModal(...modals) {
  modals.forEach((modal) => {
    modal.classList.add("active");
  });
}
