// JavaScript Document

var docW, docH;
var faceHandler;
var isMobile = false;

$(window).load(function(){
	$(window).resize(function () {
		setPagePos();
	});
	head.ready(function () {
		setPagePos();
		if (head.mobile) isMobile = true;
		
		faceHandler = new FaceHandler();
		faceHandler.setFace();
	});
	
});

function setPagePos(){
	docW = $(window).width();
	docH = $(window).height();
}