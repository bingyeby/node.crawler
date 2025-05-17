const _ = require('lodash')

function change(arr){
  let arrRes = []
  _.times(2, () => {
    let randomV = _.random(_.size(arr) - 1)
    arrRes.push(!arr.splice(randomV, 1)[0])
  })
  arrRes = [...arrRes, ...arr]
  return arrRes
}

function one(){
  var a = _.times(100, () => {
    return true
  })
  _.times(50, (n, i) => {
    a = change(a)
  })
  let isAllFalse = _.every(a, (n, i) => {
    return !n
  })
  console.log(`a`, isAllFalse)
}

_.times(1000, () => {
  one()
})


