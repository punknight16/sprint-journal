var http = require('http');
var fs = require('fs');
var mu = require('mu2-updated');

var receivePostData = require('./_models/receive-post-data');
var receiveCookieData = require('./_models/receive-cookie-data');
var registerInteractor = require('./_scripts/register-interactor');
var setDarkModeInteractor = require('./_scripts/set-dark-mode-interactor');
var getBrowseInteractor = require('./_scripts/get-browse-interactor');
var getHomeInteractor = require('./_scripts/get-home-interactor');
var openSprintInteractor = require('./_scripts/open-sprint-interactor');

var error = function(res, err_msg){
	displayTemplate(res, err_msg, 'error.html');
};

var displayTemplate = function(res, msg, template=null, args={}){
	var template_path = "./_templates/"+template;
	var full_args = Object.assign(args, {msg: msg});
	var stream = mu.compileAndRender(template_path, full_args);
	stream.pipe(res);
}

var data = {
	universal_data: [],
	name_data: [
		{universal_id: 'check_icon', universal_name: 'M6.41 0l-.69.72-2.78 2.78-.81-.78-.72-.72-1.41 1.41.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72-1.44-1.41z'},
		{universal_id: 'broadcast_icon', universal_name: 'M3.75 0c-1.38 0-2.66.4-3.75 1.09l.53.81c.93-.59 2.03-.91 3.22-.91 1.2 0 2.32.31 3.25.91l.53-.81c-1.09-.7-2.4-1.09-3.78-1.09zm0 3c-.79 0-1.5.23-2.13.63l.53.84c.47-.3 1-.47 1.59-.47.59 0 1.16.17 1.63.47l.53-.84c-.62-.39-1.37-.63-2.16-.63zm0 3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'},
		{universal_id: 'video_icon', universal_name: 'M.5 0c-.28 0-.5.23-.5.5v4c0 .28.23.5.5.5h5c.28 0 .5-.22.5-.5v-1.5l1 1h1v-3h-1l-1 1v-1.5c0-.28-.22-.5-.5-.5h-5z'},
		{universal_id: 'audio_icon', universal_name: 'M2.91-.03a1 1 0 0 0-.13.03 1 1 0 0 0-.78 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1.09-1.03zm-2.56 2.03a.5.5 0 0 0-.34.5v.5c0 1.48 1.09 2.69 2.5 2.94v1.06h-.5c-.55 0-1 .45-1 1h4.01c0-.55-.45-1-1-1h-.5v-1.06c1.41-.24 2.5-1.46 2.5-2.94v-.5a.5.5 0 1 0-1 0v.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2v-.5a.5.5 0 0 0-.59-.5.5.5 0 0 0-.06 0z'},
		{universal_id: 'support_icon', universal_name: 'M2 0v2h-2v4h2v2h4v-2h2v-4h-2v-2h-4z'},
		{universal_id: 'b1', universal_name: 'open-a-sprint'},
		{universal_id: 'b2', universal_name: 'add-article'},
		{universal_id: 'b3', universal_name: 'broadcast-progress'},
		{universal_id: 'b4', universal_name: 'close-sprint'},
		{universal_id: 'b5', universal_name: 'dark-mode'},
		{universal_id: 'c1', universal_name: 'punknight'},
		{universal_id: 'c2', universal_name: 'basic_burrata'},
		{universal_id: 'c3', universal_name: 'lopimentel'},
		{universal_id: 'c4', universal_name: 'riley'},
		{universal_id: 'c5', universal_name: 'SortOf'},
		{universal_id: 'c6', universal_name: '[OSCE] MaSa'},
		{universal_id: 'c7', universal_name: 'LiquidTLO'},
		{universal_id: 'c8', universal_name: '[ROOT] puCK'},
		{universal_id: 'c9', universal_name: '[Chivo] Cham'},
		{universal_id: 'c10', universal_name: 'llllllllllll'},
		{universal_id: 'c11', universal_name: '[AlpX] Light'},
		{universal_id: 'c12', universal_name: '[BearMe] PiLiPiLi'},
		{universal_id: 'c13', universal_name: '[PSISTM] Epic'},
		{universal_id: 'c14', universal_name: '[CYCLPS] Winter'},
		{universal_id: 's1', universal_name: 'pay off loans'},
		{universal_id: 's2', universal_name: '365 pic challenge'},
		{universal_id: 's3', universal_name: 'gain clients'},
		{universal_id: 's4', universal_name: 'train dog'},
		{universal_id: 's5', universal_name: 'increase macro game'},
		{universal_id: 's6', universal_name: 'eat healthier food'},
		{universal_id: 's7', universal_name: 'explore my new home'},
		{universal_id: 's8', universal_name: 'learn chinese'},
		{universal_id: 's9', universal_name: 'meditate everyday'},
		{universal_id: 's10', universal_name: 'get a promotion'},
		{universal_id: 's11', universal_name: 'train for marathon'},
		{universal_id: 's12', universal_name: 'learn to give more'},
		{universal_id: 's13', universal_name: 'fill out billing everyday'},
		{universal_id: 's14', universal_name: 'pass more butter'}


	],
	cred_data: [],
	engagement_data: [],
	badge_data: [],
	sprint_data: [
		{status_id: '', cred_id: 'c1', sprint_id:'s1', retention_metric: .2345},
		{status_id: 'broadcast_icon', cred_id: 'c2', sprint_id:'s2', retention_metric: .2345},
		{status_id: 'video_icon', cred_id: 'c3', sprint_id:'s3', retention_metric: .2345},
		{status_id: '', cred_id: 'c4', sprint_id:'s4', retention_metric: .2345},
		{status_id: '', cred_id: 'c5', sprint_id:'s5', retention_metric: .2345},
		{status_id: '', cred_id: 'c6', sprint_id:'s6', retention_metric: .2345},
		{status_id: '', cred_id: 'c7', sprint_id:'s7', retention_metric: .2345},
		{status_id: '', cred_id: 'c8', sprint_id:'s8', retention_metric: .2345},
		{status_id: '', cred_id: 'c9', sprint_id:'s9', retention_metric: .2345},
		{status_id: '', cred_id: 'c10', sprint_id:'s10', retention_metric: .2345},
		{status_id: '', cred_id: 'c11', sprint_id:'s11', retention_metric: .2345},
		{status_id: '', cred_id: 'c12', sprint_id:'s12', retention_metric: .2345},
		{status_id: '', cred_id: 'c13', sprint_id:'s13', retention_metric: .2345},
		{status_id: '', cred_id: 'c14', sprint_id:'s14', retention_metric: .2345},
	]
};

var config = {
	pass_secret: require('./_config/cred.js').pass_secret,
	token_secret: require('./_config/cred.js').token_secret,
	last_engagement_arr: [],
	token_arr: []
};
var ext = {};
ext.generateId = require('./_models/generate-id');
ext.addObj = require('./_models/add-obj');
ext.getObj = require('./_models/get-obj');
ext.editObj = require('./_models/edit-obj');
ext.listObj = require('./_models/list-obj');
ext.addCredObj = require('./_scripts/add-cred-obj');
ext.addNameObj = require('./_scripts/add-name-obj');
ext.addEngagementObj = require('./_scripts/add-engagement-obj');
ext.addTokenObj = require('./_scripts/add-token-obj');
ext.encryptPassword = require('./_models/encrypt').encryptPassword;
ext.compareCreds = require('./_models/encrypt').compareCreds;
ext.crypto = require('crypto');
ext.cypher = require('./_models/cypher').cypher;
ext.decypher = require('./_models/cypher').decypher;
ext.addBadgeObj = require('./_scripts/add-badge-obj');
ext.getBadgeObj = require('./_scripts/get-badge-obj');
ext.editBadgeObj = require('./_scripts/edit-badge-obj');
ext.authorizeRequest = require('./_models/authorize-request');
ext.getTokenObj = require('./_scripts/get-token-obj');
ext.compareKeys = require('./_models/compare-keys');
ext.listSprintObj = require('./_scripts/list-sprint-obj');

var server = http.createServer(function(req, res){
	var path_params = req.url.split('/');
	var path = path_params[1].split('?');
	switch(path[0]){
		case '':
			var stream = fs.createReadStream('./_pages/index.html');
			stream.pipe(res);
			break;
		case 'index':
			var stream = fs.createReadStream('./_pages/index.html');
			stream.pipe(res);
			break;
		case 'login':
			var stream = fs.createReadStream('./_pages/login.html');
			stream.pipe(res);
			break;
		case 'register':
			var stream = fs.createReadStream('./_pages/register.html');
			stream.pipe(res);
			break;

		case 'easter-egg':
			receiveCookieData(req, function(err, cookie_obj){
				if(err) return error(res, err);
				if(!cookie_obj.hasOwnProperty('token_id')) return error(res, 'missing auth params');
				if(!cookie_obj.hasOwnProperty('public_token')) return error(res, 'missing auth params');
				setDarkModeInteractor(data, config, cookie_obj, ext, function(err, confirm_args){
					if(err) return error(res, err);
					confirm_args.cookie_script = '';
					var test_index = confirm_args.badge_arr.findIndex((item)=>{
						return (item.badge_id=='b5' && item.vector=='check_icon')
					});
					swapIdForName(data.name_data, confirm_args.badge_arr, function(err, swapped_data){
						if(test_index!=-1){
							confirm_args.dark = 'light';
							confirm_args.light = 'dark';
						} else {
							confirm_args.dark = 'dark';
							confirm_args.light = 'light';
						}
						confirm_args.badges = swapped_data;
						displayTemplate(res, 'dark-mode changed', 'badge.html', confirm_args);
					});
				});
			});
			break;
		case 'browse':
			receiveCookieData(req, function(err, cookie_obj){
				if(err) return error(res, err);
				if(!cookie_obj.hasOwnProperty('token_id')) return error(res, 'missing auth params');
				if(!cookie_obj.hasOwnProperty('public_token')) return error(res, 'missing auth params');
				if(typeof path[1] == 'undefined'){
						path[1] = 'page=1';
					};
				var args = Object.assign(cookie_obj, {page: path[1].split('=')[1]});
				getBrowseInteractor(data, config, args, ext, function(err, confirm_args){
					if(err) return error(res, err);
					confirm_args.cookie_script = '';
					var test_index = confirm_args.badge_arr.findIndex((item)=>{
						return (item.badge_id=='b5' && item.vector=='check_icon')
					});
					confirm_args.pages = new Array(confirm_args.pages).fill({a:1}).map((item, index)=>{ 
						item = {};
						item.active = '';
						if((confirm_args.page-1)==index){
							item.active = 'active'
						}
						item.index = index+1;
						return item;
					});
					swapIdForName(data.name_data, confirm_args.badge_arr, function(err, swapped_data){
						swapIdForName(data.name_data, confirm_args.sprint_arr, function(err, more_swaps){
							if(test_index!=-1 || typeof test_index == 'undefined'){
								confirm_args.dark = 'light';
								confirm_args.light = 'dark';
							} else {
								confirm_args.dark = 'dark';
								confirm_args.light = 'light';
							}
							confirm_args.badges = swapped_data;
							confirm_args.Objects = more_swaps;
							displayTemplate(res, '', 'browse.html', confirm_args);
						});
					});
				});
			});
			break;
		case 'home':
			if(req.method=='GET'){
				receiveCookieData(req, function(err, cookie_obj){
					if(err) return error(res, err);
					if(!cookie_obj.hasOwnProperty('token_id')) return error(res, 'missing auth params');
					if(!cookie_obj.hasOwnProperty('public_token')) return error(res, 'missing auth params');
					getHomeInteractor(data, config, cookie_obj, ext, function(err, confirm_args){
						if(err) return error(res, err);
						var test_index = confirm_args.badge_arr.findIndex((item)=>{
							return (item.badge_id=='b5' && item.vector=='check_icon')
						});
						swapIdForName(data.name_data, confirm_args.badge_arr, function(err, swapped_data){
							if(test_index!=-1){
								confirm_args.dark = 'light';
								confirm_args.light = 'dark';
							} else {
								confirm_args.dark = 'dark';
								confirm_args.light = 'light';
							}
							confirm_args.badges = swapped_data;
							if(typeof confirm_args.sprint_status == 'undefined' || confirm_args.sprint_status=='closed'){
								displayTemplate(res, '', 'open.html', confirm_args);
							} else {
								displayTemplate(res, '', 'home.html', confirm_args);
							}
						});
					});
				});
			} else {
				receivePostData(req, function(err, post_obj){
					if(err) return error(res, err);
					switch(post_obj.form_id){
						case 'login':
							res.end('logged in');
							break;
						case 'register':
							if(!post_obj.hasOwnProperty('username') || 
								!post_obj.hasOwnProperty('email') ||
								!post_obj.hasOwnProperty('password')) return error(res, 'missing register params');
							registerInteractor(data, config, post_obj, ext, function(err, confirm_args){
								
								if(err) return error(res, err);
								var token_str = confirm_args.token_obj.token_id+'.'+confirm_args.token_obj.public_token+'.'+confirm_args.token_obj.cred_id;
								confirm_args.cookie_script = 'document.cookie = "token='+token_str+'; path=/";';
								var test_index = confirm_args.badge_arr.findIndex((item)=>{
									return (item.badge_id=='b5' && item.vector=='check_icon')
								});
								
								swapIdForName(data.name_data, confirm_args.badge_arr, function(err, swapped_data){
									if(test_index!=-1){
										confirm_args.dark = 'light';
										confirm_args.light = 'dark';
									} else {
										confirm_args.dark = 'dark';
										confirm_args.light = 'light';
									}
									confirm_args.badges = swapped_data;
									displayTemplate(res, 'Registration Successful', 'badge.html', confirm_args);
								});
							});
							break;
						case 'open':
							receiveCookieData(req, function(err, cookie_obj){
								if(err) return error(res, err);
								if(!cookie_obj.hasOwnProperty('token_id')) return error(res, 'missing auth params');
								if(!cookie_obj.hasOwnProperty('public_token')) return error(res, 'missing auth params');
								openSprintInteractor(data, config, cookie_obj, ext, function(err, confirm_args){
									if(err) return error(res, err);
									var test_index = confirm_args.badge_arr.findIndex((item)=>{
										return (item.badge_id=='b5' && item.vector=='check_icon')
									});
									swapIdForName(data.name_data, confirm_args.badge_arr, function(err, swapped_data){
										if(test_index!=-1){
											confirm_args.dark = 'light';
											confirm_args.light = 'dark';
										} else {
											confirm_args.dark = 'dark';
											confirm_args.light = 'light';
										}
										confirm_args.badges = swapped_data;
										displayTemplate(res, '', 'home.html', confirm_args);
									});
								});
							});
							break;
						default:
							res.end('bad request is the home POST route');
					}
				});
			}
			break;
		default: 
			res.end('bad request');
	}
}).listen(3002, function(){
	console.log('server is up and running on 3002');
})

function swapIdForName(name_data, args_data, cb){
	var swapped_data = args_data.map((obj)=>{
		var swapped_obj = {}
		for (var prop in obj) {
			var uni_obj = name_data.find((item)=>{
				return (item.universal_id === obj[prop])
			})
			if(typeof uni_obj != 'undefined'){
				swapped_obj[prop] = uni_obj.universal_name;
			} else {
				swapped_obj[prop] = obj[prop];
			}
		}
		return swapped_obj;
	});
	return cb(null, swapped_data);
}
