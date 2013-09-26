function Album(data){
  ko.mapping.fromJS(data, {}, this);
  delete this.__ko_mapping__;
}

function ViewModel(albums){
  var self = this;
  this.albums = ko.observableArray();

  this.setDateAsFirstTitle = function(){
    self.albums()[0].title(new Date());
  }

  this.setAllCountriesAR = function(){
    self.realAlbums().forEach(function(item){
      item.country(['AR']);
    });
  }

  this.realAlbums = function(){
    return self.albums().filter(function(album){ return self.albums().indexOf(album) < self.albums().length -1 });
  }

  this.removeAlbum = function(index){
    self.albums.remove(self.albums()[index])
  }

  this.fields = ko.observableArray([
    { name: 'title', type: 'text', text: "Plain text title" },
    { name: 'description', type: 'text', text: "HTML Description" },
    { name: 'cover', type: 'text', text: "Cover" },
    { name: 'country', type: 'select2', text: "Country", selectorData: [{id:'AR',text:'Argentina'},{id:'BR',text:'Brasil'},{id:'CH',text:'Chile'},{id:'UY',text:'Uruguay'}] },
    { name: 'authors', type: 'multiValue', text: "Authors", selectorData: [{id:'CP',text:'Charles Perez'},{id:'NG',text:'Nick Gomez'},{id:'WW',text:'Walter White'},{id:'ER',text:'Edward Rodriguez'}] }
  ]);

  albums.forEach(function(album){
    self.albums.push(new Album(album))
  });
}