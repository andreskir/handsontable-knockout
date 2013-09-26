class MultiValueRenderer extends Select2Renderer
  contructor: (instance, td, row, col) ->
    super instance, td, row, col
    @isOpened = false

  defaultOptions: $.extend(true, multiple: true,Select2Renderer.prototype.defaultOptions)

  bindMyEvents: () ->
    runLater = (ms,func) -> setTimeout func, ms
    @select2.on "select2-open",()=>
      @isOpened = true
      runLater 100,()=>
        @instance.view.render()
    @select2.on "select2-close",()=>
      runLater 100,()=>
        @isOpened = false
        @instance.view.render() #otherwise keyDown is trigged after isOpened is set to false
    @select2.on "change",()=>
      runLater 100,()=>
        @instance.view.render()

  returnPressed: ()=>
    if !@isOpened
      @finishEditing()

  shouldBeginEditing: (keyCode)->
    super(keyCode) || keyCode==8 #or backspace

  shouldDeleteAndRehook: (keyCode) ->
    keyCode==46

Handsontable.MultiValueRenderer = (instance, td, row, col, prop, value, cellProperties) ->
  return createSelect2Renderer MultiValueRenderer, instance, td, row, col, prop, value, cellProperties

Handsontable.MultiValueCell =
	editor: Handsontable.Select2Editor
	renderer: Handsontable.MultiValueRenderer

Handsontable.cellTypes.multiValue = Handsontable.MultiValueCell;