const setValue = (property, value) => {
    if (value) {
        document.documentElement.style.setProperty(`--${property}`, value);

        const input = document.querySelector(`#${property}`);
        if (input) {
            value = value.replace('px', '');
            input.value = value;
        }
    }
};

const setValueFromLocalStorage = property => {
    let value = localStorage.getItem(property);
    setValue(property, value);
};

const setTheme = options => {
    for (let option of Object.keys(options)) {
        const property = option;
        const value = options[option];

        setValue(property, value);
        localStorage.setItem(property, value);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setValueFromLocalStorage('color-background');
    setValueFromLocalStorage('color-text-pri');
    setValueFromLocalStorage('color-text-acc');
});



function setThemeTo(identifier) {
	for (var themeoption of loadeddata['themes']) {
		if (identifier == themeoption['name']) {
			setTheme({
					'color-background': themeoption['background'],
					'color-text-pri': themeoption['main'],
					'color-text-acc': themeoption['accent']
			});
			break;
		}
	}
}
