'use strict';

angular.module('app').factory('IDService', function($store, $log){
	var ID = {};

    return {
    	getID: function () {
    		if(ID == null) {
    			ID.id = $store.get('id');
    			ID.name = $store.get('name');
    		}
    		$log.log(ID);
    		return ID;
    	},
        setID: function(user) {
             ID = { id: user._id, name: user.name };

			$store.set('id', user._id);
			$store.set('name', user.name);
        },
        setFBID: function(user) {
             ID = { id: user._id, name: user.displayName };

            $store.set('id', user._id);
            $store.set('name', user.displayName);
        }
    };
});