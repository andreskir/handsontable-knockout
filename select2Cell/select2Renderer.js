function Select2Renderer (instance, td, row, col){

    var self = this;
    this.instance = instance;
    this.td = td;
    this.row = row;
    this.col = col;

    this.createElements = function(selectorData,value) {
      self.defaultOptions.data = selectorData;
      var $select = $('<input class="select2Element" style="width: 100%" tabindex="-1">');
      $select.appendTo(self.td);
      self.select2 = $select.select2(self.defaultOptions);
      self.setValue(value);
      this.bindOnBlur();
      this.bindOnOpening();
      this.bindMyEvents();
    };

    this.setValue = function(value){
      self.select2.select2("val",value);
    }

    this.selectCurrentCell = function(){
      self.instance.selectCell(self.row,self.col,self.row,self.col,false);
    };

    this.bindOnBlur = function(){
      self.select2.on("select2-blur",function(){
        self.saveData();
      });
    };

    this.bindOnOpening = function() {
      self.select2.on("select2-opening",function(){
        if(self.instance.getSelected() && !arraysEqual(self.instance.getSelected(),[self.row,self.col,self.row,self.col]))
          self.selectCurrentCell();
        self.select2.select2("container").find(".select2-input").off('keydown.exitKeys').on('keydown.exitKeys', self.exitKeys);        
      });
    };

    this.exitKeys = function (event) {

        switch (event.keyCode) {

          case 9: /* tab */
            self.finishEditing();
            event.preventDefault();
            break;

          case 39: /* arrow right */
            self.finishEditing();
            break;

          case 37: /* arrow left */
            self.finishEditing();
            break;

          case 27: /* ESC */
            self.finishEditing();
            break;

          case 13: /* return/enter */
            self.returnPressed();
            break;
          default:
            event.stopImmediatePropagation(); //backspace, delete, home, end, CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)
            break;
        }
    };

    this.finishEditing = function() {
      self.saveData();
      self.select2.select2("close");
      self.selectCurrentCell(); //removes focus from select2 and triggers Editor where hookOnce is binded
    };
    this.saveData = function(){
      self.instance.populateFromArray(self.row, self.col, self.getValue(), null, null, 'edit');
    };

    var arraysEqual = function(arr1, arr2) {
      for (var i=0;i<arr1.length;i++){
          if (arr1[i] != arr2[i]) return false;
      }
      return true;
    };

    this.renderInstance = function(){
      this.instance.render();
    };
    this.getValue = function(){
      return [[self.select2.select2("val")]];
    };
    this.addHookOnce = function(){
      self.instance.addHookOnce('beforeKeyDown', self.beforeKeyDownHook);
    };

    this.beforeKeyDownHook = function(event) {
      if (self.shouldBeginEditing(event.keyCode)) {
        event.stopImmediatePropagation();
        self.beginEditing();
      }  else if (self.shouldDeleteAndRehook(event.keyCode)){ 
        self.select2.select2("val","");
        self.addHookOnce();
      }  else if (self.shouldRehook(event.keyCode)){
        self.addHookOnce();
      }
    };

    this.beginEditing = function(){
      self.select2.select2("open");
    };
}

Select2Renderer.prototype.defaultOptions = {
        placeholder: "Select report type",
        allowClear: true,
        openOnEnter: false
}

Select2Renderer.prototype.bindMyEvents = function(){
  var self = this;
  this.bindOnSelecting();
}

Select2Renderer.prototype.bindOnSelecting = function(){
  var self = this;
  this.select2.on("select2-selecting",function(){setTimeout(function(){self.selectCurrentCell()}, 0)}); //otherwise select2 triggers focus after selecting CurrentCell
}

Select2Renderer.prototype.returnPressed = function(){
  this.finishEditing();
}

Select2Renderer.prototype.shouldBeginEditing = function(keyCode){
  return Handsontable.helper.isPrintableChar(keyCode);
}

Select2Renderer.prototype.shouldDeleteAndRehook = function(keyCode){
  return [8, 46].indexOf(keyCode)>=0; //backspace or delete
}

Select2Renderer.prototype.shouldRehook = function(keyCode){
  return [9, 33, 34, 35, 36, 37, 38, 39, 40, 13].indexOf(keyCode) == -1; // other non printable character
}

Handsontable.Select2Renderer = function (instance, td, row, col, prop, value, cellProperties) {
  var $td = $(td);
  if(!$td.data("renderer")){
    var renderer = new Select2Renderer(instance, td, row, col);
    renderer.createElements(cellProperties.selectorData, value);
    $td.data("renderer",renderer);
  }
  else
    $td.data("renderer").setValue(value);
  return td;
}

Handsontable.Select2Editor = function (instance, td, row, col, prop, value, cellProperties) {
  var $td = $(td);
  $td.data("renderer").addHookOnce();
}

Handsontable.Select2Cell = {
  editor: Handsontable.Select2Editor,
  renderer: Handsontable.Select2Renderer
};
Handsontable.cellTypes.select2 = Handsontable.Select2Cell;

