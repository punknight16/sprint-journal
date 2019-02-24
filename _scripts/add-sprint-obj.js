function addSprintObj(data, config, args, ext){
	var sprint_obj = {
		status_id: '',
		sprint_id: args.sprint_id,
		cred_id: args.cred_id,
		gold_icon: '', 
		gold_value: '',
		sprint_status: 'open_status',
		engagement_id: args.engagement_id
	};
	ext.addObj(data.sprint_data, sprint_obj);
	return false
}

module.exports = addSprintObj;