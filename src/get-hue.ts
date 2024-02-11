import dotenv from "dotenv";
import { v3 } from "node-hue-api";
export async function getHue() {
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
  return await v3.api.createLocal(ipAddress).connect(username);
}
