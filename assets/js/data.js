const loadeddata = {}

function debug(data,name) {
	 console.log(data)
	 return data
}

function fetchRealOrExample(name) {
	return fetch(name + '.yml')
		.then(response => { if (response.status == 200) { return response } else { return fetch(name + '_example.yml') } })
}


function fetchAndProcess(name,steps) {
	fetchRealOrExample(name)
		.then(response => response.text())
		.then(rawyaml => YAML.parse(rawyaml))
		.then(data => {
			for (var step of steps) {
				console.log('performing step',step,'on',data);
				data = step(data,name);
			}
		})
}


function render(data,name) {
	renderdata = {};
	renderdata[name] = data;
	const mysource = document.getElementById(name + '-template').innerHTML;
	const mytemplate = Handlebars.compile(mysource);
	const myresult = mytemplate(renderdata);
	document.getElementById(name).innerHTML = myresult;
	return data
}

function getHost(url) {
	return url.replace(/.*\/\//s,'').split(':')[0].split('?')[0].split('/')[0]
}

const favicon_grabber = (domain) => `https://api.faviconkit.com/${domain}/144`
//const favicon_grabber = (domain) => `https://favicons.githubusercontent.com/${domain}`

function preprocess_links(data,name) {
	for (var category of data) {
		if (!category.hasOwnProperty('ssl')) { category.ssl = true };
		try {
			for (var entry of category.entries) {
				entry.host = getHost(entry.url);
			}
		}
		catch {
			for (var bookmarkcategory in category.entries) {
				var bookmarklist = []
				for (var name in category.entries[bookmarkcategory]) {
					var url = category.entries[bookmarkcategory][name]
					bookmarkentry = {'name':name,'url':url, 'host':getHost(url), 'favicon':favicon_grabber(getHost(url))}
					bookmarklist.push(bookmarkentry)
				}
				category.entries[bookmarkcategory] = bookmarklist
			}
		}


	}
	return data;
}

function save(data,name) {
	loadeddata[name] = data;
	return data
}


data_files = [
	["links", preprocess_links, render],
	["themes", save],
	["config", save]
]

document.addEventListener('DOMContentLoaded', () => {
	for (var i of data_files) {
		i.reverse()
		var name = i.pop();
		var instructions = i.reverse();
		fetchAndProcess(name,instructions)
	}
});
