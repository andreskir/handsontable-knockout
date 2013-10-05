var InputGridToHandsontableAdapter;

InputGridToHandsontableAdapter = (function() {
  function InputGridToHandsontableAdapter() {}

  InputGridToHandsontableAdapter.prototype.adapt = function(inputGrid) {
    return {
      data: inputGrid.rows,
      columns: FieldsToColumnsMapper.map(inputGrid.visibleFields()),
      allowAdd: true,
      dataSchema: inputGrid.newRowTemplate,
      isRemovable: function(row) {
        return row.isRemovable();
      },
      isNewRow: function(row) {
        return row.isNewRow;
      },
      toggleInputHelper: inputGrid.toggleInputHelper
    };
  };

  return InputGridToHandsontableAdapter;

})();
