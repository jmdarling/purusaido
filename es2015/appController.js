/* globals angular SC */
angular.module('purusaido').controller('appController', ['$scope', 'dataService', function ($scope, dataService) {
  $scope.states = {
    play: 'play',
    pause: 'pause',
    stop: 'stop'
  }

  $scope.currentTrack = {}

  $scope.player = {}

  $scope.state = $scope.states.stop

  dataService.getTracks()
    .then(response => {
      $scope.tracks = response.data

      SC.initialize({
        client_id: '4b6980dcd349603b96c8312647f9d6df'
      })
    })
    .catch(err => {
      console.error(err)
    })

  $scope.play = () => {
    if ($scope.state === $scope.states.pause) {
      $scope.player.play()
      $scope.state = $scope.states.play
      return
    }

    $scope.currentTrack = getRandomTrack()

    SC.stream(`/tracks/${$scope.currentTrack.scId}`)
      .then(player => {
        $scope.$apply(() => {
          $scope.player = player
          $scope.player.play()
          $scope.player.on('finish', () => {
            $scope.play()
          })
          $scope.state = $scope.states.play
        })
      })
      .catch(error => {
        console.error(error)
        $scope.play()
      })
  }

  $scope.pause = () => {
    $scope.player.pause()
    $scope.state = $scope.states.pause
  }

  $scope.skip = () => {
    $scope.state = $scope.states.play
    $scope.play()
  }

  function getRandomTrack () {
    return $scope.tracks[window.Math.floor(window.Math.random() * $scope.tracks.length)]
  }
}])
