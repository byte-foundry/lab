(function(window) {
	window.Ptypo = {};

	var values = Ptypo.values = {};
	Ptypo.createFont = function( name, font ) {
		return window.PrototypoCanvas.init({
			canvas: document.getElementById('canvas'),
			workerUrl: 'worker.js',
			workerDeps: document.querySelector('script[src*=prototypo\\.]').src,
			onlyWorker: true,
			familyName: name,
		}).then(function( instance ) {
			return instance.loadFont(font, font + '.json');
		}).then(function( instance ) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			Ptypo[name] = instance;
			return fetch(font + '.json', {
				headers: myHeaders,
			})

		}).then(function( data ) {
			return data.json();
		}).then(function (data) {
			console.log(data);
			values[name] = {};
			data.controls.forEach(function( control ) {
				control.parameters.forEach(function(param) {
					values[name][param.name] = param.init;
				});
			});
			Ptypo[name].subset = 'optical';
			Ptypo[name].update(values[name]);

		});;
	}

	Ptypo.changeParam = function(value, name, font) {
		values[font][name] = value;
		Ptypo[font].update(values[font]);
	}

	Ptypo.getParam = function(name, font) {
		return values[font][name];
	}
}(window))
