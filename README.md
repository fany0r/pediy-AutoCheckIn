<p align="center">
    <h1 align="center">pediyCheckIn</h1>
</p>
  <p align="center">基于GitHub Actions的看雪论坛自动签到</del></p>


## 使用方法
### 获取看雪COOKIE
登录[看雪论坛](https://bbs.pediy.com/)，按`F12`打开控制台，点击网络(network)，点击Fetch/XHR(XHR)，再点击签到赚雪币，点击user-signin.htm，找到请求头(Request Header)中的Cookie，将后面的值复制下来保存好。![获取cookie](./imgs/pediy_cookie.jpg)

### 仓库配置

首先点击右上角的fork，fork此仓库，配置随便填。接下来在你fork下来的仓库中进行操作。

#### 设置密钥

![配置密钥](./imgs/secrets.png)

+ 配置看雪COOKIE
  `Name`填写: `COOKIE`
  `Value`处，将刚才在看雪论坛获取的COOKIE粘贴进去
  点击`Add secret`
  ![1](./imgs/secret1.png)

### 修改定时

1. 打开 `.github/workflows/checkin.yml`
2. 找到`cron`，修改 crontab表达式，可以参考[此处](https://crontab.guru/)。GitHub Actions用的是UTC时间，另外还有延迟，建议自己再试一下。

## 手动运行尝试

1. 点击`Actions`→`I understand my workflows, go ahead and enable them`
2. 点击`PEDIY-CheckIn`，再依次点击图中灰色和绿色的`run workflow`
   ![run](./imgs/actions.png)

等右边的加载圈圈变成绿色勾勾，证明工作流正常，可以点进去看详细信息。

## 作者
[@BeaCox](https://github.com/BeaCox)

