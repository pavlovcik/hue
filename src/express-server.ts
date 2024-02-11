import { spawn } from "child_process";
import cors from "cors"; // Import cors
import express from "express";
const app = express();
app.use(cors()); // Use cors middleware
const port = 3000;

app.get("/run-script/:scriptName", (req, res) => {
  const { scriptName } = req.params;
  const child = spawn("yarn", [scriptName]);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("error", (error) => {
    console.error(`error: ${error.message}`);
    res.send(`Error running script: ${error.message}`);
  });

  child.on("close", (code) => {
    if (code !== 0) {
      console.log(`process exited with code ${code}`);
      res.send(`Script ${scriptName} ran with exit code ${code}`);
    } else {
      res.send(`Script ${scriptName} ran successfully`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
