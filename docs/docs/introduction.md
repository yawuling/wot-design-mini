## 介绍

该组件库基于小程序构建，根据京东商家侧的UI设计规范（京麦移动端设计规范）开发，旨在给商家提供统一的UI交互，同时提高研发的开发效率。

### 快速上手

请查看[快速上手](#/components/quickUse)文档。

### 扫码体验

<div style="display: inline-block; margin-right: 60px;">
  <img style="width: 150px; height: 150px;" :src="WxQrcode" />
  <div style="text-align: center;">微信扫码</div>
</div>

<div style="display: inline-block;">
  <img style="width: 150px; height: 150px;" :src="JmQrcode" />
  <div style="text-align: center;">京麦app扫码</div>
</div>

### 特性

* 50+ 组件
* 京东小程序和微信小程序2个版本

> 京东系app都可以使用，如京东app、京麦app、京东金融app

### 链接

* [意见反馈](https://github.com/jd-ftf/wot-design-mini/issues)
* [更新日志](#/components/changelog)
* [常见问题](#/components/commonProblems)

### 开源协议

本项目遵循 MIT 协议。

<script>
import WxQrcode from '../assets/img/wx.jpg'
import JmQrcode from '../assets/img/jm.jpg'

export default {
  data () {
    return {
      WxQrcode,
      JmQrcode
    }
  }
}
</script>