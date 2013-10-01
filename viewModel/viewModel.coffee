class Field
  constructor:(data,val,mappingOptions)->
    mappingOptions = $.extend {}, mappingOptions
    ko.mapping.fromJS data, mappingOptions, this
    @value(val) if typeof val != 'undefined'
    delete @__ko_mapping__

  adapt: (runner)->
    runner.adaptField @

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

  setValue: (description)->
    if !description
      @value ""
    else
      @value @getSelectorPair('description',description).id

class MultiValue extends Selector
  adapt: (runner)->
    runner.adaptMultiValue @

class Row
  constructor:(fieldsData,rowData)->
    @fields = ko.observableArray fieldsData.map (field)->
      new window[field._type](field,rowData[field.name])

  getFieldByName: (name)->
    @fields().filter((field)->field.name()==name)[0]

class InputGrid
  constructor: (fieldsData,data)->
    @fieldsData = fieldsData
    @fields = ko.observableArray fieldsData.map (field)->
      new window[field._type](field)
    @rows = ko.observableArray data.map (row)->
      new Row(fieldsData,row)

  setDateAsFirstTitle: ()->
    @rows()[0].getFieldByName('title').value new Date()

  setAllCountriesAR: ()->
    @realRows().forEach (row)->row.getFieldByName('country').value 'AR'

  realRows: ()->
    @rows().filter (row)=> @rows().indexOf(row)<@rows().length-1

  removeRow: (index)->
    @rows.remove @rows()[index]

  newRowTemplate: ()=>
    row = new Row(@fieldsData,{})
    row.isNewRow = true
    row

  dataMatrix: ()->
    @rows().map (row)->
      row.fields().map (field)-> field.value()
