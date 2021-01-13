import VueComponent from '../../../common/component'
import { formatMonthTitle, getMonths, compareMonth, getTimeData, compareDate } from '../../utils'
import { getType, debounce } from '../../../common/util'

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
    panelHeight: Number
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
    getTimeData (value, type) {
      if (this.data.type === 'datetime') {
        return getTimeData(value, this.data.minDate, this.data.maxDate)
      } else {
        if (type === 'start') {
          return getTimeData(this.data.minDate, this.data.value[1] ? this.data.value[1] : this.data.minDate)
        } else {
          return getTimeData(this.data.value[0], this.data.maxDate)
        }
      }
    },
    getTimeValue (date, type) {
      if (this.data.type === 'datetime') {
        if (compareDate(date, this.data.minDate) === 0) {
          const minDate = new Date(this.data.minDate)
          return [minDate.getHours(), minDate.getMinutes(), minDate.getSeconds()]
        } else if (this.data.defaultTime.length) {
          const [startTime] = this.data.defaultTime
          return startTime
        } else {
          return []
        }
      } else {
        const [start, end] = date
        if (type === 'start') {
          if (compareDate(start, this.data.minDate) === 0) {
            const minDate = new Date(this.data.minDate)
            return [minDate.getHours(), minDate.getMinutes(), minDate.getSeconds()]
          } else if (this.data.defaultTime.length) {
            const [startTime] = this.data.defaultTime
            return startTime
          } else {
            return []
          }
        } else {
          if (compareDate(end, start) === 0) {
            const minDate = new Date(start)
            return [minDate.getHours(), minDate.getMinutes(), minDate.getSeconds()]
          } else if (compareDate(end, this.data.maxDate) === 0) {
            const maxDate = new Date(this.data.maxDate)
            return [maxDate.getHours(), maxDate.getMinutes(), maxDate.getSeconds()]
          } else if (this.data.defaultTime.length) {
            return this.data.defaultTime[1]
          } else {
            return []
          }
        }
      }
    },
    handleDateChange ({ detail: { value, type } }) {
      this.setData({
        value
      })
      this.handleChange(value)
      // datetime 和 datetimerange 类型，需要计算 timeData 并做展示
      if (this.data.type.indexOf('time') > -1) {
        this.setData({
          timeData: this.getTimeData(value),
          timeValue: this.getTimeValue(value, type),
          timeType: type
        })
      }
    },
    handleChange (value) {
      // console.log(new Date(value))
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
        date.setSeconds(value[2])
        const dateTime = date.getTime()

        this.setData({
          timeData: this.getTimeData(dateTime),
          timeValue: value
        })
        console.log(value)
        console.log(new Date(dateTime))
        this.handleChange(dateTime)
      } else {
        const [start, end] = this.data.value
        const dataValue = this.data.timeType === 'start' ? start : end
        const date = new Date(dataValue)
        date.setHours(value[0])
        date.setMinutes(value[1])
        date.setSeconds(value[2])
        const dateTime = date.getTime()

        if (dateTime === dataValue) return

        const finalValue = [start, end]
        if (this.data.timeType === 'start') {
          finalValue[0] = dateTime
        } else {
          finalValue[1] = dateTime
        }

        this.setData({
          timeData: this.getTimeData(dateTime),
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