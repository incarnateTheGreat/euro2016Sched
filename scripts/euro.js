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
                    val.when = moment(matchDate).format("DD MMMM");
                    val.theDate = moment(matchDate).format("DD");
                    val.time = (moment(matchDate).format("HH.mm"));
                });
            });
        }

        function todaysMatches(o) {
            let matchDate = moment(o, "DD MMMM");
            if (today.isSame(moment(matchDate), "d")) return true;
        }
    }
}());
