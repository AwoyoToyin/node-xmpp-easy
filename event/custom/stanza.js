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
        console.log('confused');
        postman(stanza)
        saveToDb(getMessageFromStanza(stanza))
    } else if (stanza.is('presence')) {
        console.log('online');
    } else if (!stanza.is('presence')) {
        console.log('offline');
    } else if (stanza.is('iq') && stanza.attrs.type == 'get') {
        console.log('whatt???');
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
    // console.log(stanza.attrs.to, stanza.attrs.from)
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
    console.log("\n",from,"\n", to,"\n", message,"\n", quote);

    /** formats from id */
    let fromId;
    let userType;
    let fromArray = from.split('\\', 1);
    if (fromArray[0].indexOf('client') > -1) {
        fromId = fromArray[0].split('client');
        userType = 'client';
    }
    if (fromArray[0].indexOf('assistant') > -1) {
        fromId = fromArray[0].split('assistant');
        userType = 'assistant';
    }

    ChatRoom.findOne({quote: quote})
        .then((chatroom) => {
            if (chatroom && chatroom.id) {
                const data = {
                    chatroom_id: chatroom.id,
                    sender: fromId[1],
                    userType: userType,
                    message: message
                }
                chatroom.messages.add(data);
                chatroom.save();
            }
        })
        .then(() => {})
        .catch((err) => console.log('err -- ', err))
}