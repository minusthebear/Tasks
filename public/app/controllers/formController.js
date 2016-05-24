(function() {

    'use strict';

    angular
        .module('app')
        .controller('FormController', ['$log', 'dataService', 'taskService', 'IDService', '$store', FormController]);

    function errorCallback(errorMsg) {
        console.log('Error Message: ' + errorMsg);
    }

    function taskCompleted() {
        console.log('The operation has completed');
    }

    function FormController($log, dataService, taskService, IDService, $store) {

        var ts = taskService.getMessage();
        var vm = this;

        if (ts) {
            vm.firstOne = function(){
                vm.message = ts;
                return true;
            };
        }

        vm.custom = {};
        vm.customFields = [        	
        	{
        		key: 'task_name',
        		type: 'input',
        		templateOptions: {
        			type: 'text',
        			label: 'Enter task',
        			placeholder: 'Enter task here',
        			required: true
        		},
                validators: {
                  validCheck: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if(value){
                      console.log(value);
                      return validateFormField(value)
                    }
                  }
                 }
        	},
			{
        		key: 'value1',
        		type: 'input',
        		templateOptions: {
        			type: 'text',
        			label: 'Enter first value',
        			placeholder: 'Enter value',
        			required: true
        		},
                validators: {
                  validCheck: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if(value){
                      console.log(value);
                      return validateFormField(value)
                    }
                  }
                 }
        	}, 
			{
        		key: 'value2',
        		type: 'input',
        		templateOptions: {
        			type: 'text',
        			label: 'Enter second value',
        			placeholder: 'Enter value',
        			required: false
        		},
                validators: {
                  validCheck: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if(value){
                      console.log(value);
                      return validateFormField(value)
                    }
                  }
                 }
        	}        	
        ];

        vm.submit = function(table){
            var ID = $store.get('id');
            $log.log("THIS IS THE ID");
            $log.log(ID);
            var t = IDService.getID()
            $log.log(t);
            dataService.addTable(ID, table);
        };

        vm.addField = function() {
            vm.customFields.push({
                key: 'value' + (vm.customFields.length),
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Enter next value',
                    placeholder: 'Enter new value',
                    required: false
                }
            });                      
        };

        function validateFormField(value){
          return /[A-Za-z0-9\s]+$/.test(value);
        }       

    }

})();