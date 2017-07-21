const glob = require("glob")

//config options for glob
const options = { cwd: './node-xmpp-easy/event' }

module.exports = {
    loadCustomEvents: () => {
        console.log(process.cwd())
        return new Promise((resolve, reject) => {
            glob(`custom/*.js`, options, function (err, files) {
                if (err) return reject({ error: err, message: 'error getting event' })

                const events = []
                files.map(file => "../event/" + file.substr(0, file.length - 3)).forEach(file => {
                    //load event and store event name
                    events.push({name: file.substr(file.lastIndexOf('/')+1), action: require(file)})
                })

                resolve(events)
            })
        })
    }
}