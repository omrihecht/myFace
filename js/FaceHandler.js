// JavaScript Document

function FaceHandler(){

	var player, result = flwebgl.Player.S_OK;
	var atlasList = [], content = undefined;
	var stage;
	var sgf;
	var face_mc;
	var jairoOldHor,jairoOldVer;

	this.setFace = function(){
		loadContent();
	}

	function loadContent() {
		getAsset("assets/_01.json", function (response) {content = JSON.parse(response); assetLoaded(); });
		getAsset("assets/_01_atlas.json", function (response) { atlasList.push({json:JSON.parse(response), image:"assets/_01_atlas.png"}); assetLoaded(); });
	}
	
	function assetLoaded() {
		if (atlasList.length == 1 && content) {
			var canvas = document.getElementById("canvas");
			player = new flwebgl.Player();

			//Create textureatlas object for all the textures which you have
			var textureAtlasList = [];
			for (var i = 0; i < atlasList.length; i++) {
				textureAtlasList.push(new flwebgl.TextureAtlas(atlasList[i].json, atlasList[i].image));
			}
			
			result = player.init(canvas, content, textureAtlasList, handleComplete);
			
			if(result === flwebgl.Player.E_CONTEXT_CREATION_FAILED) {
				document.getElementById("err_nowebglsupport").style.display="block";
				return;
			} else if(result === flwebgl.Player.E_REQUIRED_EXTENSION_NOT_PRESENT) {
				document.getElementById("err_extensionnotpresent").style.display="block";
				return;
			}
			
			//Resize the canvas and reset the viewport
			var w = player.getStageWidth();
			var h = player.getStageHeight();
			canvas.width = w;
			canvas.height = h;
			player.setViewport(new flwebgl.geom.Rect(0, 0, w, h));				
		}
	}
	
	function getAsset(url, callbk) {
		if (!window.XMLHttpRequest) {
			document.getElementById("err_nowebglsupport").style.display="block";
			return;
		}
		
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callbk(req.responseText);
		};
		req.open("GET", url, true);
		req.send();
	}
	
	function handleComplete() {
		if(result === flwebgl.Player.S_OK) {
			player.play();
			$('#canvas').css('display','block');
			setFace();
			// ==> This is a good place to add code <==
		}
	}
	
	function setFace(){
		stage = player.getStage();
		sgf = player.getScenegraphFactory();
		face_mc = sgf.createMovieClipInstance('FaceMC')
		stage.addChild(face_mc);
		var x = 400, y = 250, s = 0.3;
		var mat = new flwebgl.geom.Matrix([s, 0, 0, s, x, y]);
		face_mc.setLocalTransform(mat);	
		setTimeout(function(){
			face_mc.getChildByName('eyeR').getChildByName('eye').gotoAndStop(1);
			face_mc.getChildByName('eyeL').getChildByName('eye').gotoAndStop(1);
			face_mc.getChildByName('eyebrowR').getChildByName('mc').gotoAndStop(1);
			face_mc.getChildByName('eyebrowL').getChildByName('mc').gotoAndStop(1);		
		},100);
		posFace(50,50);
		jairoOldHor = jairoOldVer = 50;
		setBlink();
		
		isMobile ? setJairo() : setMoveEvent();
		
	}
	
	function setMoveEvent(){
		$('#canvas').mousemove(function(e){

			var x = e.pageX - $('#canvas').offset().left;
			var y = e.pageY - $('#canvas').offset().top;
			var frameHor = Math.ceil( 100*x/800 );
			var frameVer = 100 - Math.ceil( 100*y/500 );
			posFace(frameHor,frameVer);
		});
	}
	
	function setJairo(){
		$('.jairoPosX, .jairoPosY').show();
		window.addEventListener('devicemotion',onDeviceMotion,false);		
	}
	
	function onDeviceMotion(event){
		var accel = event.accelerationIncludingGravity;
		ax = accel.x;
		ay = accel.y;
		var frameHor = Math.ceil( (ax+0.5)*10 ) + 51 ;
		var frameVer = 101 - Math.ceil( Math.abs(ay)*10 );
		$('.jairoPosX .val').html( frameHor );
		$('.jairoPosY .val').html( frameVer );
		if(docW < docH){
			posFace(frameHor,frameVer);
		}else{
			posFace(frameVer,frameHor);
		}
		jairoOldHor = frameHor;
		jairoOldVer = frameVer;
	}
	
	function posFace(frameHor,frameVer){
		if(isMobile){
			if( (Math.abs(jairoOldHor - frameHor) < 2) && (Math.abs(jairoOldVer - frameVer) < 2) ) return;
		}
		face_mc.gotoAndStop(frameHor);
		face_mc.getChildByName('eyeR').getChildByName('eye').getChildByName('eye').gotoAndStop(frameHor);
		face_mc.getChildByName('eyeR').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').getChildByName('pupil').gotoAndStop(frameHor);
		face_mc.getChildByName('eyeL').getChildByName('eye').getChildByName('eye').gotoAndStop(frameHor);
		face_mc.getChildByName('eyeL').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').getChildByName('pupil').gotoAndStop(frameHor);
		
		
		face_mc.getChildByName('eyebrowR').gotoAndStop(frameVer);
		face_mc.getChildByName('eyebrowL').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeR').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeR').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeR').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').getChildByName('pupil').getChildByName('black').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeR').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').getChildByName('pupil').getChildByName('col').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeL').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeL').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeL').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').getChildByName('pupil').getChildByName('black').gotoAndStop(frameVer);
		face_mc.getChildByName('eyeL').getChildByName('eye').getChildByName('eye').getChildByName('eyeball').getChildByName('pupil').getChildByName('col').gotoAndStop(frameVer);
		face_mc.getChildByName('head').gotoAndStop(frameVer);
		face_mc.getChildByName('earR').gotoAndStop(frameVer);
		face_mc.getChildByName('earL').gotoAndStop(frameVer);
		face_mc.getChildByName('beard').gotoAndStop(frameVer);
		face_mc.getChildByName('mouthT').gotoAndStop(frameVer);
		face_mc.getChildByName('mouthB').gotoAndStop(frameVer);
		face_mc.getChildByName('noseR').gotoAndStop(frameVer);
		face_mc.getChildByName('noseL').gotoAndStop(frameVer);
		face_mc.getChildByName('noseGlow').gotoAndStop(frameVer);
		face_mc.getChildByName('noseB').gotoAndStop(frameVer);

		if ((frameVer < 51)) {
			var perVer = 0.02 * frameVer;
			var perHor = 0.02 * (frameHor - 51);
			var nFrame = Math.round((51 - perVer * (perHor * 51)));

			face_mc.getChildByName('noseR').getChildByName('mc').gotoAndStop(nFrame);
			face_mc.getChildByName('noseL').getChildByName('mc').gotoAndStop(nFrame);
			face_mc.getChildByName('noseGlow').getChildByName('mc').gotoAndStop(nFrame);
		}
		else {
			face_mc.getChildByName('noseR').getChildByName('mc').gotoAndStop((101 - frameHor));
			face_mc.getChildByName('noseL').getChildByName('mc').gotoAndStop((101 - frameHor));
			face_mc.getChildByName('noseGlow').getChildByName('mc').gotoAndStop((101 - frameHor));
		}

		face_mc.getChildByName('hairT').gotoAndStop(frameVer);
		face_mc.getChildByName('hairTR').gotoAndStop(frameVer);
		face_mc.getChildByName('hairTL').gotoAndStop(frameVer);
		face_mc.getChildByName('hairBR').gotoAndStop(frameVer);
		face_mc.getChildByName('hairBL').gotoAndStop(frameVer);
		face_mc.getChildByName('hairB').gotoAndStop(frameVer);
		face_mc.getChildByName('hairM').gotoAndStop(frameVer);					
	}
	
	function setBlink(){
		var randTime = Math.random()*3000+1000;
		setTimeout(function(){
			face_mc.getChildByName('eyeR').getChildByName('eye').gotoAndPlay('blink');
			face_mc.getChildByName('eyeL').getChildByName('eye').gotoAndPlay('blink');
			face_mc.getChildByName('eyebrowR').getChildByName('mc').gotoAndPlay('blink');
			face_mc.getChildByName('eyebrowL').getChildByName('mc').gotoAndPlay('blink');							
			setBlink();
		},randTime);
	}
	
}