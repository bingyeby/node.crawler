async function asyncMap(array, callback) {
  let arr = []
  for (let index = 0; index < array.length; index++) {
    arr.push(await callback(array[index], index, array))
  }
  return arr
}

async function asyncEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = {
  asyncMap: asyncMap,
  asyncEach: asyncEach,
}
