/**
 * 组件用法
 *   属性                    说明                        类型            可选值             默认值
 *   show                   是否展示                     boolean         -                false
 *   showBill               是否展示账单                  boolean         -                false
 *   billType               账单类型，’bill‘ 账单日期，    string          ’arrive'         'bill'
 *                          'arrive' 到账日期
 *   showShortcut           是否展示快捷方式               boolean         -                fasle
 *   dateType               快捷类型，'3' 近3天，'7' 近    string          '3', '7', '30'   'custom'
 *                          7天，'30' 近30天，'custom'
 *                          自由选择
 *   value                  dateType为'custom'时自由选    array           -                -
 *                          择面板的选中值，为2个13位时间戳
 *   close-on-click-modal   是否点击蒙层可关闭             boolean         -                 true
 *   formatter              格式化日期展示                function        -                 -
 *   default-time           日期时间                     array           -                 ['00:00:00', '00:00:00']
 *   first-day-of-week      周起始天                     number          -                 7
 *   min-date               最小时间，13位时间戳           number          -                 当前日期往前推6个月
 *   max-date               最大时间，13位时间戳           number          -                 当前日期往后推6个月
 *
 *
 *  事件                      说明                       参数
 *  bind:confirm             点击确定按钮触发              event.detail = { show, billType, dateType, value }
 *  bind:close               点击蒙层或者关闭按钮时触发     -
 *  bind:billTypechange      切换 tabs 时触发             event.detail = { billType }
 *  bind:datetypechange      切换日期选项时触发            event.detail = { dateType }
 *  bind:select              点击日期时触发               event.detail = { value }
 *
 *  一般只需要用到 bind:confirm 事件即可。
 *
 *  <calendar show="{{ show }}" show-bill show-shortcut bill-type="{{ billType }}" date-type="{{ dateType }}" value="{{ value }}" bind:confirm="handleConfirm" />
 *
 *  Page({
 *    data: {
 *      show: false,
 *      billType: 'bill',
 *      dateType: 'custom',
 *      value: []
 *    },
 *    handleConfirm (event) {
 *      const { show, billType, dateType, value } = event.detail
 *      this.setData({
 *        show,
 *        billType,
 *        dateType,
 *        value
 *      })
 *    }
 *  })
 */
const current = new Date()
const currentYear = current.getFullYear()
const currentMonth = current.getMonth()
const currentDay = current.getDate()

Component({
  properties: {
    type: {
      type: String,
      value: 'daterange'
    },
    show: {
      type: Boolean,
      observer (val) {
        if (val) {
          // 记录原来的值，如果用户没点击确定按钮，则将数据还原
          const { billType, dateType, value } = this.data
          this.setData({
            lastbillType: billType,
            lastDateType: dateType,
            lastValue: value.slice(0)
          })
          // 延迟更新tab的下划线，以及 calendarView 滚动到当前日期或者选中的日期
          setTimeout(() => {
            if (this.data.showBill) {
              const tabs = this.selectComponent('#tabs')
              tabs.updateLineStyle(false)
            }
            const calendarView = this.selectComponent('#calendar-view')
            calendarView.scrollIntoView()
          }, 200)
        }
      }
    },
    showBill: Boolean,
    billType: {
      type: String,
      value: 'bill'
    },
    showShortcut: Boolean,
    dateType: {
      type: String,
      value: 'custom',
      observer: 'setBtnDisabled'
    },
    minDate: {
      type: Number,
      value: new Date(currentYear, currentMonth - 6, currentDay).getTime()
    },
    maxDate: {
      type: Number,
      value: new Date(currentYear, currentMonth + 6, currentDay, 23, 59, 59).getTime()
    },
    value: {
      type: [null, Number, Array],
      observer (val) {
        if (this.data.dateType === 'custom') {
          this.setData({
            innerValue: val
          })
          this.setBtnDisabled()
        } else {
          this.setData({
            innerValue: []
          })
          this.setBtnDisabled()
        }
      }
    },
    closeOnClickModal: {
      type: Boolean,
      value: true
    },
    formatter: null,
    defaultTime: {
      type: [String, Array],
      observer (val) {
        this.setData({
          formatDefauleTime: this.getDefaultTime(val)
        })
      }
    },
    firstDayOfWeek: {
      type: Number,
      value: 7
    }
  },
  data: {
    innerValue: [],
    lastbillType: '',
    lastDateType: '',
    lastValue: '',
    btnDisabled: true,
    formatDefauleTime: []
  },
  methods: {
    // 设置按钮禁用，只有 dateType 为 custom 且其值不完整时禁用
    setBtnDisabled () {
      const rangeDisabled = this.data.type.indexOf('range') > -1 &&
        (!this.data.innerValue || !this.data.innerValue.length || !this.data.innerValue[0] || !this.data.innerValue[1])
      const singleDisabled = this.data.type.indexOf('range') === -1 && !this.data.innerValue

      this.setData({
        btnDisabled: this.data.dateType === 'custom' && (rangeDisabled || singleDisabled)
      })
    },
    handleClose () {
      this.setData({
        show: false
      })
      this.triggerEvent('close')
      setTimeout(() => {
        // 未点击确定就关闭，还原为原来的值
        const { lastbillType, lastDateType, lastValue } = this.data
        this.setData({
          billType: lastbillType,
          dateType: lastDateType,
          value: lastValue
        })
      }, 250)
    },
    handleBillTypeChange ({ detail: { name } }) {
      this.setData({
        billType: name
      })
      this.triggerEvent('billtypechange', {
        billType: name
      })
    },
    handleShortcutChange ({ detail: { value } }) {
      this.setData({
        dateType: value,
        innerValue: []
      })
      this.triggerEvent('datetypechange', {
        dateType: value
      })
      this.setBtnDisabled()
    },
    handleCalendarChange ({ detail: { value } }) {
      if (this.data.dateType !== 'custom') {
        this.setData({
          dateType: 'custom'
        })
        this.triggerEvent('datetypechange', {
          dateType: 'custom'
        })
      }
      this.setData({
        innerValue: value
      })
      this.triggerEvent('select', {
        value
      })
      this.setBtnDisabled()
    },
    // 获取完整的 defaultTime
    getDefaultTime (defaultTime) {
      if (defaultTime instanceof Array) {
        const startTime = (defaultTime[0] || '00:00:00').split(':').map(item => {
          return parseInt(item)
        })
        const endTime = (defaultTime[1] || '00:00:00').split(':').map(item => {
          return parseInt(item)
        })
        return [startTime, endTime]
      } else {
        const time = (defaultTime || '00:00:00').split(':').map(item => {
          return parseInt(item)
        })

        return [time, time]
      }
    },
    // 根据 defaultTime 获取时间
    getDateByDefaultTime (date, isEnd) {
      if (!this.data.formatDefauleTime || !this.data.formatDefauleTime.length) return date

      const [startTime, endTime] = this.data.formatDefauleTime || []
      date = new Date(date)
      const time = isEnd ? endTime : startTime
      date.setHours(time[0])
      date.setMinutes(time[1])
      date.setSeconds(time[2])

      return date.getTime()
    },
    handleConfirm () {
      this.setData({
        show: false
      })
      const { billType, dateType } = this.data

      let value = this.data.innerValue

      // 计算近3天、近7天、近30天的开始结束时间
      if (dateType !== 'custom') {
        let end = Date.now() - 24 * 60 * 60 * 1000
        end = this.getDateByDefaultTime(end, true)

        let start = Date.now() - 24 * 60 * 60 * 1000 * parseInt(dateType)
        start = this.getDateByDefaultTime(start)
        value = [start, end]
      }

      this.triggerEvent('confirm', {
        show: false,
        billType: billType,
        dateType: dateType,
        value
      })
    }
  }
})