export async function mainModule() {
  const origin = window.location.hostname;
  const apiOrigin = `//${origin}:3000`;
  const loading = document.getElementById("loading");
  const progress = document.getElementById("progress");

  // Calculate average time on page load
  let times = JSON.parse(localStorage.getItem("times") || "[]");
  if (times.length > 0) {
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    progress.style.animationDuration = `${averageTime}ms`; // Adjust animation duration
  }

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      const startTime = Date.now(); // Record the start time
      loading.style.display = "block";
      const script = button.getAttribute("data-script");
      if (!script) {
        console.error("No script attribute found on button");
        return;
      }
      const response = await fetch(`${apiOrigin}/${script}`, {
        method: "GET",
      });
      const endTime = Date.now(); // Record the end time
      const elapsedTime = endTime - startTime; // Calculate elapsed time
      times.push(elapsedTime);
      if (times.length > 10) times = times.slice(-10); // Keep the last 10 times
      localStorage.setItem("times", JSON.stringify(times));
      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      progress.style.animationDuration = `${averageTime}ms`; // Adjust animation duration
      loading.style.display = "none";
      if (response.ok) {
        console.log("Lights set");
      } else {
        console.error("Error setting lights");
      }
    });
  });
}
mainModule()
  .then(() => {
    console.log("mainModule loaded");
  })
  .catch((error) => {
    console.error(error);
  });
