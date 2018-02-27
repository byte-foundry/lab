// Setup fonts
Ptypo.createFont('grotesk', 'venus').then( function() {
	Ptypo.changeParam(5, 'slant', 'grotesk');
});

$( window ).load(function() {
	clock();
});

function clock() {
    setInterval(function(){
		var d = new Date();
	    var h = d.getHours();
	    var m = d.getMinutes();
	    var s = d.getSeconds();

		change(h, m, s);
	}, 1000);
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function change(h, m, s) {
	Ptypo.changeParam( 0.5 + Math.sqrt( h / 6 ), 'width', 'grotesk');
	Ptypo.changeParam( m / 60 * 800, 'xHeight', 'grotesk');
	Ptypo.changeParam( 6 + s * 2, 'thickness', 'grotesk');

	$('#clock').html( addZero(h) + ":" + addZero(m) + ":" + addZero(s) );
}

function fake() {
	var s = 0;
	setInterval(function(){
		s = s+7;
		change(Math.floor((s / 3600) % 24), Math.floor((s / 60) % 60), Math.floor(s % 60));
	}, 5);
}
