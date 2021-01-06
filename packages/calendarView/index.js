import VueComponent from '../common/component'
import { getType } from '../common/util'

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
      value: new Date(currentYear, currentMonth + 6, currentDay).getTime()
    },
    firstDayOfWeek: {
      type: Number,
      value: 7
    },
    formatter: null,
    maxRange: Number,
    rangePrompt: String,
    allowSameDay: Boolean
  },
  methods: {
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