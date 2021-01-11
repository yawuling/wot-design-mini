import VueComponent from '../../../common/component'
import { formatMonthTitle, getMonths, compareMonth } from '../../utils'
import { getType } from '../../../common/util'

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
    panelHeight: String
  },
  data: {
    title: '',
    scrollIntoView: ''
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
    handleDateChange ({ detail: { value } }) {
      this.$emit('change', {
        value
      })
    }
  }
})