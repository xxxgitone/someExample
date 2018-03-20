// Promise/A+规范
// 1、promise有三种状态， 等待（pending）、已完成（resolved）、已拒绝（rejected）
// 2、 promise的状态只能从“等待”转到“完成”或者“拒绝”，不能逆向转换，同时“完成”和“拒绝”也不能相互转换
// 3、promise必须有一个then方法，而且要返回一个promise，供then的链式调用，也就是可thenable的
// 4、then接受俩个回调(成功与拒绝),在相应的状态转变时触发，回调可返回promise，等待此promise被resolved后，继续触发then链

function Promise (executor) {
  var self = this
  self.status = 'pending' // Promise当前状态
  self.data = undefined // Promise的值
  self.onResolvedCallback = [] // Promise resolve时的回调函数集, 在Promise结束之前有可能有多个回调添加到它上面
  self.onRejectedCallback = [] // Promise reject是的回调函数集

  function resolve (value) {
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    }, 0)
  }

  function reject (reason) {
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason)
        }
      }
    }, 0)
  }

  try {
    // executor的过程中有可能出错
    // 比如new Promise(function(resolve, reject) {
      //   throw 2
      // })
    executor(resolve, reject) // 执行executor并传入相应的参数
  } catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  var self = this
  var promise2

  // 如果then的参数不是Function, 处理值穿透,Promise值的穿透就是then默认参数就是把值往后传或者抛
  onResolved = typeof onResolved === 'function' ? onResolved : function(value) { return value } // 处理值穿透
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { throw reason }

  if (self.status === 'resolved') {
    // 如果Promise1(此处为self/this)的状态已经确定为resolved,调用onResolved
    // 考虑到可能throw,用try...catch
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) { // 如果onResolved返回值是一个Promise对象, 直接取它的结果作为promise2的结果
            x.then(resolve, reject)
          }
          resolve(x) // 否则,以它的返回值作为promise2的结果
        } catch (e) {
          reject(e) // 出错,以捕获到的错误作为promise2的结果
        }
      }, 0)
    })
  }

  if (self.status === 'rejected') {
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      }, 0)
    })
  }

  if (self.status === 'pending') {
    // 如果当前的Promise还处于pending状态,并不能确定调用onResolved还是onRejected
    // 只能等到Promis的状态确定后,才能确定如何处理
    // 所以需要把两种情况的处理逻辑作为callback放入promise1(此处self/this)的回调数组中
    // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
    return promise2 = new Promise(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function(reason) {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

Promise.resolve = function (value) {
  return new Promise(resolve => {
    resolve(value)
  })
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}

Promise.prototype.catch = function (onResolved) {
  return this.then(null, onRejected)
}

/**
 * Promise.all Promis并行处理
 * 参数: Promises对象组成的数组
 * 返回: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部变为resolve状态的时候,才会resolve
 */
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
      let done = gen(promises.length, resolve)
      promises.forEach((promise, index) => {
          promise.then((value) => {
              done(index, value)
          }, reject)
      })
  })
}

function gen(length, resolve) {
  let count = 0
  let values = []
  return function(i, value) {
      values[i] = value
      if (++count === length) {
          console.log(values)
          resolve(values)
      }
  }
}

/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 resolved 或者 rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
      promises.forEach((promise, index) => {
         promise.then(resolve, reject)
      })
  })
}
