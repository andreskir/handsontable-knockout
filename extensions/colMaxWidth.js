(function ($) {

  Handsontable.PluginHooks.add('afterGetColWidth', function (col,obj) {
    var instance = this;
    var settings = instance.getSettings();
    var maxWidth = settings.columns[col].maxWidth || settings.colMaxWidth;
    obj.width = maxWidth ? Math.min(obj.width,maxWidth) : obj.width;
  });

})(jQuery);