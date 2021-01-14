Page({
  data: {
    show: false,
    billType: 'bill',
    dateType: 'custom',
    value: [],
    formatValue: ''
  },
  handleConfirm (event) {
    const { show, billType, dateType, value } = event.detail
    const start = new Date(value[0])
    const end = new Date(value[1])

    const startStr = `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`
    const endStr = `${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`

    console.log(start, end)
    this.setData({
      show,
      billType,
      dateType,
      value,
      formatValue: `${startStr}-${endStr}`
    })
  },
  openCalendar () {
    this.setData({
      show: true
    })
  }
})