const loadeddata = {}

function debug(data) {
	 console.log(data)
	 return data
}

function fetchRealOrExample(name) {
	return fetch(name + '.yml')
		.then(response => { if (response.status == 200) { return response } else { return fetch(name + '_example.yml') } })
}

function fetchAndRender (name,postprocessor) {
    fetchRealOrExample(name)
				.then(response => response.text())
        .then(rawyaml => YAML.parse(rawyaml))
        .then(data => {
						data = postprocessor(data);
						loadeddata[name] = data
						renderdata = {}
						renderdata[name] = data;
            const mysource = document.getElementById(name + '-template').innerHTML;
            const mytemplate = Handlebars.compile(mysource);
            const myresult = mytemplate(renderdata);
            document.getElementById(name).innerHTML = myresult;
        });
}

function getHost(url) {
	return url.replace(/.*\/\//s,'').split('?')[0].split('/')[0]
}

const favicon_grabber = (domain) => `https://api.faviconkit.com/${domain}/144`
//const favicon_grabber = (domain) => `https://favicons.githubusercontent.com/${domain}`

function postprocess_links(data) {
	for (var category of data) {
		try {
			for (var entry of category.entries) {
				entry.domain = getHost(entry.url);
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
function postprocess_themes(data) {
	return data;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRender('links',postprocess_links);
		fetchAndRender('themes',postprocess_themes);
});
