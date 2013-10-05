ko.bindingHandlers.handsontable =
  init: (element, valueAccessor) ->
    options = valueAccessor()
    $(element).handsontable
      data: options.data()
      minSpareRows: (if options.allowAdd then 1 else 0)
      dataSchema: options.dataSchema
      colHeaders: getColumnsTitles(options.columns)
      columns: options.columns
      removeRowPlugin: true
      removeRowFunction: (row) ->
        options.data.remove options.data()[row]

      isRemovable: (row) ->
        options.isRemovable options.data()[row]

      colMaxWidth: 150
      enterBeginsEditing: true
      afterCreateRow: ->
        options.data.notifySubscribers()

      beforeRender: (changes, source) ->
        totalWidth = 50
        i = 0
        while i < @countCols()
          totalWidth += @getColWidth(i)
          i++
        $(element).width totalWidth

      isEmptyRow: (row) ->
        options.data()[row].isNewRow

      cells: (row, col, prop) ->
        @source = @getSourceAt(options.data()[row])  if @getSourceAt

      toggleInputHelper: options.toggleInputHelper
      width: 900


  update: (element, valueAccessor) ->
    options = valueAccessor()
    dummy = options.data().length
    instance = $(element).handsontable("getInstance")
    instance.alter "insert_row", 0, -1  if options.allowAdd and not instance.isEmptyRow(instance.countRows() - 1) #hack para que internamente ejecute adjustRowsAndCols y se de cuenta que tiene que agregar una fila
    instance.render()

getColumnsTitles = (columns) ->
  columns.map (col) ->
    col.title