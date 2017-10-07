/**
 * Here you can authenticate a user.
 * return cb(null, opts) if truthy or cb(false) if false
 * @param client
 * @return function(opt, cb)
 */
const CLIENTS = require('../../util/clients')

module.exports = client => (opts, cb) => {
    //do authentication / password check here
    var authenticated = true

    if (authenticated) { //truthy
        cb(null, opts)
        // console.log('client -- ', client)
        saveClient(client)
    } else { //false
        cb(false)
    }

    console.log("i'm authenticated")
}

function saveClient(client) {
    console.log('server:', client.jid.local, 'ONLINE')
    const clientKey = `${client.jid.user}@${client.jid.domain}`
    client['clientKey'] = clientKey
    //store client informaiton
    CLIENTS.set(clientKey, client)
    console.log(CLIENTS.size)
    console.dir(CLIENTS.keys())
}