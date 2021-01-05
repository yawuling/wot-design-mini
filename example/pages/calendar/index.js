Page({
  data: {
    value1: ''
  },
  handleConfirm1 (event) {
    this.setData({
      value1: event.detail.value
    })
  }
})