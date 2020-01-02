class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // store the old value
    this.value = this.get();
  }
  // get value of the expr from this.vm
  get() {
    // save the watcher on Dep
    Dep.target = this;
    // The getValue method will use the vm.$data
    // Since each data will have the get method, this get method will be called, 
    // the dep on the data observer will add this watcher into its subscibers
    let value = this.getValue(this.vm, this.expr);
    Dep.target = null;
    return value;
  }
  getValue(vm, expr) {
    expr = expr.split(".");
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  // expose method
  // this update function is called in observers' set method
  update() {
    let newValue = this.getValue(this.vm, this.expr);
    let oldValue = this.value;
    if (newValue !== oldValue) {
      // the callback of Watch
      this.cb(newValue);
    }
  }
}