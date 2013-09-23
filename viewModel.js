function Album(data){
	ko.mapping.fromJS(data);
}

function ViewModel(albums){
	var self = this;
	this.albums = ko.observableArray();

	albums.forEach(function(album){
		self.albums.push(new Album(album))
	});
}