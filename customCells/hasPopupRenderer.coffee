clonableTEXT = document.createElement 'DIV'
clonableTEXT.className = 'hasPopup'

clonableGLASS = document.createElement 'DIV'
clonableGLASS.className = 'hasPopupGlass'

HasPopupRenderer = (instance, TD, row, col, prop, value, cellProperties) ->
	TEXT = clonableTEXT.cloneNode false
	GLASS = clonableGLASS.cloneNode true

	GLASSListener = () =>
		instance.getSettings().toggleInputHelper(row,col)
	$(GLASS).on('mouseup', GLASSListener)

	Handsontable.TextRenderer(instance, TEXT, row, col, prop, value, cellProperties)

	if !TEXT.firstChild
	    TEXT.appendChild(document.createTextNode('\u00A0'))
	
	TEXT.appendChild GLASS
	instance.view.wt.wtDom.empty TD
	$(TD).css 'padding','0'
	TD.appendChild TEXT