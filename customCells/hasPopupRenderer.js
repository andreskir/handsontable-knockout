var HasPopupRenderer, clonableGLASS, clonableTEXT;

clonableTEXT = document.createElement('DIV');

clonableTEXT.className = 'hasPopup';

clonableGLASS = document.createElement('DIV');

clonableGLASS.className = 'hasPopupGlass';

HasPopupRenderer = function(instance, TD, row, col, prop, value, cellProperties) {
  var GLASS, GLASSListener, TEXT,
    _this = this;
  TEXT = clonableTEXT.cloneNode(false);
  GLASS = clonableGLASS.cloneNode(true);
  GLASSListener = function() {
    return instance.getSettings().toggleInputHelper(row, col);
  };
  $(GLASS).on('mouseup', GLASSListener);
  Handsontable.TextRenderer(instance, TEXT, row, col, prop, value, cellProperties);
  if (!TEXT.firstChild) {
    TEXT.appendChild(document.createTextNode('\u00A0'));
  }
  TEXT.appendChild(GLASS);
  instance.view.wt.wtDom.empty(TD);
  $(TD).css('padding', '0');
  return TD.appendChild(TEXT);
};
