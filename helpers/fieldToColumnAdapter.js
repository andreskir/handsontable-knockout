var DatePickerToColumnAdapter, FieldToColumnAdapter, FieldToColumnAdapterRunner, FieldsToColumnsMapper, MultiValueToColumnAdapter, SelectorToColumnAdapter, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FieldToColumnAdapter = (function() {
  function FieldToColumnAdapter() {}

  FieldToColumnAdapter.prototype.getColumnFor = function(field) {
    var column;
    column = {
      data: this.valueAccessor(field.name()),
      type: "text",
      title: field.text(),
      readOnly: field.isReadOnly()
    };
    if (field.hasPopup()) {
      column.renderer = HasPopupRenderer;
    }
    return column;
  };

  FieldToColumnAdapter.prototype.valueAccessor = function(fieldName) {
    var _this = this;
    return function(row, val) {
      if (typeof val === 'undefined') {
        if (row.isNewRow) {
          return "";
        }
        return _this.getter(row.getFieldByName(fieldName));
      }
      return _this.setter(row.getFieldByName(fieldName), val);
    };
  };

  FieldToColumnAdapter.prototype.getter = function(field) {
    return field.value();
  };

  FieldToColumnAdapter.prototype.setter = function(field, val) {
    return field.value(val);
  };

  return FieldToColumnAdapter;

})();

DatePickerToColumnAdapter = (function(_super) {
  __extends(DatePickerToColumnAdapter, _super);

  function DatePickerToColumnAdapter() {
    _ref = DatePickerToColumnAdapter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DatePickerToColumnAdapter.prototype.getColumnFor = function(field) {
    var column;
    column = DatePickerToColumnAdapter.__super__.getColumnFor.call(this, field);
    column.type = "date";
    return column;
  };

  return DatePickerToColumnAdapter;

})(FieldToColumnAdapter);

SelectorToColumnAdapter = (function(_super) {
  __extends(SelectorToColumnAdapter, _super);

  function SelectorToColumnAdapter() {
    _ref1 = SelectorToColumnAdapter.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  SelectorToColumnAdapter.prototype.getColumnFor = function(field) {
    var column;
    column = SelectorToColumnAdapter.__super__.getColumnFor.call(this, field);
    column.type = "autocomplete";
    column.getSourceAt = function(row) {
      return row.getFieldByName(field.name()).selectorPairs().filter(function(item) {
        return item.id;
      }).map(function(item) {
        return item.description;
      });
    };
    column.strict = true;
    return column;
  };

  SelectorToColumnAdapter.prototype.valueAccessor = function(fieldName) {
    var _this = this;
    return function(row, val) {
      if (typeof val === 'undefined') {
        if (row.isNewRow) {
          return "";
        }
        return _this.getter1(row.getFieldByName(fieldName));
      }
      return _this.setter1(row.getFieldByName(fieldName), val);
    };
  };

  SelectorToColumnAdapter.prototype.getter1 = function(selector) {
    return selector.getDisplayValue();
  };

  SelectorToColumnAdapter.prototype.setter1 = function(selector, val) {
    return selector.setValueByDescription(val);
  };

  return SelectorToColumnAdapter;

})(FieldToColumnAdapter);

MultiValueToColumnAdapter = (function(_super) {
  __extends(MultiValueToColumnAdapter, _super);

  function MultiValueToColumnAdapter() {
    _ref2 = MultiValueToColumnAdapter.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  MultiValueToColumnAdapter.prototype.getColumnFor = function(field) {
    var column;
    column = MultiValueToColumnAdapter.__super__.getColumnFor.call(this, field);
    column.type = "multiValue";
    column.selectorData = field.selectorPairs().filter(function(item) {
      return item.id;
    }).map(function(item) {
      return {
        id: item.id,
        text: item.description
      };
    });
    column.width = 200;
    return column;
  };

  return MultiValueToColumnAdapter;

})(FieldToColumnAdapter);

FieldToColumnAdapterRunner = (function() {
  function FieldToColumnAdapterRunner() {}

  FieldToColumnAdapterRunner.prototype.adaptField = function(field) {
    return new FieldToColumnAdapter().getColumnFor(field);
  };

  FieldToColumnAdapterRunner.prototype.adaptDatePicker = function(datePicker) {
    return new DatePickerToColumnAdapter().getColumnFor(datePicker);
  };

  FieldToColumnAdapterRunner.prototype.adaptSelector = function(selector) {
    return new SelectorToColumnAdapter().getColumnFor(selector);
  };

  FieldToColumnAdapterRunner.prototype.adaptMultiValue = function(multiValue) {
    return new MultiValueToColumnAdapter().getColumnFor(multiValue);
  };

  return FieldToColumnAdapterRunner;

})();

FieldsToColumnsMapper = (function() {
  function FieldsToColumnsMapper() {}

  FieldsToColumnsMapper.map = function(fields) {
    return fields.map(function(field) {
      return field.adapt(new FieldToColumnAdapterRunner());
    });
  };

  return FieldsToColumnsMapper;

})();
