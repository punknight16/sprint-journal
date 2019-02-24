function getHomeInteractor(data, config, args, ext, cb){
	var err;
	ext.authorizeRequest(data, config, args, ext, function(err, cred_id){
		if(err) return cb(err);
		args.cred_id = cred_id;

		var badge_obj = ext.getBadgeObj(data.badge_data, cred_id, ext.getObj);
		if(typeof badge_obj == 'undefined') return cb('couldn\'t get badge_obj');
		


		return cb(null, {
			badge_arr: badge_obj.badge_arr
		});
	});
}

module.exports = getHomeInteractor;