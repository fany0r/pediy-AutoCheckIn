const axios = require('axios');
const PUSHPLUS = process.env.PUSHPLUS;
const COOKIE = process.env.COOKIE;

const checkCOOKIE = async () => {
    if (!COOKIE.length) {
        console.error('[!] 不存在 COOKIE ，请重新检查');
        return false;
    }

    const pairs = COOKIE.split(/\s*;\s*/);
    for (const pairStr of pairs) {
        if (!pairStr.includes('=')) {
            console.error(`[!] 存在不正确的 COOKIE ，请重新检查`);
            return false;
        }
    }
    return true;
}

const checkIn = async () => {
    const options = {
        method: 'post',
        url: `https://bbs.kanxue.com/user-signin.htm`,
        headers: {
            'User-Agent': 'HD1910(Android/7.1.2) (pediy.UNICFBC0DD/1.0.7) Weex/0.26.0 720x1280',
            'Cookie': COOKIE,
            'Connection': 'keep-alive',
            'Accept': '*/*'
        }
    };
    return axios(options).then(response => {
        //console.log('[*] Response Data:', response.data);
        const msg = response.data['message'];
        if (response.data.code == 0) {
            console.log(`[+] 🎉🎉🎉已完成签到，获得${msg}雪币`);
        } else if (msg == '您今日已签到成功'){
            console.warn(`[!] ❗ 亲，您今天已签到，无需重复签到哈~`);
        } else {
            console.error(`[!] 签到失败：${msg}`);
            process.exit(1); // 让 GitHub Actions 任务失败，触发Notify on failure
        }
    })
    .catch(error => {
        // 请求失败时的错误处理逻辑
        if (error.response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            console.error('Error Response:', error.response.data);
            console.error('Status Code:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // 请求已经成功发起，但没有收到响应
             console.error('No Response Received:', error.request);
        } else {
            // 发送请求时出了点问题
            console.error('Request Error:', error.message);
        }
          console.error('Request Config:', error.config);
    });
};

const sendMsg = async (msg, code) => {
    var token = PUSHPLUS;
    if (!token) {
        return;
    }
    if (code == 0){
        msg = `🎉🎉🎉签到成功，获得${msg}雪币`;
    }
    else{
        msg = `📢您已签到，无需重复签到`;
    }
    const data = {
        token,
        title: '看雪论坛签到',
        content: msg,
        template: 'json'
    };
    console.log('pushData', {
        ...data,
        token: data.token.replace(/^(.{1,4})(.*)(.{4,})$/, (_, a, b, c) => a + b.replace(/./g, '*') + c)
    });

    return axios({
        method: 'post',
        url: `http://www.pushplus.plus/send`,
        data
    }).catch((error) => {
        if (error.response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            console.warn(`[!] PUSHPLUS推送 请求失败，状态码：${error.response.status}`);
        } else if (error.request) {
            // 请求已经成功发起，但没有收到响应
            console.warn('[!] PUSHPLUS推送 网络错误');
        } else {
            // 发送请求时出了点问题
            console.log('[+] Axios Error', error.message);
        }
    });
};

const start = async () => {
    try {
        const checkCOOKIE_result = await checkCOOKIE();
        if (!checkCOOKIE_result) return;
        else {
            console.log('[+] COOKIE检查通过');
        }
        
        const checkIn_result = await checkIn();
        const message = checkIn_result?.data?.message;
        const code = checkIn_result?.data?.code;
        
        if (code == 0 || message == '您今日已签到成功') {
            if (PUSHPLUS.length) {
                const pushResult = (await sendMsg(message, code))?.data?.msg;
                console.log('[+] PUSHPLUS 推送结果', pushResult);
            } else {
                console.warn('[!] 不存在 PUSHPLUS ，停止推送消息');
            }
        }
    } catch (error) {
        console.error('catch error: ', error);
    }
}

start();
