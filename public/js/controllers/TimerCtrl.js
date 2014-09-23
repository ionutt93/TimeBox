'use strict'
angular.module("TimerCtrl", []).controller("TimerController", function ($scope, $timeout) {
    $scope.workSession = 25;
    $scope.smallBreakSession = 5;
    $scope.bigBreakSession = 15;
    $scope.pomodoros = 1;
    $scope.bigBreakFreq = 4;
    $scope.$parent.timerActiveState = "Stopped";

    var interval;
    var pomodoroFinishedSound = new Audio('audio/pomodoro-finished.mp3');
    var breakFinishedSound = new Audio('audio/break-finished.mp3');

    $scope.active = false;
    $scope.remainingTime = $scope.workSession * 60;
    $scope.remaining = $scope.remainingTime * 1000;
   	$scope.workTime = 0;
   	$scope.breakTime = 0;
   	$scope.remainingBreakTime = $scope.smallBreakSession * 60;
    $scope.remainingBreak = $scope.remainingBreakTime * 1000;
   	$scope.action = "Start";
   	
   	// Chart init data
	var ctx = document.getElementById("time-rep").getContext("2d");
   	var chartData = [{
   		value: $scope.workTime,
   		color: "#FD7373"
   	}, {
   		value: $scope.remainingTime,
   		color: "#e8e8e8"
   	}, {
   		value: $scope.breakTime,
   		color: "#bee8ff"
    }, {
   		value: $scope.remainingBreakTime,
   		color: "#e8e8e8"
   	}];

    var timeChart = new Chart(ctx).Doughnut(chartData, {
    	percentageInnerCutout : 45,
    	animationEasing: "easeOutQuart",
      showTooltips: false
    });

    // Actions if button was clicked
    $scope.btnClick = function () {
    	if ($scope.action == "Start") {
    		$scope.startTimer();
    	} else if ($scope.action == "Pause") {
    		console.log("Pause timer");
    		$scope.pauseTimer();
    	}
    };

    // Actions if button was hold
    $scope.btnHold = function () {
    	if ($scope.action == "Start") {
    		$scope.startTimer();
    	} else if ($scope.action == "Pause") {
    		$scope.stopTimer();
    	}
    };

    // Checks if the given state is active
    $scope.isActive = function (state) {
    	if ($scope.$parent.timerActiveState == state)
    		return true;
    	return false;
    };

    // Updates chart
    $scope.updateChart = function () {
    	$scope.remainingTime = parseInt($scope.workSession) * 60;
   		$scope.workTime = 0;
   		$scope.breakTime = 0;

   		if ($scope.pomodoros != 0 && $scope.pomodoros % $scope.bigBreakFreq == 0)
   			$scope.remainingBreakTime = parseInt($scope.bigBreakSession) * 60;	
   		else
   			$scope.remainingBreakTime = parseInt($scope.smallBreakSession) * 60;	

   		timeChart.segments[0].value = $scope.workTime;
  		timeChart.segments[1].value = $scope.remainingTime;
  		timeChart.segments[2].value = $scope.breakTime;
  		timeChart.segments[3].value = $scope.remainingBreakTime;

  		timeChart.update();	
    };

    // Starts timer
    $scope.startTimer = function () {
    	if ($scope.$parent.timerActiveState == "Stopped") {
    		$scope.updateChart();
    	}
    	
    	$scope.action = "Pause";
    	$scope.$parent.timerActiveState = "Running";
    	if ($scope.isBreak == true)
    		$timeout($scope.breakTick, 1000);
    	else
   			$timeout($scope.tick, 1000);
    };

    // Stops timer
    $scope.stopTimer = function () {
   		$scope.action = "Start";
   		$scope.$parent.timerActiveState = "Stopped";
   		$scope.isBreak = false;

   		$scope.updateChart();
    };

    // Pause timer
    $scope.pauseTimer = function () {
    	if ($scope.$parent.timerActiveState == "Running") {
			$scope.action = "Start";
			$scope.$parent.timerActiveState = "Pause";
    	}
    };

    // Updates work time
   	$scope.tick = function () {
   		if ($scope.remainingTime == 0) {
   			console.log("Work time finished");
   			$scope.isBreak = true;
   			$scope.pomodoros++;

   			pomodoroFinishedSound.play();
        $scope.$parent.$emit('pomodoroFinished');
   			$scope.breakTick();

   		} else if ($scope.$parent.timerActiveState == "Running") {
	   		$scope.workTime++;
	   		$scope.remainingTime--;

            $scope.remaining = $scope.remainingTime * 1000;

  			timeChart.segments[0].value = $scope.workTime;
  			timeChart.segments[1].value = $scope.remainingTime;

  			timeChart.update();

  			console.log("Tick");
  			$timeout($scope.tick, 1000);	
   	    }
   	};

   	// Updates break time
   	$scope.breakTick = function () {
   		if ($scope.remainingBreakTime != 0 && $scope.$parent.timerActiveState == "Running") {
   			$scope.breakTime++;
  			$scope.remainingBreakTime--;
            $scope.remainingBreak = $scope.remainingBreakTime * 1000;

  			timeChart.segments[2].value = $scope.breakTime;
  			timeChart.segments[3].value = $scope.remainingBreakTime;

  			timeChart.update();
  			console.log("break tick");
  			$timeout($scope.breakTick, 1000);	
   		} else if ($scope.remainingBreakTime == 0) {
   			$scope.stopTimer();
   			breakFinishedSound.play();
   			console.log('Pomodoro finished');
   		}
   	};

   	// Decides between click and hold events
   	$scope.mouseEventStart = function () {
   		$scope.startTime = Date.now();
   	};

   	$scope.mouseEventStop = function () {
   		$scope.endTime = Date.now();
   		interval = $scope.endTime - $scope.startTime;
   		
   		if (interval < 500) {
   			console.log("click");
   			$scope.btnClick();
   		} else {
   			console.log("hold");
   			$scope.btnHold();
   		}
   	};
});
