function getItemId(item) {
	return item?.id ?? item?.ID ?? item?.folder_id ?? item?.menu_id;
}

function getItemName(item) {
	return item?.name ?? item?.folder_name ?? item?.menu_name ?? item?.description ?? 'Item sem nome';
}

function getMenuChildren(menu) {
	return menu?.childrens || menu?.children || [];
}

export { getItemId, getItemName, getMenuChildren };
