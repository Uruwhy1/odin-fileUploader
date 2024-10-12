export function hideModal(...modals) {
  modals.forEach((modal) => {
    modal.classList.remove("active");
  });
}
export function showModal(...modals) {
  modals.forEach((modal) => {
    modal.classList.add("active");
  });
}

export function createElement(tag, options = {}, ...children) {
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

let popupActive = false;
export function showPopup(text, bool) {
  if (popupActive) return;
  const popupElement = document.querySelector("#popup");
  popupElement.innerHTML = "";
  popupElement.classList.add("active");

  const textElement = document.createElement("p");
  textElement.textContent = text;

  let type = bool ? "success" : "failure";
  let svg = bool
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`;

  const svgElement = document.createElement("svg");
  svgElement.innerHTML = svg;

  popupElement.appendChild(svgElement);
  popupElement.appendChild(textElement);
  popupElement.classList.add(type);

  popupActive = true;
  setTimeout(() => {
    popupElement.classList.remove("active");
  }, 2000);
  setTimeout(() => {
    popupElement.classList.remove(type);
    popupActive = false;
  }, 3000);
}
