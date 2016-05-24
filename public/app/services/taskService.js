'use strict';

angular.module('app').factory('taskService', function($store, $log){
	var task = {}, redirected = false, p, q, m;

    return {
    	getTaskInfo: function () {
            $log.log("GET TASK INFO");
            return task;
    	},
        setTaskInfo: function(t) {
            if (!t.task || t.message === 'empty'){
                task = null;
                redirected = true;
            } else {
                task = t.task;
                redirected = false;
            }
            $log.log("SET TASK INFO");
            //return task;
        },
        redirected: function(){
            return redirected;
        },
        getParam: function(){
            return p;
        },
        setParam: function(x){
            p = x;
        },
        getEditID: function(){
            return q;
        },
        setEditID: function(x){
            q = x;
        },
        getMessage: function(){
            if (!m){
                return null;
            } else {
                return m;
            }
        },
        setMessage: function(x){
            m = x;
        }
    };
});