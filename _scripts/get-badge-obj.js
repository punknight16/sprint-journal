function getBadgeObj(badge_data, cred_id, getObj){
	var badge_obj = getObj(badge_data, {cred_id: cred_id});
	return badge_obj;
}

module.exports = getBadgeObj;