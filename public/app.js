var mongoose = require('mongoose');
require('.models/Posts');
require('.models/Comments');

mongoose.connect('mongodb://localhost/news');

var PostSchema = new mongoose.Schema({
  name: String,
  title: String,
  link: String,
  text: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});
 
mongoose.model('Post', PostSchema);

var CommentSchema = new mongoose.Schema({
  name: String,
  body: String,
  author: String,
  text: String,
  upvotes: {type: Number, default: 0},
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

mongoose.model('Comment', CommentSchema);

var app = angular.module("SUNews", []);
angular.module('SUNews', ['ui.router']);
app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);

app.controller("MainCtrl", [
  '$scope',
  'posts',
  function($scope, posts) {
    $scope.text = "Hello world!";
    $scope.posts = [
      {title: 'post 1', upvotes: 5},
      {title: 'post 2', upvotes: 2},
      {title: 'post 3', upvotes: 15},
      {title: 'post 4', upvotes: 9},
      {title: 'post 5', upvotes: 4}
    ];
    $scope.addPost = function() {
      if(!$scope.title || $scope.title === '') {return;}
      $scope.posts.push({
        author: $scope.name,
        title: $scope.title,
        link: $scope.link,
        post: $scope.text,
        upvotes: 0,
        comments: [
          {author: 'Joe', body:'Cool post!', upvotes: 0},
          {author: 'Bob', body:'Great idea but everything is wrong!', upvotes: 0}
        ]
       });
       $scope.name='';
      $scope.title = '';
      $scope.link = '';
      $scope.text = '';
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
    $scope.posts = posts.posts;
  }]);

  app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts) {
      $scope.post = posts.posts[$stateParams.id];
    }];

  $scope.addComment = function() {
    if($scope.body === '') {return; }
    $scope.post.comments.push({
      body: $scope.body,
      author: 'user',
      upvotes: 0
    });
    $scope.body = '';
    };
  );

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

      $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      });

      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      });

      $urlRouterProvider.otherwise('home');
    }]);
