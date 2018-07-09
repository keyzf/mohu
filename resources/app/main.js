const electron = require('electron');
const fs = require("fs");
const path = require('path');
const { init_hosts,main_host_is_existed } = require("./hosts")
const { check_update, manual_check_update } = require("./check_update")
const copy_current_url = require("./copy_current_url")

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
                enabled: false,
                click: () => {
                    mainWindow.webContents.goBack();

                }
            },
            {
                label: "转到下一页",
                id: "goForward",
                accelerator: "Ctrl+Right",
                enabled: false,
                click: () => {
                    mainWindow.webContents.goForward()

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
            // {
            //     label: "搜索",

            //     //accelerator: "F5",
            //     click: () => {
            //         mainWindow.webContents.findInPage("1");
            //     }
            // },
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
            // { type: 'separator' },//分割线
            {
                label: '切换开发者工具',
                accelerator: "F12",
                click() { mainWindow.webContents.toggleDevTools(); }
            },
        ]
    },
    {
        label: '分享',

        submenu: [
            {
                label: "复制当前网址",
                click: () => {
                    copy_current_url()
                }
            },

        ]
    },
    {
        label: '高级',
        submenu: [
            {
                label: '增加免番羽土啬hosts',
                click() { init_hosts() }
            },
            // { type: 'separator' },//分割线
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
const refresh_menu = () => {
    menu.getMenuItemById("goBack").enabled = mainWindow.webContents.canGoBack()
    menu.getMenuItemById("goForward").enabled = mainWindow.webContents.canGoForward()

}

//给文本框增加右键菜单
const contextMenuTemplate = [
    // {  label: "转到上一页",role: 'undo' }, //Undo菜单项
    // { role: 'redo' }, //Redo菜单项 
    // { type: 'separator' }, //分隔线 
    { label: "剪切", role: 'cut' }, //Cut菜单项 
    { label: "复制", role: 'copy' }, //Copy菜单项 
    { label: "粘贴", role: 'paste' }, //Paste菜单项 
    { label: "删除", role: 'delete' }, //Delete菜单项 
    { type: 'separator' }, //分隔线 
    { label: "全选", role: 'selectall' } //Select All菜单项 
];
const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);


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
        if(!main_host_is_existed()){
            init_hosts()
        }

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1100,
            height: 740,
            icon: path.join(__dirname, 'logo.png'),
            show: false,
            webPreferences: {
                nodeIntegration: false, // 不集成 Nodejs
                // webSecurity: false,//禁用同源策略
                // allowRunningInsecureContent:true//允许一个 https 页面运行 http url 里的资源
                preload: path.join(__dirname, 'pre.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
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

        mainWindow.webContents.once('did-finish-load', () => {
            if (!mainWindow) {
                throw new Error('"mainWindow" is not defined');
            }
            mainWindow.show();
            mainWindow.focus();
        });

        mainWindow.webContents.on('did-finish-load', () => {
            refresh_menu()

        });

        mainWindow.webContents.on('new-window', (event, url) => {
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

ipcMain.on("right_btn", () => {
    contextMenu.popup(mainWindow);
})
