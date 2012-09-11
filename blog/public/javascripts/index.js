//index.js
$(document).ready(function(){
	var socket = io.connect('http://localhost');
	
	$('h1:first').click(function(){
		socket.emit('dbReq', {req:'findAll'});
	});
	socket.on('findAllResp', function(data){
		$('#socketArticles').text(data.articles[0].title);
	});
});