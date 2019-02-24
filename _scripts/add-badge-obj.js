function addBadgeObj(data, config, args, ext){
	var badge_obj = {
		cred_id: args.cred_id,
		badge_arr: [
			{vector: '', badge_id: 'b1'},
			{vector: '', badge_id: 'b2'},
			{vector: '', badge_id: 'b3'},
			{vector: '', badge_id: 'b4'}
		],
		engagement_id: args.engagement_id
	};
	ext.addObj(data.badge_data, badge_obj);
	return false
}

module.exports = addBadgeObj;