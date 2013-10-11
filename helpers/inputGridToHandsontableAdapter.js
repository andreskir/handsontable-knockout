var InputGridToHandsontableAdapter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

InputGridToHandsontableAdapter = (function() {
  function InputGridToHandsontableAdapter(inputGrid) {
    this.afterSet = __bind(this.afterSet, this);
    this.beforeSet = __bind(this.beforeSet, this);
    this.inputGrid = inputGrid;
  }

  InputGridToHandsontableAdapter.prototype.adapt = function() {
    var _this = this;
    return {
      data: this.inputGrid.rows,
      columns: new FieldsToColumnsMapper(this.beforeSet, this.afterSet).map(this.inputGrid.visibleFields()),
      allowAdd: true,
      dataSchema: this.inputGrid.newRowTemplate,
      isRemovable: function(row) {
        return row.isRemovable();
      },
      isNewRow: function(row) {
        return row.isNewRow;
      },
      toggleInputHelper: this.inputGrid.toggleInputHelper,
      isSetting: function() {
        return _this.isSetting;
      }
    };
  };

  InputGridToHandsontableAdapter.prototype.beforeSet = function() {
    return this.inputGrid.handsontableIsSettingValue = true;
  };

  InputGridToHandsontableAdapter.prototype.afterSet = function() {
    return this.inputGrid.handsontableIsSettingValue = false;
  };

  return InputGridToHandsontableAdapter;

})();
