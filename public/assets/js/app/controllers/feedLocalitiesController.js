'use strict';
/*
 * Feeds Locality Controller
 *
 */
function FeedLocalitiesCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  var breadcrumbs = [
    {
      name: "Feeds",
      url: "/#/feeds"
    },
    {
      name: feedid,
      url: "/#/feeds/" + $scope.vipfeed
    },
    {
      name: "Election",
      url: "/#/feeds/" + $scope.vipfeed + "/election"
    },
    {
      name: "State",
      url: "/#/feeds/" + $scope.vipfeed + "/election/state"
    },
    {
      name: "Localities",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Localities", breadcrumbs, "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedLocalitiesCtrl_getFeedLocalities($scope, $rootScope, $feedsService, data.localities, $filter, ngTableParams);

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, the VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedData = {};
      $scope.feedLocalities = {};
    });
}

/*
 * Get the Feed Localities for the Feed detail page
 *
 */
function FeedLocalitiesCtrl_getFeedLocalities($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Locality
  $feedsService.getFeedLocalities(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedLocalities = data;

      // sets the defaults for the table sorting parameters
      $scope.localitiesTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = $scope.feedLocalities.length + " Localities";


    }).error(function (data, $http) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Localities data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocalities = {};
    });
}
