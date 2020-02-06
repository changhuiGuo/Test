$(function(){
	$('.circle1').on('touchstart',function(){
		window.location.href = Config.rootPath + 'qrborrowandreturn/borrowBooks.html';
	});
	$('.circle2').on('touchstart',function(){
		window.location.href = Config.rootPath + 'qrborrowandreturn/returnBooks.html';
	});
})
