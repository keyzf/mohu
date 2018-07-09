const process = require("process");
const fs = require("fs");
const path = require('path');
const platform = process.platform;
const { dialog, shell, BrowserWindow } = require('electron')

// Windows 系统有可能不安装在 C 盘
const sys_hosts_path = platform === 'win32' ? `${process.env.windir || 'C:\\WINDOWS'}\\system32\\drivers\\etc\\hosts` : '/etc/hosts'
const home_path = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const work_path = path.join(home_path, '.Mohu')

const host = "104.27.146.57 www.mohu.club"

const host_is_existed = (data) => {
    var i = data.indexOf(host);
    return i >= 0;
}

const main_host_is_existed = () =>{
    data = fs.readFileSync(sys_hosts_path, "utf-8")
    var i = data.indexOf(host);
    return i >= 0;
}

const get_sudo_pswd = () => {

}

const add_host = () => {
    fs.writeFile(sys_hosts_path, "\n" + host + "\n", { flag: "a" }, (err) => {
        if (err) {
            throw err
        }
        else {
            dialog.showMessageBox({
                type: "info",
                buttons: ["确定"],
                defaultId: 0,
                title: "添加hosts成功!",
                message: `'${host}' 已被添加到您的hosts文件中 `,
            }, (response, checkboxChecked) => {
                if (response == 0) {
                    BrowserWindow.getFocusedWindow().webContents.reload();
                }
            })
        }

    })
}

const ok = () => {
    fs.readFile(sys_hosts_path, "utf-8", (err, data) => {
        if (err) {
            throw err;
        } else {
            if (!host_is_existed(data)) {
                add_host()
            } else {
                dialog.showMessageBox({
                    type: "warning",
                    buttons: ["确定"],
                    defaultId: 0,
                    title: `hosts已存在`,
                    message: `'${host}' 已存在于您的hosts文件中 `,
                })
            }
        }

    })
}

const init_hosts = () => {
    dialog.showMessageBox({
        type: "question",
        buttons: ["确定", "取消"],
        defaultId: 0,
        cancelId: 1,
        title: `增加hosts`,
        message: "是否要增加hosts以实现免 番羽土啬 访问膜乎?",
        detail: `'${host}' 将会被添加到您的hosts文件中 `,
    }, (response, checkboxChecked) => {
        if (response == 0) {
            ok()
        }
    })



};

module.exports = {
    init_hosts: init_hosts,
    main_host_is_existed: main_host_is_existed,
}
