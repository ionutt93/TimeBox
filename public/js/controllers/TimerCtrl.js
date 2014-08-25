'use strict'
angular.module("TimerCtrl", []).controller("TimerController", function ($scope, $timeout) {
    $scope.workSession = 25;
    $scope.breakSession = 5;

    var interval;
    var activeState = "Stopped";
    
    $scope.active = false;
    $scope.remainingTime = $scope.workSession;
   	$scope.workTime = 0;
   	$scope.breakTime = 0;
   	$scope.remainingBreakTime = $scope.breakSession;
   	$scope.action = "Start";
   	
   	// Chart init data
	var ctx = document.getElementById("time-rep").getContext("2d");
   	var chartData = [{
   		value: $scope.workTime,
   		color: "#ff1d00"
   	}, {
   		value: $scope.remainingTime,
   		color: "#e8e8e8"
   	}, {
   		value: $scope.breakTime,
   		color: "#bee8ff"
    }, {
   		value: $scope.breakSession,
   		color: "#9ec1d6"
   	}];

    var timeChart = new Chart(ctx).Doughnut(chartData, {
    	percentageInnerCutout : 45,
    	animationEasing: "easeOutQuart"
    });

    $scope.btnClick = function () {
    	if ($scope.action == "Start") {
    		$scope.startTimer();
    	} else if ($scope.action == "Pause") {
    		console.log("Pause timer");
    		$scope.pauseTimer();
    	}
    };

    $scope.btnHold = function () {
    	if ($scope.action == "Start") {
    		$scope.startTimer();
    	} else if ($scope.action == "Pause") {
    		$scope.stopTimer();
    	}
    };

    // Checks if the given state is active
    $scope.isActive = function (state) {
    	if (activeState == state)
    		return true;
    	return false;
    };

    // Updates chart
    $scope.updateChart = function () {
    	$scope.remainingTime = parseInt($scope.workSession);
   		$scope.workTime = 0;

   		$scope.remainingBreakTime = parseInt($scope.breakSession);
   		$scope.breakTime = 0;

   		timeChart.segments[0].value = $scope.workTime;
		timeChart.segments[1].value = $scope.remainingTime;
		timeChart.segments[2].value = $scope.breakTime;
		timeChart.segments[3].value = $scope.remainingBreakTime;

		timeChart.update();	
    };

    // Starts timer
    $scope.startTimer = function () {
    	if (activeState == "Stopped") {
    		$scope.updateChart();
    	}
    	
    	$scope.action = "Pause";
    	activeState = "Running";
    	if ($scope.isBreak == true)
    		$timeout($scope.breakTick, 1000);
    	else
   			$timeout($scope.tick, 1000);
    };

    // Stops timer
    $scope.stopTimer = function () {
    	console.log($scope.workSession);
    	console.log($scope.breakSession);

   		$scope.action = "Start";
   		activeState = "Stopped";
   		$scope.isBreak = false;

   		$scope.updateChart();
    };

    // Pause timer
    $scope.pauseTimer = function () {
    	if (activeState == "Running") {
			$scope.action = "Start";
			activeState = "Pause";
    	}
    };

    // Updates work time
   	$scope.tick = function () {
   		if ($scope.remainingTime == 0) {
   			console.log("Work time finished");
   			$scope.isBreak = true;
   			$scope.breakTick();

   		} else if (activeState == "Running") {
	   		$scope.workTime++;
	   		$scope.remainingTime--;

			timeChart.segments[0].value = $scope.workTime;
			timeChart.segments[1].value = $scope.remainingTime;

			timeChart.update();

			console.log("Tick");
			$timeout($scope.tick, 1000);	
   		}
   	};

   	// Updates break time
   	$scope.breakTick = function () {
   		if ($scope.remainingBreakTime != 0 && activeState == "Running") {
   			$scope.breakTime++;
			$scope.remainingBreakTime--;

			timeChart.segments[2].value = $scope.breakTime;
			timeChart.segments[3].value = $scope.remainingBreakTime;

			timeChart.update();
			console.log("break tick");
			$timeout($scope.breakTick, 1000);	
   		} else if ($scope.remainingBreakTime == 0) {
   			$scope.stopTimer();
   			console.log('Pomodoro finished');
   		}
   	};

   	// Mouse click and mouse hold
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
