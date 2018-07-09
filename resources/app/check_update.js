const process = require("process");
const get_json = require("./get_json")
const path = require('path');
const { dialog, shell } = require('electron')


var _platform = process.platform == "win32" ? "windows" : "linux";
var version = "1.0.1"/*当前版本号*/
var versionCheckApi = "https://raw.githubusercontent.com/Xmader/mohu/master/version.json"/*检查更新Api地址*/
var DownloadUrl = `https://xmader.oss-cn-shanghai.aliyuncs.com/mohu-${_platform}.zip`
var version_formatted = format_version(version)

var download_remote_version = function () {
    const url = "https://raw.githubusercontent.com/Xmader/hydrogen/windows/hydrogen-version.json"
    // const url = versionCheckApi

    const f = (data) => {
        var new_version = data["version"] // get_new_version
        var new_version_formatted = format_version(new_version)
        if (version_formatted < new_version_formatted) {
            dialog.showMessageBox({
                type: "question",
                buttons: ["下载", "取消"],
                defaultId: 0,
                cancelId: 1,
                title: `发现新版本${new_version}!`,
                message: "是否要下载新版本?",
                //detail:"",
                icon: path.join(__dirname, './logo.png'),
            }, (response, checkboxChecked) => {
                if (response == 0) {
                    shell.openExternal(DownloadUrl)
                }
            })
        }
    }
    get_json(url, f)
}


function format_version(e) {
    return e.split(".").map(function (e) { return e - 0 })
}

module.exports = download_remote_version

