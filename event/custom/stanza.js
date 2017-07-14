const CLIENTS = require('../../util/clients')

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
    } else if (stanza.is('chat') && (stanza.attrs.type !== 'error')) {
        postman(stanza)
    } else if (stanza.is('presence')) {

    } else if (stanza.is('iq') && stanza.attrs.type == 'get') {

    }

}

/**
 * If client is online, forward message
 * @param {*} stanza 
 */
function postman(stanza) {
    const clientKey = stanza.attrs.to
    if (CLIENTS.has(clientKey)) {//client is online
        CLIENTS.get(clientKey).send(stanza)
    }
}

/**
 * save stanza to database
 * @param {*} stanza 
 */
function saveToDb(stanza) {
    console.dir(stanza)
}