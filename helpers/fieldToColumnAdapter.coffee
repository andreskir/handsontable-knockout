class FieldToColumnAdapter
	constructor: (beforeSet,afterSet)->
		@beforeSet = beforeSet
		@afterSet = afterSet

	getColumnFor: (field)->
		validateRequired = (field,value)->
			!field.required || field.required?() && !!value
		validateValue = (field,value)->
			method = if field.type()=="integer" then "digits" else field.type()
			isValid(method,value)

		column =
			data: @valueAccessor(field.name())
			type: "text"
			title: field.text()
			readOnly: field.isReadOnly()
			validator: (value,callback)->
				callback (validateRequired(field,value) && validateValue(field,value))
			allowInvalid: true
		if field.hasPopup() then column.renderer = HasPopupRenderer
		column

	valueAccessor: (fieldName)->
		(row,val)=>
			if typeof val == 'undefined'
				return "" if row.isNewRow
				return @getter row.getFieldByName(fieldName)
			@beforeSet()
			@setter row.getFieldByName(fieldName),val
			@afterSet()

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

	getter: (selector)->
		selector.getDisplayValue()
	setter: (selector,val)->
		selector.setValueByDescription val

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
	constructor: (beforeSet,afterSet)->
		@beforeSet = beforeSet
		@afterSet = afterSet

	adaptField: (field)->
		new FieldToColumnAdapter(@beforeSet,@afterSet).getColumnFor field

	adaptDatePicker: (datePicker)->
		new DatePickerToColumnAdapter(@beforeSet,@afterSet).getColumnFor datePicker

	adaptSelector: (selector)->
		new SelectorToColumnAdapter(@beforeSet,@afterSet).getColumnFor selector

	adaptMultiValue: (multiValue)->
		new MultiValueToColumnAdapter(@beforeSet,@afterSet).getColumnFor multiValue

class FieldsToColumnsMapper
	constructor: (beforeSet,afterSet)->
		@beforeSet = beforeSet
		@afterSet = afterSet

	map: (fields)->
		fields.map (field)=>
			field.adapt new FieldToColumnAdapterRunner(@beforeSet,@afterSet)

isValid = (methodName,value)->
	method = $.validator.methods[methodName]
	if method && value
		v = $("<form>").validate()
		element = $("<input>")[0]
		element.value = value		
		return method.call v, value, element
	true

