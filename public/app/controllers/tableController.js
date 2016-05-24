(function(){

	angular.module('app')
		.controller('tableController', ['taskService', '$state', '$stateParams', tableController]);

	function tableController(taskService, $state, $stateParams) {
		var self = this;
		getEverything(self, taskService, $state, $stateParams);
	}

	function errorCallback(errorMsg) {
		console.log('Error Message: ' + errorMsg);
	}

	function getTableCompleted() {
		console.log('The operation has completed');
	}
	function tableSuccess(data, self, $state, $stateParams, taskService) {
		console.log("Table is downloaded");
		self.add = function(x){
			taskService.setParam($stateParams.task);
			$state.go('indtaskform');
		};
		self.edit = function(x){
			taskService.setParam($stateParams.task);
			taskService.setEditID(x);
			$state.go('edittaskform', {'task': $stateParams.task, 'id': x});
		};
		var x = parseData(data);
		self.allColumns = x;
	}
	function getEverything(self, taskService, $state, $stateParams) {
		var ts = taskService.getTaskInfo();
		tableSuccess(ts, self, $state, $stateParams, taskService);		
	}

	function findID(d){
		var x;
		for (var c in d) {
			if (c == 'id'){
				var x = d[c];
				delete d[c];
				return x;
			}
		}		
	}
	function gatherKeys(d, e){
		e.array = [];
		console.log(d);
		for (var c in d){
    		var num = "n" + (c.substring(0, c.indexOf("$"))).toString(),
    			f = c.substring(c.indexOf("$")+1).replace(/_/g, " "),
    			g = {};
    		g[f] = d[c];
    		if (num == 'n1'){
    			e[num] = g;			
    		} else {
    			e.array.push(g);
    		}
    	}
	}

	function parseData(d) {
		var array = [];
		for (var c in d){
			var e = {};
			e.id = findID(d[c]);
			gatherKeys(d[c], e);
			array.push(e);		
		}
		return array;
	}

	function addField(taskService, $state){

	}
	
	angular.module('app').directive('eachTaskColumn', function($q, dataService, taskService) {
		
		return {
			restrict: "E",
			controller: function($scope){

				var receivedInfo = false;

				// function getRow(x) {
				// 	if (receivedInfo) {
				// 		return;
				// 	} else {
				// 		var deferred = $q.defer();

				// 		dataService.getRow(x)
				// 			.then(function(data){
				// 				for(var i=0; i < data.length; i++) {
				// 					arrayRow.push(data[i]);
				// 				}
				// 			}).then(function(){			
				// 				deferred.resolve(arrayRow);
				// 			}).catch(function(msg, code){
				// 				deferred.reject(msg);
				// 				console.log(msg, code);
				// 				console.log(arrayRow);
				// 			});
				// 		return deferred.promise;
				// 	}						
				// }				
				var arrayRow = [];
		
				$scope.collapsed = true;
				
				$scope.collapse = function(x){
					$scope.collapsed = !$scope.collapsed;

					if (!$scope.collapsed) {
						// for (var y in x){
						// 	console.log(y);
						// 	console.(x[y]);
						var w = {};
						for (var y in x){
							for (var z in x[y]) { 
								console.log(z);
								console.log(x[y][z]);
								w[z] = x[y][z];
							}
						}
						$scope.indTask = w;
						receivedInfo = true;
						//}	
					}					
				};

			}
		}
	});

	angular.module('app').directive('addNewSong', function($location){
		return {
			templateUrl: "/app/templates/addNewSongButton.html",
			scope: {},
			restrict: "E",
			controller: function($scope, $location) {
				$scope.addRedirect = function(){
					$location.path('/drums/add');
				}
			}
		}
	});
}());
