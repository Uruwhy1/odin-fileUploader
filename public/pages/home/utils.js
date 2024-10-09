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
