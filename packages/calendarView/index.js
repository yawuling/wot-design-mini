import VueComponent from '../common/component'
import { getType } from '../common/util'
import { getDefaultTime } from './utils'

const current = new Date()
const currentYear = current.getFullYear()
const currentMonth = current.getMonth()
const currentDay = current.getDate()

VueComponent({
  behaviors: ['jd://form-field'],
  props: {
    value: {
      type: [null, Number, Array]
    },
    type: {
      type: String,
      value: 'date'
    },
    beforeConfirm: {
      type: null,
      observer (fn) {
        if (getType(fn) !== 'function') {
          throw Error('The type of beforeConfirm must be Function')
        }
      }
    },
    minDate: {
      type: Number,
      value: new Date(currentYear, currentMonth - 6, currentDay).getTime()
    },
    maxDate: {
      type: Number,
      value: new Date(currentYear, currentMonth + 6, currentDay, 23, 59, 59).getTime()
    },
    firstDayOfWeek: {
      type: Number,
      value: 7
    },
    formatter: null,
    maxRange: Number,
    rangePrompt: String,
    allowSameDay: Boolean,
    showPanelTitle: {
      type: Boolean,
      value: true
    },
    defaultTime: {
      type: [String, Array],
      observer (val) {
        this.setData({
          formatDefauleTime: getDefaultTime(val)
        })
      }
    },
    panelHeight: Number,
    timeFilter: null,
    hideSecond: Boolean
  },
  data: {
    formatDefauleTime: []
  },
  methods: {
    // 对外暴露方法
    scrollIntoView (thresholds) {
      const panel = this.getPanel()
      panel.initRect && panel.initRect(thresholds)
      panel.scrollIntoView()
    },
    getPanel () {
      return this.data.type.indexOf('month') > -1 ? this.selectComponent('#yearPanel') : this.selectComponent('#monthPanel')
    },
    handleChange ({ detail: { value } }) {
      this.setData({
        value
      })
      this.$emit('change', {
        value
      })
    }
  }
})