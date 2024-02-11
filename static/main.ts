export async function mainModule() {
  const origin = window.location.hostname;
  const loading = document.getElementById("loading");
  const apiOrigin = `//${origin}:3000`;
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      loading.style.display = "block";
      const script = button.getAttribute("data-script");
      if (!script) {
        console.error("No script attribute found on button");
        return;
      }
      const response = await fetch(`${apiOrigin}/${script}`, {
        method: "GET",
      });
      if (response.ok) {
        loading.style.display = "none";
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
