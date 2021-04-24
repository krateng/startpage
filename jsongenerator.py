import json, yaml
from collections.abc import Mapping


def list_to_mapping(input,key='identifier'):
	return {l[key]:l for l in input}

def mapping_to_list(input,key='identifier'):
	return [{**input[k],key:k} for k in input]

def convert_services(data):
	return data

def convert_themes(data):
	return [
		{**data[key], 'identifier':key} for key in data
	]

def convert_bookmarks(data):
	if isinstance(data,Mapping):
		data = [{'name':c,'bookmarks':data[c]} for c in data]

	for category in data:
		bookmarks = category['bookmarks']
		if isinstance(bookmarks,Mapping):
			category['bookmarks'] = [{'name':b,'link':bookmarks[b]} for b in bookmarks]

	return data


configs = [
	('themes',convert_themes),
	('bookmarks',convert_bookmarks),
	('services',convert_services),
	('machines',convert_services)
]


for configtype,function in configs:
	try:
		with open(configtype + '.yml','r') as srcf:
			data = yaml.safe_load(srcf)
	except:
		with open(configtype + '_example.yml','r') as srcf:
			data = yaml.safe_load(srcf)

	#mapping to list
	data = { configtype: function(data) }

	with open(configtype + '.json','w') as trgf:
		json.dump(data,trgf,indent=4)
