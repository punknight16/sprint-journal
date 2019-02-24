function getBrowseInteractor(data, config, args, ext, cb){
	var err;
	ext.authorizeRequest(data, config, args, ext, function(err, cred_id){
		if(err) return cb(err);
		args.cred_id = cred_id;

		var badge_obj = ext.getBadgeObj(data.badge_data, cred_id, ext.getObj);
		if(typeof badge_obj == 'undefined') return cb('couldn\'t get badge_obj');
		if(typeof args.page == 'undefined'){
			args.page = 1;	
		}
		var sprint_arr = ext.listSprintObj(data.sprint_data, 'r0', ext.listObj);
		args.sprint_arr = sprint_arr.map((item, index)=>{item.index=index; return item});
		var pages = Math.ceil(sprint_arr.length/10);
		return cb(null, {
			badge_arr: badge_obj.badge_arr,
			sprint_arr: args.sprint_arr.slice((args.page-1)*10, args.page*10),
			pages: pages,
			page: args.page
		});
	});
}

module.exports = getBrowseInteractor;