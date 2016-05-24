(function(){

	angular.module('app')
		.controller('mainController', ['$q', 'dataService', '$window', '$state', '$store', 'IDService', 'taskService', mainController]);
		
	function mainController($q, dataService, $window, $state, $store, IDService, taskService) {
		var self = this;

		var info = IDService.getID();

		self.ID = $store.get('id');

		dataService.getAllUserTables(self.ID)
			.then(tasksSuccess)
			.catch(errorCallback)
			.finally(getAllTasksComplete);

		self.test = function(val){
			x = val.id;
			var str = self.ID + "$" + x;
			var dfd = $q.defer()
			dataService.getTable(str)
				.then(function(t){
					taskService.setTaskInfo(t);
					if(!t.task && t.message == "empty"){
						taskService.setParam(x);
						$state.go('indtaskform');
					} else {
						//taskService.setTaskInfo(t);
						$state.go('custom', {'task': x});					
					}
					dfd.resolve();
				}).catch(function(){
					errorCallback();
					dfd.reject();
				})
				.finally(getAllTasksComplete);
			return dfd.promise;	
		}

		// dataService.getAllTasks()
		// 	.then(tasksSuccess)
		// 	.catch(errorCallback)
		// 	.finally(getAllTasksComplete);

		function tasksSuccess(tasks) {
		//	$window.location.reload();
			var allTasks = [], j = 1, l = tasks.length;
			console.log(tasks);
			if (l <= 0){
				taskService.setMessage("Welcome to the Task App! Please create the first task table!");
				$state.go('taskform');
			}
			console.log(tasks);
			for (var i in tasks){
				self.firstOne = null;
				var task = {};
				var t = tasks[i];
				task.id = j;
				task.name = t.replace(/_/g, " ");
				task.url = t.replace(/\s/g, "_");
				allTasks.push(task);
				j++;
			}
			self.allTasks = allTasks;
		}

		function getTasksNotification(notification) {
            console.log('Promise Notification: ' + notification);
        }

        function errorCallback(errorMsg) {
            console.log('Error Message: ' + errorMsg);
        }

        function getAllTasksComplete() {
            console.log('The operation has completed');
        }

	}
}());
