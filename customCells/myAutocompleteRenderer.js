var clonableARROW, clonableTEXT, myAutocompleteRenderer;

clonableTEXT = document.createElement("DIV");

clonableTEXT.className = "htAutocomplete";

clonableARROW = document.createElement("DIV");

clonableARROW.className = "htAutocompleteArrow";

clonableARROW.appendChild(document.createTextNode("\u25BC"));

myAutocompleteRenderer = function(instance, TD, row, col, prop, value, cellProperties) {
  Handsontable.AutocompleteCell.renderer.apply(this, arguments);
  return $(TD).css('padding', '0');
};
