angular.module('app').controller('HeaderCtrl', function($scope, $auth){
	$scope.isAuthenticated = $auth.isAuthenticated;
});

angular.module('app').controller('LogoutController', ['$auth', '$log', '$state', '$store', LogoutController]); 

function LogoutController ($auth, $log, $state, $store){
	$auth.logout();
	$store.remove('id');
	$store.remove('name');
	$log.log("This is running through.")
	$state.go('login');
}