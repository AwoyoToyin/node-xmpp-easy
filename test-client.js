require('dotenv').config()

var debug = console.log
var xmpp = require('node-xmpp-server');
var Client = require('node-xmpp-client');
var Stanza = require('node-xmpp-core').Stanza;
var IQ = require('node-xmpp-core').IQ;


var client1 = new Client({
    websocket: { url: `ws://${process.env.XMPP_DOMAIN || 'localhost'}:${process.env.XMPP_PORT || '8090'}` },
    jid: 'client1@localhost',
    password: 'secret'
})
client1.on('online', function (data) {
    debug('client1 is online')
    debug('client1', data)
    setInterval(()=>{
        client1.send(new Stanza('message', { to: '4@localhost', quote: 'quote id mf' }).c('body').t('baba i dey come back office'))
    }, 2000)
})
client1.on('stanza', function (stanza) {
    debug('client1', 'received stanza', stanza.root().toString())
})
client1.on('error', function (error) {
    debug('client1 auth failed')
    debug('client1', error)
})



var client2 = new Client({
    websocket: { url: `ws://${process.env.XMPP_DOMAIN || 'localhost'}:${process.env.XMPP_PORT || '8090'}` },
    jid: 'client2@localhost',
    password: 'notsecret'
})
client2.on('error', function (error) {
    debug('client2 auth failed')
    debug('client2', error)
})
client2.on('online', function (data) {
    debug('client2 is online')
    debug('client2', data)
})
client2.on('stanza', function (stanza) {
    debug('client2', 'received stanza ==>',  stanza.root().toString(), "\n\n")
    console.log(stanza.toString())
    // client2.send(new Stanza('message', { to: '1@localhost' }).c('body').t('HelloWorld'))
})

console.log(`connected to server through websockts on ws://${process.env.XMPP_DOMAIN || 'localhost'}:${process.env.XMPP_PORT || '8090'}`)