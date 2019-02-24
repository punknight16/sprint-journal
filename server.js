var http = require('http');
var fs = require('fs');
var mu = require('mu2-updated');

var receivePostData = require('./_models/receive-post-data');

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
	name_data: [],
	cred_data: []
};

var config = {
	pass_secret: require('./_config/cred.js').pass_secret,
	token_secret: require('./_config/cred.js').token_secret,
	last_engagement_arr: [],
	token_arr: []
};
var ext = {
	ext.generateId = require('./_models/generate-id');
	ext.addObj = require('./_models/add-obj');
	ext.addCredObj = require('./_scripts/add-cred-obj');
	ext.addNameObj = require('./_scripts/add-name-obj');
	ext.addEngagementObj = require('./_scripts/add-engagement-obj');
	ext.addTokenObj = require('./_scripts/add-token-obj');
	ext.encryptPassword = require('./_models/encrypt').encryptPassword;
	ext.compareCreds = require('./_models/encrypt').compareCreds;
	ext.crypto = require('crypto');
	ext.cypher = require('./_models/cypher').cypher;
	ext.decypher = require('./_models/cypher').decypher;
};


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
							registerInteractor(data, config, post_obj, ext, function(err, args){
								if(err) return error(res, err);
								var token_str = args.token_obj.token_id+'.'+args.token_obj.public_token+'.'+args.token_obj.cred_id;
								args.cookie_script = 'document.cookie = "token='+token_str+'; path=/";';
								displayTemplate(res, 'Registration Successful', 'badge.html', args);
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