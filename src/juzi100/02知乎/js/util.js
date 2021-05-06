/**
 * 延迟
 * @param time 延迟时间,单位ms
 * @returns {Promise<*>}
 */
async function delay(time = 1000) {
  return new Promise((resolve, reject) => {
    console.log('延迟开始:', new Date())
    console.log(`延迟时长:`, time)
    setTimeout(() => {
      console.log('延迟结束:', new Date())
      resolve()
    }, time)
  })
}

/*
* 异步map
* */
async function asyncMap(array, callback) {
  let arr = []
  for (let index = 0; index < array.length; index++) {
    arr.push(await callback(array[index], index, array))
  }
  return arr
}

/*
* 异步each
* */
async function asyncEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/**
 * 等待页面存在某个元素,或者满足函数运行结果
 * @param classNameOrFunc
 * @param time 时间,秒
 * @returns {Promise<unknown>}
 */
async function waitFor(classNameOrFunc, time = 5) {
  return new Promise((resolve, reject) => {
    let timeNum = 0
    let timeId = setInterval((n, i) => {
      if (timeNum > time) {
        clearInterval(timeId)
        reject(_.isString(classNameOrFunc) ? `没有找到元素: ${classNameOrFunc}` : '没有满足执行条件')
      }
      timeNum++

      if (_.isString(classNameOrFunc)) {
        if ($(classNameOrFunc).length > 0) { // 找到元素
          clearInterval(timeId)
          resolve($(classNameOrFunc))
        }
      } else if (_.isFunction(classNameOrFunc)) {
        if (classNameOrFunc()) { // 执行判断函数
          clearInterval(timeId)
          resolve()
        }
      }
    }, 1000)
  })
}

window.util = {
  delay,
  asyncMap,
  asyncEach,
  waitFor,
}
