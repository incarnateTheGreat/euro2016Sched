'use strict';

(function () {
    const EuroApp = angular.module("EuroApp", ["ngAnimate"]);

    EuroApp.factory("euroTableFactory", function ($http) {
        let promise;
        const jsondata = {
            get: function () {
                if (!promise) {
                    promise = $http.get("src/euro2016.json").success(function (response) {
                        return response.data;
                    });
                    return promise;
                }
            }
        };
        return jsondata;
    });

    EuroCtrl.$inject = ["euroTableFactory"];
    EuroApp.controller('EuroCtrl', EuroCtrl);

    function EuroCtrl(euroTableFactory) {
        const vm = this;
        const today = moment();
        const format = {
            when: "DD MMMM",
            theDate: "DD",
            time: "HH.mm",
            dateFormat: "d"
        };

        vm.todaysMatches = todaysMatches;
        vm.buildFixtureTable = buildFixtureTable;
        vm.evenOddClass = null;
        vm.euroFixtures = null;

        activate();

        function activate() {
            buildFixtureTable();
        }

        function buildFixtureTable() {
            euroTableFactory.get().then(function (d) {
                vm.euroFixtures = d.data.matches;
                var teams = d.data.teams;

                _.forEach(vm.euroFixtures, function (val) {
                    var matchDate = val.when;

                    var homeTeam = _.filter(teams, function (o) {
                        return o.code == val.home ? o.name : "";
                    });

                    var awayTeam = _.filter(teams, function (o) {
                        return o.code == val.away ? o.name : "";
                    });

                    val.home = homeTeam[0].name;
                    val.away = awayTeam[0].name;
                    val.when = moment(matchDate).format(format.when);
                    val.theDate = moment(matchDate).format(format.theDate);
                    val.time = (moment(matchDate).format(format.time));
                });
            });
        }

        function todaysMatches(o) {
            let matchDate = moment(o, format.when);
            if (today.isSame(moment(matchDate), format.dateFormat)) return true;
        }
    }
}());
