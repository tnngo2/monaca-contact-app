angular.module('starter.services', [])

.factory('PersonDetail', function() {

	var o = {
		person: []
	}

	o.viewPerson = function(paraPerson){
		// make sure there's a song to add
		if (!paraPerson) return false;

		o.person = [];
		o.person.unshift(paraPerson);
	}

	return o;  
})

.service('LoginService', function($q,ApiEndpoint) {
	return {
		loginUser: function(name, pw, http) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			promise.success = function(fn) {
					promise.then(fn);
					return promise;
			}
			promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
			}

			http.get(ApiEndpoint.url + 'user/search/findByUsername?username=' + name)
					.then(function(data) {
						if (data.data._embedded != undefined && data.data._embedded.user != undefined  && data.data._embedded.user[0].password === pw){
							deferred.resolve('Welcome ' + name + '!');
						} else {
							deferred.reject('Wrong credentials.');
						}
					});

			return promise;
		}
	}
})


.service('SignUpService', function($q, ApiEndpoint){
	return {
		signUpUser: function(name, pw, firstname, lastname, email, note, phoneNo, http) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			 var req = {
					method: 'POST',
					url: ApiEndpoint.url + 'user',
					headers: {
						'Content-Type': 'application/json'
					},
					data: { 
						'username' : name, 
						'password' : pw, 
						'firstName' : firstname,  
						'lastName' : lastname, 
						'email' : email , 
						'note' : note, 
						'phoneNumber' : phoneNo
					}
				};
			http(req).then(function(){});

			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}

			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}   
		}
	}
})

.service('AddPersonService', function($q, ApiEndpoint){
	return {
		addPerson: function(firstname, lastname, email, note, phoneNo, http) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}

			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}

			var req = {
				method: 'POST',
				url: ApiEndpoint.url + 'person',
				headers: {
					'Content-Type': 'application/json'
				},
				data: { 
					'firstName' : firstname,  
					'lastName' : lastname, 
					'email' : email , 
					'note' : note, 
					'phoneNumber' : phoneNo
				}
			};

			http(req).then(function(data){
				if (data.status === 201) {
					deferred.resolve(data);
					promise.data = data;
				} else {
					deferred.reject('Errors');
				}
			});

			return promise;
		}
	}
})

.service('UpdatePersonService', function($q, ApiEndpoint){
	return {
		updPerson: function(firstname, lastname, email, note, phoneNo, http, personIndex) {
			var deferred = $q.defer();
			var promise = deferred.promise;


			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}

			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}

			var req = {
				method: 'PUT',
				url: ApiEndpoint.url + 'person/' + personIndex,
				headers: {
					'Content-Type': 'application/json'
				},
				data: { 
					'firstName' : firstname,  
					'lastName' : lastname, 
					'email' : email , 
					'note' : note, 
					'phoneNumber' : phoneNo
				}
			};
			
			http(req).then(function(data){
				if (data.status === 204) {
					deferred.resolve(data);
					promise.data = data;
				} else {
					deferred.reject('Errors');
				}
			});

			return promise;

		}
	}
})

.service('DeletePersonService', function($q, ApiEndpoint){
	return {
		deletePerson: function(personIndex, http) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}

			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}
			
			var req = {
					method: 'DELETE',
					url: ApiEndpoint.url + 'person/' + personIndex,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			http(req).then(function(data){
				if (data.status === 204) {
					deferred.resolve(data);
				} else {
					deferred.reject('Errors');
				}
			});

			return promise;   
		}
	}
})

.service('SearchService', function($q, ApiEndpoint){
	return {
		search: function(searchQuery, http){
			var deferred = $q.defer();
			var promise = deferred.promise;

			promise.success = function(fn) {
					promise.then(fn);
					return promise;
			}
			promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
			}
			http.get(ApiEndpoint.url + 
								'person/search/findByFirstNameOrLastName?firstname=' + searchQuery + '&lastname=' + searchQuery)
					.then(function(data) {
						if (data.data._embedded != undefined && data.data._embedded.person != undefined){
							deferred.resolve(data.data._embedded.person);
						} else {
							deferred.reject('Errors');
						}
					});


			return promise;
		},

		listAllPerson: function(http){
			var deferred = $q.defer();
			var promise = deferred.promise;

			promise.success = function(fn) {
					promise.then(fn);
					return promise;
			}
			promise.error = function(fn) {
					promise.then(null, fn);
					return promise;
			}
			http.get(ApiEndpoint.url + 'person')
					.then(function(data) {
						if (data.data._embedded != undefined && data.data._embedded.person != undefined){
							deferred.resolve(data.data._embedded.person);
						} else {
							deferred.reject('Errors');
						}
					});

			return promise;
		}
	}
});
