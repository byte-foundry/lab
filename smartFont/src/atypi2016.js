// Setup fonts
Ptypo.createFont('elzevir-book', 'elzevir').then( function() {
	Ptypo.changeParam(90, 'thickness', 'elzevir-book');
});

Ptypo.createFont('elzevir-static', 'elzevir').then( function() {
	Ptypo.changeParam(90, 'thickness', 'elzevir-static');
});

// Form Action
$(document).ready( function() {
	$('#environment').on('change', function() {
		var environment = $('input[name=environment]:checked', '#environment').val();
		switch(environment) {
			case 'display':
				$('body').removeClass('blackground');
				$('.captionView').hide();
				param( { spacing: 0.1, thickness: 70, serifHeight: 5, _contrast: -0.7, serifArc: 0.8 } )
				$('.gelatine').removeClass().addClass('gelatine g-display');
			break;
			case 'caption':
				$('body').removeClass('blackground');
				$('.captionView').show();
				param( { spacing: 0.2, width: 1.2, serifHeight: 40, serifMedian: 0.6, _contrast: -2.2, xHeight: 550, spurHeight: 0, diacriticHeight: 50 } )
				$('.gelatine').removeClass().addClass('gelatine g-caption');
				break;
			case 'black':
				$('body').addClass('blackground');
				$('.captionView').hide();
				param( { thickness: 110 } )
				$('.gelatine').removeClass().addClass('gelatine g-blackground');
				break;
			case 'condensed':
				$('body').removeClass('blackground');
				$('.captionView').hide();
				param( { width: 0.7 } )
				$('.gelatine').removeClass().addClass('gelatine g-condensed');
				break;
			case 'extended':
				$('body').removeClass('blackground');
				$('.captionView').hide();
				param( { width: 1.5, _contrast: -1.5, serifHeight: 20 } )
				$('.gelatine').removeClass().addClass('gelatine g-extended');
				break;
			case 'night':
				$('body').removeClass('blackground');
				$('.captionView').hide();
				window.addEventListener("devicelight", function (event) {
					var lux = event.value;
					param( { thickness: 150 - lux } )
				});
				$('.gelatine').removeClass().addClass('gelatine g-night');
				break;
			// case 'distance':
			// 	$('body').removeClass('blackground');
			// 	$('.captionView').hide();
			// 	distance();
			// 	$('.gelatine').removeClass().addClass('gelatine g-distance');
			// 	break;
			default:
				$('body').removeClass('blackground');
				$('.captionView').hide();
				param( {} )
				$('.gelatine').removeClass().addClass('gelatine');
				break;
		}
	});

})



var params = {
	spacing: 0,
	width: 1,
	thickness: 90,
	serifHeight: 15,
	serifTerminal: 0,
	serifMedian: 1,
	_contrast: -1,
	serifArc: 0,
	xHeight: 500,
	spurHeight: 1,
	diacriticHeight: 35
}
var paramTimeout = {};
function param( newParams ) {
	var modifiedParams = $.extend( {}, params, newParams);
	$('.params').html('');
	Object.keys( paramTimeout ).forEach( function( key ){
		clearInterval(paramTimeout[key]);
	})

	Object.keys( modifiedParams ).forEach( function( key ){
		var base = Ptypo.values['elzevir-book'][key];
		var delta = modifiedParams[key] - base;
		var i = 0;
		var steps = 20;
		var timeoutFunc = function() {
			if (i < steps) {
				Ptypo.changeParam(base + delta * (i+1) / steps, key, 'elzevir-book');
				i++;
			}
			else {
				setTimeout(function() {
					Ptypo.changeParam(modifiedParams[key], key, 'elzevir-book');
				}, 100)
				clearInterval(paramTimeout[key]);
			}
		}

		paramTimeout[key] = setInterval(timeoutFunc, 60);
		//Ptypo.changeParam( modifiedParams[key], key, 'elzevir-book');


		if ( modifiedParams[key] != params[key] ) {
			$('.params').append( '<span>' + key + '</span>' );
		}
	})
}

$(window).on('keydown', function (e) {
	if (e.keyCode === 0 || e.keyCode === 32) {
		e.preventDefault()
		$('.compare').toggle();
	}
	if (e.keyCode === 90) {
		e.preventDefault()
		$('.elzevir-book').toggleClass('zoom');
	}
})

// function distance() {
// 	navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
// 	   getUserMedia: function(c) {
// 	     return new Promise(function(y, n) {
// 	       (navigator.mozGetUserMedia ||
// 	        navigator.webkitGetUserMedia).call(navigator, c, y, n);
// 	     });
// 	   }
// 	} : null);
// 	if (!navigator.mediaDevices) {
// 	  throw new Error("getUserMedia() not supported.");
// 	}
//
// 	var video = document.querySelector('video');
// 	var constraints = {
// 	  audio: false,
// 	  video: true
// 	};
// 	var canvas = document.querySelector('canvas');
// 	var context = canvas.getContext('2d');
// 	function startCamera() {
// 	  return navigator.mediaDevices.getUserMedia(constraints)
// 	  .then(function(stream) {
// 	    video.src = URL.createObjectURL(stream);
// 	    video.play();
// 	    faceDetectionTimer = setInterval(function() {
// 	      context.drawImage(video, 0, 0, canvas.width, canvas.height);
// 	      var faces = ccv.detect_objects({
// 	        canvas: ccv.pre(canvas),
// 	        cascade: cascade,
// 	        interval: 2,
// 	        min_neighbors: 1
// 	      });
// 	      faces.forEach(function(face) {
// 	        context.beginPath();
// 	        context.rect(face.x, face.y, face.width, face.height);
// 	        context.lineWidth = 1;
// 	        context.strokeStyle = 'red';
// 	        context.stroke();
// 	        var percentage = 100 * face.height / canvas.height;
// 			console.log( ( percentage / 100 ) );
// 			param( { thickness: 90 * ( 1 - ( percentage * 2 / 100 )) } )
// 	       });
// 	    }, 300);
//
// 	    return stream;  // so chained promises can benefit
// 	  })
// 	  .catch(function(error) {
// 	    console.error(error);
// 	  });
// 	}
// 	var streamOn = null;
// 	document.querySelector('button').onclick = function() {
// 	  var button = this;
// 	  if (streamOn !== null) {
// 	    streamOn.stop();
// 	    URL.revokeObjectURL(video.src);  // cleanin up
// 	    button.textContent = 'Start camera';
// 	  } else {
// 	    button.textContent = 'Starting camera';
// 	    startCamera().then(function(stream) {
// 	      streamOn = stream;
// 	      button.textContent = 'Stop camera';
// 	    });
// 	  }
// 	}
// }
