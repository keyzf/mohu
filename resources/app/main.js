const electron = require('electron');
const fs = require("fs");
const path = require('path');
const { init_hosts } = require("./hosts")

var { app, BrowserWindow, ipcMain } = electron;
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

const isDev = true
// const isDev = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

function createWindow() {
    locale = app.getLocale();
    landingWindow = new BrowserWindow({
        show: false,
        frame: isDev,
        icon: path.join(__dirname, 'assets/imgs/logo.png'),
        width: 490,
        height: 400
    })



    landingWindow.once("show", () => {
        init_hosts()

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1100,
            height: 740,
            titleBarStyle: isDev ? "show" : 'hidden',
            icon: path.join(__dirname, 'assets/imgs/logo.png'),
            show: false
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

        // and load the index.html of the app.
        mainWindow.loadURL(`file://${__dirname}/app.html`);

        const menuBuilder = new MenuBuilder(mainWindow);
        menuBuilder.buildMenu(locale);
    })

    landingWindow.loadURL(`file://${__dirname}/landing.html`)
    landingWindow.once('ready-to-show', () => {
        landingWindow.show()
    })
}

ipcMain.on("reload", () => {
    mainWindow.webContents.reloadIgnoringCache()
})
