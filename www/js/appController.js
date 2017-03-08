'use strict';

/* globals angular */
angular.module('purusaido').controller('appController', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
  $scope.states = {
    play: 'play',
    pause: 'pause',
    stop: 'stop'
  };

  $scope.currentTrack = '';
  $scope.state = $scope.states.stop;
  $scope.audio = new window.Audio('http://stream.radio.co/s98f81d47e/listen');

  $scope.pause = function () {
    if ($scope.state === $scope.states.pause || $scope.state === $scope.states.stop) {
      return;
    }

    $scope.audio.pause();
    $scope.state = $scope.states.pause;
    $scope.currentTrack = '';
  };

  $scope.play = function () {
    if ($scope.state === $scope.states.play) {
      return;
    }

    $scope.audio.play();
    $scope.state = $scope.states.play;

    getCurrentTrackTitle().then(function (title) {
      $scope.currentTrack = title;
    });
  };

  $interval(function () {
    if ($scope.state === $scope.states.play) {
      getCurrentTrackTitle().then(function (title) {
        $scope.currentTrack = title;
      });
    }
  }, 5000);

  function getCurrentTrackTitle() {
    return $http.get('https://public.radio.co/stations/s98f81d47e/status').then(function (response) {
      return response.data.current_track.title;
    });
  }
}]);