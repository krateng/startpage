import json, yaml

for configtype in ('themes','links','apps'):
	try:
		with open(configtype + '.yml','r') as srcf:
			data = yaml.safe_load(srcf)

		#mapping to list
		data = {
			configtype: [
				{**data[key], 'name':key} for key in data
			]
		}

		with open(configtype + '.json','w') as trgf:
			json.dump(data,trgf,indent=4)
	except:
		pass
