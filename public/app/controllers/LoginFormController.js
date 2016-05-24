(function(){
	angular.module('app').controller('LoginFormController', ['$scope', LoginFormController]);

	function LoginFormController($scope){
		$scope.user = {
			name: '',
			password: ''
		};
	}

	angular.module('app').controller('RegisterFormController', ['$scope', RegisterFormController]);

	function RegisterFormController($scope){
		$scope.user = {
			name: '',
			email: '',
			password: ''
		};
	}	
})();