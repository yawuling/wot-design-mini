/**
 * 比较两个时间的日期是否相等
 * @param {Number} date1 
 * @param {Number} date2 
 */
export function compareDate (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)

  const year1 = date1.getFullYear()
  const year2 = date2.getFullYear()
  const month1 = date1.getMonth()
  const month2 = date2.getMonth()
  const day1 = date1.getDate()
  const day2 = date2.getDate()

  if (year1 === year2) {
    if (month1 === month2) {
      return day1 === day2 ? 0 : (day1 > day2 ? 1 : -1)
    }
    return month1 === month2 ? 0 : (month1 > month2 ? 1 : -1)
  }

  return year1 > year2 ? 1 : -1
}

export function getMonthEndDay (year, month) {
  return 32 - new Date(year, month - 1, 32).getDate()
}

export function formatMonthTitle (date) {
  date = new Date(date)

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return year + '年' + month + '月'
}

/**
 * 比较两个日期的月份是否相等
 * @param date1 
 * @param date2 
 */
export function compareMonth (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)

  const year1 = date1.getFullYear()
  const year2 = date2.getFullYear()
  const month1 = date1.getMonth()
  const month2 = date2.getMonth()

  if (year1 === year2) {
    return month1 === month2 ? 0 : (month1 > month2 ? 1 : -1)
  }

  return year1 > year2 ? 1 : -1
}

/**
 * 根据最小日期和最大日期获取这之间总共有几个月份
 * @param minDate 
 * @param maxDate 
 */
export function getMonths (minDate, maxDate) {
  const months = []
  const month = new Date(minDate)
  month.setDate(1)

  while (compareMonth(month, maxDate) < 1) {
    months.push(month.getTime())
    month.setMonth(month.getMonth() + 1)
  }

  return months
}

export function getWeekRange (date) {
  date = new Date(date)
  date.setHours(0, 0, 0, 0)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const week = date.getDay()

  const weekStart = new Date(year, month, day - week)
  const weekEnd = new Date(year, month, day + 6 - week)

  return [weekStart.getTime(), weekEnd.getTime()]
}
