class Compile {
  constructor(el, vm) {
    // el is either a template, or query this node on DOM
    this.el = this.isElementNode(el)? el: document.querySelector(el);
    this.vm = vm;
    // the following code happens when el is a VALID node
    if (this.el) {
      // 1. put the real DOM element into fragment in memory
      let fragment = this.node2fragment(this.el);
      // 2. get node v-model and text_node in {{}}
      this.compile(fragment);
      // 3. put the compiled fragment into the real DOM tree
      this.el.appendChild(fragment);
    }
  }
  node2fragment(el) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    // fragment will contain '#text' before, after and between real nodes
    // because a text node is inserted to maintain the whitespace between tags
    while (el.firstChild) {
      // this will update el.firstChild parent to be fragment
      // so this child no longer belongs to el
      // el.firstChild is updated
      firstChild = el.firstChild;
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  // the compile of virtual DOM is actually the tree preorder traversal
  compile(fragment) {
    let childNodes = fragment.childNodes;
    // from array-like to array (shalow copy)
    Array.from(childNodes).forEach((node)=> {
      if (this.isElementNode(node)) {
        // ELEMENT_NODE
        // We need to continue compiling...
        this.compileElement(node);
        // recursively deal with all node until reach text_node
        this.compile(node);
      } else {
        // TEXT_NODE
        this.compileText(node);
      }
    })
  }
  compileElement(node) {
    // deal with node with v-model, v-text...
    let attrs = node.attributes;
    Array.from(attrs).forEach((attr)=> {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        let expr = attr.value;
        let [, type] = attrName.split("-");
        CompileUtil[type](node, this.vm, expr);
      }
    })
  }
  compileText(node) {
    let expr = node.textContent;
    // if expr contains things like {{ blah }}
    let reg = /\{\{([^}]+)\}\}/g;
    if (reg.test(expr)) {
      CompileUtil['text'](node, this.vm, expr);
    }
  }
  // is this an ELEMENT_NODE, not TEXT_NODE?
  isElementNode(node) {
    return node.nodeType === 1;
  }
  // whether this is a directive, like v-
  isDirective(name) {
    return name.includes('v-');
  }
}

// CompileUtil deals with text and model so far...
CompileUtil = {
  text(node, vm, expr) {
    let updateFn = this.updater["textUpdater"];
    let value = this.getTextVal(vm, expr);
    updateFn && updateFn(node, value);
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (matchedStr, strFound)=> {
      return this.getVal(vm, strFound);
    })
  },
  getVal(vm, expr) {
    // get the value like message.txt.a.b.c
    expr = expr.split(".");
    return expr.reduce((prev, next)=> {
      return prev[next];
    }, vm.$data)
  },
  model(node, vm, expr) {
    let updateFn = this.updater["modelUpdater"];

    updateFn && updateFn(node, this.getVal(vm, expr));
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    }
  }
}
