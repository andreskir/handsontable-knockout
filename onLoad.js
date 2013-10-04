$(document).ready(function () {

  countries = [{id:null,description:''},{id:'AR',description:'Argentina'},{id:'BR',description:'Brasil'},{id:'CH',description:'Chile'},{id:'UY',description:'Uruguay'}];
  authors = [{id:null,description:''},{id:'CP',description:'Charles Perez'},{id:'NG',description:'Nick Gomez'},{id:'WW',description:'Walter White'},{id:'ER',description:'Edward Rodriguez'}];
  formats = [{id:null,description:''},{id:'LP',description:'Long Play'},{id:'C',description:'Cassette'},{id:'CD',description:'Compact Disk'},{id:'BR',description:'Blue Ray'},{id:'MP3',description:'MP3'}]

  var fields = [{ name: 'title', text: "Plain text title", value: 'A', _type: "Field", visible: true, isReadOnly: false },
    { name: 'description', text: "HTML Description", hasPopup: function(){return true}, value: 'B', _type: "Field", visible: true, isReadOnly: false },
    { name: 'cover', text: "Cover", value: null, _type: "Field", visible: true, isReadOnly: false },
    { name: 'date', text: "Date", value: null, _type: "DatePicker", visible: true, isReadOnly: false },
    { name: 'dummy1', value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'format', text: "Format", value: null, _type: "Selector", selectorData: [], visible: true, isReadOnly: false },
    { name: 'dummy2', value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'country', text: "Country", value: 'AR', _type: "Selector", selectorData: [], visible: true, isReadOnly: false },
    { name: 'dummy3', value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'authors', text: "Authors", value: ["WW"], _type: "MultiValue", selectorData: [], visible: true, isReadOnly: false },
    { name: 'dummy4', value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'notes', text: "Notes", value: null, _type: "Field", visible: true, isReadOnly: true },
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

  inputGrid.getFieldByName('country').selectorData = countries;
  inputGrid.getFieldByName('authors').selectorData = authors;
  inputGrid.getFieldByName('format').selectorData = formats;

  ko.applyBindings(inputGrid);
});