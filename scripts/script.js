angular.module('app', ['LocalStorageModule'])
  .directive('gitCard', gitCard)
  .service('GitService', gitService)
  .controller('MainController', MainController);

function gitService(localStorageService) {
  var service = {
    add: add,
    remove: remove,
    getAll: getAll
  },

  users = JSON.parse(localStorageService.get('users') || '[]');

  return service;


  function add(user) {
    if(!~users.indexOf(user)){
      users.push(user);
      save();
    }
  }

  function remove(user) {
    var index = users.indexOf(user);

    users.splice(index, 1);
  }

  function getAll() {
    return users;
  }

  function save() {
    localStorageService.set('users', JSON.stringify(users));
  }
}

function gitCard($http) {
  return {
    restrict: 'E',
    templateUrl: 'git-card.html',
    scope: {
      user: '=',
      remove: '&'
    },
    link: function(scope) {
      $http.get('https://api.github.com/users/' + scope.user)
      .then(function (response) {
        scope.data = response.data;
      })
      .catch(function (err) {
        scope.data = {
          name: 'user not found : ' + scope.user
        }
      });
    }
  }
}

function MainController(GitService) {
  var vm = this;

  vm.submit = submit;
  vm.remove = remove;
  vm.user = '';
  vm.users = GitService.getAll();

  function remove(user) {
    console.log('main remove')
    GitService.remove(user);
  }

  function submit() {
    GitService.add(vm.user);
    vm.user = '';
  }
}
