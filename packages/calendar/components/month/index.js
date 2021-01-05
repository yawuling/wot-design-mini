import VueComponent from '../../../common/component'
import { compareDate, getMonthEndDay, getWeekRange } from '../../utils'

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
    }
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
        if (!type && compareDate(date, Date.now()) === 0) {
          type = ['is-today']
        }
        days.push({
          date: date,
          text: day,
          topInfo: '',
          bottomInfo: '',
          type,
          disabled: false
        })
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
      if (compareDate(date, this.data.value) === 0) {
        return ['is-selected']
      }
    },
    getDatesType (date) {
      if (!this.data.value) return

      let type

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
      const [startDate, endDate] = value

      if (startDate && compareDate(date, startDate) === 0) {
        return ['is-selected-range', 'is-selected-start']
      } else if (endDate && compareDate(date, endDate) === 0) {
        return ['is-selected-range', 'is-selected-end']
      } else if (startDate && endDate && compareDate(date, startDate) === 1 && compareDate(date, endDate) === -1) {
        return ['is-selected-range']
      }
    },
    getWeekValue () {
      if (this.data.type === 'week') {
        return getWeekRange(this.data.value)
      } else {
        const [startDate, endDate] = this.data.value

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
      if (!date.type || date.type.indexOf('is-selected') === -1) {
        this.$emit('change', {
          value: date.date
        })
      }
    },
    handleDatesChange (date) {
      const value = this.data.value || []
      if (!date.type || date.type.indexOf('is-selected') === -1) {
        value.push(date.date)
      } else {
        value.splice(value.indexOf(date.date), 1)
      }
      console.log(value)
      this.$emit('change', {
        value
      })
    },
    handleDateRangeChange (date) {
      let value
      let [startDate, endDate] = this.data.value
      if (!date.type || date.type.indexOf('is-selected') === -1) {
        if (startDate) {
          if (compareDate(date.date, startDate) < 1 || endDate) {
            value = [date.date, null]
          } else {
            value = [startDate, date.date]
          }
        } else {
          value = [date.date, null]
        }
      } else {
        value = [date.date, null]
      }
      this.$emit('change', {
        value
      })
    },
    handleWeekChange (date) {
      if (date.type && (date.type.indexOf('is-selected') > -1 || date.type.indexOf('is-selected-range') > -1)) return

      const [weekStart] = getWeekRange(date.date)

      this.$emit('change', {
        value: weekStart
      })
    },
    handleWeekRangeChange (date) {
      
    }
  }
})