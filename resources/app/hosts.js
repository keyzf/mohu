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

const main_host_is_existed = () => {
    data = fs.readFileSync(sys_hosts_path, "utf-8")
    var i = data.indexOf(host);
    return i >= 0;
}

const get_sudo_pswd = () => {

}

const add_host = () => {
    fs.writeFile(sys_hosts_path, "\n" + host + "\n", { flag: "a" }, (err) => {
        if (err) {
            console.log(err)
            let msg = err.message
            if (platform === 'win32') {
                const msg2 = `请尝试 进入${path.dirname(sys_hosts_path)}文件夹, 右键hosts属性-安全-高级-权限-添加-选择主体-高级-立即查找-找到你现在的账户-勾选完全控制-一路确定即可添加对hosts文件的修改权限`
                msg = `${msg}\n\n请以管理员身份运行本程序`
                dialog.showMessageBox({
                    type: "error",
                    buttons: ["尝试自动获取权限", "取消"],
                    defaultId: 0,
                    cancelId: 1,
                    title: "添加hosts失败!",
                    message: msg,
                }, (response, checkboxChecked) => {
                    if (response == 0) {
                        var subpy = require('child_process').spawn(path.join(__dirname, 'auto_uac_add_hosts.exe'), [], { windowsHide: true });

                        subpy.on('close', (code) => {
                            if (code == 0) {
                                dialog.showMessageBox({
                                    type: "info",
                                    buttons: ["确定"],
                                    defaultId: 0,
                                    title: "添加hosts成功!",
                                    message: `您现在可以正常地免 番羽土啬 访问膜乎!`,
                                })
                            }
                            else {
                                dialog.showMessageBox({
                                    type: "error",
                                    buttons: ["确定"],
                                    defaultId: 0,
                                    title: "尝试自动获取权限添加hosts失败",
                                    message: msg2,
                                })
                            }
                        });
                    }
                })
            }
            else {
                msg = `${msg}\n\n请使用sudo或使用root身份运行本程序`
                console.log(msg)
                dialog.showMessageBox({
                    type: "error",
                    buttons: ["确定"],
                    defaultId: 0,
                    title: "添加hosts失败!",
                    message: msg,
                })
            }
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
                    BrowserWindow.fromId(2).webContents.reload();
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
