import { v3 } from "node-hue-api";
import { getHue } from "./get-hue";

// const kelvin = 2700;
// const mireds = Math.round(1000000 / kelvin);
// const brightState = new v3.lightStates.LightState().on(true).brightness(10).ct(mireds);
// const colorLoop = new v3.lightStates.LightState().effect("colorloop").brightness(10).on(true);

void (async function main() {
  const hue = await getHue();
  const groups = await hue.groups.getAll();
  const roomNames = groups.filter((group) => group.type === "Room").map((room) => room.name);
  console.log("Room Names:", roomNames);

  const redMaxBrightness = new v3.lightStates.LightState().on(true).brightness(100).effect("none").rgb(255, 0, 0).sat(100);

  await setLightsByRoomName("Kitchen", redMaxBrightness, groups, hue);
})();

async function setLightsByRoomName(roomName, lightSetting, groups, hue) {
  const lights = groups.filter((group) => group.name === roomName && group.type === "Room").flatMap((group) => group.lights);
  console.log(`${roomName} Lights:`, lights);

  const lightStatePromises = lights.map((lightId) => {
    return hue.lights.setLightState(lightId, lightSetting).catch((err) => {
      console.error(`Error changing light ${lightId} state`, err);
    });
  });

  await Promise.all(lightStatePromises)
    .then(() => console.log("Kitchen lights set to max brightness and red color."))
    .catch((err) => console.error("An error occurred while updating the kitchen lights", err));
}

// async function toggleLights(hue) {
//   const lights = await hue.lights.getAll();
//   const lightStatePromises = lights.map((light, index) => {
//     const state = colorLoop;
//     return hue.lights.setLightState(light.id, state).catch((err) => {
//       console.error(`Error changing light ${light.id} state`, err);
//     });
//   });

//   await Promise.all(lightStatePromises)
//     .then(() => console.log("complete."))
//     .catch((err) => console.error("An error occurred while updating the lights", err));
// }
