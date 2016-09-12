app.config([
  '$urlRouterProvider',
  '$stateProvider',
  '$httpProvider',    
  function($urlRouterProvider,$stateProvider,$httpProvider){

  $urlRouterProvider.otherwise('/');  

  $stateProvider.state('home',{
    url:'/',
    templateUrl:'angular/views/home.html', 
    controller: 'homeController'                 
  });  

}]);
