export const myHelpers = {
	data() {
		return {};
	},
	methods: {
		sendDM(message) {
			const cryptr = new Cryptr(
				this.$q.localStorage.getItem("privatekey")
			);
			const encryptedString = cryptr.encrypt(message);
		},
		readDM(message) {
			const cryptr = new Cryptr(
				this.$q.localStorage.getItem("privatekey")
			);
			const encryptedString = cryptr.encrypt(message);
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

		////////////////////////////
		////////////helpers/////////
		////////////////////////////

		postEvent(ref, text) {
			console.log(text);
			var eventp = {
				pubkey: this.$q.localStorage.getItem("pubkey"),
				created_at: Math.floor(Date.now() / 1000),
				kind: 1,
				ref: ref,
				content: text,
			};
			console.log(eventp);
			this.publishEvent(
				eventp,
				this.$q.localStorage.getItem("privatekey"),
				["https://nostr-relay.bigsun.xyz", "https://nostr.coinos.io"]
			);
		},
		makeRandom32() {
			var array = new Uint32Array(32);
			window.crypto.getRandomValues(array);
			return Buffer.from(array);
		},

		pubkeyFromPrivate(privateHex) {
			return schnorr.convert
				.pubKeyFromPrivate(new BigInteger(privateHex, 16))
				.toString("hex");
		},

		verifySignature(evt) {
			try {
				schnorr.verify(
					Buffer.from(evt.pubkey, "hex"),
					Buffer.from(evt.id, "hex"),
					Buffer.from(evt.sig, "hex")
				);
				return true;
			} catch (err) {
				return false;
			}
		},

		async publishEvent(evt, key, hosts) {
			let hash = shajs("sha256")
				.update(this.serializeEvent(evt))
				.digest();
			evt.id = hash.toString("hex");
			console.log(evt);
			evt.sig = schnorr
				.sign(new BigInteger(key, 16), hash, this.makeRandom32())
				.toString("hex");

			return await this.broadcastEvent(evt, hosts);
		},

		broadcastEvent(evt, hosts) {
			hosts.forEach(async (host) => {
				if (host.length && host[host.length - 1] === "/")
					host = host.slice(0, -1);

				let publishLogEntry = {
					id: evt.id,
					time: evt.created_at,
					host,
				};

				try {
					let r = await window.fetch(host + "/save_event", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify(evt),
					});
					if (!r.ok) throw new Error("error publishing");

					db.publishlog.put({
						...publishLogEntry,
						status: "succeeded",
					});
				} catch (err) {
					console.log(`failed to publish ${evt} to ${host}`);
					db.publishlog.put({ ...publishLogEntry, status: "failed" });
				}
			});

			return evt;
		},

		serializeEvent(evt) {
			let version = Buffer.alloc(1);
			version.writeUInt8(0);

			let pubkey = Buffer.from(evt.pubkey, "hex");

			let time = Buffer.alloc(4);
			console.log(time);
			time.writeUInt32BE(evt.created_at);

			console.log(time);

			let kind = Buffer.alloc(1);
			kind.writeUInt8(evt.kind);

			let reference = Buffer.alloc(0);
			if (evt.ref) {
				reference = Buffer.from(evt.ref, "hex");
			}

			let content = Buffer.from(evt.content);
			console.log(content);
			return Buffer.concat([
				version,
				pubkey,
				time,
				kind,
				reference,
				content,
			]);
		},

		async overwriteEvent(conditions, event) {
			let events = await db.events.where(conditions).toArray();

			for (let i = 0; i < events.length; i++) {
				// only save if it's newer than what we have
				let evt = events[i];
				if (evt.created_at > event.created_at) {
					// we found a newer one
					return true;
				}

				// this is older, delete it
				db.events.delete(evt.id);
			}

			// we didn't find a newer one
			await db.events.put(event);

			return false;
		},

		////////////////////////////////////
		//////////end of helpers////////////
		////////////////////////////////////
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
