$(document).ready(function () {

  var data = [
    {
      title: "Professional JavaScript for Web Developers",
      description: "This <a href='http://bit.ly/sM1bDf'>book</a> provides a developer-level introduction along with more advanced and useful features of <b>JavaScript</b>.",
      cover: "http://ecx.images-amazon.com/images/I/51bRhyVTVGL._SL50_.jpg",
      select2: null
    },
    {
      title: "JavaScript: The Good Parts",
      description: "This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.",
      cover: "http://ecx.images-amazon.com/images/I/51gdVAEfPUL._SL50_.jpg",
      select2: null
    },
    {
      title: "JavaScript: The Definitive Guide",
      description: "<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.",
      cover: "http://ecx.images-amazon.com/images/I/51VFNL4T7kL._SL50_.jpg",
      select2: "AR"
    }
  ];

  var $container = $("#example1");
  $container.handsontable({
    data: data,
    colHeaders: ["Plain text title", "HTML Description", "Cover", "Country"],
    minSpareRows: 1,
    columns: [
        {data: "title", width: "200"},
        {data: "description", width: "200" },
        {data: "cover", width: "200" },
        {data: "select2", type: "select2", width: "200", selectorData: [{id:'AR',text:'Argentina'},{id:'BR',text:'Brasil'},{id:'CH',text:'Chile'},{id:'UY',text:'Uruguay'}] }
    ]
  });
  $("#dump").click(function(){
    $("#example1").handsontable("getData").forEach(function(item){console.log(item.select2);});
  });
});