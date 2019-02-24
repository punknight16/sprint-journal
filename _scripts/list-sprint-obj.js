function listSprintObj(sprint_data, universal_id, listObj){
	if(universal_id=='r0') return sprint_data;
	var  sprint_arr = listObj(sprint_data, {universal_id: universal_id});
	return sprint_arr;
}

module.exports = listSprintObj;