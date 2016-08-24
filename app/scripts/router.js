'use strict';

/**
 * Config for the router
 */
app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;				
	}])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {	
		$urlRouterProvider
				.otherwise('/app/action');
		$stateProvider
			.state('app', {
				abstract: true,
				url: '/app',
				templateUrl: 'views/app.html'
			})
			//功能模块管理
			.state('app.action', {
				url: '/action',
				templateUrl: 'views/action/action.html',
				controller: 'ActionController'
			})
			.state('app.action.add', {
				url: '/addTree/:id?label',
				templateUrl: 'views/action/actionTree/addDelEdit.html',
				controller: 'Action_Add_Controller'
			})
			.state('app.action.del', {
				url: '/delTree/:id?label',
				templateUrl: 'views/action/actionTree/addDelEdit.html',
				controller: 'Action_Del_Controller'
			})
			.state('app.action.edit', {
				url: '/editTree/:id?label',
				templateUrl: 'views/action/actionTree/addDelEdit.html',
				controller: 'Action_Edit_Controller'
			})

			//组织机构管理
			.state('app.organization', {
				url: '/organization',
				templateUrl: 'views/organization/organization.html',
				controller: 'OrganizationController'
			})
			.state('app.organization.addTree', {
				url: '/addTree/:id?label',
				templateUrl: 'views/organization/organizationTree/organizationTreeAdd.html',
				controller: 'Organization_Addtree_Controller'
			})
			.state('app.organization.delTree', {
				url: '/delTree/:id?label',
				templateUrl: 'views/organization/organizationTree/organizationTreeDel.html',
				controller: 'Organization_Deltree_Controller'
			})
			.state('app.organization.editTree', {
				url: '/editTree/:id?label',
				templateUrl: 'views/organization/organizationTree/organizationTreeEdit.html',
				controller: 'Organization_Edittree_Controller'
			})
			.state('app.organization.addList', {
				url: '/addList/:id?label',
				templateUrl: 'views/organization/organizationList/organizationListForm.html',
				controller: 'Organization_Addlist_Controller'
			})
			.state('app.organization.editList', {
				url: '/editList/:id?label',
				templateUrl: 'views/organization/organizationList/organizationListForm.html',
				controller: 'Organization_Editlist_Controller'
			})

			//角色管理
			.state('app.role', {
				url: '/role',
				templateUrl: 'views/role/role.html',
				controller: 'RoleController'
			})
			.state('app.role.add', {
				url: '/add',
				templateUrl: 'views/role/roleForm/roleForm.html',
				controller: 'Role_add_controller'
			})
			.state('app.role.edit', {
				url: '/edit/:id?label',
				templateUrl: 'views/role/roleForm/roleForm.html',
				controller: 'Role_edit_controller'
			})

			//在线用户
			.state('app.onlineUser', {
				url: '/onlineUser',
				templateUrl: 'views/onlineUser/onlineUser.html',
				controller: 'OnlineUserController'
			})
			.state('app.onlineUser.add', {
				url: '/add',
				templateUrl: 'views/onlineUser/onlineUserForm/onlineUserForm.html',
				controller: 'OnlineUser_add_controller'
			})
			.state('app.onlineUser.edit', {
				url: '/edit/:id?label',
				templateUrl: 'views/onlineUser/onlineUserForm/onlineUserForm.html',
				controller: 'OnlineUser_edit_controller'
			})

			// others
			.state('access', {
				url: '/access',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('access.signin', {
				url: '/signin',
				templateUrl: 'views/access/page_signin.html',
				controller: 'SigninController'
			})
			.state('access.404', {
				url: '/404',
				templateUrl: 'views/access/page_404.html'
			});
	}]);