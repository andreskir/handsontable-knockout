var HasPopupRenderer, clonableGLASS, clonableTEXT;

clonableTEXT = document.createElement('DIV');

clonableTEXT.className = 'hasPopup';

clonableGLASS = document.createElement('DIV');

clonableGLASS.className = 'hasPopupGlass';

HasPopupRenderer = function(instance, TD, row, col, prop, value, cellProperties) {
  var GLASS, TEXT,
    _this = this;
  TEXT = clonableTEXT.cloneNode(false);
  GLASS = clonableGLASS.cloneNode(true);
  if (!instance.acGLASSListener) {
    instance.acGLASSListener = function() {
      return instance.view.wt.getSetting('onCellDblClick');
    };
    instance.rootElement.on('mouseup', '.hasPopupGlass', instance.acGLASSListener);
  }
  Handsontable.TextRenderer(instance, TEXT, row, col, prop, value, cellProperties);
  if (!TEXT.firstChild) {
    TEXT.appendChild(document.createTextNode('\u00A0'));
  }
  TEXT.appendChild(GLASS);
  instance.view.wt.wtDom.empty(TD);
  return TD.appendChild(TEXT);
};
