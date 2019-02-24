function openSprintInteractor(data, config, args, ext, cb){
	var err;
	ext.authorizeRequest(data, config, args, ext, function(err, cred_id){
		if(err) return cb(err);
		args.cred_id = cred_id;

		var badge_obj = ext.getBadgeObj(data.badge_data, cred_id, ext.getObj);
		if(typeof badge_obj == 'undefined') return cb('couldn\'t get badge_obj');
		
		var test_index = badge_obj.badge_arr.findIndex((item)=>{
			return (item.badge_id == 'b1');
		});
		if(test_index != -1){
			badge_obj.badge_arr[test_index].vector = (badge_obj.badge_arr[test_index].vector=='check_icon') ? '' : 'check_icon';
		} 
		err = ext.editBadgeObj(data.badge_data, cred_id, badge_obj, ext.editObj);
		if(err) return cb('couldn\'t add dark-mode');


		return cb(null, {
			badge_arr: badge_obj.badge_arr
		});
	});
}

module.exports = openSprintInteractor;