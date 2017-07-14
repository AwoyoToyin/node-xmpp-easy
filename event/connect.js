/**
 * This function is called when connection has been
 * established between a client and the server
 * @param client
 */
const {loadCustomEvents} = require('../util/loader')

module.exports = client => {
    loadCustomEvents().then(events => {
        events.forEach(event => {
            client.on(event.name, event.action(client))
        })
    }).catch(error => {
        console.log(error)
    })

    console.log("i'm connected")
}