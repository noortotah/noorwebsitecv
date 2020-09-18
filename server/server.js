const path = require('path');
const express = require('express');
const server = express();
const httpss = require('https');
const cors = require('cors');

const logger = require('morgan');

const DIST_DIR = __dirname;
const PORT = process.env.PORT || 8080;

const sendemail = require('./sendemail.js');
server.use(sendemail);




server.use(express.static(DIST_DIR));
server.use(cors());
server.use(logger('dev'));

// send the user to index html page inspite of the url
// server.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'));
// });


httpss.createServer(server);
server.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})