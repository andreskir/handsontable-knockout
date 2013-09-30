var Select2Editor, Select2Renderer, createSelect2Renderer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Select2Renderer = (function() {
  function Select2Renderer(instance, td, row, col) {
    this.returnPressed = __bind(this.returnPressed, this);
    this.exitKeys = __bind(this.exitKeys, this);
    this.instance = instance;
    this.td = td;
    this.row = row;
    this.col = col;
  }

  Select2Renderer.prototype.defaultOptions = {
    allowClear: true,
    openOnEnter: false
  };

  Select2Renderer.prototype.createElements = function(selectorData, value) {
    var $select;
    this.defaultOptions.data = selectorData;
    $select = $('<input class="select2Element" style="width: 100%" tabindex="-1">');
    $select.appendTo(this.td);
    this.select2 = $select.select2(this.defaultOptions);
    this.setValue(value);
    this.bindOnBlur();
    this.bindOnOpening();
    return this.bindMyEvents();
  };

  Select2Renderer.prototype.setValue = function(value) {
    return this.select2.select2("val", value);
  };

  Select2Renderer.prototype.selectCurrentCell = function() {
    return this.instance.selectCell(this.row, this.col, this.row, this.col, false);
  };

  Select2Renderer.prototype.bindMyEvents = function() {
    return this.bindOnSelecting();
  };

  Select2Renderer.prototype.bindOnBlur = function() {};

  Select2Renderer.prototype.bindOnOpening = function() {
    var _this = this;
    return this.select2.on("select2-opening", function() {
      if (_this.instance.getSelected() && !_this.arraysEqual(_this.instance.getSelected(), [_this.row, _this.col, _this.row, _this.col])) {
        _this.selectCurrentCell();
      }
      return _this.select2.select2("container").find(".select2-input").off('keydown.exitKeys').on('keydown.exitKeys', _this.exitKeys);
    });
  };

  Select2Renderer.prototype.bindOnSelecting = function() {
    var runLater,
      _this = this;
    runLater = function(func) {
      return setTimeout(func, 0);
    };
    return this.select2.on("select2-selecting", function() {
      return runLater(function() {
        return _this.selectCurrentCell();
      });
    });
  };

  Select2Renderer.prototype.exitKeys = function(event) {
    switch (event.keyCode) {
      case 9:
        this.finishEditing();
        return event.preventDefault();
      case 39:
      case 37:
      case 27:
        return this.finishEditing();
      case 13:
        return this.returnPressed();
      default:
        return event.stopImmediatePropagation();
    }
  };

  Select2Renderer.prototype.returnPressed = function() {
    return this.finishEditing();
  };

  Select2Renderer.prototype.finishEditing = function() {
    this.saveData();
    this.select2.select2("close");
    return this.selectCurrentCell();
  };

  Select2Renderer.prototype.saveData = function() {
    return this.instance.populateFromArray(this.row, this.col, this.getValue(), null, null, 'edit');
  };

  Select2Renderer.prototype.arraysEqual = function(arr1, arr2) {
    var i, item, _i, _len;
    for (i = _i = 0, _len = arr1.length; _i < _len; i = ++_i) {
      item = arr1[i];
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };

  Select2Renderer.prototype.renderInstance = function() {
    return this.instance.render();
  };

  Select2Renderer.prototype.getValue = function() {
    return [[this.select2.select2("val")]];
  };

  return Select2Renderer;

})();

Select2Editor = (function() {
  function Select2Editor(instance, td) {
    this.beforeKeyDownHook = __bind(this.beforeKeyDownHook, this);
    this.instance = instance;
    this.td = td;
    this.select2 = $(td).find(".select2Element").select2("container");
  }

  Select2Editor.prototype.addHookOnce = function() {
    var _this = this;
    this.instance.addHookOnce('beforeKeyDown', this.beforeKeyDownHook);
    return this.instance.addHookOnce('afterSelection', function() {
      return _this.instance.removeHook('beforeKeyDown', _this.beforeKeyDownHook);
    });
  };

  Select2Editor.prototype.beforeKeyDownHook = function(event) {
    if (this.shouldBeginEditing(event.keyCode)) {
      event.stopImmediatePropagation();
      return this.beginEditing();
    } else if (this.shouldDeleteAndRehook(event.keyCode)) {
      this.select2.select2("val", "");
      return this.addHookOnce();
    } else if (this.shouldRehook(event.keyCode)) {
      return this.addHookOnce();
    }
  };

  Select2Editor.prototype.beginEditing = function() {
    return this.select2.select2("open");
  };

  Select2Editor.prototype.shouldBeginEditing = function(keyCode) {
    return Handsontable.helper.isPrintableChar(keyCode) || keyCode === 113;
  };

  Select2Editor.prototype.shouldDeleteAndRehook = function(keyCode) {
    return [8, 46].indexOf(keyCode) >= 0;
  };

  Select2Editor.prototype.shouldRehook = function(keyCode) {
    return [9, 33, 34, 35, 36, 37, 38, 39, 40, 13].indexOf(keyCode) === -1;
  };

  return Select2Editor;

})();

createSelect2Renderer = function(model, instance, td, row, col, prop, value, cellProperties) {
  var renderer;
  $(td).empty();
  renderer = new model(instance, td, row, col);
  renderer.createElements(cellProperties.selectorData, value);
  return td;
};

Handsontable.Select2Renderer = function(instance, td, row, col, prop, value, cellProperties) {
  return createSelect2Renderer(Select2Renderer, instance, td, row, col, prop, value, cellProperties);
};

Handsontable.Select2Editor = function(instance, td, row, col, prop, value, cellProperties) {
  var editor;
  editor = new Select2Editor(instance, td);
  return editor.addHookOnce();
};

Handsontable.Select2Cell = {
  editor: Handsontable.Select2Editor,
  renderer: Handsontable.Select2Renderer
};

Handsontable.cellTypes.select2 = Handsontable.Select2Cell;
