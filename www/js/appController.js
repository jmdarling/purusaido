'use strict';

/* globals angular SC */
angular.module('purusaido').controller('appController', ['$scope', '$ionicLoading', 'dataService', function ($scope, $ionicLoading, dataService) {
  $scope.states = {
    play: 'play',
    pause: 'pause',
    stop: 'stop'
  };

  $scope.currentTrack = {};

  $scope.player = {};

  $scope.state = $scope.states.stop;

  dataService.getTracks().then(function (response) {
    $scope.tracks = response.data;

    SC.initialize({
      client_id: '4b6980dcd349603b96c8312647f9d6df'
    });
  }).catch(function (err) {
    console.error(err);
  });

  $scope.play = function () {
    if ($scope.state === $scope.states.pause) {
      $scope.player.play();
      $scope.state = $scope.states.play;
      return;
    }

    $scope.currentTrack = getRandomTrack();
    $scope.state = $scope.states.stop;

    $ionicLoading.show({
      template: 'Loading...'
    });

    SC.stream('/tracks/' + $scope.currentTrack.scId).then(function (player) {
      $scope.$apply(function () {
        $scope.player = player;
        $scope.player.play();
        $scope.player.on('finish', function () {
          $scope.play();
        });
        $scope.state = $scope.states.play;
      });
      $ionicLoading.hide();
    }).catch(function (error) {
      console.error(error);
      $scope.play();
    });
  };

  $scope.pause = function () {
    $scope.player.pause();
    $scope.state = $scope.states.pause;
  };

  $scope.skip = function () {
    $scope.state = $scope.states.play;
    $scope.play();
  };

  function getRandomTrack() {
    return $scope.tracks[window.Math.floor(window.Math.random() * $scope.tracks.length)];
  }
}]);