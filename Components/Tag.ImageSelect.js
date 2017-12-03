var Observable = require('FuseJS/Observable');

var Camera = require("FuseJS/Camera");
var CameraRoll = require("FuseJS/CameraRoll");
var ImageTools = require("FuseJS/ImageTools");


function takePicture() {
	Camera.takePicture().then(
		function (image) {
			// console.log("received image: " + image.path + ", " + image.width + "/" + image.height);
			resizeImage(image);
		}
	).catch(
		function (reason) {
			console.log("Couldn't take picture: " + reason);
		}
		);
};

function selectPicture() {
	CameraRoll.getImage().then(
		function (image) {
			// console.log("received image: " + image.path + ", " + image.width + "/" + image.height);
			resizeImage(image);
		}
	).catch(
		function (reason) {
			console.log("Couldn't get image: " + reason);
		}
		);
};

var resizeImage = function (image) {
	var args = { desiredWidth: 640, desiredHeight: 640, mode: ImageTools.KEEP_ASPECT, performInPlace: true };
	ImageTools.resize(image, args).then(
		function (image) {
			CameraRoll.publishImage(image);
			displayImage(image);
		}
	).catch(
		function (reason) {
			console.log("Couldn't resize image: " + reason);
		}
		);
}


var displayImage = function (image) {
	//   imagePath.value = image.path;
	//   imageName.value = image.name;
	//   imageSize.value = image.width+"x"+image.height;

	ImageTools.getBase64FromImage(image).then(
		function (b64) {
			console.log("b64 ");
			
			imageSelcted.raise({imageData: b64, imagePath: image.path});
			//imageSelcted.raise({ selectedItem: image.path, testdat: image.path });
		}
	);
}



module.exports = {
	takePicture: takePicture,
	selectPicture: selectPicture,
}

