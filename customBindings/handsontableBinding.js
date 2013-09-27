ko.bindingHandlers.handsontable = {
 init: function (element, valueAccessor, allBindingsAccessor) {
     var options = valueAccessor();   

     $(element).handsontable({
        data: options.data(),
        minSpareRows: options.allowAdd ? 1 : 0,
        dataSchema: options.dataSchema,
        colHeaders: getColumnsTitles(options.columns),
        columns: options.columns,
        removeRowPlugin: true,
        removeRowFunction: function(row){ options.data.remove(options.data()[row]); },
        isRemovable: function(row) { return !options.data()[row].title(); },
        colMaxWidth: 150,
        enterBeginsEditing: false
     });

 },
 update: function (element, valueAccessor, allBindingsAccessor) {
     $(element).handsontable("getInstance").render();
 }
};

var getColumnsTitles = function(columns){
    return columns.map(function(col){ return col.title });
}

var adaptFieldsToHandsontableColumns = function(fields){
  return fields.map(function(field){
    return { 
      data: property(field.name),
      type: field.type,
      source: field.selectorData ? field.selectorData.map(function(item){return item.text}) : [],
      title: field.text,
      strict: true
    };
  });
}

var property = function (attr) {
  return function (item, val) {
    if (typeof val === 'undefined') {
      return item[attr]();
    }
    return item[attr](val);
  }
}