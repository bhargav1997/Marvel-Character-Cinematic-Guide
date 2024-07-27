document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("search-form");
   const loaderOverlay = document.querySelector(".loader-overlay");

   // Hide the loader overlay when the page loads or becomes visible
   function hideLoader() {
      loaderOverlay.classList.remove("active");
   }

   // Hide the loader on page visibility change
   document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
         hideLoader();
      }
   });

   // Hide the loader on page load
   hideLoader();

   form.addEventListener("submit", (event) => {
      // Show loader overlay
      loaderOverlay.classList.add("active");
   });
});
