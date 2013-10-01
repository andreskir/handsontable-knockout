var DatePickerToColumnAdapter, FieldToColumnAdapter, FieldToColumnAdapterRunner, FieldsToColumnsMapper, MultiValueToColumnAdapter, SelectorToColumnAdapter, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FieldToColumnAdapter = (function() {
  function FieldToColumnAdapter() {}

  FieldToColumnAdapter.getColumnFor = function(field) {
    var column;
    column = {
      data: this.valueAccessor(field.name()),
      type: "text",
      title: field.text()
    };
    if (field.hasPopup) {
      column.renderer = HasPopupRenderer;
    }
    return column;
  };

  FieldToColumnAdapter.valueAccessor = function(fieldName) {
    return function(row, val) {
      if (typeof val === 'undefined') {
        if (row.isNewRow) {
          return "";
        }
        if (typeof val === 'undefined') {
          return row.getFieldByName(fieldName).value();
        }
      }
      return row.getFieldByName(fieldName).value(val);
    };
  };

  return FieldToColumnAdapter;

})();

DatePickerToColumnAdapter = (function(_super) {
  __extends(DatePickerToColumnAdapter, _super);

  function DatePickerToColumnAdapter() {
    _ref = DatePickerToColumnAdapter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DatePickerToColumnAdapter.getColumnFor = function(field) {
    var column;
    column = DatePickerToColumnAdapter.__super__.constructor.getColumnFor.call(this, field);
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

  SelectorToColumnAdapter.getColumnFor = function(field) {
    var column;
    column = SelectorToColumnAdapter.__super__.constructor.getColumnFor.call(this, field);
    column.type = "autocomplete";
    column.source = field.selectorPairs().map(function(item) {
      return item.description;
    });
    column.strict = true;
    return column;
  };

  SelectorToColumnAdapter.valueAccessor = function(fieldName) {
    return function(row, val) {
      if (typeof val === 'undefined') {
        return row.getFieldByName(fieldName).getDisplayValue();
      }
      return row.getFieldByName(fieldName).setValue(val);
    };
  };

  return SelectorToColumnAdapter;

}).call(this, FieldToColumnAdapter);

MultiValueToColumnAdapter = (function(_super) {
  __extends(MultiValueToColumnAdapter, _super);

  function MultiValueToColumnAdapter() {
    _ref2 = MultiValueToColumnAdapter.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  MultiValueToColumnAdapter.getColumnFor = function(field) {
    var column;
    column = MultiValueToColumnAdapter.__super__.constructor.getColumnFor.call(this, field);
    column.type = "multiValue";
    column.selectorData = field.selectorPairs().map(function(item) {
      return {
        id: item.id,
        text: item.description
      };
    });
    column.width = 200;
    return column;
  };

  MultiValueToColumnAdapter.valueAccessor = function(fieldName) {
    return function(row, val) {
      if (typeof val === 'undefined') {
        return row.getFieldByName(fieldName).value();
      }
      return row.getFieldByName(fieldName).value(val);
    };
  };

  return MultiValueToColumnAdapter;

}).call(this, SelectorToColumnAdapter);

FieldToColumnAdapterRunner = (function() {
  function FieldToColumnAdapterRunner() {}

  FieldToColumnAdapterRunner.prototype.adaptField = function(field) {
    return FieldToColumnAdapter.getColumnFor(field);
  };

  FieldToColumnAdapterRunner.prototype.adaptDatePicker = function(datePicker) {
    return DatePickerToColumnAdapter.getColumnFor(datePicker);
  };

  FieldToColumnAdapterRunner.prototype.adaptSelector = function(selector) {
    return SelectorToColumnAdapter.getColumnFor(selector);
  };

  FieldToColumnAdapterRunner.prototype.adaptMultiValue = function(multiValue) {
    return MultiValueToColumnAdapter.getColumnFor(multiValue);
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
