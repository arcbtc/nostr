import { relayPool } from "nostr-tools";
export const myHelpers = {
	data() {
		return {
			profile: {
				pubkey: null,
				privkey: null,
				avatar: null,
				about: null,
				handle: null,
				follows: [],
			},
			following: [],
			passphrasegenerated: false,
			step: 1,
			disabled: false,
			link: "inbox",
			publishtext: "",
			search: "",
			selectedTab: "myAccount",
			splitterModel: 20,
			dialogpublish: false,
			dialoggenerate: false,
			activatevideo: false,
			imageCaptured: false,
			showInstallBanner: false,
			user: {
				isPwd: true,
				passphrase: "",
				keystoreoption: "local",
				loading: false,
			},
			publishtext: "",
			emojiOn: false,
			activatevideohome: false,
			imageCaptured: false,
			hasCamerasuport: true,
			homeembedimage: false,
			imagefile: "",
			newpost: {
				user: "",
				message: "",
				image: null,
				date: Date.now(),
			},
			emojis1: [
				{ item: "😂" },
				{ item: "😃" },
				{ item: "😍" },
				{ item: "😘" },
				{ item: "😭" },
				{ item: "🤣" },
				{ item: "🧐" },
				{ item: "👊" },
				{ item: "🤘" },
			],
			emojis2: [
				{ item: "👌" },
				{ item: "🙌" },
				{ item: "🤦" },
				{ item: "🚀" },
				{ item: "🔥" },
				{ item: "💯" },
				{ item: "⚡" },
				{ item: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
				{ item: "🌑" },
			],
			posts: [],
			followlist: false,
		};
	},
	methods: {
		addPubFollow(pubKeyFollow) {
			console.log(pubKeyFollow);
			if (!this.$q.localStorage.getItem("follow")) {
				this.$q.localStorage.set(
					"follow",
					JSON.stringify([this.$q.localStorage.getItem("pubkey")])
				);
			}
			var follows = JSON.parse(this.$q.localStorage.getItem("follow"));
			console.log(follows.includes("pubKeyFollow"));
			if (!follows.includes(pubKeyFollow)) {
				follows.push(pubKeyFollow);
				console.log(follows);
				this.$q.localStorage.set("follow", JSON.stringify(follows));
				this.$q.localStorage.set(
					pubKeyFollow,
					JSON.stringify({
						handle: pubKeyFollow,
						about: "",
						avatar: "",
					})
				);
			} else {
				this.$q.notify({
					message: "Already following",
					color: "secondary",
				});
			}

			this.getAllPosts();
		},
		getAllPosts() {
			this.getRelayPosts();
			var postss = JSON.parse(this.$q.localStorage.getItem("posts"));

			for (var i = 0; i < postss.length; i++) {
				var singlePost = JSON.parse(
					this.$q.localStorage.getItem(postss[i])
				);

				if (singlePost.kind == 1) {
					this.posts.push({
						id: singlePost.id,
						message: singlePost.content,
						avatar: this.avatarMake(singlePost.pubkey),
						date: singlePost.created_at * 1000,
						user: singlePost.pubkey,
						handle: null,
					});
				}
			}
		},
		getRelayPosts() {
			const pool = relayPool();

			var relays = JSON.parse(this.$q.localStorage.getItem("relays"));
			for (var i = 0; i < relays.length; i++) {
				pool.addRelay(relays[i], {
					read: true,
					write: true,
				});
			}
			pool.onEvent((event, context, relay) => {
				if (this.$q.localStorage.getItem(event.id) === null) {
					var postss = JSON.parse(
						this.$q.localStorage.getItem("posts")
					);
					this.$q.localStorage.set(event.id, JSON.stringify(event));
					postss.unshift(event.id);
					this.$q.localStorage.set("posts", JSON.stringify(postss));
					this.posts.unshift({
						id: event.id,
						message: event.content,
						avatar: this.avatarMake(event.pubkey),
						date: event.created_at * 1000,
						user: event.pubkey,
						handle: null,
					}); // what to push unto the rows array?
				}
				this.publishtext = "";
			});
			var follows = JSON.parse(this.$q.localStorage.getItem("follow"));
			for (var i = 0; i < follows.length; i++) {
				pool.subKey(follows[i]);
			}
			pool.reqFeed();
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
					canvas.width = 240 * (img.width / img.height);
					canvas.height = 240;

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

		////////////////////////////////////
		//////////start nostr helpers///////
		////////////////////////////////////
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
