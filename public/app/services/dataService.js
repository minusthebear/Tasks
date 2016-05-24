(function(){
	
	angular.module('app')
		.factory('dataService', ['$q', '$timeout', '$http', '$log', '$cacheFactory', dataService]);
		
	angular.module('app')
		.factory('drumSearchService', ['$log', drumSearchService]);

	function drumSearchService ($log) {
			var songs = {};
			
			return {
				getSongs: function () {
					return songs;
				},
				setSongs: function(value) {
					value.filter(function(data){
						data.forEach(function(i){
							var myVar = i.artist;
							if (!songs[myVar]) {
								songs[myVar] = { artist: i.artist, songs: [] };
								songs[myVar].songs.push(i.song);
							} else if (songs[myVar]) {
								songs[myVar].songs.push(i.song);
							} else {
								return;
							}
						}); 
					});
				}
			};
		}

	
	function dataService($q, $timeout, $http, $log, $cacheFactory) {
	
		return {
		
			addTable: addTable,
			getTable: getTable,
			addRow: addRow,
			getRow: getRow,
			editRow: editRow,
			deleteRow: deleteRow,
			getAllUserTables: getAllUserTables,
			getFormFields: getFormFields,
			checkID: checkID 
			//formFields: formFields

	// Only as reference point.
			// getAllComputers: getAllComputers, 
			// getCompByID: getCompByID,
			// getDrumByID: getDrumByID,
			// updateComp: updateComp,
			// updateDrum: updateDrum,
			// addComp: addComp,
			// addDrum: addDrum,
			// getAllDrums: getAllDrums,
			// searchSongs: searchSongs,
			// getSongsByArtists: getSongsByArtists
		};

		var route = 'api/tables/';

        function getSongsByArtists(artist) {
			var Artist = eliminateSpaces(artist);			
			return $http.get('artist/' + Artist)
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function searchSongs(song){
			var arrayArtistsSongs = [];

			var Song = eliminateSpaces(song);
			return $http.get('search/' + Song)
				.then(function(value){
					var SRD = sendResponseData(value);
					arrayArtistsSongs.push(SRD);
					console.log(arrayArtistsSongs);
					return arrayArtistsSongs;
				})
				.catch(sendGetError);			
		}

		function checkID(id){
			return $http.post('api/tables/checkID', {id: id})
				.then(sendResponseData)
				.catch(sendGetError);
		}
 
		function addTable(id, table){
			return $http.post('api/tables/addTable', {id: id, table: table})
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function deleteTable(task){
			return $http.delete('api/tables/deleteTable', table)
				.then(sendResponseData)
				.catch(sendGetError);
		}		
		function addRow(id, row){
			console.log(row);
			return $http.post('api/tables/addRow', {id: id, row: row})
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function getRow(task, id) {		
			return $http.get('api/tables/getRow/' + task +'/' + id)
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function editRow(task, val, id){
			return $http.post('api/tables/editRow', {task: task, val: val, id: id})
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function deleteRow(id, task, table){
			var data = [];
			for(var i = 0; i < arguments.length; i++){
				if (arguments.length !== 3){
					throw new Error("Arguments must be 3");
				} else {
					console.log(arguments);
					console.log(i);
					switch (i){
						case 0:
							data.push({id: arguments[i]});
							break;
						case 1:
							data.push({task: arguments[i]});
							break;
						case 2:
							data.push({table: arguments[i]});
							break;
						default:
							console.log("Sorry, there seems to be a mistake.");
					}

					// data.push(arguments[i]);
				}
			}
			console.log(data);


			return $http.post('api/tables/deleteRow/' + id + '/' + task + '/' + table)
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function getTable(task){
			$log.log("getTable: " + task);
			return $http.get('api/tables/getTable/' + task)
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function getAllUserTables(id){
			return $http.get('api/tables/getAllTables/' + id)
				.then(sendResponseData)
				.catch(sendGetError);
		}
		function getFormFields(task){
			return $http.get('api/tables/getColumns/' + task)
				.then(sendResponseData)
				.catch(sendGetError);
		}
        function sendResponseData(response) {
            return response.data;
        }
        function sendGetError(response) {
            return $q.reject('Error retrieving your information. (HTTP status: ' + response.status + ')');
        }
	
        function transformer(data, headersGetter) {
            var transformed = angular.fromJson(data);
            return transformed;
        }
        function transformPostRequest(data, headersGetter){
			return JSON.stringify(data);
		}
        function eliminateSpaces(data) {
			if(arguments.length < 1) Throw('No name given!');
			var noSpaces = data.replace(/\s+/g, '_');
			return noSpaces;			
		}
	}
	
}());
