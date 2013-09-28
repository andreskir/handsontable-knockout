var FieldToColumnAdapter, FieldToColumnAdapterRunner, FieldsToColumnsMapper, SelectorToColumnAdapter, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FieldToColumnAdapter = (function() {
  function FieldToColumnAdapter() {}

  FieldToColumnAdapter.getColumnFor = function(field) {
    return {
      data: this.valueAccessor(field.name()),
      type: field.type(),
      title: field.text()
    };
  };

  FieldToColumnAdapter.valueAccessor = function(fieldName) {
    return function(row, val) {
      if (typeof val === 'undefined') {
        return row.getFieldByName(fieldName).value();
      }
      return row.getFieldByName(fieldName).value(val);
    };
  };

  return FieldToColumnAdapter;

})();

SelectorToColumnAdapter = (function(_super) {
  __extends(SelectorToColumnAdapter, _super);

  function SelectorToColumnAdapter() {
    _ref = SelectorToColumnAdapter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SelectorToColumnAdapter.getColumnFor = function(field) {
    var column;
    column = SelectorToColumnAdapter.__super__.constructor.getColumnFor.call(this, field);
    column.source = field.selectorData().map(function(item) {
      return item.text();
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

FieldToColumnAdapterRunner = (function() {
  function FieldToColumnAdapterRunner() {}

  FieldToColumnAdapterRunner.prototype.adaptField = function(field) {
    return FieldToColumnAdapter.getColumnFor(field);
  };

  FieldToColumnAdapterRunner.prototype.adaptSelector = function(selector) {
    return SelectorToColumnAdapter.getColumnFor(selector);
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
