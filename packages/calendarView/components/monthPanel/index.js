import VueComponent from '../../../common/component'
import { formatMonthTitle, getMonths, compareMonth, getTimeData } from '../../utils'
import { getType, debounce, isEqual } from '../../../common/util'

VueComponent({
  props: {
    type: String,
    value: {
      type: [null, Number, Array]
    },
    minDate: Number,
    maxDate: Number,
    firstDayOfWeek: Number,
    formatter: null,
    maxRange: Number,
    rangePrompt: String,
    allowSameDay: Boolean,
    showPanelTitle: Boolean,
    defaultTime: Array,
    panelHeight: Number,
    timeFilter: null,
    hideSecond: Boolean
  },
  data: {
    title: '',
    scrollIntoView: '',
    timeValue: [],
    timeData: [],
    timeType: ''
  },
  mounted () {
    this.initRect()
    this.scrollIntoView()
  },
  methods: {
    initRect (thresholds = [0, 0.15, 0.7, 0.8, 0.9, 1]) {
      if (!this.data.showPanelTitle) return

      if (this.contentObserver != null) {
        this.contentObserver.disconnect()
      }

      const contentObserver = this.createIntersectionObserver({
        thresholds,
        observeAll: true
      })

      this.contentObserver = contentObserver

      contentObserver.relativeTo('.wd-month-panel__container')
      contentObserver.observe('.month', (res) => {
        if (res.boundingClientRect.top <= res.relativeRect.top) {
          this.setData({
            title: formatMonthTitle(res.dataset.date)
          })
        }
      })
    },
    scrollIntoView () {
      this.requestAnimationFrame().then(() => {
        let activeDate
        const type = getType(this.data.value)
        if (type === 'array') {
          activeDate = this.data.value[0]
        } else if (type === 'number') {
          activeDate = this.data.value
        }

        if (!activeDate) {
          activeDate = Date.now()
        }

        const months = getMonths(this.data.minDate, this.data.maxDate)

        months.some((month, index) => {
          if (compareMonth(month, activeDate) === 0) {
            this.setData({
              scrollIntoView: `month${index}`
            })
            return true
          }

          return false
        })
      })
    },
    /**
     * 获取时间 picker 的数据
     * @param {timestamp|array} value 当前时间
     * @param {string} type 类型，是开始还是结束
     */
    getTimeData (value, type) {
      if (this.data.type === 'datetime') {
        return getTimeData({
          date: value,
          minDate: this.data.minDate,
          maxDate: this.data.maxDate,
          filter: this.data.timeFilter,
          isHideSecond: this.data.hideSecond
        })
      } else {
        if (type === 'start') {
          return getTimeData({
            date: value[0],
            minDate: this.data.minDate,
            maxDate: this.data.value[1] ? this.data.value[1] : this.data.maxDate,
            filter: this.data.timeFilter,
            isHideSecond: this.data.hideSecond
          })
        } else {
          return getTimeData({
            date: value[1],
            minDate: value[0],
            maxDate: this.data.maxDate,
            filter: this.data.timeFilter,
            isHideSecond: this.data.hideSecond
          })
        }
      }
    },
    /**
     * 获取 date 的时分秒
     * @param {timestamp} date 时间
     * @param {string} type 类型，是开始还是结束
     */
    getTimeValue (date, type) {
      if (this.data.type === 'datetime') {
        date = new Date(date)
      } else {
        if (type === 'start') {
          date = new Date(date[0])
        } else {
          date = new Date(date[1])
        }
      }

      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      return this.data.hideSecond ? [hour, minute] : [hour, minute, second]
    },
    handleDateChange ({ detail: { value, type } }) {
      if (!isEqual(value, this.data.value)) {
        this.setData({
          value
        })
        this.handleChange(value)
      }
      // datetime 和 datetimerange 类型，需要计算 timeData 并做展示
      if (this.data.type.indexOf('time') > -1) {
        this.setData({
          timeData: this.getTimeData(value, type),
          timeValue: this.getTimeValue(value, type),
          timeType: type
        })
      }
    },
    handleChange (value) {
      this.$emit('change', {
        value
      })
    },
    handleTimeChange (event) {
      const { value } = event.detail

      if (this.data.type === 'datetime') {
        const date = new Date(this.data.value)
        date.setHours(value[0])
        date.setMinutes(value[1])
        date.setSeconds(this.data.hideSecond ? 0 : value[2])
        const dateTime = date.getTime()

        this.setData({
          timeData: this.getTimeData(dateTime),
          timeValue: value
        })
        this.handleChange(dateTime)
      } else {
        const [start, end] = this.data.value
        const dataValue = this.data.timeType === 'start' ? start : end
        const date = new Date(dataValue)
        date.setHours(value[0])
        date.setMinutes(value[1])
        date.setSeconds(this.data.hideSecond ? 0 : value[2])
        const dateTime = date.getTime()

        if (dateTime === dataValue) return

        const finalValue = [start, end]
        if (this.data.timeType === 'start') {
          finalValue[0] = dateTime
        } else {
          finalValue[1] = dateTime
        }

        this.setData({
          timeData: this.getTimeData(finalValue, this.data.timeType),
          timeValue: value
        })

        this.handleChange(finalValue)
      }
    }
  },
  beforeCreate () {
    this.handleChange = debounce(this.handleChange, 50)
  }
})