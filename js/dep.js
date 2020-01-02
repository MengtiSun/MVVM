class Dep {
  constructor() {
    // subscribers
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher=> watcher.update());
  }
}