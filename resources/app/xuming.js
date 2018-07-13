const https = require('https');

const formatTime = (t) => {
    if (t == 0) return "0s"
    ret = ""
    if (t > 60 * 60 * 24 * 30 * 12) {
        ret += Math.floor(t / (60 * 60 * 24 * 30 * 12)) + "y "
        t = t % (60 * 60 * 24 * 30 * 12)
    }

    if (t > 60 * 60 * 24 * 30) {
        ret += Math.floor(t / (60 * 60 * 24 * 30)) + "mo "
        t = t % (60 * 60 * 24 * 30)
    }

    if (t > 60 * 60 * 24) {
        ret += Math.floor(t / (60 * 60 * 24)) + "d "
        t = t % (60 * 60 * 24)
    }

    if (t > 60 * 60) {
        ret += Math.floor(t / (60 * 60)) + "h "
        t = t % (60 * 60)
    }

    if (t > 60) {
        ret += Math.floor(t / (60)) + "m "
        t = t % (60)
    }

    if (t > 0) {
        ret += Math.floor(t) + "s"
        t = 0
    }

    return ret.trim()
}

const get_increased_time = () => { // 获取已续命时间 单位:秒
    if ($) {
        $.get("https://angry.im/l/life", function (data) {
            document.getElementById("time").innerText = formatTime(parseInt(data))
        })
    }
    else {
        https.get("https://angry.im/l/life", (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            if (statusCode !== 200) {
                throw new Error('请求失败。' + `状态码: ${statusCode}`);
            }
            else {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    document.getElementById("time").innerText = formatTime(parseInt(rawData))
                });

            }
        })
    }
}

const increase_time = () => {

    if ($) {
        $.post("https://angry.im/p/life", function (data) {
            time = formatTime(parseInt(data))
            document.getElementById("time").innerText = time
        })
    }
    else {
        https.request({ hostname: 'angry.im', path: '/p/life', method: 'POST' }, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            if (statusCode !== 200) {
                throw new Error('请求失败。' + `状态码: ${statusCode}`);
            }
            else {
                time = formatTime(parseInt(data))
                document.getElementById("time").innerText = time
                console.log("+1s成功!")
            }
        })
    }
}

setInterval(get_increased_time, 1000)
get_increased_time()




