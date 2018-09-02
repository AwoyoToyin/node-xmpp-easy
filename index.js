/**
 * load enviromental file.
 */
require('dotenv').config();

//load modules
const {WebSocketServer} = require('node-xmpp-server');
const {Stanza} = require('node-xmpp-core');

const domain = (sails.config.environment === "production") ? process.env.XMPP_DOMAIN_PROD : process.env.XMPP_DOMAIN_DEV;
const port = process.env.XMPP_PORT;

const server = new WebSocketServer({
    port,
    domain: domain
});

server.on('connect', require('./event/connect'));
console.log(`Xmpp server running on ${domain}:${port}`);
