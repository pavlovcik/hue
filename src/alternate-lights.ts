import dotenv from "dotenv";
import { v3 } from "node-hue-api";
dotenv.config();
// Create a LightState object with the desired state

(async function main() {
  if (!process.env.HUE_USERNAME) {
    console.error("Please set HUE_USERNAME in .env");
    process.exit(1);
  }
  if (!process.env.HUE_BRIDGE_IP) {
    console.error("Please set HUE_BRIDGE_IP in .env");
    process.exit(1);
  }
  const ipAddress = process.env.HUE_BRIDGE_IP;
  const username = process.env.HUE_USERNAME;

  const hue = await v3.api.createLocal(ipAddress).connect(username);

  const dimState = new v3.lightStates.LightState().on(true).brightness(100).saturation(0).rgb(255, 0, 0);

  const brightState = new v3.lightStates.LightState().on(true).brightness(100).saturation(0).rgb(0, 255, 0);

  async function toggleLights() {
    const lights = await hue.lights.getAll();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const lightStatePromises = lights.map((light, index) => {
        const state = index % 2 === 0 ? dimState : brightState;
        return hue.lights.setLightState(light.id, state).catch((err) => {
          console.error(`Error changing light ${light.id} state`, err);
        });
      });

      await Promise.all(lightStatePromises)
        .then(() => {
          console.log("complete.");
        })
        .catch((err) => {
          console.error("An error occurred while updating the lights", err);
        });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Start toggling the lights
  await toggleLights();
})()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
