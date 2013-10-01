clonableTEXT = document.createElement 'DIV'
clonableTEXT.className = 'hasPopup'

clonableGLASS = document.createElement 'DIV'
clonableGLASS.className = 'hasPopupGlass'

HasPopupRenderer = (instance, TD, row, col, prop, value, cellProperties) ->
	TEXT = clonableTEXT.cloneNode false
	GLASS = clonableGLASS.cloneNode true

	if !instance.acGLASSListener
		instance.acGLASSListener = () =>
			instance.view.wt.getSetting('onCellDblClick')
		instance.rootElement.on('mouseup', '.hasPopupGlass', instance.acGLASSListener)

	Handsontable.TextRenderer(instance, TEXT, row, col, prop, value, cellProperties)

	if !TEXT.firstChild
	    TEXT.appendChild(document.createTextNode('\u00A0'))
	
	TEXT.appendChild GLASS
	instance.view.wt.wtDom.empty TD
	TD.appendChild TEXT