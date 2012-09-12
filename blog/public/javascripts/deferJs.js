function createScriptElement(src){
	var scpt=document.createElement('script');
	scpt.type='text/javascript';
	scpt.src=src;
	//scpt.async='true';
	return scpt;
}

//$(document).ready(function(){
	//script(src='/javascripts/socket.io.min.js')
    //script(src='http://code.jquery.com/jquery-1.8.1.min.js')
	//$( document.createElement('script') ).attr('src','/javascripts/socket.io.min.js');
	//$( document.createElement('script') ).attr('src','http://code.jquery.com/jquery-1.8.1.min.js');
	//$( document.createElement('script') ).attr('src','/javascripts/index.js');

	//document.body.appendChild(createScriptElement('/javascripts/socket.io.min.js'));
	//document.body.appendChild(createScriptElement('http://code.jquery.com/jquery-1.8.1.min.js'));
//});