const electron = require('electron');
const fs = require("fs");
const path = require('path');
const { init_hosts } = require("./hosts")

var { app, BrowserWindow, ipcMain, Menu } = electron;
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
        label: "膜乎",

        // accelerator: "Ctrl+M",
        click: () => {
            BrowserWindow.getFocusedWindow().webContents.loadURL("https://www.mohu.club/")
        }
    },
    {
        label: "小游戏",

        submenu: [
            {
                label: "Flappy Winnie",

                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.loadURL(`file://${__dirname}/flappy_winnie/index.html`)
                }
            },
            {
                label: "切包子",

                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.loadURL(`file://${__dirname}/bao/index.html`)
                }
            }
        ]
    },
    {
        label: '高级',
        submenu: [
            {
                label: '增加免番羽土啬hosts',
                click() { init_hosts() }
            },
            {
                label: '切换开发者工具',
                click() { BrowserWindow.getFocusedWindow().webContents.toggleDevTools(); }
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(template)

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
        // init_hosts()

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
        })

        mainWindow.webContents.on("will-navigate", (ev) => {
            ev.preventDefault();
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
        })

        mainWindow.webContents.on('will-navigate', (event, url) => {
            event.preventDefault()
            mainWindow.webContents.loadURL(url)
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
