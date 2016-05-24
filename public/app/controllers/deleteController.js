(function(){

	angular.module('app')
		.controller('deleteController', ['$q', 'dataService', '$state', '$store', 'IDService', 'taskService', deleteController]);
		
	function deleteController($q, dataService, $state, $store, IDService, taskService) {
		var self = this;

		self.ID = $store.get('id');

		dataService.getAllUserTables(self.ID)
			.then(tasksSuccess)
			.catch(errorCallback)
			.finally(getAllTasksComplete);
		
		self.deleteIndTask = deleteIndTask;
		
		function deleteIndTask(x){
			x_mod = x.replace(/\s/g, '_')
			var str = self.ID + "$" + x_mod;
			var dfd = $q.defer();
			dataService.deleteRow(self.ID, str, x)
				.then(function(t){
					console.log(t);
					dfd.resolve();
				}).catch(function(){
					errorCallback();
					dfd.reject();
				})
				.finally(function(t){
					getAllTasksComplete();
					$state.go('main');
				});
			return dfd.promise;	
		};

		// dataService.getAllTasks()
		// 	.then(tasksSuccess)
		// 	.catch(errorCallback)
		// 	.finally(getAllTasksComplete);

		function tasksSuccess(tasks) {
			if (tasks.length <= 0){
				self.firstOne = function(){
					self.message = "You currently have no tasks to delete.";
					return true;
				};
			}
			console.log(tasks);
			var allTasks = [], j = 1, l = tasks.length;
			for (var i in tasks){
				console.log(i);
				var task = {};
				var t = tasks[i];
				task.id = j;

				task.name = t.replace(/_/g, " ");
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
