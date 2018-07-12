# Mohu App

[English](https://github.com/Xmader/mohu/blob/master/README.md) | [中文](https://github.com/Xmader/mohu/blob/master/README_zh.md)

一个simple的膜乎免 番羽土啬 Windows & Linux APP

[![+1s](https://img.shields.io/badge/%CE%98..%CE%98-%2B1s-green.svg)](https://zh.wikipedia.org/wiki/%E8%86%9C%E8%9B%A4%E6%96%87%E5%8C%96)

## 功能

* 自动添加hosts, 免 番羽土啬 浏览膜乎

* 内置三个镆铪/乳苞小游戏:

    * Flappy Winnie
    * Flappy Frog
    * 切包子

* 自动检查更新

## 下载

你可以下载源码自行构建, 或者直接在下面下载构建好的可执行版本:

[Windows 32位版](https://mohu.oss-cn-shanghai.aliyuncs.com/MohuAPP-win32-ia32.zip)

[Windows 64位版](https://mohu.oss-cn-shanghai.aliyuncs.com/MohuAPP-win32-x64.zip)

[Linux 64位版](https://mohu.oss-cn-shanghai.aliyuncs.com/MohuAPP-linux-x64.zip)

## 构建

> 如果您下载的是构建好的版本, 您可以直接跳过泽一步

```bash
cd ./resources/app

electron-packager . MohuAPP   --out ../../OutApp/ --electron-version 2.0.4 --overwrite --icon=./logo.ico --tmpdir=../../OutApp/Temp/ --ignore=packager.sh
```

## 运行

1. 解压全部文件
2. 找到 `MohuAPP.exe`(Windows) 或 `MohuAPP`(Linux)，双击运行

## 备注

* 本项目的开发周期总计只有一天，时间有一些仓促，希望大家多多包涵

* 如果有bug，请在[这里](https://github.com/Xmader/mohu/issues)向我反馈

## 特别感谢

> 本项目在开发过程中参考了以下项目或用户的部分源代码

* [Hydrogen](https://github.com/Xmader/hydrogen/tree/linux) (参考了其landing页面)

* [@hahaxixi](https://github.com/hahaxixi) (本项目内置了他的三个小游戏)

* [SwitchHosts!](https://github.com/oldj/SwitchHosts) (参考了其关于修改hosts文件的部分代码)


## 开源许可证

本软件是一个完全免费的开源软件, 基于 MIT 协议开源。

> 很惭愧，就做了一点微小的工作，谢谢大家
