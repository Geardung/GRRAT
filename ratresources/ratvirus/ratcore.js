
const { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } = require('node-vk-sdk')
const fs = require("fs-extra")

fs.exists("./config.json", exist => {
    if (exist) {
        fs.exists("../ratvirus", existfolder => {
            console.log(`${exist}       ||      ${existfolder}`)
            if (existfolder) {
                var actconf = { ownerid: 312888294 }
                var conf = require("./config.json")
                ratcore.init({conf: conf,actconf: actconf})
            } else {
                conf = require("./config.json")
                ratcore.init({conf: conf,actconf: actconf})
            }
        })
    }
})

const ratcore = {}
ratcore.init = function start(temp) {
    let conf = temp.conf
    let actconf = temp.actconf
    let api = new VKApi({
        token: conf.group.token,
        logger: new ConsoleLogger()
    })
    
    let updatesProvider = new BotsLongPollUpdatesProvider(api, conf.group.id)
    
    updatesProvider.getUpdates(updates => {
    
    })
    
    api.docsGetMessagesUploadServer({
        peer_id: actconf.ownerid
    }).then((url) => {
        
    })
}