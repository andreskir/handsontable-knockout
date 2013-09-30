var MultiValueEditor, MultiValueRenderer, getSelect2, getSelect2Value, saveSelect2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MultiValueRenderer = (function() {
  function MultiValueRenderer(instance, td, row, col) {
    this.returnPressed = __bind(this.returnPressed, this);
    this.exitKeys = __bind(this.exitKeys, this);
    this.instance = instance;
    this.td = td;
    this.row = row;
    this.col = col;
    this.isOpened = false;
  }

  MultiValueRenderer.prototype.defaultOptions = {
    allowClear: true,
    openOnEnter: false,
    multiple: true
  };

  MultiValueRenderer.prototype.createElements = function(selectorData, value) {
    var $select;
    this.defaultOptions.data = selectorData;
    $select = $('<input class="select2Element" style="width: 100%" tabindex="-1">');
    $select.appendTo(this.td);
    this.select2 = $select.select2(this.defaultOptions);
    this.setValue(value);
    this.bindOnOpening();
    return this.bindMyEvents();
  };

  MultiValueRenderer.prototype.setValue = function(value) {
    return this.select2.select2("val", value);
  };

  MultiValueRenderer.prototype.selectCurrentCell = function() {
    return this.instance.selectCell(this.row, this.col, this.row, this.col, false);
  };

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

  MultiValueRenderer.prototype.bindOnOpening = function() {
    var _this = this;
    return this.select2.on("select2-opening", function() {
      if (_this.instance.getSelected() && !_this.arraysEqual(_this.instance.getSelected(), [_this.row, _this.col, _this.row, _this.col])) {
        _this.selectCurrentCell();
      }
      return _this.select2.select2("container").find(".select2-input").off('keydown.exitKeys').on('keydown.exitKeys', _this.exitKeys);
    });
  };

  MultiValueRenderer.prototype.exitKeys = function(event) {
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

  MultiValueRenderer.prototype.returnPressed = function() {
    if (!this.isOpened) {
      return this.finishEditing();
    }
  };

  MultiValueRenderer.prototype.finishEditing = function() {
    this.saveData();
    this.select2.select2("close");
    return this.selectCurrentCell();
  };

  MultiValueRenderer.prototype.saveData = function() {
    return saveSelect2(this.instance, this.td, this.row, this.col);
  };

  MultiValueRenderer.prototype.arraysEqual = function(arr1, arr2) {
    var i, item, _i, _len;
    for (i = _i = 0, _len = arr1.length; _i < _len; i = ++_i) {
      item = arr1[i];
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };

  MultiValueRenderer.prototype.renderInstance = function() {
    return this.instance.render();
  };

  MultiValueRenderer.prototype.getValue = function() {
    return getSelect2Value(this.select2);
  };

  return MultiValueRenderer;

})();

MultiValueEditor = (function() {
  function MultiValueEditor(instance, td, row, col) {
    this.beforeKeyDownHook = __bind(this.beforeKeyDownHook, this);
    this.instance = instance;
    this.td = td;
    this.row = row;
    this.col = col;
    this.select2 = getSelect2(td);
  }

  MultiValueEditor.prototype.addHookOnce = function() {
    var _this = this;
    this.instance.addHookOnce('beforeKeyDown', this.beforeKeyDownHook);
    return this.instance.addHookOnce('afterSelection', function() {
      return _this.instance.removeHook('beforeKeyDown', _this.beforeKeyDownHook);
    });
  };

  MultiValueEditor.prototype.beforeKeyDownHook = function(event) {
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

  MultiValueEditor.prototype.beginEditing = function() {
    var _this = this;
    this.instance.addHookOnce('beforeSelection', function() {
      return saveSelect2(_this.instance, _this.td, _this.row, _this.col);
    });
    return this.select2.select2("open");
  };

  MultiValueEditor.prototype.shouldBeginEditing = function(keyCode) {
    return Handsontable.helper.isPrintableChar(keyCode) || keyCode === 113 || keyCode === 8;
  };

  MultiValueEditor.prototype.shouldDeleteAndRehook = function(keyCode) {
    return keyCode === 46;
  };

  MultiValueEditor.prototype.shouldRehook = function(keyCode) {
    return [9, 33, 34, 35, 36, 37, 38, 39, 40, 13].indexOf(keyCode) === -1;
  };

  return MultiValueEditor;

})();

getSelect2 = function(td) {
  return $(td).find(".select2Element").select2("container");
};

saveSelect2 = function(instance, td, row, col) {
  var cellValue, select2;
  select2 = getSelect2(td);
  cellValue = getSelect2Value(select2);
  return instance.populateFromArray(row, col, cellValue, null, null, 'edit');
};

getSelect2Value = function(select2) {
  return [[select2.select2("val")]];
};

Handsontable.MultiValueRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  var renderer;
  $(td).empty();
  renderer = new MultiValueRenderer(instance, td, row, col);
  renderer.createElements(cellProperties.selectorData, value);
  return td;
};

Handsontable.MultiValueEditor = function(instance, td, row, col, prop, value, cellProperties) {
  var editor;
  editor = new MultiValueEditor(instance, td, row, col);
  return editor.addHookOnce();
};

Handsontable.MultiValueCell = {
  editor: Handsontable.MultiValueEditor,
  renderer: Handsontable.MultiValueRenderer
};

Handsontable.cellTypes.multiValue = Handsontable.MultiValueCell;
