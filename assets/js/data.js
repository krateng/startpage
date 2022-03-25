const loadeddata = {}

function debug(data,name) {
	 console.log(data)
	 return data
}

// fetches file or its example version
function fetchRealOrExample(name) {
	return fetch('userdata/' + name + '.yml')
		.then(response => { if (response.status == 200) { return response } else { return fetch('exampledata/' + name + '.yml') } })
}

// fetches YAML files, parses it, then applies processing steps synchronously
function fetchAndProcess(name,steps) {
	fetchRealOrExample(name)
		.then(response => response.text())
		.then(rawyaml => YAML.parse(rawyaml))
		.then(data => {
			for (var step of steps) {
				data = step(data,name);
			}
		})
}



// helper functions
function getHost(url) {
	return url.replace(/.*\/\//s,'').split(':')[0].split('?')[0].split('/')[0];
}

const favicon_grabber = (domain => `https://api.faviconkit.com/${domain}/144`)
//const favicon_grabber = (domain => `https://favicons.githubusercontent.com/${domain}`)





// renders data in the appropriate template
function render(data,name) {
	renderdata = {};
	renderdata[name] = data;
	const mysource = document.getElementById(name + '-template').innerHTML;
	const mytemplate = Handlebars.compile(mysource);
	const myresult = mytemplate(renderdata);
	document.getElementById(name).innerHTML = myresult;
	return data
}



// makes template rendering simpler by preparing link data
function preprocess_links(data,name) {
	for (var category of data) {
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

// saves data in javascript for later access
function save(data,name) {
	loadeddata[name] = data;
	return data
}

function set_theme(data,name) {
	if (loadeddata.hasOwnProperty('config') && loadeddata.hasOwnProperty('themes')) {
		setThemeTo(loadeddata.config.theme);
	}

}


data_files = [
	["links", preprocess_links, render],
	["themes", save, render, set_theme],
	["config", save, set_theme] // do it for both, whichever finishes last does it for real
]

document.addEventListener('DOMContentLoaded', () => {
	for (var instructions of data_files) {
		var name = instructions.splice(0,1);
		fetchAndProcess(name,instructions)
	}
});
