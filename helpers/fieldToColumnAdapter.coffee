class FieldToColumnAdapter
	@getColumnFor: (field)->
		column =
			data: @valueAccessor(field.name())
			type: "text"
			title: field.text()
		if field.hasPopup then column.renderer = HasPopupRenderer
		column

	@valueAccessor: (fieldName)->
		(row, val)->
			if typeof val == 'undefined'
				if row.isNewRow
					return ""
				return row.getFieldByName(fieldName).value() if typeof val == 'undefined'
			row.getFieldByName(fieldName).value(val)

class DatePickerToColumnAdapter extends FieldToColumnAdapter
	@getColumnFor: (field)->
		column = super field
		column.type = "date"
		return column

class SelectorToColumnAdapter extends FieldToColumnAdapter
	@getColumnFor: (field)->
		column = super field
		column.type = "autocomplete"
		column.source = field.selectorPairs().map (item)->item.description
		column.strict = true
		return column

	@valueAccessor: (fieldName)=>
		(row,val)=>
			return row.getFieldByName(fieldName).getDisplayValue() if typeof val == 'undefined'
			row.getFieldByName(fieldName).setValue val

class MultiValueToColumnAdapter extends SelectorToColumnAdapter
	@getColumnFor: (field)->
		column = super field
		column.type = "multiValue"
		column.selectorData = field.selectorPairs().map (item)->
			id: item.id
			text: item.description
		column.width = 200
		return column

	@valueAccessor: (fieldName)=>
		(row,val)=>
			return row.getFieldByName(fieldName).value() if typeof val == 'undefined'
			row.getFieldByName(fieldName).value(val)

class FieldToColumnAdapterRunner
	adaptField: (field)->
		FieldToColumnAdapter.getColumnFor field

	adaptDatePicker: (datePicker)->
		DatePickerToColumnAdapter.getColumnFor datePicker

	adaptSelector: (selector)->
		SelectorToColumnAdapter.getColumnFor selector

	adaptMultiValue: (multiValue)->
		MultiValueToColumnAdapter.getColumnFor multiValue

class FieldsToColumnsMapper
	@map: (fields)->
		fields.map (field)->
			field.adapt new FieldToColumnAdapterRunner()


