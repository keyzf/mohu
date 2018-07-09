const electron = require('electron');
const fs = require("fs");
const path = require('path');
const { init_hosts } = require("./hosts")
const { check_update, manual_check_update } = require("./check_update")

var { app, BrowserWindow, ipcMain, Menu, shell } = electron;
let mainWindow = null, landingWindow = null, locale;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

var forceQuit = false;

app.on('before-quit', (ev) => {
    forceQuit = true;
})

app.on("quit", (ev) => {
    app.exit(0);
})

app.on('activate', (ev, hasVisibleWindows) => {
    if (mainWindow) {
        mainWindow.show()
    } else {
        createWindow();
    }
});

app.on('ready', createWindow);

// const isDev = true
const isDev = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

const template = [
    {
        label: "页面",

        submenu: [
            {
                label: "转到上一页",
                id: "goBack",
                accelerator: "Ctrl+Left",
                enabled:false,
                click: () => {
                    mainWindow.webContents.goBack();
                    go_forward_go_back_menu()
                }
            },
            {
                label: "转到下一页",
                id: "goForward",
                accelerator: "Ctrl+Right",
                enabled:false,
                click: () => {
                    mainWindow.webContents.goForward()
                    go_forward_go_back_menu()
                }
            },
            {
                label: "刷新",

                accelerator: "F5",
                // accelerator: "Ctrl+R",
                click: () => {
                    mainWindow.webContents.reload();
                }
            },
        ]
    },
    {
        label: "进入",

        submenu: [
            {
                label: "膜乎",

                // accelerator: "Ctrl+M",
                click: () => {
                    mainWindow.webContents.loadURL("https://www.mohu.club/")
                }
            },
            {
                label: "小游戏",

                submenu: [
                    {
                        label: "Flappy Winnie",

                        click: () => {
                            mainWindow.webContents.loadURL(`file://${__dirname}/flappy_winnie/index.html`)
                        }
                    },
                    {
                        label: "切包子",

                        click: () => {
                            mainWindow.webContents.loadURL(`file://${__dirname}/bao/index.html`)
                        }
                    },
                    {
                        label: "Flappy Frog",

                        click: () => {
                            mainWindow.webContents.loadURL(`file://${__dirname}/flappy_frog/index.html`)
                        }
                    },
                ]
            }]
    },
    {
        label: '视图',
        submenu: [
            {
                label: "全屏",
                accelerator: "F11",
                click: () => {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
            },
            {
                label: '切换开发者工具',
                accelerator: "F12",
                click() { mainWindow.webContents.toggleDevTools(); }
            },
        ]
    },
    // {
    //     label: '分享',

    //     submenu: [
    //         {
    //             label: "全屏",
    //             accelerator: "F11",
    //             click: () => {
    //                 mainWindow.setFullScreen(!mainWindow.isFullScreen());
    //             }
    //         },
    //         {
    //             label: '切换开发者工具',
    //             accelerator: "F12",
    //             click() { mainWindow.webContents.toggleDevTools(); }
    //         },
    //     ]
    // },
    {
        label: '高级',
        submenu: [
            {
                label: '增加免番羽土啬hosts',
                click() { init_hosts() }
            },
            {
                label: '检查更新',
                click() { manual_check_update() }
            },
            {
                label: '关于',
                click() { shell.openExternal("https://github.com/Xmader/mohu") }
            },
        ]
    },

]
const menu = Menu.buildFromTemplate(template)
const go_forward_go_back_menu = () => {
    menu.getMenuItemById("goBack").enabled = mainWindow.webContents.canGoBack()
    menu.getMenuItemById("goForward").enabled = mainWindow.webContents.canGoForward()

}

function createWindow() {
    locale = app.getLocale();
    landingWindow = new BrowserWindow({
        show: false,
        frame: isDev,
        icon: path.join(__dirname, 'logo.png'),
        width: 490,
        height: 400
    })



    landingWindow.once("show", () => {

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1100,
            height: 740,
            icon: path.join(__dirname, 'logo.png'),
            show: false,
            webPreferences: {
                nodeIntegration: false
            }
        })

        mainWindow.once("show", () => {
            landingWindow.hide()
            landingWindow.close()
            landingWindow.removeAllListeners();
            mainWindow.show()
            landingWindow = null
            check_update()
        })

        mainWindow.webContents.on('did-finish-load', () => {
            if (!mainWindow) {
                throw new Error('"mainWindow" is not defined');
            }
            mainWindow.show();
            mainWindow.focus();
        });

        mainWindow.webContents.on('new-window', (event, url) => {
            event.preventDefault()
            mainWindow.webContents.loadURL(url)
            go_forward_go_back_menu()
        })

        mainWindow.webContents.on('did-navigate', (event, url) => {
            go_forward_go_back_menu()
        })


        mainWindow.on("close", function (event) {
            if (process.platform === "darwin" && !forceQuit) {
                event.preventDefault();
                mainWindow.hide();
            }
        })

        mainWindow.on('closed', function (event) {
            mainWindow.removeAllListeners();
            mainWindow = null;
            app.exit(0);
        })

        // mainWindow.loadURL(`file://${__dirname}/app.html`);
        mainWindow.loadURL("https://www.mohu.club/")

        Menu.setApplicationMenu(menu)
    })

    landingWindow.loadURL(`file://${__dirname}/landing.html`)
    landingWindow.once('ready-to-show', () => {
        landingWindow.show()
    })
}

ipcMain.on("reload", () => {
    mainWindow.webContents.reloadIgnoringCache()
})
