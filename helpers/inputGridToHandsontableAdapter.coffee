class InputGridToHandsontableAdapter
	constructor: (inputGrid)->
		@inputGrid = inputGrid

	adapt: ->
		data: @inputGrid.rows
		columns: new FieldsToColumnsMapper(@beforeSet,@afterSet).map(@inputGrid.visibleFields())
		allowAdd: true
		dataSchema: @inputGrid.newRowTemplate
		isRemovable: (row)->row.isRemovable()
		isNewRow: (row)->row.isNewRow
		toggleInputHelper: @inputGrid.toggleInputHelper
		isSetting: => @isSetting

	beforeSet: =>
		@inputGrid.handsontableIsSettingValue = true
	afterSet: =>
		@inputGrid.handsontableIsSettingValue = false
