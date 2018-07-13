const getArgs = () => {
    var args = {};
    var match = null;
    var search = decodeURIComponent(location.search.substring(1));
    var reg = /(?:([^&]+)=([^&]+))/g;
    while ((match = reg.exec(search)) !== null) {
        args[match[1]] = match[2];
    }
    return args;
}

var t = getArgs()["type"] || "shuo"

var link = $("#" + t)
link.addClass('active');

var json
$.get("https://mohu.oss-cn-shanghai.aliyuncs.com/" + t + ".json", (data) => {
    keys = _.keys(data)
    var card_deck = $("#card-deck")

    for (var i=0; i <keys.length; i++) {
        var key = keys[i]
        var items = data[key]["titles"]
        var item_html = ""


        for (var a=0; a < items.length; a++) {
            item_html += `<li class="list-group-item"><a>${items[a]}</a></li>`
        }

        var html = `
    <div class="card">
        <h5 class="card-header">${key}</h5>
        <ul class="list-group list-group-flush">
            ${item_html}
        </ul>
    </div>`;
        card_deck.append(html);
    }




})
