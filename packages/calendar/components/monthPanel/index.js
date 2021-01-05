import VueComponent from '../../../common/component'
import { formatMonthTitle, getMonths, compareMonth } from '../../utils'
import { getType } from '../../../common/util'

VueComponent({
  props: {
    show: {
      type: Boolean,
      observer (val) {
        if (val) {
          setTimeout(() => {
            this.initRect()
            this.scrollIntoView()
          }, 300)
        }
      }
    },
    type: String,
    value: {
      type: [null, Number, Array]
    },
    minDate: Number,
    maxDate: Number,
    firstDayOfWeek: Number
  },
  data: {
    title: '',
    scrollIntoView: ''
  },
  mounted () {
    if (this.data.show) {
      this.initRect()
      this.scrollIntoView()
    }
  },
  methods: {
    initRect () {
      if (this.contentObserver != null) {
        this.contentObserver.disconnect()
      }

      const contentObserver = this.createIntersectionObserver({
        thresholds: [0, 0.1, 0.9, 1],
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
      this.requestAnimationFrame(() => {
        if (!this.data.show) return

        let activeDate
        let type = getType(this.data.value)
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
    handleDateChange ({ detail: { value } }) {
      this.$emit('change', {
        value
      })
    }
  }
})