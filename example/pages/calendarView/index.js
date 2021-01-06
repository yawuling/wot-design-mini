Page({
  data: {
    type1: 'date',
    type2: 'daterange',
    value1: Date.now(),
    value2: [Date.now(), Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now() + 24 * 60 * 60 * 1000 * 3],
    value3: [Date.now() - 24 * 60 * 60 * 1000 * 33, Date.now()]
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