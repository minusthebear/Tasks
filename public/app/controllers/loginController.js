(function(){
	
	angular.module('app')
		.controller('LoginController', ['$scope', '$state', '$http', '$log', '$auth', 'IDService', 'dataService', LoginController]);

	function LoginController($scope, $state, $http, $log, $auth, IDService, dataService){

		$scope.signin = function(user) {
			$auth.login({name: user.name, password: user.password})
				.then(function(response){
					if(response) {
						console.log(response.data);
						IDService.setID(response.data.user);
						console.log($auth.isAuthenticated());
						$auth.isAuthenticated();
						$state.go('main');
					} else {
						console.log('failed login');
					}
				}).catch(function(err){
					console.log("There is an error.")
				});	
		};

		$scope.authenticate = function(provider){
			$auth.authenticate(provider).then(function(res){
				if (!!res.data.user.facebookId){
					dataService.checkID(res.data.user._id);
					IDService.setFBID(res.data.user);				
				}
				
				console.log('Hey there ' + res.data.user.displayName + '!');
			}, function(err){
				console.log(err.message);
			});
		};

		function handleError(err){
			console.log(err.message);
		}
	}


		// auth.login($scope.email, $scope.password)
		// 	.success(function(res){})
/*
		$scope.signin = function(user) {
			$http.post('api/login', {name: user.name, password: user.password}).then(function(response){
					if(response) {
						$log.log("It worked!");
						$log.log(response.data);
						authToken.setToken(response.data.token);
						// $state.go('main');
					} else {
						console.log('failed login');
					}
				});	
		};

		$scope.google = function(){
			auth.googleAuth().then(function(res){
				console.log('Hey there ' + res.data.user.displayName + '!');
			}, function(err){
				console.log(err.message);
			});
		};

            <input type="button" name="Google" id="loginSubmit" value="Login" class="btn btn-default btn-lg" ng-click="google()">
*/
})();