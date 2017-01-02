var app = angular.module("ChatTree", ['ngAnimate', 'mgcrea.ngStrap', 'ui.tree'])

app.factory("users", function () {
    var user = {
        loggedUser: null,
        getUser: function () { return user.loggedUser }
    }
    user.users = {}
    user.login = function (username, pass) {
        if (user.users[username] == pass) {
            user.loggedUser = username;
            return true;
        }
        else return false;
    }
    user.register = function (username, pass) {
        if (!user.users[username]) {
            user.users[username] = pass;
            return true;
        }
        else return false;
    }
    user.logout = function () {
        user.loggedUser = null;
    }
    return user;
})

app.controller("main", ["$scope", "users", function ($scope, users) {
    var tabs = []
    $scope.tabs = tabs;

    var loginTab = { title: "Login", content: "templates/login.html" }
    var registerTab = { title: "Register", content: "templates/register.html" }
    var homeTab = { title: "Home", content: "templates/home.html" }

    activeTab = { index: 0 }
    $scope.activeTab = activeTab;

    $scope.openChat = function (name) {
        var tab = {
            title: name,
            content: "templates/chat.html"
        }
        var i = tabs.indexOf(tab)
        if (i == -1) {
            tabs.push(tab);
            i = tabs.length - 1
        }
        activeTab.index = i;
    }

    $scope.newSearch = function () {
        tabs.push({
            title: "Search",
            content: "templates/search.html"
        });
        activeTab.index = tabs.length - 1;
    }
    var resetTabs = function () {
        tabs.splice(0, tabs.length)
        tabs.push(homeTab)
    }
    resetTabs();

    $scope.login = function () {
        var i = tabs.indexOf(loginTab)
        if (i == -1) {
            tabs.push(loginTab);
            i = tabs.length - 1
        }
        activeTab.index = i;
    }
    $scope.register = function () {
        var i = tabs.indexOf(registerTab)
        if (i == -1) {
            tabs.push(registerTab);
            i = tabs.length - 1
        }
        activeTab.index = i;
    }
    $scope.logout = function () {
        users.logout();
        resetTabs();
    }

    $scope.$watch(users.getUser, function (newval) {
        $scope.user = newval;
        var i = tabs.indexOf(loginTab)
        if (i != -1) {
            tabs.splice(i, 1);
        }
        i = tabs.indexOf(registerTab)
        if (i != -1) {
            tabs.splice(i, 1);
        }
    })

    $scope.$watch(function () { return tabs.length }, function (newval) {
        if (newval == 0)
            resetTabs();
    });
}])

app.controller("search", ["$scope", "$filter", function ($scope, $filter) {
    $scope.searchTerm = null
    $scope.rooms = [
        { name: "room1", tags: ['tag', 'game'], private: false },
        { name: "room2", tags: ['tagged', 'game'], private: true }
    ]
}])

app.controller("login", ["$scope", "users", function ($scope, users) {
    var user = { name: null, password: null }
    $scope.user = user;
    $scope.success = null;
    $scope.error = null;
    $scope.login = function () {
        $scope.success = users.login(user.name, user.password)
        $scope.error = !$scope.success;
    }
}])

app.controller("register", ["$scope", "users", function ($scope, users) {
    var user = { name: null, password: null }
    $scope.user = user;
    $scope.success = null;
    $scope.error = null;
    $scope.register = function () {
        $scope.success = users.register(user.name, user.password)
        $scope.error = !$scope.success;
    }
}])