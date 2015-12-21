angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $http) {
	$scope.login = function() {
		LoginService
		.loginUser(this.data.username, this.data.password, $http)
		.then($scope.loginSuccess, $scope.loginFail);
	};

	$scope.loginSuccess = function(data) {
		$state.go('search');
	};

	$scope.loginFail = function(data) {
		var alertPopup = $ionicPopup.alert({
			title: 'Login failed!',
			template: 'Please check your credentials!'
		});
	};

	$scope.signUp = function() {
		$state.go('signUp');
	};

})

.controller('SignUpCtrl', function($scope, $state, SignUpService, $http){
	$scope.back = function(){
		$state.go('login');
	};

	$scope.signUp = function(){
		// Our form data for creating a new post with ng-model
		SignUpService
		.signUpUser(this.data.username, this.data.password, this.data.firstName,
			this.data.lastName, this.data.email, this.data.note, this.data.phoneNumber, $http);
			$state.go('login');
	};
})

.controller('SearchCtrl', function($scope, SearchService, $ionicPopup, $state, $http, $ionicLoading, PersonDetail, DeletePersonService,$window) {

	$scope.shouldShowDelete = true;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true;

	$scope.search = function() {
		$scope.spinner = true;

		if (this.data === undefined || this.data.searchQuery == '') {
			SearchService
			.listAllPerson($http)
			.success(function(data) {
				$scope.persons = data;
				$scope.spinner = false;
			}).error(function(data) {
				var alertPopup = $ionicPopup.alert({
					title: 'Not found!',
					template: 'Not found!'
				});
				$scope.spinner = false;
				$scope.persons = "";
			});
		} else {
			SearchService
			.search(this.data.searchQuery, $http)
			.success(function(data) {
				$scope.persons = data;
				$scope.spinner = false;
			}).error(function(data) {
				var alertPopup = $ionicPopup.alert({
					title: 'Not found!',
					template: 'Not found!'
				});
				$scope.spinner = false;
				$scope.persons = "";
			});
		}
	};

	$scope.addNC = function() {
		$state.go('addNC');
	};

	$scope.logout = function(){    
		$state.go('login');
	};

	$scope.detail = function(person){
		PersonDetail.viewPerson(person);
		$state.go('detailNC');
	};

	$scope.delete = function(personHref){
		var personIndex = 0;
		if (personHref === undefined || personHref == '') {
			personIndex = 0;
		} else {
			personIndex = personHref.split('/')[personHref.split('/').length-1];
		};
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete',
			template: 'Are you sure you want to delete this person?'
		});
		confirmPopup.then(function(res) {
		if(res) {
			DeletePersonService
			.deletePerson(personIndex, $http)
			.success(function(data){
				SearchService
				.listAllPerson($http)
				.success(function(data) {
					$scope.persons = data;
				}).error(function(data) {
					var alertPopup = $ionicPopup.alert({
						title: 'Not found!',
						template: 'Not found!'
					});
				});
			});
		} else {
		  console.log('You are not sure');
		}
		});

	};

	$scope.doRefresh = function() {
		SearchService
		.listAllPerson($http)
		.success(function(data) {
		  $scope.persons = data;
		}).error(function(data) {
			var alertPopup = $ionicPopup.alert({
				title: 'Not found!',
				template: 'Not found!'
			});
		}).finally(function() {
		  // Stop the ion-refresher from spinning
		  $scope.$broadcast('scroll.refreshComplete');
		});
	};

	SearchService
		.listAllPerson($http)
		.success(function(data) {
			$scope.persons = data;
		}).error(function(data) {
			var alertPopup = $ionicPopup.alert({
						title: 'Not found!',
						template: 'Not found!'
			});
		});
})

.controller('AddCtrl', function($scope, $state, AddPersonService, $http, $window){
	$scope.back = function(){
		$state.go('search');
	};

	$scope.save = function(){
		// Our form data for creating a new post with ng-model
		AddPersonService
		.addPerson(this.data.firstName, this.data.lastName, this.data.email, 
			this.data.note, this.data.phoneNumber, $http)
		.success(function(data){
			$state.go('search', {}, { reload: true });
			$window.location.reload(true);
		});
	};
})

.controller('DetailCtrl', function($scope, $state, PersonDetail, $http, UpdatePersonService){
	$scope.back = function(){
		$state.go('search');
	};

	$scope.save = function(indexHref){
		var personIndex = 0;
		if (indexHref === undefined || indexHref == '') {
			personIndex = 0;
		} else {
			personIndex = indexHref.split('/')[indexHref.split('/').length-1];
		};

		UpdatePersonService
		.updPerson(this.person.firstName, this.person.lastName, this.person.email, 
			this.person.note, this.person.phoneNumber, $http, personIndex)
		.success(function(data){
			$state.go('search', {}, { reload: true });
			$window.location.reload(true);
		});
	};

	$scope.person = PersonDetail.person[0];
});
