'use strict'
angular.module("TimerCtrl", []).controller("TimerController", function ($scope, $timeout) {
    var session = 25;
    var interval;
    var activeState = "Stopped";
    
    $scope.active = false;
    $scope.remainingTime = session;
   	$scope.workTime = 0;
   	$scope.action = "Start";
   	// Chart init data
	var ctx = document.getElementById("time-rep").getContext("2d");
   	var chartData = [{
   		value: $scope.workTime,
   		color: "#ff1d00",
   		highlight: "#ff1d00",
   		label: "Done"		
   	}, {
   		value: $scope.remainingTime,
   		color: "#e8e8e8",
   		highlight: "#e8e8e8",
   		label: "Remaining"
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

    $scope.isActive = function (state) {
    	if (activeState == state)
    		return true;
    	return false;
    };

    $scope.startTimer = function () {
    	if (activeState == "Stopped") {
    		$scope.remainingTime = session;
	   		$scope.workTime = 0;
    	}
    	
    	$scope.action = "Pause";
    	activeState = "Running";
   		$timeout($scope.tick, 1000);
    };

    $scope.stopTimer = function () {
    	$scope.remainingTime = session;
   		$scope.workTime = 0;
   		$scope.action = "Start";
   		activeState = "Stopped";

   		timeChart.segments[0].value = $scope.workTime;
		timeChart.segments[1].value = $scope.remainingTime;

		timeChart.update();
    };

    $scope.pauseTimer = function () {
    	if (activeState == "Running") {
			$scope.action = "Start";
			activeState = "Pause";
    	}
    };

   	$scope.tick = function () {
   		if ($scope.remainingTime == 0) {
   			console.log("Timer finished/paused");
   			activeState = "Stopped";
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
