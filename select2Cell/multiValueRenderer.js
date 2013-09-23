function MultiValueRenderer (instance, td, row, col){
  Select2Renderer.call(this,instance,td,row,col);
  this.isOpened = false;
}

Handsontable.helper.inherit(MultiValueRenderer, Select2Renderer);

MultiValueRenderer.prototype.bindMyEvents = function(){
  var self = this;
  this.select2.on("select2-open",function(){ self.isOpened = true });
  this.select2.on("select2-close",function(){
    setTimeout(function(){ self.isOpened = false },0) //otherwise keyDown is trigged after isOpened is set to false
  });
  this.select2.on("change",function(){
    setTimeout(function(){ self.renderInstance();});
  });
};

MultiValueRenderer.prototype.defaultOptions = $.extend(true,{multiple:true},Select2Renderer.prototype.defaultOptions);

MultiValueRenderer.prototype.returnPressed = function(){
  if(!this.isOpened)
    this.finishEditing();
};
MultiValueRenderer.prototype.shouldBeginEditing = function(keyCode){
  return Handsontable.helper.isPrintableChar(keyCode) || keyCode==8; // or backspace
}
MultiValueRenderer.prototype.shouldDeleteAndRehook = function(keyCode){
  return keyCode==46; //delete
}


Handsontable.MultiValueRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  if(!cellProperties.select2Renderer){
    cellProperties.select2Renderer = new MultiValueRenderer(instance, td, row, col);
    cellProperties.select2Renderer.createElements(cellProperties.selectorData, value);
  }
  return td;
};

Handsontable.MultiValueCell = {
	editor: Handsontable.Select2Editor,
	renderer: Handsontable.MultiValueRenderer
};
Handsontable.cellTypes.multiValue = Handsontable.MultiValueCell;
