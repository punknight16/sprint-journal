function getHomeInteractor(data, config, args, ext, cb){
	var err;
	ext.authorizeRequest(data, config, args, ext, function(err, cred_id){
		if(err) return cb(err);
		args.cred_id = cred_id;

		var badge_obj = ext.getBadgeObj(data.badge_data, cred_id, ext.getObj);
		if(typeof badge_obj == 'undefined') return cb('couldn\'t get badge_obj');
		
		var sprint_arr = ext.listSprintObj(data.sprint_data, cred_id, ext.listObj);
		var open_sprint_index = sprint_arr.findIndex((item)=>{
			return (item.sprint_status == 'open_status')
		});
		var sprint_status = 'closed_status';
		var sprint_title = 'Example Title';
		if(open_sprint_index!=-1){
			sprint_status = 'open_status';
			sprint_title = ext.getNameObj(data.name_data, sprint_arr[open_sprint_index].sprint_id, ext.getObj).universal_name;
		}


		return cb(null, {
			badge_arr: badge_obj.badge_arr,
			sprint_status: sprint_status,
			sprint_title: sprint_title
		});
	});
}

module.exports = getHomeInteractor;