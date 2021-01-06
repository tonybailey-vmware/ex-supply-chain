const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const { exit } = require('process');
const app = express();

const [port] = process.argv.slice(2);
if (!port) {
  console.log("Usage: node proxy.js PORT");
  exit(1);
}

const jsonApiUrl = process.env.REACT_APP_JSON_API_URL;

console.log(`JSON API proxy: ${jsonApiUrl}`);

app.use(express.static(path.join(__dirname, 'build')));
app.use('/v1', proxy(jsonApiUrl));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log(`Listening on ${port}...`);
app.listen(port);
