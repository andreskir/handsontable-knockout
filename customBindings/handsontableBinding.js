ko.bindingHandlers.handsontable = {
 init: function (element, valueAccessor, allBindingsAccessor) {
     var value = valueAccessor();   
     var colHeaders = ["Plain text title", "HTML Description", "Cover", "Country"];

     $(element).handsontable({
        data: value(),
        minSpareRows: 1,
        dataSchema: function(){ return new Album({ title: null, description: null, cover: null, country: null }) },
        columns: [
            {data: property("title"), width: "200"},
            {data: property("description"), width: "200" },
            {data: property("cover"), width: "200" },
            {data: property("country"), type: "select2", width: "200", selectorData: [{id:'AR',text:'Argentina'},{id:'BR',text:'Brasil'},{id:'CH',text:'Chile'},{id:'UY',text:'Uruguay'}] }
        ],
        removeRowPlugin: true,
        removeRow: function(row){ value.remove(value()[row]); }
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
