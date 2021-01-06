import VueComponent from '../../../common/component'
import { compareDate, compareMonth } from '../../utils'
import { getType } from '../../../common/util'

VueComponent({
  data: {
    months: [],
    value: []
  },
  props: {
    type: {
      type: String,
      observer: 'setMonths'
    },
    date: {
      type: Number,
      observer: 'setMonths'
    },
    value: {
      type: [null, Number, Array],
      observer: 'setMonths'
    },
    minDate: {
      type: Number,
      observer: 'setMonths'
    },
    maxDate: {
      type: Number,
      observer: 'setMonths'
    },
    formatter: {
      type: null,
      observer: 'setMonths'
    }
  },
  methods: {
    setMonths () {
      const months = []
      const date = new Date(this.data.date)
      const year = date.getFullYear()

      let value = this.data.value

      if ((this.data.type === 'week' || this.data.type === 'weekrange') && value) {
        value = this.getWeekValue()
      }

      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1).getTime()
        let type = this.getMonthType(date, value)
        if ((type.length === 0) && compareMonth(date, Date.now()) === 0) {
          type = ['is-current']
        }
        let monthObj = {
          date: date,
          text: month + 1,
          bottomInfo: '',
          type,
          disabled: compareMonth(date, this.data.minDate) === -1 || compareMonth(date, this.data.maxDate) === 1
        }
        if (this.data.formatter) {
          if (getType(this.data.formatter) === 'function') {
            monthObj = this.data.formatter(monthObj)
          } else {
            console.error('[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function')
          }
        }
        months.push(monthObj)
      }

      this.setData({
        months
      })
    },
    getMonthType (date) {
      if (this.data.type === 'monthrange') {
        const [startDate, endDate] = this.data.value || []

        if (startDate && compareMonth(date, startDate) === 0) {
          const type = ['is-start']

          if (!endDate || startDate === endDate) {
            type.push('is-without-end')
          }

          return type
        } else if (endDate && compareMonth(date, endDate) === 0) {
          return ['is-end']
        } else if (startDate && endDate && compareMonth(date, startDate) === 1 && compareMonth(date, endDate) === -1) {
          return ['is-middle']
        } else {
          return []
        }
      } else {
        if (this.data.value && compareMonth(date, this.data.value) === 0) {
          return ['is-selected']
        } else {
          return []
        }
      }
    },
    handleDateClick (event) {
      const { index } = event.currentTarget.dataset
      const date = this.data.months[index]

      if (date.disabled) return

      switch (this.data.type) {
      case 'month':
        this.handleMonthChange(date)
        break
      case 'monthrange':
        this.handleMonthRangeChange(date)
        break
      default:
        this.handleMonthChange(date)
      }
    },
    handleMonthChange (date) {
      if (date.type.indexOf('is-selected') === -1) {
        this.$emit('change', {
          value: date.date
        })
      }
    },
    handleMonthRangeChange (date) {
      let value
      const [startDate, endDate] = this.data.value || []
      if (startDate && !endDate && compareDate(date.date, startDate) > -1) {
        value = [startDate, date.date]
      } else {
        value = [date.date, null]
      }
      this.$emit('change', {
        value
      })
    }
  }
})