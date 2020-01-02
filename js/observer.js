class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    // data has to be an object
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach((key)=> {
      this.defineReactive(data, key, data[key]);
      // recursion to observe data
      this.observe(data[key]);
    })
  }
  // we need value, because obj[key] can be changed
  defineReactive(obj, key, value) {
    let that = this;
    // each data is a publisher
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // add watchers to its subscribers
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if (newValue != value) {
          // newValue can be an object, need recursively observe it
          that.observe(newValue);
          value = newValue;
          // notify every subscriber, this data is updated
          dep.notify();
        }
      }
    })
  }
}