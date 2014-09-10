'use strict'
angular.module('myGroupDirective', ['myTaskDirective'])
	.directive('myGroup', function () {
		return {
			restrict: 'E',
			templateUrl: './views/group-partial.html',
			link: function (scope, element, attrs) {
				scope.groupName = attrs.name;
			}
		}
	})
	.directive('myEnter', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('keypress', function (event) {
					if (event.which == 13) {
						createGroup(element[0].value);
					}
				});

				function createGroup (name) {
					scope.insertGroup(name);
					element[0].value = "";
					scope.groupInputVisible = false;
				}
			}
		}
	})
	.directive('myFocusGroup', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
            	var gIndex = attrs.myFocusGroup;

            	if (element.hasClass('create-new-group')) {
            		scope.$watch('groupInputVisible', function (newValue) {
            			if (newValue == true)
            				element[0].children[1].focus();
            		});
				} else {
					scope.$watch('groups[gIndex].inputVisible', function (newValue) {
            		if (newValue == true)
            			element[0].children[0].children[0].focus();
            		});	
				}
            }	
		}
	});