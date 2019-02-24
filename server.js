var http = require('http');
var fs = require('fs');
var mu = require('mu2-updated');

var receivePostData = require('./_models/receive-post-data');
var receiveCookieData = require('./_models/receive-cookie-data');
var registerInteractor = require('./_scripts/register-interactor');
var setDarkModeInteractor = require('./_scripts/set-dark-mode-interactor');

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
		{universal_id: 'b1', universal_name: 'support-sprint'},
		{universal_id: 'b2', universal_name: 'open-a-sprint'},
		{universal_id: 'b3', universal_name: 'add-to-sprint'},
		{universal_id: 'b4', universal_name: 'close-sprint'},
		{universal_id: 'b5', universal_name: 'dark-mode'}
	],
	cred_data: [],
	engagement_data: [],
	badge_data: []
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
		case 'home':
			if(req.method=='GET'){
				return error(res, 'go register or login');
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
