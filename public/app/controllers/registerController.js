(function(){
	
	angular.module('app')
		.controller('RegisterController', ['$scope', '$log', '$state', '$http', '$auth', 'IDService', RegisterController]);

	function RegisterController($scope, $log, $state, $http, $auth, IDService){

		$scope.register = function(user) {
			$auth.signup({name: user.name, email: user.email, password: user.password})
				.then(function(response){
					if(response) {
						$log.log(response.status);
						$log.log(response.data);
						IDService.setID(response.data.user);
						$auth.isAuthenticated();
						$state.go('confirm');
					} else {
						console.log('failed login');
					}
				}).catch(function(err){
					console.log(err.message);
				});	
		};	
		$scope.authenticate = function(provider){
			$auth.authenticate(provider).then(function(res){
				console.log('Hey there ' + res.data.user.displayName + '!');
			}, function(err){
				console.log(err.message);
			});
		};

		function handleError(err){
			console.log(err.message);
		}	
	}
})();