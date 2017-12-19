// 柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术

// 例子
// function add (a, b) {
//   return a + b
// }

// add(1, 2) // 3

// // 比如存在一个函数curry可以做到柯里化
// var addCurry = curry(add)
// addCurry(1)(3) // 3

// TODO
// var curry = function (fn) {
//   var ags = [].slice.call(arguments, 1)
//   return function() {
//     var newArgs = args.concat([].slice.call(arguments))
//     return fn.apply(this, newArgs)
//   }
// }

// function add(a, b) {
//   return a + b;
// }

// var addCurry = curry(add, 1, 2);
// addCurry() // 3
// //或者
// var addCurry = curry(add, 1);
// addCurry(2) // 3
// //或者
// var addCurry = curry(add);
// addCurry(1, 2) // 3

function sub_curry (fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

// TODO:慢慢消化，有点难理解
function curry (fn, length) {
  length = length || fn.length

  var slice = Array.prototype.slice

  return function () {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments))
      return curry(sub_curry.apply(this, combined), length - arguments.length)
    } else {
      return fn.apply(this, arguments)
    }
  }
}

var fn = curry(function(a, b, c) {
  return [a, b, c]
})

console.log(fn("a", "b", "c")) // ["a", "b", "c"]
console.log(fn("a", "b")("c")) // ["a", "b", "c"]
console.log(fn("a")("b")("c")) // ["a", "b", "c"]
console.log(fn("a")("b", "c")) // ["a", "b", "c"]