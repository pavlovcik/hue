import express from "express";
import { exec } from "child_process";

const app = express();
const port = 3000;

app.get("/run-script/:scriptName", (req, res) => {
  const { scriptName } = req.params;
  exec(`yarn ${scriptName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.send(`Error running script: ${error}`);
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send(`Script ${scriptName} ran successfully`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
