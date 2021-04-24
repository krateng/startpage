const loadeddata = {}

function debug(data) {
	 console.log(data)
	 return data
}

function fetchRealOrExample(name) {
	return fetch(name + '.yml')
		.then(response => { if (response.status == 200) { return response } else { return fetch(name + '_example.yml') } })
}

function fetchAndRender (name) {
    fetchRealOrExample(name)
				.then(response => response.text())
        .then(rawyaml => YAML.parse(rawyaml))
				.then(debug)
        .then(data => {
						loadeddata[name] = data
						renderdata = {}
						renderdata[name] = data;
            const mysource = document.getElementById(name + '-template').innerHTML;
            const mytemplate = Handlebars.compile(mysource);
            const myresult = mytemplate(renderdata);
            document.getElementById(name).innerHTML = myresult;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRender('links');
		fetchAndRender('config');
//	  fetchAndRender('services');
//		fetchAndRender('machines');
//    fetchAndRender('bookmarks');
//		fetchAndRender('themes');
});
