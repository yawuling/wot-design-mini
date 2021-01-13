import { getType, padZero } from '../common/util'

/**
 * 比较两个时间的日期是否相等
 * @param {timestamp} date1
 * @param {timestamp} date2
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

/**
 * 比较两个日期的月份是否相等
 * @param {timestamp} date1
 * @param {timestamp} date2
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
 * 比较两个日期的年份是否一致
 * @param {timestamp} date1
 * @param {timestamp} date2
 */
export function compareYear (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)

  const year1 = date1.getFullYear()
  const year2 = date2.getFullYear()

  return year1 === year2 ? 0 : (year1 > year2 ? 1 : -1)
}

/**
 * 获取一个月的最后一天
 * @param {number} year
 * @param {number} month
 */
export function getMonthEndDay (year, month) {
  return 32 - new Date(year, month - 1, 32).getDate()
}

/**
 * 格式化年月
 * @param {timestamp} date
 */
export function formatMonthTitle (date) {
  date = new Date(date)

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return year + '年' + month + '月'
}

/**
 * 格式化年份
 * @param {timestamp} date
 */
export function formatYearTitle (date) {
  date = new Date(date)

  const year = date.getFullYear()

  return year + '年'
}

/**
 * 根据最小日期和最大日期获取这之间总共有几个月份
 * @param {timestamp} minDate
 * @param {timestamp} maxDate
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

/**
 * 根据最小日期和最大日期获取这之间总共有几年
 * @param {timestamp} minDate
 * @param {timestamp} maxDate
 */
export function getYears (minDate, maxDate) {
  const years = []
  const year = new Date(minDate)
  year.setMonth(0)
  year.setDate(1)

  while (compareYear(year, maxDate) < 1) {
    years.push(year.getTime())
    year.setFullYear(year.getFullYear() + 1)
  }

  return years
}

/**
 * 获取一个日期所在周的第一天和最后一天
 * @param {timestamp} date
 */
export function getWeekRange (date, firstDayOfWeek) {
  if (firstDayOfWeek >= 7) {
    firstDayOfWeek = firstDayOfWeek % 7
  }

  date = new Date(date)
  date.setHours(0, 0, 0, 0)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const week = date.getDay()

  const weekStart = new Date(year, month, day - (7 + week - firstDayOfWeek) % 7)
  const weekEnd = new Date(year, month, day + 6 - (7 + week - firstDayOfWeek) % 7)

  console.log(weekStart, weekEnd)

  return [weekStart.getTime(), weekEnd.getTime()]
}

/**
 * 获取日期偏移量
 * @param {timestamp} date1
 * @param {timestamp} date2
 */
export function getDayOffset (date1, date2) {
  return (date1 - date2) / (24 * 60 * 60 * 1000) + 1
}

/**
 * 获取偏移日期
 * @param {timestamp} date
 * @param {number} offset
 */
export function getDayByOffset (date, offset) {
  date = new Date(date)
  date.setDate(date.getDate() + offset)

  return date.getTime()
}

export function getMonthOffset (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)

  const year1 = date1.getFullYear()
  const year2 = date2.getFullYear()
  let month1 = date1.getMonth()
  const month2 = date2.getMonth()

  month1 = (year1 - year2) * 12 + month1

  return month1 - month2 + 1
}

export function getMonthByOffset (date, offset) {
  date = new Date(date)
  date.setMonth(date.getMonth() + offset)

  return date.getTime()
}

export function getDefaultTime (defaultTime) {
  if (getType(defaultTime) === 'array') {
    const startTime = (defaultTime[0] || '00:00:00').split(':').map(item => {
      return parseInt(item)
    })
    const endTime = (defaultTime[1] || '00:00:00').split(':').map(item => {
      return parseInt(item)
    })
    return [startTime, endTime]
  } else {
    const time = (defaultTime || '00:00:00').split(':').map(item => {
      return parseInt(item)
    })

    return [time, time]
  }
}

export function getDateByDefaultTime (date, defaultTime) {
  date = new Date(date)
  date.setHours(defaultTime[0])
  date.setMinutes(defaultTime[1])
  date.setSeconds(defaultTime[2])

  return date.getTime()
}

const times = (n, iteratee) => {
  let index = -1
  const result = Array(n < 0 ? 0 : n)
  while (++index < n) {
    result[index] = iteratee(index)
  }
  return result
}

const getTime = (date) => {
  date = new Date(date)
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
}

export function getTimeData (date, minDate, maxDate) {
  const compareMin = compareDate(date, minDate)
  const compareMax = compareDate(date, maxDate)

  let minHour = 0
  let maxHour = 23
  let minMinute = 0
  let maxMinute = 59
  let minSecond = 0
  let maxSecond = 59

  if (compareMin === 0) {
    const minTime = getTime(minDate)
    const currentTime = getTime(date)

    minHour = minTime[0]
    if (minTime[0] === currentTime[0]) {
      minMinute = minTime[1]

      if (minTime[1] === currentTime[1]) {
        minSecond = minTime[2]
      }
    }
  }

  if (compareMax === 0) {
    const maxTime = getTime(maxDate)
    const currentTime = getTime(date)

    maxHour = maxTime[0]
    if (maxTime[0] === currentTime[0]) {
      maxMinute = maxTime[1]

      if (maxTime[1] === currentTime[1]) {
        maxSecond = maxTime[2]
      }
    }
  }

  const columns = []
  columns.push(times(24, index => {
    return {
      label: padZero(index),
      value: index,
      disabled: index < minHour || index > maxHour
    }
  }))
  columns.push(times(60, index => {
    return {
      label: padZero(index),
      value: index,
      disabled: index < minMinute || index > maxMinute
    }
  }))
  columns.push(times(60, index => {
    return {
      label: padZero(index),
      value: index,
      disabled: index < minSecond || index > maxSecond
    }
  }))

  return columns
}