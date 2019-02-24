function editBadgeObj(badge_data, cred_id, badge_obj, editObj){
	var badge_params = {
		cred_id: cred_id
	};
	return editObj(badge_data, badge_params, badge_obj);
}

module.exports = editBadgeObj;