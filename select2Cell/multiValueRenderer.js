var MultiValueRenderer, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MultiValueRenderer = (function(_super) {
  __extends(MultiValueRenderer, _super);

  function MultiValueRenderer() {
    this.returnPressed = __bind(this.returnPressed, this);
    _ref = MultiValueRenderer.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MultiValueRenderer.prototype.contructor = function(instance, td, row, col) {
    MultiValueRenderer.__super__.contructor.call(this, instance, td, row, col);
    return this.isOpened = false;
  };

  MultiValueRenderer.prototype.defaultOptions = $.extend(true, {
    multiple: true
  }, Select2Renderer.prototype.defaultOptions);

  MultiValueRenderer.prototype.bindMyEvents = function() {
    var runLater,
      _this = this;
    runLater = function(ms, func) {
      return setTimeout(func, ms);
    };
    this.select2.on("select2-open", function() {
      _this.isOpened = true;
      return runLater(100, function() {
        return _this.instance.view.render();
      });
    });
    this.select2.on("select2-close", function() {
      return runLater(100, function() {
        _this.isOpened = false;
        return _this.instance.view.render();
      });
    });
    return this.select2.on("change", function() {
      return runLater(100, function() {
        return _this.instance.view.render();
      });
    });
  };

  MultiValueRenderer.prototype.returnPressed = function() {
    if (!this.isOpened) {
      return this.finishEditing();
    }
  };

  MultiValueRenderer.prototype.shouldBeginEditing = function(keyCode) {
    return MultiValueRenderer.__super__.shouldBeginEditing.call(this, keyCode) || keyCode === 8;
  };

  MultiValueRenderer.prototype.shouldDeleteAndRehook = function(keyCode) {
    return keyCode === 46;
  };

  return MultiValueRenderer;

})(Select2Renderer);

Handsontable.MultiValueRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  return createSelect2Renderer(MultiValueRenderer, instance, td, row, col, prop, value, cellProperties);
};

Handsontable.MultiValueCell = {
  editor: Handsontable.Select2Editor,
  renderer: Handsontable.MultiValueRenderer
};

Handsontable.cellTypes.multiValue = Handsontable.MultiValueCell;
