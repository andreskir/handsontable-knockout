var getColumnsTitles;

ko.bindingHandlers.handsontable = {
  init: function(element, valueAccessor) {
    var options;
    options = valueAccessor();
    return $(element).handsontable({
      data: options.data(),
      minSpareRows: (options.allowAdd ? 1 : 0),
      dataSchema: options.dataSchema,
      colHeaders: getColumnsTitles(options.columns),
      columns: options.columns,
      removeRowPlugin: true,
      removeRowFunction: function(row) {
        return options.data.remove(options.data()[row]);
      },
      isRemovable: function(row) {
        return options.isRemovable(options.data()[row]);
      },
      colMaxWidth: 150,
      enterBeginsEditing: true,
      afterCreateRow: function() {
        return options.data.notifySubscribers();
      },
      beforeRender: function(changes, source) {
        var i, totalWidth;
        totalWidth = 50;
        i = 0;
        while (i < this.countCols()) {
          totalWidth += this.getColWidth(i);
          i++;
        }
        return $(element).width(totalWidth);
      },
      isEmptyRow: function(row) {
        return options.isNewRow(options.data()[row]);
      },
      cells: function(row, col, prop) {
        if (this.getSourceAt) {
          return this.source = this.getSourceAt(options.data()[row]);
        }
      },
      toggleInputHelper: options.toggleInputHelper,
      width: 900
    });
  },
  update: function(element, valueAccessor, allbinding, viewModel) {
    var dummy, instance, options;
    options = valueAccessor();
    dummy = options.data().length;
    if (!viewModel.handsontableIsSettingValue) {
      instance = $(element).handsontable("getInstance");
      if (options.allowAdd && !instance.isEmptyRow(instance.countRows() - 1)) {
        instance.alter("insert_row", 0, -1);
      }
      return instance.render();
    }
  }
};

getColumnsTitles = function(columns) {
  return columns.map(function(col) {
    return col.title;
  });
};
