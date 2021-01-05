

export const myHelpers = {

	data() {
		return {
			follows: [{"pub": "dfgbsdg", "petname": "doofus"},]
		};
	},
	methods: {
        stringToArray(bufferString) {
	let uint8Array = new TextEncoder("utf-8").encode(bufferString);
	return uint8Array;
},

		captureimage() {
			let video = this.$refs.video;
			let canvas = this.$refs.canvas;
			canvas.width = video.getBoundingClientRect().width;
			canvas.height = video.getBoundingClientRect().height;
			let context = canvas.getContext("2d");
			context.drawImage(video, 0, 0, canvas.width, canvas.height);
			this.imageCaptured = true;
			this.newpost.imagetemp = canvas.toDataURL();
			this.newpost.image = this.dataURItoBlob(canvas.toDataURL());
			const vid = document.querySelector("video");
			const mediaStream = vid.srcObject;
			const tracks = mediaStream.getTracks();
			tracks.forEach((track) => track.stop());
		},
		captureimageupload(file) {
			console.log(this.imagefile);
			this.newpost.image = file;

			let canvas = this.$refs.canvas;
			let context = canvas.getContext("2d");

			var reader = new FileReader();
			reader.onload = (event) => {
				var img = new Image();
				img.onload = () => {
					canvas.width = 350 * (img.width / img.height);
					canvas.height = 350;

					context.drawImage(img, 0, 0, canvas.width, canvas.height);
					this.imageCaptured = true;
					this.homeembedimage = true;
					this.newpost.imagetemp = canvas.toDataURL();
					console.log(this.newpost.imagetemp);
				};
				img.src = event.target.result;
			};
			reader.readAsDataURL(file);
		},
		dataURItoBlob(dataURI) {
			var byteString = atob(dataURI.split(",")[1]);
			var mimeString = dataURI
				.split(",")[0]
				.split(":")[1]
				.split(";")[0];

			var ab = new ArrayBuffer(byteString.length);

			var ia = new Uint8Array(ab);

			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			// write the ArrayBuffer to a blob, and you're done
			var blob = new Blob([ab], { type: mimeString });
			return blob;
		},

		VideoonSubmit() {},
		getFile() {
			this.$refs.myFileInput.$el.click();
		},
		initcamerahome() {
			this.activatevideohome = true;
			navigator.mediaDevices
				.getUserMedia({
					video: true,
				})
				.then((stream) => {
					this.$refs.video.srcObject = stream;
				})
				.catch((error) => {
					activatevideohome = false;
					this.$q.notify({
						message: "No camera found :(",
						color: "secondary",
					});
				});
		},
		discamerahome() {
			this.activatevideohome = false;
			this.homeembedimage = false;
			this.newpost.imagetemp = "";
			this.newpost.image = "";
			this.imageCaptured = false;
		},
		photoverify() {
			this.homeembedimage = true;
			this.activatevideohome = false;
		},
		PublishonSubmit() {},
	},
	filters: {
		//prefer handle over user
		handler(value, value2) {
			if (value != "") {
				return value;
			} else {
				return value2;
			}
		},
		//make timestamp look nice
		niceDate(value) {
			let formattedString = date.formatDate(value, "YYYY MMM D h:mm A");
			return formattedString;
		},
	},
};