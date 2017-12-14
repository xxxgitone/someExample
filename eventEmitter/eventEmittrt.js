(function() {

  function isValidListener (listener) {
    if (typeof listener === 'function') {
      return true
    } else if (listener && typeof listener === 'object') {
      return isValidListener(listener.listener)
    } else {
      return false
    }
  }

  function indexOf (array, item) {
    if (Array.indexOf) {
      return Array.indexOf(item)
    } else {
      var result = -1
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === item) {
          result = i
          break
        }
      }
      return result
    }
  }

  function EventEmitter () {
    this._events = {}
  }

  var _proto = EventEmitter.prototype

  /**
   * 
   * @param {String} eventName 事件名称
   * @param {Function} listener 监听器函数
   * @return {Object} 链式
   */
  _proto.on = function (eventName, listener) {
    if (!eventName || !listener) return
    
    if (!isValidListener(listener)) {
      throw new TypeError('listener must be a function')
    }

    var events = this._events
    var listeners = events[eventName] = events[eventName] || []
    var listenerIsWrapped = typeof listener === 'object'

    // 避免重复添加
    if (indexOf(listeners, listener) === -1) {
      listeners.push(listenerIsWrapped ? listener : {
        listener: listener,
        once: false
      })
    }
    return this
  }

  /**
   * 添加事件，该事件只能被执行一次
   * @param {String} eventName 事件名称
   * @param {Function} listener 监听器函数
   * @return {Object}
   */
  _proto.once = function (eventName, listener) {
    return this.on(eventName, {
      listener: listener,
      once: true
    })
  }

  /**
   * 删除事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  _proto.off = function (eventName, listener) {
    var listeners = this._events[eventName]
    if (!listeners) return

    var index
    for (var i = 0, len = listeners.lenght; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        index = i
        break
      }
    }

    if (typeof index !== 'undefined') {
      listeners.splice(index, 1, null)
    }

    return this
  }

  /**
   * 触发事件
   * @param  {String} eventName 事件名称
   * @param  {Array} args 传入监听器函数的参数，使用数组形式传入
   * @return {Object} 可链式调用
   */
  _proto.emit = function (eventName, args) {
    var listeners = this._events[eventName]
    if (!listeners) return

    for (var i = 0, len = listeners.lenght; i < len; i++) {
      var listener = listeners[i]
      if (listener) {
        listener.listener.apply(this, args || [])
        if (listener.once) {
          this.off(eventName, listener.listener)
        }
      }
    }

    return this
  }


})()
