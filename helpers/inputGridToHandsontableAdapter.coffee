class InputGridToHandsontableAdapter
	adapt: (inputGrid)->
		data: inputGrid.rows
		columns: FieldsToColumnsMapper.map(inputGrid.visibleFields())
		allowAdd: true
		dataSchema: inputGrid.newRowTemplate
		isRemovable: (row)->row.isRemovable()
		toggleInputHelper: inputGrid.toggleInputHelper