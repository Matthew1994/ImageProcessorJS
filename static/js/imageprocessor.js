//Need to build a server to solve the cross-origin promble
(window.onload = function() {
	var cv = document.getElementById("context").getContext("2d");
	// var image = new Image();
	// image.src = "images/1.bmp";

	var image = document.getElementById("sourceImg");
	var Matrix = function(_width, _height, _data) {
		this.width = _width||0;
		this.height = _height||0;
		this.channel = 4;
		this.buffer = new ArrayBuffer(this.width*this.height*4);
		this.data = new Uint8ClampedArray(this.buffer);
		_data&&this.data.set(_data);
		this.byte = 1;
		this.type = "GV_RGBA";

		/*
		 * value is a 32 bits integer showed the ARGB for a particular pixel 
		 * Attention! ">>>" is different from ">>"
		 * ">>>" is used for unsign operation while ">>" is considered the sign
		 */
		this.setPixel = function(row, col, value) {
			this.data[row*this.width*4+col*4] = (value&0x00ff0000) >>> 16;
			this.data[row*this.width*4+col*4+1] = (value&0x0000ff00) >>> 8; 
			this.data[row*this.width*4+col*4+2] = (value&0x000000ff);
			this.data[row*this.width*4+col*4+3] = (value&0xff000000) >>> 24;
		}
		this.getPixel = function(row, col) {
			var value = 0;
			value += this.data[row*this.width*4+col*4] << 16;
			value += this.data[row*this.width*4+col*4+1] << 8; 
			value += this.data[row*this.width*4+col*4+2];
			value += this.data[row*this.width*4+col*4+3] << 24;
			return value;
		}
	}


	var cvResize = function(width, height) {
		cv.canvas.width = width;
		cv.canvas.height = height;
	}

	var getMatrix = function(image) {
		var width = image.width;
		var height = image.height;
		cvResize(width, height);
		cv.drawImage(image,0,0);
		var imageData = cv.getImageData(0,0,width,height);
		var matrix = new Matrix(width,height,imageData.data);
		imageData = null;
		cv.clearRect(0,0,width,height);
		return matrix;
	}

	var setImage = function(matrix) {
		var imageData = cv.createImageData(matrix.width, matrix.height);
		imageData.data.set(matrix.data);
		cv.putImageData(imageData,0,0);
	}
	
	var setColorChannel = function(srcMatrix, channel) {
		var matrix = new Matrix(srcMatrix.width, srcMatrix.height, srcMatrix.data);
		var color = {"red":16, "green":8, "blue":0, "alpha":24};
		for (var i = 0; i < srcMatrix.height; i++) {
			for (var j = 0; j < srcMatrix.width; j++) {
				var temp = matrix.getPixel(i,j);
				temp = ((0xff<<color[channel])+0xff000000)&temp;
				matrix.setPixel(i,j,temp);
			}
		}
		return matrix;
	}

	var setAlpha = function(srcMatrix, percentageOfAlpha) {
		var matrix = new Matrix(srcMatrix.width, srcMatrix.height, srcMatrix.data);
		for (var i = 0; i < matrix.height; i++) {
			for (var j = 0 ; j < matrix.width; j++) {
				var temp = ((256*percentageOfAlpha)<<24)|0x00ffffff;
				matrix.setPixel(i,j,temp&matrix.getPixel(i,j));
			}
		}
		return matrix;
	}

	var nearestNeigbor = function(srcMatrix, width, height) {

	}
	
	var a = getMatrix(image);
	//setImage(setColorChannel(a, "green"));
	setImage(setAlpha(a, 0.25));


});





