function receivePostData (req, cb){
	var post_str = '';
	req.setEncoding = 'utf8';
	req.on('data', function(chunk){
		post_str += chunk;
	});
	req.on('end', function(){
		var post_obj = {};
		if(post_str == ''){
			return cb('no post data');
		} else if (post_str.indexOf('=')>0){	
			post_str = post_str.replace(/%40/g, "@");
			var post_arr = post_str.split('&');
			post_arr.map((item)=>{
				var parse = item.split('=');
				
				post_obj[parse[0]] = parse[1];
			});
			return cb(null, post_obj);	
		} else {
			return cb('post_str doesn\'t have an = sign: ');
		}
	});

}

module.exports = receivePostData;