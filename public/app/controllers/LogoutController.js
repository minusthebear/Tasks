'use strict';

angular.module('app')
	.controller('LogoutController', function($auth, $state){
		$auth.logout();
		$state.go('main');
	})