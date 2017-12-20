/**
 * load enviromental file.
 */
require('dotenv').config();

//load modules
const {WebSocketServer} = require('node-xmpp-server');
const {Stanza} = require('node-xmpp-core');

const domain = (sails.config.environment === "production") ? process.env.XMPP_DOMAIN_PROD : process.env.XMPP_DOMAIN_DEV;

const server = new WebSocketServer({
    port: process.env.XMPP_PORT,
    domain: domain
});

server.on('connect', require('./event/connect'));
console.log(`Xmpp server running on ${domain}:${process.env.XMPP_PORT}`);
