ko.bindingHandlers.handsontable = {
  init: function (element, valueAccessor) {
    var options = valueAccessor();

    $(element).handsontable({
      data: options.data(),
      minSpareRows: options.allowAdd ? 1 : 0,
      dataSchema: options.dataSchema,
      colHeaders: getColumnsTitles(options.columns),
      columns: options.columns,
      removeRowPlugin: true,
      removeRowFunction: function (row) { options.data.remove(options.data()[row]); },
      isRemovable: function (row) { return options.isRemovable() },
      colMaxWidth: 150,
      enterBeginsEditing: true,
      afterCreateRow: function () {
        options.data.notifySubscribers();
      },
      beforeChange: function (changes, source) {
        if (source == 'edit') {
          var newValue = changes[0][3];
          if (newValue) {
            var row = changes[0][0];
            options.markRowAsOld(options.data()[row]);
          }
        }
      },
      width: 900
    });
  },
  update: function (element, valueAccessor) {
    var value = valueAccessor();
    $(element).handsontable("getInstance").render();
  }
};

var getColumnsTitles = function (columns) {
  return columns.map(function (col) { return col.title; });
}