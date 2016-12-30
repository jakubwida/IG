var app = angular.module("ChatTree", ['ngAnimate', 'mgcrea.ngStrap', 'ui.tree'])
app.controller("main", function ($scope) {
    $scope.tabs = [
        {
            title: "Home",
            content: "templates/home.html"
        },
        {
            title: "Search",
            content: "templates/search.html"
        }
    ]
    $scope.activeTab = "Home"
})
app.controller("search", function ($scope, $filter) {
    $scope.searchTerm = null
    $scope.rooms = [
        { name: "room1", tags: ['tag', 'game'], private: false },
        { name: "room2", tags: ['tagged', 'game'], private: true }
    ]
})