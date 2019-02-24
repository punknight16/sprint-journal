function openSprintInteractor(data, config, args, ext, cb){
	var err;
	args.engagement_id = ext.generateId(data.universal_data, 'engagement-', 10);
	if(typeof args.engagement_id == 'undefined') return cb('no engagement_id');
	args.sprint_id = ext.generateId(data.universal_data, 'sprint-', 10);
	if(typeof args.sprint_id == 'undefined') return cb('no sprint_id');

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

		err = ext.addSprintObj(data, config, args, ext);
		if(err) return cb('couldn\'t add sprint_obj');

		args.universal_id = args.sprint_id;
		args.universal_name = args.sprint_title;
		err = ext.addNameObj(data, config, args, ext);
		if(err) return cb('failed to add name_obj');

		

		return cb(null, {
			badge_arr: badge_obj.badge_arr,
			sprint_status: 'open_status',
			sprint_title: args.sprint_title
		});
	});
}

module.exports = openSprintInteractor;