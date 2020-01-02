class MVVM {
  constructor(options) {
    // bind the data to the instance
    this.$el = options.el;
    this.$data = options.data;
    
    // if the template exits, I want to do something fancy
    if (this.$el) {
      new Observer(this.$data);
      // This is a template engine
      new Compile(this.$el, this);

    }
  }
}