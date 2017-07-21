const CLIENTS = require('../../util/clients')
const JID = require('@xmpp/jid')

/**
 * When a new message is received, this function is called.
 *  @example to send the exact same message back to sender
 *    var from = stanza.attrs.from
 *    stanza.attrs.from = stanza.attrs.to
 *    stanza.attrs.to = from
 *    client.send(stanza)
 * 
 * @param client
 */
const Stanza = require('node-xmpp-core').Stanza

module.exports = client => (stanza) => {
    const clientKey = stanza.attrs.to
    //get client from map and send message
    if (stanza.is('message') && (stanza.attrs.type !== 'error')) {
        postman(stanza)
        saveToDb(getMessageFromStanza(stanza))
    } else if (stanza.is('chat') && (stanza.attrs.type !== 'error')) {
        postman(stanza)
        saveToDb(getMessageFromStanza(stanza))
    } else if (stanza.is('presence')) {

    } else if (stanza.is('iq') && stanza.attrs.type == 'get') {

    }

}

function getMessageFromStanza(stanza) {
    var from = stanza.root().attrs.from
    var to = stanza.root().attrs.to
    var quote = stanza.root().attrs.quote
    var message = stanza.root().children[0].children[0]

    return {from, to, message, quote}
}

/**
 * If client is online, forward message
 * @param {*} stanza 
 */
function postman(stanza) {
    const clientKey = stanza.attrs.to
    var nJid = JID(clientKey, "localhost")
    console.log(stanza.attrs.to, stanza.attrs.from)
    if (CLIENTS.has(nJid.toString())) {//client is online
        CLIENTS.get(nJid.toString()).send(stanza)
    } else {
    }
}

/**
 * save stanza to database
 * @param {from, to message} stanza 
 */
function saveToDb({from, to, message, quote}) {
    console.log("details below")
    console.log("\n",from,"\n", to,"\n", message,"\n", quote)
}