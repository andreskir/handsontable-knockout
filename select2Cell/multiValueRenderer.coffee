class MultiValueRenderer
	constructor: (instance, td, row, col) ->
		@instance = instance
		@td = td
		@row = row
		@col = col
		@isOpened = false

	defaultOptions:
		allowClear: true
		openOnEnter: false
		multiple: true

	createElements: (selectorData,value) ->
		@defaultOptions.data = selectorData;
		$select = $ '<input class="select2Element" style="width: 100%" tabindex="-1">'
		$select.appendTo @td;
		@select2 = $select.select2 @defaultOptions
		@setValue value
		@bindOnOpening()
		@bindMyEvents()

	setValue: (value) ->
		@select2.select2 "val",value

	selectCurrentCell: () ->
		@instance.selectCell @row,@col,@row,@col,false

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
	        @saveData()
	        @instance.view.render()
	    @select2.on "blur",()=>
	        @saveData()

	bindOnOpening: () ->
		@select2.on "select2-opening", () =>
			if @instance.getSelected() && !@arraysEqual @instance.getSelected(),[@row,@col,@row,@col]
				@selectCurrentCell()
			@select2.select2("container").find(".select2-input").off('keydown.exitKeys').on 'keydown.exitKeys', @exitKeys

	exitKeys: (event) =>
		switch event.keyCode
			when 9 #tab
				@finishEditing()
				event.preventDefault()
			when 39, 37, 27 then @finishEditing() #left,right,esc
			when 13 then @returnPressed() #return/enter
			else event.stopImmediatePropagation() #backspace, delete, home, end, CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)

	returnPressed: () =>
	    if !@isOpened
	      @finishEditing()

	finishEditing: () ->
		@saveData()
		@select2.select2 "close"
		@selectCurrentCell() #removes focus from select2 and triggers Editor where hookOnce is binded

	saveData: () ->
		@instance.populateFromArray @row, @col, @getValue(), null, null, 'edit'

	arraysEqual: (arr1,arr2) ->
		for item, i in arr1
			return false if arr1[i] != arr2[i]
		return true

	renderInstance: () ->
		@instance.render()

	getValue: () ->
		[[@select2.select2 "val"]]

class MultiValueEditor
	constructor: (instance, td) ->
		@instance = instance
		@td = td
		@select2 = $(td).find(".select2Element").select2 "container"

	addHookOnce: () ->
		@instance.addHookOnce 'beforeKeyDown', @beforeKeyDownHook
		@instance.addHookOnce 'afterSelection', () =>
			@instance.removeHook 'beforeKeyDown', @beforeKeyDownHook #to avoid bug where beforeKeyDown is triggered when it is not current cell

	beforeKeyDownHook: (event) =>
		if @shouldBeginEditing event.keyCode
			event.stopImmediatePropagation()
			@beginEditing()
		else if @shouldDeleteAndRehook event.keyCode
			@select2.select2 "val",""
			@addHookOnce()
		else if @shouldRehook event.keyCode
			@addHookOnce()

	beginEditing: () ->
		@select2.select2 "open"

	shouldBeginEditing: (keyCode) ->
		Handsontable.helper.isPrintableChar(keyCode) || keyCode == 113 || keyCode==8 # or backspace

	shouldDeleteAndRehook: (keyCode) ->
	    keyCode==46

	shouldRehook: (keyCode) ->
		[9, 33, 34, 35, 36, 37, 38, 39, 40, 13].indexOf(keyCode) == -1 #other non printable character

create2Renderer = (instance, td, row, col, prop, value, cellProperties) ->
	$(td).empty()
	renderer = new MultiValueRenderer instance, td, row, col
	renderer.createElements cellProperties.selectorData, value
	return td


Handsontable.MultiValueRenderer = (instance, td, row, col, prop, value, cellProperties) ->
	create2Renderer instance, td, row, col, prop, value, cellProperties

Handsontable.MultiValueEditor = (instance, td, row, col, prop, value, cellProperties) ->
	editor = new MultiValueEditor instance, td
	editor.addHookOnce()

Handsontable.MultiValueCell =
	editor: Handsontable.MultiValueEditor
	renderer: Handsontable.MultiValueRenderer

Handsontable.cellTypes.multiValue = Handsontable.MultiValueCell;

