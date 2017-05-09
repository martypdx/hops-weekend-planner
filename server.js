/* eslint no-console: "off" */
const app = require('./lib/app');
const http = require('http');

const PORT = 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});