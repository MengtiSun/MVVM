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
  defineReactive(obj, key, value) {
    let that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        if (newValue != value) {
          // newValue can be an object, need recursively observe it
          that.observe(newValue);
          value = newValue;
        }
      }
    })
  }
}