'use strict';

/* globals angular */
angular.module('purusaido').service('dataService', ['$http', function ($http) {
  this.getTracks = function () {
    return $http.get('http://poolsideapi2.herokuapp.com/tracks');
  };
}]);