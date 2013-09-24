ko.bindingHandlers.handsontable = {
 init: function (element, valueAccessor, allBindingsAccessor) {
     var options = valueAccessor();   

     $(element).handsontable({
        data: options.data(),
        minSpareRows: 1,
        dataSchema: function(){ return new Album({ title: null, description: null, cover: null, country: null, authors: null }) },
        colHeaders: getColumnsTitles(options.columns),
        columns: options.columns,
        removeRowPlugin: true,
        removeRowFunction: function(row){ options.data.remove(options.data()[row]); },
        isRemovable: function(row) { return !options.data()[row].title(); },
        colMaxWidth: 250,
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
      width: 200,
      type: field.type,
      selectorData: field.selectorData,
      title: field.text
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