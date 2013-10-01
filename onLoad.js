$(document).ready(function () {

  var fields = [{ name: 'title', type: 'text', text: "Plain text title", value: 'A', _type: "Field" },
    { name: 'description', type: 'text', text: "HTML Description", value: 'B', _type: "Field" },
    { name: 'cover', type: 'text', text: "Cover", value: null, _type: "Field" },
    { name: 'date', type: 'date', text: "Date", value: null, _type: "Field" },
    { name: 'country', type: 'autocomplete', text: "Country", value: null, _type: "Selector", selectorData: [{id:'AR',text:'Argentina'},{id:'BR',text:'Brasil'},{id:'CH',text:'Chile'},{id:'UY',text:'Uruguay'}] },
    { name: 'authors', type: 'multiValue', text: "Authors", value: null, _type: "MultiValue", selectorData: [{id:'CP',text:'Charles Perez'},{id:'NG',text:'Nick Gomez'},{id:'WW',text:'Walter White'},{id:'ER',text:'Edward Rodriguez'}] },
    { name: 'notes', type: 'text', text: "Notes", value: null, _type: "Field" },
  ];

  var data = [
    // {
    //   title: "Professional JavaScript for Web Developers",
    //   description: "",
    //   cover: "http://ecx.images-amazon.com/images/I/51bRhyVTVGL._SL50_.jpg",
    //   country: "BR",
    //   authors: ["CP"]
    // },
    // {
    //   title: "JavaScript: The Good Parts",
    //   description: "",
    //   cover: "http://ecx.images-amazon.com/images/I/51gdVAEfPUL._SL50_.jpg",
    //   country: "UY",
    //   authors: ["NG"]
    // },
    // {
    //   title: "JavaScript: The Definitive Guide",
    //   description: "",
    //   cover: "http://ecx.images-amazon.com/images/I/51VFNL4T7kL._SL50_.jpg",
    //   country: "AR",
    //   authors: ["ER"]
    // }
  ];

  inputGrid = new InputGrid(fields, data);
  ko.applyBindings(inputGrid);

  $("#dump").click(function(){
    $("#example1").handsontable("getData").forEach(function(item){console.log(item.select2);});
  });
});