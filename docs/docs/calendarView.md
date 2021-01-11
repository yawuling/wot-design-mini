## CalendarView 日历面板组件

提供日历单选、多选、范围选择、周纬度、月纬度等功能。可以根据实际业务场景基于该组件进行封装高度定制化组件。

### 引入

```json
{
  "usingComponents": {
    "wd-calendar-view": "/wot-design/calendarView/index"
  }
}
```

### 基本使用

`type` 默认为 `date` 类型，设置 `value` 绑定值（13位时间戳格式），监听 `bind:change` 事件获取选中值。`min-date` 最小日期默认为当前日期往前推 6 个月，`max-date` 最大日期默认为当前日期往后推 6 个月，日历面板的日期只展示最小日期到最大日期之间的日期事件。

> 小程序中这两个值尽量不要设置过大，避免大量数据的计算和传递导致页面性能低下。

```html
<wd-calendar-view value="{{ value }}" bind:change="handleChange" />
```

```javascript
Page({
  data: {
    value: Date.now()
  },
  handleChange (event) {
    this.setData({
      value: event.detail.value
    })
  }
})
```

### 日期多选

设置 `type` 为 `dates` 类型，此时 `value` 为数组。

```html
<wd-calendar-view type="dates" value="{{ value }}" bind:change="handleChange" />
```

```javascript
Page({
  data: {
    value: []
  },
  handleChange (event) {
    this.setData({
      value: event.detail.value
    })
  }
})
```

### 周类型选择

设置 `type` 为 `week` 类型，此时 `value` 有值时其值为周的第一天（周日）。

```html
<wd-calendar-view type="week" value="{{ value }}" bind:change="handleChange" />
```

```javascript
Page({
  data: {
    value: Date.now()
  },
  handleChange (event) {
    this.setData({
      value: event.detail.value
    })
  }
})
```

### 月类型选择

设置 `type` 为 `month` 类型，此时 `value` 有值时其值为月的第一天。

```html
<wd-calendar-view type="month" value="{{ value }}" bind:change="handleChange" />
```

```javascript
Page({
  data: {
    value: Date.now()
  },
  handleChange (event) {
    this.setData({
      value: event.detail.value
    })
  }
})
```

### 范围选择

`type` 支持 `daterange`（日期范围选择）、`weekrange`（周范围选择）、`monthrange`（月范围选择） 类型，此时 `value` 为数组格式。

```html
<wd-calendar-view type="daterange" value="{{ value }}" bind:change="handleChange" />
```

```javascript
Page({
  data: {
    value: []
  },
  handleChange (event) {
    this.setData({
      value: event.detail.value
    })
  }
})
```

### 范围选择允许选中同一日期

设置 `allow-same-day` 属性，范围选择允许用户选择同一天、同一周、同一个月。

```html
<wd-calendar-view type="daterange" value="{{ value }}" allow-same-day bind:change="handleChange" />
```

### 格式化日期

设置 `formatter` 参数，其值为函数类型，接收一个 `object` 参数，返回一个对象，对象的属性保持跟入参的属性一致，其属性如下：

| 属性      | 类型 | 说明                                 |
|---------- |---- |---------- |
| type | string | 日期类型，'selected' - 单日期选中，'start' - 范围开始日期，'end' - 范围结束日期，'middle' - 范围开始与结束之间的日期，'same' - 范围开始与结束日期同一天 ｜
| date | timestamp | 13位的时间戳 |
| text | string | 日期文本内容 |
| topInfo | string | 上方提示信息 |
| bottomInfo | string | 下方提示信息 |
| disabled | boolean | 是否禁用 |

```html
<wd-calendar-view type="daterange" value="{{ value }}" allow-same-day formatter="{{ formatter }}" bind:change="handleChange" >
```

```javascript
Page({
  data: {
    value: [],
    formatter: function (day) {
      const date = new Date(day.date)
      const now = new Date()

      const year = date.getFullYear()
      const month = date.getMonth()
      const da = date.getDate()
      const nowYear = now.getFullYear()
      const nowMonth = now.getMonth()
      const nowDa = now.getDate()

      if (year === nowYear && month === nowMonth && da === nowDa) {
        day.topInfo = '今天'
      }

      if (month === 5 && da === 18) {
        day.topInfo = '618大促'
      }

      if (month === 10 && da === 11) {
        day.topInfo = '京东双11'
      }

      if (day.type === 'start') {
        day.bottomInfo = '开始'
      }

      if (day.type === 'end') {
        day.bottomInfo = '结束'
      }

      if (day.type === 'same') {
        day.bottomInfo = '开始/结束'
      }

      return day
    }
  },
  handleChange (event) {
    this.setData({
      value: event.detail.value
    })
  }
})
```

### 最大范围限制

设置 `maxRange` 属性，设置范围选择的最大限制。

```html
<wd-calendar-view type="daterange" max-range="{{ 3 }}" />
```

### 展示面板标题

`show-panel-title` 默认为 `true`，会自动计算标题并进行展示，可以选择不进行展示。

```html
<wd-calendar-view type="daterange" show-panel-title="{{ false }}" />
```


