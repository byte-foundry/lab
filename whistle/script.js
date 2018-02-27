// fork getUserMedia for multiple browser versions, for those
// that need prefixes
navigator.getUserMedia = (navigator.getUserMedia ||
							navigator.webkitGetUserMedia ||
							navigator.mozGetUserMedia ||
							navigator.msGetUserMedia);

if ( !navigator.getUserMedia ) {
	alert('getUserMedia not supported in your browser');
	throw new Error('getUserMedia not supported in your browser');
}

initPrototypo();

function initPrototypo() {
	var values = {
		xHeight: 500,
		capDelta: 250,
		ascender: 250,
		descender: -250,
		crossbar: 1,
		width: 1,
		slant: 0,
		overshoot: 10,
		thickness: 85,
		_contrast: -1,
		_contrastExtremity: -1,
		aperture: 1,
		apertureTop: 1,
		apertureBottom: 1,
		curviness: 0.6,
		opticThickness: 1,
		breakPath: 1,
		axis: 0,
		serifWidth: 65,
		midWidth: 1,
		serifHeight: 20,
		serifMedian: 1,
		serifCurve: 15,
		serifRoundness: 1,
		serifArc: 0,
		serifTerminal: 0,
		serifTerminalCurve: 1,
		spurHeight: 1,
		serifRotate: 1,
		serifBall: 1
	};

	PrototypoCanvas.init({
		canvas: document.querySelector('#letter'),
		// comment the following line to test "production mode", where worker is
		// built from source instead of file
		//workerUrl: 'src/worker.js',
		workerDeps: document.querySelector('script[src*=prototypo\\.]').src,
		// uncomment and customize only when using a local version of Glyphr
		glyphrUrl: 'http://localhost:8080/dev/Glyphr_Studio.html'
	}).then(function( instance ) {
		return instance.loadFont(
			'grotesk', 'venus.json');

	}).then(function( instance ) {
		instance.displayChar( 's' );
		instance.subset = '';
		instance.update( values );
		instance.view.setCenter( 250, -280 );
		instance.zoom = 0.9;
		instance.currGlyph.fillColor = '#FFFFFF';

		prototypo.paper.view.update();

		initAudio( values, instance );
	});
}

function initAudio( values, instance ) {
	// set up forked web audio context, for multiple browsers
	// window. is needed otherwise Safari explodes
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	// var voiceSelect = document.getElementById('voice');
	var source;

	//set up the different audio nodes we will use for the app
	var analyser = audioCtx.createAnalyser();
	analyser.minDecibels = -90;
	analyser.maxDecibels = -10;
	analyser.smoothingTimeConstant = 0.85;

	var distortion = audioCtx.createWaveShaper();
	var gainNode = audioCtx.createGain();
	var biquadFilter = audioCtx.createBiquadFilter();
	var convolver = audioCtx.createConvolver();

	// set up canvas context for visualizer
	// var canvas = document.getElementById('sound');
	// var canvasCtx = canvas.getContext('2d');

	navigator.getUserMedia(
		// constraints - only audio needed for this app
		{ audio: true },

		// Success callback
		function(stream) {
			// Once the script is initialized and the users have accepted to
			// share their microphone, hide the spinner.
			document.querySelector('.spinner').style.display = 'none';


			source = audioCtx.createMediaStreamSource(stream);
			source.connect(analyser);
			analyser.connect(distortion);
			distortion.connect(biquadFilter);
			biquadFilter.connect(convolver);
			convolver.connect(gainNode);
			gainNode.connect(audioCtx.destination);

			visualize();
			voiceChange();
		},

		// Error callback
		function(err) {
			throw err;
		}
	);

	function visualize() {
		// var WIDTH = canvas.width;
		// var HEIGHT = canvas.height;

		analyser.fftSize = 128;
		var bufferLength = analyser.frequencyBinCount;
		var dataArray = new Uint8Array(bufferLength);

		// canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

		function draw() {
			requestAnimationFrame(draw);

			analyser.getByteFrequencyData(dataArray);

			// canvasCtx.fillStyle = 'rgb(0, 0, 0)';
			// canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
			//
			// var barWidth = (WIDTH / bufferLength) * 2.5;
			// var barHeight;
			// var x = 0;
			//
			// for(var i = 0; i < bufferLength; i++) {
			// 	barHeight = dataArray[i];
			//
			// 	canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
			// 	canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
			//
			// 	x += barWidth + 1;
			// }

			values.thickness = dataArray[1];
			values._contrast = - ( 1 - ( dataArray[5] / 300 ) );
			values.curviness = 1 - ( dataArray[9] / 300 );
			instance.update( values );
		}

		draw();
	}

	function voiceChange() {
		distortion.oversample = '4x';
		biquadFilter.gain.value = 0;
		convolver.buffer = undefined;
	}
}
