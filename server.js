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
							res.end('registered');
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