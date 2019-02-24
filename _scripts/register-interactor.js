function registerInteractor(data, config, args, ext, cb){
	var err;
	//generate ids
	args.engagement_id = ext.generateId(data.universal_data, 'engagement-', 10);
	if(typeof args.engagement_id == 'undefined') return cb('no engagement_id');
	args.cred_id = ext.generateId(data.universal_data, 'cred-', 10);
	if(typeof args.cred_id == 'undefined') return cb('no cred_id');
	args.token_id = ext.generateId(data.universal_data, 'token-', 10);
	if(typeof args.token_id == 'undefined') return cb('no token_id');
	args.public_token = ext.generateId(data.universal_data, 'k-', 10);
	if(typeof args.public_token == 'undefined') return cb('no public_token');
	//use those ids to create objs that run the application
	err = ext.addCredObj(data, config, args, ext);
	if(err) return cb('failed to add cred_obj');
	args.universal_id = args.cred_id;
	args.universal_name = args.username;
	err = ext.addNameObj(data, config, args, ext);
	if(err) return cb('failed to add name_obj');
	//
	err = ext.addEngagementObj(data, config, args, ext);
	if(err) return cb('failed to add engagement');
	var token_obj = ext.addTokenObj(data, config, args, ext);
	if(typeof token_obj == 'undefined') return cb('couldn\'t generate token_obj');
	
	return cb(null, {
		token_obj: token_obj
	});
}

module.exports = registerInteractor;