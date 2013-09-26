$(document).ready(function () {

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
      authors: ["NG","WW"]
    },
    {
      title: "JavaScript: The Definitive Guide",
      description: "<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.",
      cover: "http://ecx.images-amazon.com/images/I/51VFNL4T7kL._SL50_.jpg",
      country: "AR",
      authors: ["ER"]
    }
  ];

  viewModel = new ViewModel(data);
  ko.applyBindings(viewModel);

  $("#dump").click(function(){
    $("#example1").handsontable("getData").forEach(function(item){console.log(item.select2);});
  });
});