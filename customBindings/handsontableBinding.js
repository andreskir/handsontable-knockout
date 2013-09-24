ko.bindingHandlers.handsontable = {
 init: function (element, valueAccessor, allBindingsAccessor) {
     var value = valueAccessor();   
     var colHeaders = ["Plain text title", "HTML Description", "Cover", "Country"];

     $(element).handsontable({
        data: value(),
        minSpareRows: 1,
        dataSchema: function(){ return new Album({ title: null, description: null, cover: null, country: null }) },
        colHeaders: colHeaders,
        columns: [
            {data: property("title") },
            {data: property("description") },
            {data: property("cover") },
            {data: property("country"), type: "select2", selectorData: [{id:'AR',text:'Argentina'},{id:'BR',text:'Brasil'},{id:'CH',text:'Chile'},{id:'UY',text:'Uruguay'}] }
        ],
        removeRowPlugin: true,
        removeRowFunction: function(row){ value.remove(value()[row]); },
        isRemovable: function(row) { return !value()[row].title(); },
        colMaxWidth: 250
     });

 },
 update: function (element, valueAccessor, allBindingsAccessor) {
     $(element).handsontable("getInstance").render();
 }
};

function property(attr) {
  return function (item, val) {
    if (typeof val === 'undefined') {
      return item[attr]();
    }
    return item[attr](val);
  }
}
