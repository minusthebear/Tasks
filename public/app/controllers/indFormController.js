(function() {

    'use strict';

    angular
        .module('app')
        .controller('IndFormController', ['$q', '$state', '$scope', 'dataService', 'IDService', 'taskService', '$store', IndFormController]);

    function errorCallback(errorMsg) {
        console.log('Error Message: ' + errorMsg);
    }

    function taskCompleted() {
        console.log('The operation has completed');
    }

    function IndFormController($q, $state, $scope, dataService, IDService, taskService, $store) {

        var self = this, 
            ID = $store.get('id'),
            p = taskService.getParam(),
            str = ID + '$' + p;
            

        console.log(ID);
        console.log(p);

        self.custom = {};
        var redirected = taskService.redirected();

        console.log(redirected);
        $scope.redirected = redirected;
        self.customFields = [];
        self.message = taskService.getMessage();

        dataService.getFormFields(str)
          .then(function(x){
            var t = x.task;
            t.sort(function(a, b){
              (a.substring(0, a.indexOf("$"))-b.substring(0, b.indexOf("$")));
            });
            t.forEach(function(y){
              var y_str = y.substring(y.indexOf("$")+1).replace(/_/g, " ");
              var obj = {
                 key: y,
                 type: 'input',
                 validators: {
                  validCheck: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if(value){
                      return /[A-Za-z0-9\s]{1,}$/.test(value);
                    }
                  }
                 },
                 templateOptions: {
                   type: 'text',
                   label: y_str,
                   placeholder: y_str,
                   required: true
                 }
               };
               self.customFields.push(obj);
            });
            console.log(self.customFields);
          }).catch(function(){
            console.log("ERROR BITCH!");
          })
          .finally(taskCompleted);

        self.submit = function(row){
          var y = Object.keys(row);
          if (y.length == 0){
            console.log("Empty Rows");
            return emptyRow("The form was empty. Please fill out the form.");
          } else if (y.length != self.customFields.length){
            return emptyRow("At least one of the form fields was empty. Please rectify that.");
          } else {
            console.log(row);
            dataService.addRow(str, row);
          }        
        };

        function validateFormField(value){
          return /[A-Za-z0-9\s]+$/.test(value);
        }
        function emptyRow(msg){
            taskService.setParam(p);
            taskService.setMessage(msg);
            $state.go($state.current, {}, {reload: true});
        }

    }

})();