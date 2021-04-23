const loadeddata = {}

function fetchAndRender (name) {
    fetch(name + '.json')
        .then(response => response.json())
        .then(data => {
            const mysource = document.getElementById(name + '-template').innerHTML;
            const mytemplate = Handlebars.compile(mysource);
            const myresult = mytemplate(data);
            document.getElementById(name).innerHTML = myresult;
						loadeddata[name] = data[name]
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRender('apps');
    fetchAndRender('links');
		fetchAndRender('themes');
});
