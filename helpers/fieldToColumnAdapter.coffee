class FieldToColumnAdapter
	@getColumnFor: (field)->
		data: @valueAccessor(field.name()),
		type: field.type(),
		title: field.text(),

	@valueAccessor: (fieldName)->
		(row, val)->
			return row.getFieldByName(fieldName).value() if typeof val == 'undefined'
			row.getFieldByName(fieldName).value(val)

class SelectorToColumnAdapter extends FieldToColumnAdapter
	@getColumnFor: (field)->
		column = super field
		column.source = field.selectorData().map (item)->item.text()
		column.strict = true
		return column

	@valueAccessor: (fieldName)=>
		(row,val)=>
			return row.getFieldByName(fieldName).getDisplayValue() if typeof val == 'undefined'
			row.getFieldByName(fieldName).setValue val

class MultiValueToColumnAdapter extends SelectorToColumnAdapter
	@getColumnFor: (field)->
		column = super field
		column.selectorData = field.selectorData().map (item)->
			id: item.id()
			text: item.text()
		return column

	@valueAccessor: (fieldName)=>
		(row,val)=>
			return row.getFieldByName(fieldName).value() if typeof val == 'undefined'
			row.getFieldByName(fieldName).value(val)

class FieldToColumnAdapterRunner
	adaptField: (field)->
		FieldToColumnAdapter.getColumnFor field

	adaptSelector: (selector)->
		SelectorToColumnAdapter.getColumnFor selector

	adaptMultiValue: (multiValue)->
		MultiValueToColumnAdapter.getColumnFor multiValue

class FieldsToColumnsMapper
	@map: (fields)->
		fields.map (field)->
			field.adapt new FieldToColumnAdapterRunner()

