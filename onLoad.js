$(document).ready(function () {

  var fields = [{ name: 'title', type: 'text', text: "Plain text title", value: null, _type: "Field" },
    { name: 'description', type: 'text', text: "HTML Description", value: null, _type: "Field" },
    { name: 'cover', type: 'text', text: "Cover", value: null, _type: "Field" },
    { name: 'date', type: 'date', text: "Date", value: null, _type: "Field" },
    { name: 'country', type: 'autocomplete', text: "Country", value: null, _type: "Selector", selectorData: [{id:'AR',text:'Argentina'},{id:'BR',text:'Brasil'},{id:'CH',text:'Chile'},{id:'UY',text:'Uruguay'}] },
    { name: 'authors', type: 'multiValue', text: "Authors", value: null, _type: "MultiValue", selectorData: [{id:'CP',text:'Charles Perez'},{id:'NG',text:'Nick Gomez'},{id:'WW',text:'Walter White'},{id:'ER',text:'Edward Rodriguez'}] }
  ];

  var data = [
    {
      title: "Professional JavaScript for Web Developers",
      description: "This <a href='http://bit.ly/sM1bDf'>book</a> provides a developer-level introduction along with more advanced and useful features of <b>JavaScript</b>.",
      cover: "http://ecx.images-amazon.com/images/I/51bRhyVTVGL._SL50_.jpg",
      country: "BR",
      authors: ["CP"]
    },
    {
      title: "JavaScript: The Good Parts",
      description: "This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.",
      cover: "http://ecx.images-amazon.com/images/I/51gdVAEfPUL._SL50_.jpg",
      country: "UY",
      authors: ["NG"]
    },
    {
      title: "JavaScript: The Definitive Guide",
      description: "<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.",
      cover: "http://ecx.images-amazon.com/images/I/51VFNL4T7kL._SL50_.jpg",
      country: "AR",
      authors: ["ER"]
    }
  ];

  inputGrid = new InputGrid(fields, data);
  ko.applyBindings(inputGrid);

  $("#dump").click(function(){
    $("#example1").handsontable("getData").forEach(function(item){console.log(item.select2);});
  });
});