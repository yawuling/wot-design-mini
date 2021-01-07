Page({
  data: {
    type1: 'date',
    type2: 'daterange',
    value1: Date.now(),
    value2: [Date.now(), Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now() + 24 * 60 * 60 * 1000 * 3],
    value3: [Date.now() - 24 * 60 * 60 * 1000 * 33, Date.now()],
    value4: [Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now() - 24 * 60 * 60 * 1000],
    formatter: function (day) {
      const date = new Date(day.date)
      const now = new Date()

      const year = date.getFullYear()
      const month = date.getMonth()
      const da = date.getDate()
      const nowYear = now.getFullYear()
      const nowMonth = now.getMonth()
      const nowDa = now.getDate()

      if (year === nowYear && month === nowMonth && da === nowDa) {
        day.text = '今天'
      }

      if (month === 5 && da === 18) {
        day.bottomInfo = '618大促'
      }

      if (day.type.indexOf('is-start') > -1) {
        day.bottomInfo = '开始'
      }

      if (day.type.indexOf('is-end') > -1) {
        day.bottomInfo = '结束'
      }

      return day
    }
  },
  handleTypeChange1 (event) {
    this.setData({
      type1: event.detail.value
    })
  },
  handleTypeChange2 (event) {
    this.setData({
      type2: event.detail.value
    })
  },
  handleConfirm1 (event) {
    this.setData({
      value1: event.detail.value
    })
  },
  handleTypeChange3 (event) {
    this.setData({
      type3: event.detail.value
    })
  }
})