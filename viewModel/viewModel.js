function Field(data){
  var self = this;
  ko.mapping.fromJS(data, {}, this);
  this.adapt = function(runner){
    return runner.adaptField(self);
  }
  delete this.__ko_mapping__;
}

function Selector(data){
  var self = this;
  ko.mapping.fromJS(data, {}, this);
  this.adapt = function(runner){
    return runner.adaptSelector(self);
  }
  this.getSelectorPair = function(prop,value){
    return self.selectorData().filter(function(item){ return item[prop]()==value })[0];
  }
  this.getDisplayValue = function(){
    if(!self.value())
      return "";
    return self.getSelectorPair('id',self.value()).text();
  }
  this.setValue = function(text){
    if(!text)
      self.value(null);
    else
      self.value(self.getSelectorPair('text',text).id());
  }
  delete this.__ko_mapping__;
}

function Row(fields,data){
  var self = this;
  this.fields = ko.observableArray();

  this.getFieldByName = function(name){
    return self.fields().filter(function(field){return field.name()==name;})[0];
  }

  fields.forEach(function(field){
    newField = new window[field._type](field);
    if (data)
      newField.value(data[field.name]);
    self.fields.push(newField);
  });
}

function InputGrid(fields,data){
  var self = this;
  this.fields = ko.observableArray();
  this.rows = ko.observableArray();

  fields.forEach(function(field){
    self.fields.push(new window[field._type](field))
  });

  data.forEach(function(row){
    var newRow = new Row(fields,row);
    self.rows.push(newRow);
  });

  this.setDateAsFirstTitle = function(){
    self.rows()[0].getFieldByName('title').value(new Date());
  };

  this.setAllCountriesAR = function(){
    self.realRows().forEach(function(row){
      row.getFieldByName('country').value('AR');
    });
  };

  this.realRows = function(){
    return self.rows().filter(function(row){ return self.rows().indexOf(row) < self.rows().length -1 });
  };

  this.removeRow = function(index){
    self.rows.remove(self.rows()[index])
  };

  this.newRowTemplate = function(){
    return new Row(fields);
  }

}