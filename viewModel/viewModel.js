var Field, InputGrid, Row, Selector, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Field = (function() {
  function Field(data, val) {
    ko.mapping.fromJS(data, {}, this);
    if (typeof val !== 'undefined') {
      this.value(val);
    }
    delete this.__ko_mapping__;
  }

  Field.prototype.adapt = function(runner) {
    return runner.adaptField(this);
  };

  return Field;

})();

Selector = (function(_super) {
  __extends(Selector, _super);

  function Selector() {
    _ref = Selector.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Selector.prototype.adapt = function(runner) {
    return runner.adaptSelector(this);
  };

  Selector.prototype.getSelectorPair = function(prop, value) {
    return this.selectorData().filter(function(item) {
      return item[prop]() === value;
    })[0];
  };

  Selector.prototype.getDisplayValue = function() {
    if (!this.value()) {
      return "";
    }
    return this.getSelectorPair('id', this.value()).text();
  };

  Selector.prototype.setValue = function(text) {
    if (!text) {
      return this.value("");
    } else {
      return this.value(this.getSelectorPair('text', text).id());
    }
  };

  return Selector;

})(Field);

Row = (function() {
  function Row(fieldsData, rowData) {
    this.fields = ko.observableArray(fieldsData.map(function(field) {
      return new window[field._type](field, rowData[field.name]);
    }));
  }

  Row.prototype.getFieldByName = function(name) {
    return this.fields().filter(function(field) {
      return field.name() === name;
    })[0];
  };

  return Row;

})();

InputGrid = (function() {
  function InputGrid(fieldsData, data) {
    this.newRowTemplate = __bind(this.newRowTemplate, this);
    this.fieldsData = fieldsData;
    this.fields = ko.observableArray(fieldsData.map(function(field) {
      return new window[field._type](field);
    }));
    this.rows = ko.observableArray(data.map(function(row) {
      return new Row(fieldsData, row);
    }));
  }

  InputGrid.prototype.setDateAsFirstTitle = function() {
    return this.rows()[0].getFieldByName('title').value(new Date());
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
    return new Row(this.fieldsData, {});
  };

  InputGrid.prototype.dataMatrix = function() {
    return this.rows().map(function(row) {
      return row.fields().map(function(field) {
        return field.value();
      });
    });
  };

  return InputGrid;

})();
