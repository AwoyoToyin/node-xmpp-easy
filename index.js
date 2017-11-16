/**
 * load enviromental file.
 */
require('dotenv').config()

//load modules
const {WebSocketServer} = require('node-xmpp-server')
const {Stanza} = require('node-xmpp-core')

const server = new WebSocketServer({
    port: process.env.XMPP_PORT,
    domain: process.env.XMPP_DOMAIN
})

server.on('connect', require('./event/connect'))

console.log(`Xmpp server running on ${process.env.XMPP_DOMAIN}:${process.env.XMPP_PORT}`)
