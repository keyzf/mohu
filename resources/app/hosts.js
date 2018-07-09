const process = require("process");
const fs = require("fs");
const path = require('path');
const platform = process.platform;

// Windows 系统有可能不安装在 C 盘
const sys_hosts_path = platform === 'win32' ? `${process.env.windir || 'C:\\WINDOWS'}\\system32\\drivers\\etc\\hosts` : '/etc/hosts'
const home_path = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const work_path = path.join(home_path, '.Mohu')

const host = "104.27.146.57 mohu.club"

const host_is_existed = (data) => {
    var i = data.indexOf(host);
    return i >= 0;
}

const get_sudo_pswd = () =>{

}

const add_host = () => {
    fs.writeFile(sys_hosts_path, "\n" + host + "\n", { flag: "a" }, (err) => {
        if (err) {
            throw err
        }
        else{
            console.log("添加hosts成功!")
        }

    })
}

const init_hosts = () => {
    fs.readFile(sys_hosts_path, "utf-8", (err, data) => {
        if (err) {
            throw err;
        } else {
            if (!host_is_existed(data)) {
                add_host()
            } else {
                console.log("hosts已存在")
            }
        }

    })
};

module.exports = {
    init_hosts: init_hosts,
}
