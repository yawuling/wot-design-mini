import VueComponent from '../../../common/component'
import { compareDate, getMonthEndDay, getWeekRange, getDayOffset, getDayByOffset } from '../../utils'
import { getType } from '../../../common/util'
import Toast from '../../../toast/toast.js'

VueComponent({
  data: {
    days: [],
    value: []
  },
  props: {
    type: {
      type: String,
      observer: 'setDays'
    },
    date: {
      type: Number,
      observer: 'setDays'
    },
    value: {
      type: [null, Number, Array],
      observer: 'setDays'
    },
    minDate: {
      type: Number,
      observer: 'setDays'
    },
    maxDate: {
      type: Number,
      observer: 'setDays'
    },
    firstDayOfWeek: Number,
    formatter: {
      type: null,
      observer: 'setDays'
    },
    maxRange: Number,
    rangePrompt: String,
    allowSameDay: Boolean
  },
  methods: {
    setDays () {
      const days = []
      const date = new Date(this.data.date)
      const year = date.getFullYear()
      const month = date.getMonth()

      const totalDay = getMonthEndDay(year, month + 1)

      let value = this.data.value

      if ((this.data.type === 'week' || this.data.type === 'weekrange') && value) {
        value = this.getWeekValue()
      }

      for (let day = 1; day <= totalDay; day++) {
        const date = new Date(year, month, day).getTime()
        let type = this.getDayType(date, value)
        if ((type.length === 0) && compareDate(date, Date.now()) === 0) {
          type = ['is-current']
        }
        let dayObj = {
          date: date,
          text: day,
          bottomInfo: '',
          type,
          disabled: compareDate(date, this.data.minDate) === -1 || compareDate(date, this.data.maxDate) === 1
        }
        if (this.data.formatter) {
          if (getType(this.data.formatter) === 'function') {
            dayObj = this.data.formatter(dayObj)
          } else {
            console.error('[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function')
          }
        }
        days.push(dayObj)
      }

      this.setData({
        days
      })
    },
    getDayType (date, value) {
      switch (this.data.type) {
      case 'date':
        return this.getDateType(date)
      case 'dates':
        return this.getDatesType(date)
      case 'daterange':
        return this.getRangeType(date, value)
      case 'week':
        return this.getRangeType(date, value)
      case 'weekrange':
        return this.getRangeType(date, value)
      default:
        return this.getDateType(date)
      }
    },
    getDateType (date) {
      if (this.data.value && compareDate(date, this.data.value) === 0) {
        return ['is-selected']
      } else {
        return []
      }
    },
    getDatesType (date) {
      if (!this.data.value) return []

      let type = []

      this.data.value.some((item) => {
        if (compareDate(date, item) === 0) {
          type = ['is-selected']

          return true
        }

        return false
      })

      return type
    },
    getRangeType (date, value) {
      const [startDate, endDate] = value || []

      if (startDate && compareDate(date, startDate) === 0) {
        const type = ['is-start']

        if (!endDate || startDate === endDate) {
          type.push('is-without-end')
        }

        return type
      } else if (endDate && compareDate(date, endDate) === 0) {
        return ['is-end']
      } else if (startDate && endDate && compareDate(date, startDate) === 1 && compareDate(date, endDate) === -1) {
        return ['is-middle']
      } else {
        return []
      }
    },
    getWeekValue () {
      if (this.data.type === 'week') {
        return getWeekRange(this.data.value)
      } else {
        const [startDate, endDate] = this.data.value || []

        if (startDate) {
          const firstWeekRange = getWeekRange(startDate)

          if (endDate) {
            const endWeekRange = getWeekRange(endDate)

            return [firstWeekRange[0], endWeekRange[1]]
          } else {
            return firstWeekRange
          }
        }

        return []
      }
    },
    handleDateClick (event) {
      const { index } = event.currentTarget.dataset
      const date = this.data.days[index]

      switch (this.data.type) {
      case 'date':
        this.handleDateChange(date)
        break
      case 'dates':
        this.handleDatesChange(date)
        break
      case 'daterange':
        this.handleDateRangeChange(date)
        break
      case 'week':
        this.handleWeekChange(date)
        break
      case 'weekrange':
        this.handleWeekRangeChange(date)
        break
      default:
        this.handleDateChange(date)
      }
    },
    handleDateChange (date) {
      if (date.disabled) return

      if (date.type.indexOf('is-selected') === -1) {
        this.$emit('change', {
          value: date.date
        })
      }
    },
    handleDatesChange (date) {
      if (date.disabled) return

      const value = this.data.value || []
      if (date.type.indexOf('is-selected') === -1) {
        value.push(date.date)
      } else {
        value.splice(value.indexOf(date.date), 1)
      }
      this.$emit('change', {
        value
      })
    },
    handleDateRangeChange (date) {
      if (date.disabled) return

      let value
      const [startDate, endDate] = this.data.value || []
      const compare = compareDate(date.date, startDate)

      // 禁止选择同个日期
      if (!this.data.allowSameDay && compare === 0) return

      if (startDate && !endDate && compare > -1) {
        // 不能选择超过最大范围的日期
        if (this.data.maxRange && getDayOffset(date.date, startDate) > this.data.maxRange) {
          const maxEndDate = getDayByOffset(startDate, this.data.maxRange - 1)
          value = [startDate, maxEndDate]
          Toast({
            msg: this.data.rangePrompt || `选择天数不能超过${this.data.maxRange}天`,
            context: this
          })
        } else {
          value = [startDate, date.date]
        }
      } else {
        value = [date.date, null]
      }
      this.$emit('change', {
        value
      })
    },
    handleWeekChange (date) {
      if (date.type && (date.type.indexOf('is-selected') > -1 || date.type.indexOf('is-middle') > -1)) return

      const [weekStart] = getWeekRange(date.date)

      // 周的第一天如果是禁用状态，则不可选中
      if (this.getFormatterDate(weekStart).disabled) return

      this.$emit('change', {
        value: weekStart
      })
    },
    handleWeekRangeChange (date) {
      const [weekStartDate] = getWeekRange(date.date)

      // 周的第一天如果是禁用状态，则不可选中
      if (this.getFormatterDate(weekStartDate).disabled) return

      let value
      const [startDate, endDate] = this.data.value || []
      const [startWeekStartDate] = startDate ? getWeekRange(startDate) : []

      if (startDate && !endDate && compareDate(weekStartDate, startWeekStartDate) > -1) {
        value = [startWeekStartDate, weekStartDate]
      } else {
        value = [weekStartDate, null]
      }

      this.$emit('change', {
        value
      })
    },
    getFormatterDate (date) {
      let dayObj = {
        date: date,
        text: new Date(date).getDate(),
        bottomInfo: '',
        type: [],
        disabled: compareDate(date, this.data.minDate) === -1 || compareDate(date, this.data.maxDate) === 1
      }
      if (this.data.formatter) {
        if (getType(this.data.formatter) === 'function') {
          dayObj = this.data.formatter(dayObj)
        } else {
          console.error('[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function')
        }
      }

      return dayObj
    }
  }
})