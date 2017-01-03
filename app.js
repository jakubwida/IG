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
            { name: "room1", tags: [], private: false },
            { name: "room2", tags: [], private: true },
            { name: "video1", tags: ['Movies'], private: false },
            { name: "movies2", tags: ['Movies'], private: false },
            { name: "video", tags: ['Movies'], private: false },
            { name: "python", tags: ['Python'], private: true },
            { name: "c++", tags: ['C++'], private: false },
            { name: "Fruit exchange I", tags: ['Apple','Banana','Lemon','Fruit'], private: false },
			{ name: "Apple computing", tags: ['Apple','Iphone','Mac'], private: false },
			{ name: "Dirt Manufacture I", tags: ['Dirt','Ground'], private: false },
			{ name: "Dirt Manufacture II: Dirt Returns", tags: ['Dirt','Ground','Sequel'], private: false },
			{ name: "Game Dev exchange", tags: ['Game','Xbox One','PS4','C++','Lua'], private: false },
			{ name: "Apartament Studio", tags: ['Youtube','Movies','Apple','Banana'], private: true },
			{ name: "John's Fruit Stories", tags: ['Xbox One'], private: false },
			{ name: "banana", tags: ['Banana'], private: false },
			{ name: "The Sequel Selection", tags: ['Movies','Sequel'], private: false },
			{ name: "Fruit exchange", tags: ['Apple','Banana','Lemon','Fruit'], private: false },
			{ name: "Programming Parlour", tags: ['Python','C++','Lua'], private: true },
			{ name: "paperwork", tags: ['Origami','Paper'], private: false },
			{ name: "paperwork 2", tags: ['Origami','Paper'], private: true },
			{ name: "the broom room", tags: [], private: false },
            { name: "The Nerds Nostrils", tags: ['Movies','Comics','DC','Marvel'], private: false },
            { name: "CMC Forum Chat Board", tags: ['Forum','CMC'], private: true },
            { name: "CMC Forum Open Chat Board", tags: ['Forum','CMC'], private: false },
            { name: "chitchat", tags: [], private: true },
            { name: "cat chat", tags: ['Cat'], private: false },
            { name: "Outside Extra", tags: ['Game', 'PS4', 'Youtube', 'X360'], private: true }],
        availableTags: [
            'Game', 'PS4', 'Movies', 'X360', 'Comics', 'DC', 'Marvel', 'AngularJS', 'Bootstrap', 'C++', 'Python', 'Lua','Apple','Banana','Lemon','Fruit','Iphone','Mac','Dirt','Ground','Sequel'
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
    $scope.searchTerm = '';
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

app.controller("chatroom", ["$scope", "users", function ($scope, users) {
    $scope.currentUser = users.getUser();
	var generate_unique_participants =function()
		{
		var name_list =
			[
			'Anthony Johnson',
			'Jeremy Hawks',
			'Janusz Brzeczka',
			'Karol Nowak',
			'Hans Otto',
			'Sergei Sergeiovich Sergeiovsky',
			'Ivan Ivanovich Tcherkin',
			'Jorah Smith',
			'Wolfgang Purtz',
			'hAxOOrL331',
			'xxXKancerk1dXxx',
			'Mr Cat',
			'Elliot Sunday',
			'Bill Brokes',
			'Hakashiwa Horukawa',
			'Chris',
			'Chris1',
			'Chris2',
			'Chris71',
			'Chris1981',
			'Chatter6',
			'xXxDankPlankxXx',
			'send_me_fruits'
			];
		var len = name_list.length;
		var out_len=Math.floor((Math.random() * len) + 1);
		var out_names = [];
		while (out_len>0)
			{
			var num =Math.floor((Math.random() * len) + 1); 
			if(out_names.indexOf(name_list[num])==-1)
				{
				out_names.push(name_list[num]);
				out_len=out_len-1;
				}
			}
		var out =[]
		for(x in out_names)
			{
			
			out.push({name:out_names[x],muted:false});
			}
		return out;
		
		};
    var participants = [];
    participants.push({ name: users.getUser(), muted: false });
	participants.push.apply(participants,generate_unique_participants())
    $scope.users = participants;

    var messages = [];
    $scope.messages = messages;

    $scope.message = null;
    $scope.send = function (event) {
        var key = event.which;
        if ((key == 13 || key == 1) && $scope.message != null) {
            messages.push({ sender: users.getUser(), text: $scope.message });
            $scope.message = null;
        }
    }
}]); 
