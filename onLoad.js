$(document).ready(function () {

  countries = [{id:null,description:''},{id:'AR',description:'Argentina'},{id:'BR',description:'Brasil'},{id:'CH',description:'Chile'},{id:'UY',description:'Uruguay'}];
  authors = [{id:null,description:''},{id:'CP',description:'Charles Perez'},{id:'NG',description:'Nick Gomez'},{id:'WW',description:'Walter White'},{id:'ER',description:'Edward Rodriguez'}];
  formats = [{id:null,description:''},{id:'LP',description:'Long Play'},{id:'C',description:'Cassette'},{id:'CD',description:'Compact Disk'},{id:'BR',description:'Blue Ray'},{id:'MP3',description:'MP3'}]

  var fields = [{ name: 'title',type: "string", text: "Plain text title", value: 'A', _type: "Field", visible: true, isReadOnly: false },
    { name: 'description', type: "string", text: "HTML Description", hasPopup: function(){return true}, value: 'B', _type: "Field", visible: true, isReadOnly: false },
    { name: 'duration', type: "integer", text: "Duration", value: null, _type: "Field", visible: true, isReadOnly: false },
    { name: 'date', type: "date", required: true, text: "Date", value: null, _type: "DatePicker", visible: true, isReadOnly: false },
    { name: 'dummy1', type: "string", value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'format', type: "string", text: "Format", value: null, _type: "Selector", selectorData: [], visible: true, isReadOnly: false },
    { name: 'dummy2', type: "string", value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'country', type: "string", text: "Country", value: 'BR', _type: "Selector", selectorData: [], visible: true, isReadOnly: false },
    { name: 'dummy3', type: "string", value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'authors', text: "Authors",type: "string",  value: ["WW"], _type: "MultiValue", selectorData: [], visible: true, isReadOnly: false },
    { name: 'dummy4', type: "string", value: null, _type: "Field", visible: false, isReadOnly: false },
    { name: 'notes', type: "string", text: "Notes", value: null, _type: "Field", visible: true, isReadOnly: true },
  ];

  inputGrid = new InputGrid(fields, []);

  inputGrid.getFieldByName('country').selectorData = countries;
  inputGrid.getFieldByName('authors').selectorData = authors;
  inputGrid.getFieldByName('format').selectorData = formats;

  ko.applyBindings(inputGrid);
});