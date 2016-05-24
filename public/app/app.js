(function() {

    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngResource', 'satellizer', 'formly', 'formlyBootstrap']);

    app.config(['$urlRouterProvider', '$stateProvider', '$logProvider', '$httpProvider', '$authProvider', '$provide', function ($urlRouterProvider, $stateProvider, $logProvider, $httpProvider, $authProvider, $provide) {

        //Would this be the way to go about authentication?

        // var requireAuthentication = function(){
        //     return {
        //         load: function ($q){
        //             console.log("Can user access route?");
        //             if (g_isLoggedIn === true) {
        //                 var dfd = $q.defer();
        //                 dfd.resolve();
        //                 console.log("Yes, they can!");
        //                 return dfd.promise;
        //             } else {
        //                 console.log('No they can\'t');
        //                 return $q.reject("'/login'");
        //             }
        //         }
        //     }
        // }

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/app/templates/main.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/app/templates/login.html',
                controller: 'LoginController',
                controllerAs: 'user'
            })
            .state('confirm', {
                url: '/confirm',
                templateUrl: '/app/templates/confirm.html',
                controller: 'LoginController',
                controllerAs: 'user'
            })
            .state('register', {
                url: '/register', 
                templateUrl: '/app/templates/register.html',
                controller: 'RegisterController',
                controllerAs: 'user'
            })
            .state('taskform', {
                url: '/taskform', 
                templateUrl: '/app/templates/taskForm.html',
                controller: 'FormController',
                controllerAs: 'tf'
            })
            .state('view', {
                url: '/viewAll', 
                templateUrl: '/app/templates/viewAll.html',
                controller: 'mainController',
                controllerAs: 'main'
            })
            .state('indtaskform', {
                url: '/custom/indtaskform', 
                templateUrl: '/app/templates/indTaskForm.html',
                controller: 'IndFormController',
                controllerAs: 'tf'
            })
            .state('edittaskform', {
                url: '/custom/edittaskform/:task/:id', 
                params: {'task': null, 'id': null},
                templateUrl: '/app/templates/editTaskForm.html',
                controller: 'EditFormController',
                controllerAs: 'tf'
            })             
            .state('logout', {
                url: '/login', 
                controller: 'LogoutController'
            })
            .state('delete',{
                url: '/deleteTask',
                templateUrl: '/app/templates/deleteTask.html',
                controller: 'deleteController',
                controllerAs: 'del'
            })
            .state('custom',{
                url: '/custom/:task',
                params: {'task': null},
                templateUrl: '/app/templates/customTask.html',
                controller: 'tableController',
                controllerAs: 'task'
            })
            .state('custom/task',{
                url: '/custom/:task/:id',
                params: {'task': null, 'id': null},
                templateUrl: '/app/templates/indTask.html'
            });
            
        $httpProvider.interceptors.push('authInterceptor');

        $authProvider.loginUrl = 'api/login';
        $authProvider.signupUrl = 'api/login/register';

        $authProvider.google({
            clientId: '357158753419-j1mr998huutgijqbd0fii06v0v4r97a2.apps.googleusercontent.com',
            url: 'api/login/google'
        });

        $authProvider.facebook({
            clientId: '760346650743828',
            url: 'api/login/facebook'
        });

    }]);
  
    app.run(['$rootScope', '$window', function($rootScope, $window) {

        var params = $window.location.search.substring(1);

        if (params && $window.opener && $window.opener.location.origin === $window.location.origin){
            var pair = params.split('=');
            var code = decodeURIComponent(pair[1]);

            $window.opener.postMessage(code, $window.location.origin);
        }

        console.log(params);

        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

            //console.log('successfully changed routes');

        });

        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {

            console.log('error changing routes');

            console.log(event);
            console.log(current);
            console.log(previous);
            console.log(rejection);

        });

    }]);

    function logDecorator($delegate, books) {

        function log(message) {
            message += ' - ' + new Date() + ' (' + books.appName + ')';
            $delegate.log(message);
        }

        function info(message) {
            $delegate.info(message);
        }

        function warn(message) {
            $delegate.warn(message);
        }

        function error(message) {
            $delegate.error(message);
        }

        function debug(message) {
            $delegate.debug(message);
        }

        function awesome(message) {
            message = 'Awesome!!! - ' + message;
            $delegate.debug(message);
        }

        return {
            log: log,
            info: info,
            warn: warn,
            error: error,
            debug: debug,
            awesome: awesome
        };

    }

}());
