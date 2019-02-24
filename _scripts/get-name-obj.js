function getNameObj(name_data, universal_id, getObj){
	var name_obj = getObj(name_data, {universal_id: universal_id});
	return name_obj;
}

module.exports = getNameObj;