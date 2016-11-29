
angular.module('skinulisApp')
  .controller('MainController', [function() {
    var self = this;
    self.controlName = 'MainController';
    console.log('MainController has been created');
  }])
  .controller('ViewController', ['$routeParams', '$timeout', function($routeParams, $timeout) {
    var self = this;

    console.log('ViewController billId = ' + $routeParams.billId);

    self.results = [];

    var query = new Scorocode.Query("bills");
    query.equalTo('_id', $routeParams.billId).find()
      .then((finded) => {
        console.log('finded');
        console.log(finded.result)

        $timeout(function(){
          var billData = finded.result[0].billData;
          for( var i = 0; i < billData.lines.length; ++i){
            self.results.push({from: billData.lines[i].from, to: billData.lines[i].to, amount: billData.lines[i].amount});
          }
        }, 10);

      })
      .catch((err) => {
        console.log(err);
      });

    //self.results.push({from: 'Name1', to: 'Name2', amount: 200});
    //self.results.push({from: 'Name3', to: 'Name4', amount: 140});

    self.meanAmount = function(){
      return 100;
    };
  }])
  .controller('CreatingController', ['focus', '$timeout', function(focus, $timeout) {

            focus('focusMe');

            var self = this;

            self.items = [];
            self.isHasLink = 0;
            self.link = "";
            self.results =[];

            self.isHasLinkFunc = function() {
              return self.isHasLink === 1;
            };

            self.isShowGetLinkButton = function() {
              if( self.results.length > 0 ) {
                if( self.isHasLink === 0 ) {
                  return true;
                }
              }
              return false;
            };

            self.submit = function(){
              var item = { name: self.newItem.name, amount: self.newItem.amount };
              console.log(item);
              self.items.push( item );
              self.newItem.name = '';
              self.newItem.amount = '';
              self.calculate( self.items );
              focus('focusMe');
            };

            self.totalAmount = function(){
              return self.items.reduce( function( sum, current){
                return sum + parseInt( current.amount );
              }, 0);
            };

            self.meanAmount = function(){
              if( self.items.length > 0) {
                var mean = self.totalAmount() / self.items.length;
                return mean;
              }
              return 0.0;
            };

            self.setLink = function( backendLink ){
              self.isHasLink = 1;
              self.link = backendLink;
            }

            self.saveAndGetLink = function() {
              var billData = {};
              billData["description"] = "application data";
              billData["lines"] = self.results;

              var bill = new Scorocode.Object("bills");
              bill.set("name", "Generated from js").set("billData", billData);

              bill.save()
                .then((saved) => {
                  console.log('saved id = ' + saved._id);

                  $timeout(function() {
                    self.setLink( "https://ni2c2k.github.io/skinulis.html#/view/" + saved._id );
                  }, 10);
                })
                .catch((error) => {
                  console.log('error while saved: ' + error.errMsg);
                });

            };

            self.calculate = function( inputItems ){
              var sinks = [];
              var sources = [];

              var amountPerPerson = self.meanAmount();

              inputItems.forEach(function(entry){
                if( entry.amount > amountPerPerson ){
                  sinks.push( {name: entry.name, count: entry.amount - amountPerPerson});
                } else if( entry.amount < amountPerPerson ){
                  sources.push( {name: entry.name, count: amountPerPerson - entry.amount});
                }
              });

              console.log( sinks );
              console.log( sources );

              self.results = [];

              for( var i = 0; i < sources.length; ++i){
                for( var j = 0; j < sinks.length; ++j){
                  if( sources[ i ].count === 0){
                    break;
                  }
                  if( sinks[ j ].count === 0 ){
                    continue;
                  }
                  if( sources[ i ].count === sinks[ j ].count ) {
                    self.results.push({from: sources[i].name, to:sinks[j].name, amount: sources[i].count});
                    sinks[j].count = 0;
                    sources[i].count = 0;
                    break;
                  }
                }
              }

              for( var i = 0; i < sources.length; ++i){
                for( var j = 0; j < sinks.length; ++j ){
                  if( sources[ i ].count === 0){
                    break;
                  }
                  if( sinks[ j ].count === 0 ) {
                    continue;
                  }
                  if( sinks[ j ].count <= sources[ i ].count ) {
                    var transfer = sinks[ j ].count;
                    self.results.push({from: sources[i].name, to: sinks[j].name, amount: transfer});
                    sinks[ j ].count = sinks[ j ].count - transfer;
                    sources[i].count = sources[i].count - transfer;
                  } else {
                    var transfer = sources[i].count;
                    self.results.push({from: sources[i].name, to: sinks[j].name, amount: transfer});
                    sinks[ j ].count = sinks[j].count - transfer;
                    sources[i].count = sources[ i].count - transfer;
                  }
                }
              }

            };

          }]);
