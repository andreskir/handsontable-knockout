class Field
  constructor:(data,val,mappingOptions)->
    mappingOptions = $.extend {}, mappingOptions
    ko.mapping.fromJS data, mappingOptions, this
    @value(val) if typeof val != 'undefined'
    delete @__ko_mapping__

  adapt: (runner)->
    runner.adaptField @

  hasPopup: ()->

  callPopup: (row)->
    alert(row+' - '+@name())

class DatePicker extends Field
  adapt: (runner)->
    runner.adaptDatePicker @

class Selector extends Field
  constructor: (data,val)->
    mappingOptions =
      copy: ["selectorData"]
    super data,val,mappingOptions

  adapt: (runner)->
    runner.adaptSelector @

  selectorPairs: ()->
    @selectorData

  getSelectorPair: (prop,value)->
    @selectorPairs().filter((item)->item[prop]==value)[0]

  getDisplayValue: ()->
    return "" if !@value()
    @getSelectorPair('id',@value()).description

  setValueByDescription: (description)->
    if !description
      @value ""
    else
      @value @getSelectorPair('description',description).id

class MultiValue extends Selector
  adapt: (runner)->
    runner.adaptMultiValue @

class CheckBox extends Field
  adapt: (runner)->
    runner.adaptCheckBox @

class InputGridRow
  constructor:(fieldsData,rowData)->
    @fields = ko.observableArray fieldsData.map (field)->
      new window[field._type](field,rowData[field.name])
    @isNewRow = true
    @allowRemove = true
    @visibleFields = ko.computed ()=>@fields().filter (field)->field.visible()

  getFieldByName: (name)->
    @fields().filter((field)->field.name()==name)[0]

  isRemovable:->
    !@isNewRow && @allowRemove

class InputGrid
  constructor: (fieldsData,data)->
    @fieldsData = fieldsData
    @fields = ko.observableArray fieldsData.map (field)->
      new window[field._type](field)
    @rows = ko.observableArray data.map (row)->
      new InputGridRow(fieldsData,row)
    @visibleFields = ko.computed ()=>@fields().filter (field)->field.visible()

  setTodayInFirstRow: ()->
    @rows()[0].getFieldByName('date').value new Date()

  setAllCountriesAR: ()->
    @realRows().forEach (row)->row.getFieldByName('country').value 'AR'

  realRows: ()->
    @rows().filter (row)=> @rows().indexOf(row)<@rows().length-1

  removeRow: (index)->
    @rows.remove @rows()[index]

  newRowTemplate: ()=>
    row = new InputGridRow(@fieldsData,{})
    @fields().forEach (field)->
      if(field.selectorData)
        row.getFieldByName(field.name()).selectorData = field.selectorData
    row.fields().forEach (field)=>
      field.valueChanged = field.value.subscribe =>
        row.isNewRow = false
        row.fields().forEach (otherField)->
          otherField.valueChanged.dispose()
        @rows.notifySubscribers()
    row

  dataMatrix: ()->
    @rows().map (row)->
      row.fields().map (field)-> field.value()

  getFieldByName: (name)->
    @fields().filter((field)->field.name()==name)[0]

  toggleInputHelper: (row,col)=>
    @rows()[row].visibleFields()[0].value('X')
    @rows()[row].visibleFields()[1].value('Y')
    @rows()[row].visibleFields()[2].value('Z')

