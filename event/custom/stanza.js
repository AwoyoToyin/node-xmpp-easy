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
    } else if (stanza.is('chat') && (stanza.attrs.type !== 'error')) {
        console.log('confused');
        postman(stanza)
    } else if (stanza.is('presence')) {
        console.log('online');
    } else if (!stanza.is('presence')) {
        console.log('offline');
    } else if (stanza.is('iq') && stanza.attrs.type == 'get') {
        console.log('whatt???');
    }

}

function getMessageFromStanza(stanza) {
    let from = stanza.root().attrs.from
    let to = stanza.root().attrs.to
    let quote = stanza.root().attrs.quote
    let message = stanza.root().children[0].children[0]

    return {from, to, message, quote}
}

/**
 * If client is online, forward message
 * @param {*} stanza 
 */
function postman(stanza) {
    const clientKey = stanza.attrs.to
    let nJid = JID(clientKey, "localhost")
    let sendMail = false

    if (CLIENTS.has(nJid.toString())) {//client is online
        console.log('client is online -- ', nJid.toString())
        CLIENTS.get(nJid.toString()).send(stanza)
    } else {
        sendMail = true
        console.log('client is offline -- ', nJid.toString())
    }
    saveToDb(getMessageFromStanza(stanza), sendMail)
}

/**
 * save stanza to database
 * @param {from, to message} stanza 
 */
function saveToDb({from, to, message, quote}, sendMail = false) {
    console.log("\n",from,"\n", to,"\n", message,"\n", quote);

    /** formats from id */
    let fromId;
    let userType;
    const fromArray = from.split('\\', 1);
    if (fromArray[0].indexOf('client') > -1) {
        fromId = fromArray[0].split('client');
        userType = 'client';
    }
    if (fromArray[0].indexOf('assistant') > -1) {
        fromId = fromArray[0].split('assistant');
        userType = 'assistant';
    }

    ChatRoom.findOne({quote: quote})
        .populate('quote')
        .populate('assistant')
        .populate('client')
        .then((chatroom) => {
            if (chatroom && chatroom.id) {
                const data = {
                    chatroom_id: chatroom.id,
                    sender: fromId[1],
                    userType: userType,
                    message: message
                }
                // save message to chatroom
                chatroom.messages.add(data)
                chatroom.save()

                // send email to recipient if not online
                if (sendMail) {
                    let recipient
                    let sentBy
                    let to
                    let quotelink
    
                    if (userType == 'client') {
                        recipient = `${chatroom.assistant.firstname} ${chatroom.assistant.lastname}`
                        sentBy = `${chatroom.client.firstname} ${chatroom.client.lastname}`
                        to = chatroom.assistant.email
                        quotelink = `assistant/account/request-order/edit/${chatroom.quote.id}`
                    } else {
                        recipient = `${chatroom.client.firstname} ${chatroom.client.lastname}`
                        sentBy = `${chatroom.assistant.firstname} ${chatroom.assistant.lastname}`
                        to = chatroom.client.email
                        quotelink = `client/account/request-order/edit/${chatroom.quote.id}`
                    }

                    if (recipient && sentBy && to && quotelink) {
                        MailerService.sendMessageReceivedMail({
                            to: to,
                            extra: {
                                recipient: recipient,
                                sentBy: sentBy,
                                code: chatroom.quote.code,
                                quotelink: quotelink
                            }
                        })
                    }
                }
            }
        })
        .then(() => {})
        .catch((err) => console.log('err -- ', err))
}
