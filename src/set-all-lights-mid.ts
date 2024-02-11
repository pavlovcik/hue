import dotenv from "dotenv";
import { v3 } from "node-hue-api";
dotenv.config();

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
(async function main() {
  const hue = await v3.api.createLocal(ipAddress).connect(username);

  const kelvin = 2700;
  const mireds = Math.round(1000000 / kelvin);

  const brightState = new v3.lightStates.LightState().on(true).brightness(50).ct(mireds).effect("none");

  async function toggleLights() {
    const lights = await hue.lights.getAll();
    const lightStatePromises = lights.map((light, index) => {
      const state = brightState;
      return hue.lights.setLightState(light.id, state).catch((err) => {
        console.error(`Error changing light ${light.id} state`, err);
      });
    });

    await Promise.all(lightStatePromises)
      .then(() => console.log("complete."))
      .catch((err) => console.error("An error occurred while updating the lights", err));
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
