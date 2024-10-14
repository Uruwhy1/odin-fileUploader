import { createElement, showPopup } from "../../utils.js";

export function renameFile(element, file) {
  const originalName = element.textContent;

  const input = createElement("input", {
    type: "text",
    value: originalName,
    className: "file-title",
  });

  element.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => handleRename(file));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleRename(file);
    }
  });

  async function handleRename(file) {
    const newName = input.value.trim();
    let worked = true;

    if (newName && newName !== originalName) {
      try {
        console.log(file, file.id);
        const response = await fetch(`/rename/${file.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newName }),
        });

        if (!response.ok) {
          worked = false;

          throw new Error("Failed to delete the file.");
        }

        showPopup("File renamed successfully!", true);
      } catch (error) {
        console.error("Error renaming file:", error);
        showPopup("Error renaming file. Please try again.", false);
      }
    } else {
      console.log("Rename canceled or no changes made.");
    }

    const newTitle = createElement("p", {
      className: "file-title",
      textContent: worked ? newName : originalName,
    });
    newTitle.addEventListener("click", () => renameFile(newTitle, file));
    input.replaceWith(newTitle);
  }
}
