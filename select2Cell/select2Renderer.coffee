class Select2Renderer
	constructor: (instance, td, row, col) ->
		@instance = instance
		@td = td
		@row = row
		@col = col

	defaultOptions:
		placeholder: "Select report type"
		allowClear: true
		openOnEnter: false

	createElements: (selectorData,value) ->
		@defaultOptions.data = selectorData;
		$select = $ '<input class="select2Element" style="width: 100%" tabindex="-1">'
		$select.appendTo @td;
		@select2 = $select.select2 @defaultOptions
		@setValue value
		@bindOnBlur()
		@bindOnOpening()
		@bindMyEvents()

	setValue: (value) ->
		@select2.select2 "val",value

	selectCurrentCell: () ->
		@instance.selectCell @row,@col,@row,@col,false

	bindMyEvents: () ->
		@bindOnSelecting();

	bindOnBlur: () ->
		@select2.on "select2-blur",() =>
			@saveData()

	bindOnOpening: () ->
		@select2.on "select2-opening", () =>
			if @instance.getSelected() && !@arraysEqual @instance.getSelected(),[@row,@col,@row,@col]
				@selectCurrentCell()
			@select2.select2("container").find(".select2-input").off('keydown.exitKeys').on 'keydown.exitKeys', @exitKeys

	bindOnSelecting: () ->
		runLater = (func) -> setTimeout func, 0
		@select2.on "select2-selecting", () =>
			runLater ()=>@selectCurrentCell() #otherwise select2 triggers focus after selecting CurrentCell

	exitKeys: (event) =>
		switch event.keyCode
			when 9 #tab
				@finishEditing()
				event.preventDefault()
			when 39, 37, 27 then @finishEditing() #left,right,esc
			when 13 then @returnPressed() #return/enter
			else event.stopImmediatePropagation() #backspace, delete, home, end, CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)

	returnPressed: () =>
		@finishEditing()

	shouldBeginEditing: (keyCode) ->
		Handsontable.helper.isPrintableChar(keyCode) || keyCode == 113 #f2

	shouldDeleteAndRehook: (keyCode) ->
		[8, 46].indexOf(keyCode)>=0 #backspace or delete

	shouldRehook: (keyCode) ->
		[9, 33, 34, 35, 36, 37, 38, 39, 40, 13].indexOf(keyCode) == -1 #other non printable character

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

	addHookOnce: () ->
		@instance.addHookOnce 'beforeKeyDown', @beforeKeyDownHook

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



findSelect2Container = (td) ->
	$(td).find(".select2Element").select2 "container"

getRendererFrom = (td) ->
	findSelect2Container(td).data "renderer"

saveRendererTo = (td, renderer) ->
	findSelect2Container(td).data "renderer", renderer

createSelect2Renderer = (model, instance, td, row, col, prop, value, cellProperties) ->
	if !getRendererFrom td
		$(td).empty()
		renderer = new model instance, td, row, col
		renderer.createElements cellProperties.selectorData, value
		saveRendererTo td, renderer
	else
		getRendererFrom(td).setValue value
	return td


Handsontable.Select2Renderer = (instance, td, row, col, prop, value, cellProperties) ->
	createSelect2Renderer Select2Renderer, instance, td, row, col, prop, value, cellProperties

Handsontable.Select2Editor = (instance, td, row, col, prop, value, cellProperties) ->
	instance.addHookOnce 'beforeKeyDown', getRendererFrom(td).beforeKeyDownHook
	instance.addHookOnce 'afterSelection', () ->
		instance.removeHook 'beforeKeyDown', getRendererFrom(td).beforeKeyDownHook #to avoid bug where beforeKeyDown is triggered when it is not current cell

Handsontable.Select2Cell =
	editor: Handsontable.Select2Editor
	renderer: Handsontable.Select2Renderer

Handsontable.cellTypes.select2 = Handsontable.Select2Cell

