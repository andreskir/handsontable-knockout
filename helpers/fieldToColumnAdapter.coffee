class FieldToColumnAdapter
	getColumnFor: (field)->
		column =
			data: @valueAccessor(field.name())
			type: "text"
			title: field.text()
		if field.hasPopup() then column.renderer = HasPopupRenderer
		column

	valueAccessor: (fieldName)->
		(row,val)=>
			if typeof val == 'undefined'
				return "" if row.isNewRow
				return @getter row.getFieldByName(fieldName)
			@setter row.getFieldByName(fieldName),val

	getter: (field)->
		field.value()
	setter: (field,val)->
		field.value val

class DatePickerToColumnAdapter extends FieldToColumnAdapter
	getColumnFor: (field)->
		column = super field
		column.type = "date"
		return column

class SelectorToColumnAdapter extends FieldToColumnAdapter
	getColumnFor: (field)->
		column = super field
		column.type = "autocomplete"
		column.getSourceAt = (row)->
			row.getFieldByName(field.name()).selectorPairs().filter((item)->item.id).map (item)->item.description
		column.strict = true
		return column

	#es muy loco pero si heredo el valueAccessor del super y sobrescribo el getter y el setter anda mal y no tira ningún error.
	valueAccessor: (fieldName)->
		(row,val)=>
			if typeof val == 'undefined'
				return "" if row.isNewRow
				return @getter1 row.getFieldByName(fieldName)
			@setter1 row.getFieldByName(fieldName),val

	getter1: (selector)->
		selector.getDisplayValue()
	setter1: (selector,val)->
		selector.setValue val

class MultiValueToColumnAdapter extends FieldToColumnAdapter
	getColumnFor: (field)->
		column = super field
		column.type = "multiValue"
		column.selectorData = field.selectorPairs().filter((item)->item.id).map (item)->
			id: item.id
			text: item.description
		column.width = 200
		return column

class FieldToColumnAdapterRunner
	adaptField: (field)->
		new FieldToColumnAdapter().getColumnFor field

	adaptDatePicker: (datePicker)->
		new DatePickerToColumnAdapter().getColumnFor datePicker

	adaptSelector: (selector)->
		new SelectorToColumnAdapter().getColumnFor selector

	adaptMultiValue: (multiValue)->
		new MultiValueToColumnAdapter().getColumnFor multiValue

class FieldsToColumnsMapper
	@map: (fields)->
		fields.map (field)->
			field.adapt new FieldToColumnAdapterRunner()
