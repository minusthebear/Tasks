'use strict';

angular.module('app').factory('authToken', function($window){
	var storage = $window.localStorage;
	var cachedToken;
	var userToken = 'userToken';
	var isAuthenticated = false;

	var authToken = {
		setToken: function(token){
			cachedToken = token;
			storage.setItem(userToken, token);
			isAuthenticated = true;
		},
		getToken: function() {
			if(!cachedToken) cachedToken = storage.getItem(userToken);
			return cachedToken;
		},
		isAuthenticated: function(){
			return !!authToken.getToken();
		},
		removeToken: function(){
			cachedToken = null;
			storage.removeToken(userToken);
		}
	};

	return authToken;
});

angular.module('app').service('auth', function auth($http, authToken, $window, $q){
	var urlBuilder = [];
	var clientId = '357158753419-j1mr998huutgijqbd0fii06v0v4r97a2.apps.googleusercontent.com';

	urlBuilder.push('response_type=code',
	 'client_id=' + clientId, 
	 'redirect_uri=' + $window.location.origin, 
	 'scope=profile email');

	this.googleAuth = function(){
		var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join('&');
		var options = "width=500, height=500, left=" + (($window.outerWidth - 500) / 2) + ", top=" + (($window.outerHeight - 500) / 2.5);

		var deferred = $q.defer();

		var popup = $window.open(url,'', options);
		$window.focus();

		$window.addEventListener('message', function(event){
			if(event.origin === $window.location.origin){
				var code = event.data;
				popup.close();

				$http.post('api/login/google', { 
					code: code,
					clientId: clientId,
					redirectUri: $window.location.origin
				}).success(function(jwt){
					authToken.setToken(jwt);
					deferred.resolve(jwt);
				});
			}
		});
		return deferred.promise;
	}
});