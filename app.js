var app = angular.module("ChatTree", ['ngAnimate', 'mgcrea.ngStrap', 'ui.tree'])

app.factory("users", function () {
    var user = {
        loggedUser: null,
        getUser: function () { return user.loggedUser }
    }
    user.users = { 'test_user': 'tester' }
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

app.factory("rooms", function () {
    var rooms = {
        joinedRooms: [],
        availableRooms: [
            { name: "room1", tags: ['tag', 'game'], private: false },
            { name: "room2", tags: ['tagged', 'game'], private: true }],
        availableTags: [
            'Game', 'PS4', 'Movies', 'X360', 'Comics', 'DC', 'Marvel', 'AngularJS', 'Bootstrap', 'C++', 'Python', 'Lua'
        ],
        logout: function () {
            rooms.joinedRooms.splice(0, rooms.joinedRooms.length);
        },
        joined: function (room) {
            return rooms.joinedRooms.findIndex(function (name) { return room == name }) != -1
        },
        join: function (room) {
            rooms.joinedRooms.push(room);
        },
        leave: function (room) {
            var i = rooms.joinedRooms.indexOf(room);
            rooms.joinedRooms.splice(i, 1);
        }
    }
    return rooms;
})

app.controller("main", ["$scope", "users", "rooms", function ($scope, users, rooms) {
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
        if (!rooms.joined(name)) rooms.join(name)
        var i = tabs.findIndex(function (tab) { return tab.title == name; })
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
        rooms.logout();
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

app.controller("search", ["$scope", "$filter", "rooms", function ($scope, $filter, rooms) {
    $scope.searchTerm = null
    $scope.rooms = rooms.availableRooms;
    $scope.joined = rooms.joined;
    $scope.notJoined = function (room) { return !rooms.joined(room.name); }
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