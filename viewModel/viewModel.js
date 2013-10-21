var CheckBox, DatePicker, Field, InputGrid, InputGridRow, MultiValue, Selector, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Field = (function() {
  function Field(data, val, mappingOptions) {
    mappingOptions = $.extend({}, mappingOptions);
    ko.mapping.fromJS(data, mappingOptions, this);
    if (typeof val !== 'undefined') {
      this.value(val);
    }
    delete this.__ko_mapping__;
  }

  Field.prototype.adapt = function(runner) {
    return runner.adaptField(this);
  };

  Field.prototype.hasPopup = function() {};

  Field.prototype.callPopup = function(row) {
    return alert(row + ' - ' + this.name());
  };

  return Field;

})();

DatePicker = (function(_super) {
  __extends(DatePicker, _super);

  function DatePicker() {
    _ref = DatePicker.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DatePicker.prototype.adapt = function(runner) {
    return runner.adaptDatePicker(this);
  };

  return DatePicker;

})(Field);

Selector = (function(_super) {
  __extends(Selector, _super);

  function Selector(data, val) {
    var mappingOptions;
    mappingOptions = {
      copy: ["selectorData"]
    };
    Selector.__super__.constructor.call(this, data, val, mappingOptions);
  }

  Selector.prototype.adapt = function(runner) {
    return runner.adaptSelector(this);
  };

  Selector.prototype.selectorPairs = function() {
    return this.selectorData;
  };

  Selector.prototype.getSelectorPair = function(prop, value) {
    return this.selectorPairs().filter(function(item) {
      return item[prop] === value;
    })[0];
  };

  Selector.prototype.getDisplayValue = function() {
    if (!this.value()) {
      return "";
    }
    return this.getSelectorPair('id', this.value()).description;
  };

  Selector.prototype.setValueByDescription = function(description) {
    if (!description) {
      return this.value("");
    } else {
      return this.value(this.getSelectorPair('description', description).id);
    }
  };

  return Selector;

})(Field);

MultiValue = (function(_super) {
  __extends(MultiValue, _super);

  function MultiValue() {
    _ref1 = MultiValue.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  MultiValue.prototype.adapt = function(runner) {
    return runner.adaptMultiValue(this);
  };

  return MultiValue;

})(Selector);

CheckBox = (function(_super) {
  __extends(CheckBox, _super);

  function CheckBox() {
    _ref2 = CheckBox.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  CheckBox.prototype.adapt = function(runner) {
    return runner.adaptCheckBox(this);
  };

  return CheckBox;

})(Field);

InputGridRow = (function() {
  function InputGridRow(fieldsData, rowData) {
    var _this = this;
    this.fields = ko.observableArray(fieldsData.map(function(field) {
      return new window[field._type](field, rowData[field.name]);
    }));
    this.isNewRow = true;
    this.allowRemove = true;
    this.visibleFields = ko.computed(function() {
      return _this.fields().filter(function(field) {
        return field.visible();
      });
    });
  }

  InputGridRow.prototype.getFieldByName = function(name) {
    return this.fields().filter(function(field) {
      return field.name() === name;
    })[0];
  };

  InputGridRow.prototype.isRemovable = function() {
    return !this.isNewRow && this.allowRemove;
  };

  return InputGridRow;

})();

InputGrid = (function() {
  function InputGrid(fieldsData, data) {
    this.toggleInputHelper = __bind(this.toggleInputHelper, this);
    this.newRowTemplate = __bind(this.newRowTemplate, this);
    var _this = this;
    this.fieldsData = fieldsData;
    this.fields = ko.observableArray(fieldsData.map(function(field) {
      return new window[field._type](field);
    }));
    this.rows = ko.observableArray(data.map(function(row) {
      return new InputGridRow(fieldsData, row);
    }));
    this.visibleFields = ko.computed(function() {
      return _this.fields().filter(function(field) {
        return field.visible();
      });
    });
  }

  InputGrid.prototype.setTodayInFirstRow = function() {
    return this.rows()[0].getFieldByName('date').value(new Date());
  };

  InputGrid.prototype.setAllCountriesAR = function() {
    return this.realRows().forEach(function(row) {
      return row.getFieldByName('country').value('AR');
    });
  };

  InputGrid.prototype.realRows = function() {
    var _this = this;
    return this.rows().filter(function(row) {
      return _this.rows().indexOf(row) < _this.rows().length - 1;
    });
  };

  InputGrid.prototype.removeRow = function(index) {
    return this.rows.remove(this.rows()[index]);
  };

  InputGrid.prototype.newRowTemplate = function() {
    var row,
      _this = this;
    row = new InputGridRow(this.fieldsData, {});
    this.fields().forEach(function(field) {
      if (field.selectorData) {
        return row.getFieldByName(field.name()).selectorData = field.selectorData;
      }
    });
    row.fields().forEach(function(field) {
      return field.valueChanged = field.value.subscribe(function() {
        row.isNewRow = false;
        row.fields().forEach(function(otherField) {
          return otherField.valueChanged.dispose();
        });
        return _this.rows.notifySubscribers();
      });
    });
    return row;
  };

  InputGrid.prototype.dataMatrix = function() {
    return this.rows().map(function(row) {
      return row.fields().map(function(field) {
        return field.value();
      });
    });
  };

  InputGrid.prototype.getFieldByName = function(name) {
    return this.fields().filter(function(field) {
      return field.name() === name;
    })[0];
  };

  InputGrid.prototype.toggleInputHelper = function(row, col) {
    this.rows()[row].visibleFields()[0].value('X');
    this.rows()[row].visibleFields()[1].value('Y');
    return this.rows()[row].visibleFields()[2].value('Z');
  };

  return InputGrid;

})();
