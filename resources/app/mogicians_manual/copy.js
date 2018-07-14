const { clipboard } = require('electron')
const {dialog} = require('electron').remote

const path = require("path")

const copy = () => {
    var text = $("#m_unformatted_body").text()
    console.log(text)
    clipboard.writeText(text)

    dialog.showMessageBox({
        type: "info",
        buttons: ["确定"],
        defaultId: 0,
        title: `复制成功!`,
        message: `我感觉你们还要削习一个`,
        icon: path.join(__dirname,"../../app/mogicians_manual/icon.png")
    })
}
