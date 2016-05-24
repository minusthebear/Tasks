(function() {

    'use strict';

    angular
        .module('app')
        .controller('EditFormController', ['$q', '$state', '$stateParams', 'dataService', 'IDService', 'taskService', '$store', EditFormController]);

    function errorCallback(errorMsg) {
        console.log('Error Message: ' + errorMsg);
    }

    function taskCompleted() {
        console.log('The operation has completed');
    }

    function getFormFields(self, ID, p, str, taskService, dataService){
      return dataService.formFields(self, ID, p, str, taskService);
    }

    function EditFormController($q, $state, $stateParams, dataService, IDService, taskService, $store) {

        var self = this, 
            ID = $store.get('id'),
            task_id,
            p = taskService.getParam(),
            str = ID + '$' + p;
        
        self.custom = {};
        var redirected = taskService.redirected();
        self.redirected = redirected;
        self.customFields = [];

        dataService.getRow(str, $stateParams.id)
          .then(function(x){
            var t = x.task[0];
            var ID;
            if(!!t.id){
              task_id = t.id;
              delete t.id;
            }
            for (var y in t){
                var y_str = y.substring(y.indexOf("$")+1).replace(/_/g, " ");
                var obj = {
                   key: y,
                   type: 'input',
                   templateOptions: {
                     type: 'text',
                     label: y_str,
                     placeholder: t[y],
                     required: true
                    },
                    validators: {
                      validCheck: function($viewValue, $modelValue, scope) {
                        var value = $modelValue || $viewValue;
                        if(value){
                          return validateFormField(value)
                        }
                      }
                     }
               };
               self.customFields.push(obj);             
            }
          }).catch(function(){
            console.log("ERROR BITCH!");
          })
          .finally(taskCompleted);

        self.submit = function(row){
            dataService.editRow(str, row, task_id);
        };
        function validateFormField(value){
          return /[A-Za-z0-9\s]+$/.test(value);
        }

    }

})();