import { v3 } from "node-hue-api";

const appName = "nexus-test"; // Replace with the name of your app
const deviceName = "Alex"; // Replace with the name of your device

// Discover the local Hue Bridge
// v3.discovery.nupnpSearch()
//   .then(searchResults => {
//     // const host = searchResults[0].ipaddress;

//     return v3.api.createLocal("192.168.219.109").connect();
//   })
v3.api
  .createLocal("192.168.219.109")
  .connect()
  .then((unauthenticatedApi) => {
    // Create a new user on the bridge
    return unauthenticatedApi.users.createUser(appName, deviceName);
  })
  .then((createdUser) => {
    console.log("New User Created");
    console.log(`Username: ${createdUser.username}`);
    console.log(`Client Key: ${createdUser.clientkey}`);
    // Save the username and clientkey to use in future requests
  })
  .catch((err) => {
    console.error(`Error creating user: ${err}`);
  });
