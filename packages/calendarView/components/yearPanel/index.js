import VueComponent from '../../../common/component'
import { getYears, compareYear } from '../../utils'
import { getType } from '../../../common/util'

VueComponent({
  props: {
    type: String,
    value: {
      type: [null, Number, Array]
    },
    minDate: Number,
    maxDate: Number,
    formatter: null,
    maxRange: Number,
    rangePrompt: String,
    allowSameDay: Boolean
  },
  data: {
    scrollIntoView: ''
  },
  mounted () {
    this.scrollIntoView()
  },
  methods: {
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

        const years = getYears(this.data.minDate, this.data.maxDate)

        years.some((year, index) => {
          if (compareYear(year, activeDate) === 0) {
            this.setData({
              scrollIntoView: `year${index}`
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