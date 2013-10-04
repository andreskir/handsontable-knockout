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
      isRemovable: function (row) { return options.isRemovable(options.data()[row]); },
      colMaxWidth: 150,
      enterBeginsEditing: true,
      afterCreateRow: function () {
        options.data.notifySubscribers();
      },
      beforeRender: function(changes, source) {
        var totalWidth = 50;
        for(i=0;i<this.countCols();i++){ 
          totalWidth+=this.getColWidth(i);
        }
        $(element).width(totalWidth);
      },
      isEmptyRow: function(row){
        return options.data()[row].isNewRow;
      },
      cells: function(row,col,prop){
        if(this.getSourceAt)
          this.source = this.getSourceAt(options.data()[row]);
      },
      toggleInputHelper: options.toggleInputHelper,
      width: 900
    });
  },
  update: function (element, valueAccessor) {
    var options = valueAccessor();
    var dummy = options.data().length;
    var instance = $(element).handsontable("getInstance");
    if(options.allowAdd && !instance.isEmptyRow(instance.countRows()-1))
      instance.alter('insert_row',0,-1); //hack para que internamente ejecute adjustRowsAndCols y se de cuenta que tiene que agregar una fila
    instance.render();
  }
};

var getColumnsTitles = function (columns) {
  return columns.map(function (col) { return col.title; });
}