document.addEventListener("DOMContentLoaded", () => {
  const loadingElement = document.querySelector(".loading");

  function showLoadingBar() {
    loadingElement.classList.add("active");
  }

  function hideLoadingBar() {
    setTimeout(() => {
      loadingElement.classList.remove("active");
      setTimeout(() => {
        loadingElement.style.background = "";
      }, 500);
    }, 500);
  }

  // Delay so animation always has time to complete
  document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.tagName === "a" && target.href) {
      if (target.target === "_blank") return; // if set to open in new tab
      event.preventDefault();
      showLoadingBar();
      setTimeout(() => {
        location.href = target.href;
        hideLoadingBar();
      }, 500);
    }
  });

  document.addEventListener("submit", function (event) {
    const form = event.target.closest("form");
    event.preventDefault();
    showLoadingBar();

    setTimeout(() => {
      form.submit();
      hideLoadingBar();
    }, 500); // delay so loading bar fills up
  });
});
