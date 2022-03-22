const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const fs = require("fs");

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// app.listen(3080);

const options = {
  // key: fs.readFileSync("./cert/star_uat_teda_th.key"),
  // cert: fs.readFileSync("./cert/star_uat_teda_th.cer"),
  // requestCert: false,
  // rejectUnauthorized: false,
};
const server = http.createServer(options, app);
server.listen(80);
