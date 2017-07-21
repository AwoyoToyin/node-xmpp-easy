const CLIENTS = require('../../util/clients')
/**
 * This is called when a client comes online
 * @param client
 */
module.exports = client => () => {
    console.log(`someone's online`)
}