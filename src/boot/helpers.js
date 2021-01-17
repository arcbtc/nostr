import { relayPool } from "nostr-tools";
import { getEventHash } from "nostr-tools";

require("md-gum-polyfill");
var crypto = require("crypto");
const secp = require("noble-secp256k1");
var bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const bip32 = require("bip32");
const bs58 = require("bs58");
var wif = require("wif");
const Buffer = require("safe-buffer").Buffer;

const pool = relayPool();
const identicon = require("identicon");
const convert = schnorr.convert;
import shajs from "sha.js";
import BigInteger from "bigi";
import schnorr from "bip-schnorr";
import { copyToClipboard } from "quasar";
const ecurve = require("ecurve");
const curve = ecurve.getCurveByName("secp256k1");
const G = curve.G;



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

			user: {
				isPwd: true,
				passphrase: "",
				keystoreoption: "local",
				loading: false,
				passphraseLoad: false,
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
			openQrShow: false,
		};
	},
	methods: {
		async launchPool(){
             await pool.setPrivateKey(this.$q.localStorage.getItem("privkey"));
             await pool.subKey(String(this.$q.localStorage.getItem("pubkey")));
             await this.relayPush();
		},
		async relayPush(theRelay = null){
		var relays = JSON.parse(this.$q.localStorage.getItem("relays"));
		if(theRelay != null){
		   relays.push(theRelay)
	    }
		this.$q.localStorage.set("relays", JSON.stringify(relays));
			for (var i = 0; i < relays.length; i++) {
				await pool.addRelay(relays[i], {
					read: true,
					write: true,
				});
			}

		},
		async sendPost(message, theTags = [], theKind = 1) {
			console.log("eventObject")
			pool.onEvent((event, context, relay) => {
				if (this.$q.localStorage.getItem(event.id) === null) {
					for (var i = 0; i < this.posts.length; i++) {
						if (this.posts[i].id == event.id) {
							this.posts[i].avatar = this.avatarMake(event.pubkey)
							this.posts[i].handle = null
						    this.posts[i].loading = false
						    this.posts[i].retry = false
						}
					}
					var postss = JSON.parse(
						this.$q.localStorage.getItem("posts")
					);
					this.$q.localStorage.set(event.id, JSON.stringify(event));
					postss.unshift(event.id);
					this.$q.localStorage.set("posts", JSON.stringify(postss));
				}
				this.publishtext = "";
			});
			const timest = Math.floor(Date.now() / 1000);
			var eventObject = {
				pubkey: String(this.$q.localStorage.getItem("pubkey")),
				created_at: timest,
				kind: theKind,
				tags: theTags,
				content: message,
			};
			var eventObjectId = await getEventHash(eventObject);
			this.retryPostTimer(eventObjectId)
			this.posts.unshift({
				id: eventObjectId,
				message: eventObject.content,
				avatar: this.avatarMake(eventObject.pubkey),
				date: eventObject.created_at * 1000,
				user: eventObject.pubkey,
				kind: theKind,
				handle: null,
				loading: true,
				retry: false,
			});
			console.log(eventObject)

			await pool.publish(eventObject);
		},
		async retryPostTimer(postid) {
			var self = this;
			setTimeout(function() {
				for (var i = 0; i < self.posts.length; i++) {
					if (postid == self.posts[i].id && self.posts[i].loading == true) {
						self.posts[i].retry = true;
						self.posts[i].loading = false;
						self.$q.notify({
						message: "Relay(s) timeout",
						color: "secondary",
					});
					}
				}
			}, 3000);
		},
		postAgain(postData) {
			for (var i = 0; i < this.posts.length; i++) {
				if (this.posts[i].id == postData.id) {
					this.posts.splice(i, 1);
				}
			}
			this.sendPost(postData.message);
		},
		avatarMake(theData) {
			const avicon = shajs("sha256")
				.update(theData)
				.digest("hex");
			return identicon.generateSync({ id: avicon, size: 40 });
		},
		addPubFollow(pubKeyFollow) {
	
			if (!this.$q.localStorage.getItem("follow")) {
				this.$q.localStorage.set(
					"follow",
					JSON.stringify([this.$q.localStorage.getItem("pubkey")])
				);
			}
			var follows = JSON.parse(this.$q.localStorage.getItem("follow"));
			if (!follows.includes(pubKeyFollow)) {
				follows.push(pubKeyFollow);
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
                if(this.$q.localStorage.getItem("pubkey") != pubKeyFollow){
				this.$q.notify({
					message: "Already following",
					color: "secondary",
				});
			}
			}
			this.getFollowing();
			if(this.posts > 20){
				this.getRelayPosts(3, 0);
			}
			else{
			this.getRelayPosts(10, 0);
		    }
		},
		getFollowing() {
			var follows = JSON.parse(this.$q.localStorage.getItem("follow"));
			if (follows.length > 1) {
				this.followlist = true;
				for (var i = 0; i < follows.length; i++) {
					this.following.push(follows[i])
				}
			}
		},
		getAllPosts() {
			try {
				if(JSON.parse(this.$q.localStorage.getItem('posts')).length < 20){
				this.getRelayPosts(10, 0);
			}
			else{
				this.getRelayPosts(3, 0);
			}
			} catch{
					this.$q.notify({
						message: "Not able to connect to relay",
						color: "secondary",
					});
			}
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
						tags: singlePost.tags,
						kind: 1,
						handle: null,
					});
				}
			}
		},
		async unfollow(data) {
			
			await pool.unsubKey(data)
			var parseFollows = JSON.parse(this.$q.localStorage.getItem("follow"))
			parseFollows.splice(parseFollows.indexOf(data), 1);
			this.following.splice(this.following.indexOf(data), 1);
			this.$q.localStorage.set("follow", JSON.stringify(parseFollows))
			this.link = "home";
			this.$router.push("/");

		},

		async getRelayPosts(theLimit, theOffset) {	
			await pool.reqFeed({limit: theLimit, offset: theOffset});
		},
		createKeys(words = "") {
			var splitWords = words.split(" ")
			var mnemonic;
			if(splitWords.length == 12){
            this.user.passphrase = words;
            mnemonic = words;
			}
			else{
			var randomBytes = crypto.randomBytes(16);
			mnemonic = bip39.entropyToMnemonic(randomBytes.toString("hex"));
			this.user.passphrase = mnemonic;
			}

			this.$q.notify({
				message: "MAKE SURE YOU BACKUP YOUR WORD LIST",
			});

			const seed = bip39.mnemonicToSeedSync(mnemonic);
			const root = bip32.fromSeed(seed);
			const path = "m/0'/0/0";
			const child1 = root.derivePath(path);
			this.passphrasegenerated = true;
			console.log(root.privateKey.toString("hex"));
			this.user.privatekey = root.privateKey.toString("hex");

			const privKey = BigInteger.fromHex(root.privateKey.toString("hex"));
			console.log(privKey);
			//  const pubkey = pointToBuffer(G.multiply(privKey)).toString('hex')
			const pubkey = G.multiply(privKey)
				.getEncoded(true)
				.slice(1)
				.toString("hex");
			this.user.publickey = pubkey;
		},
		finalgenerate() {
			var stored = this.user.keystoreoption;

			if (stored == "external") {
				this.$q.localStorage.set("exernal", true);
				this.$q.localStorage.set("pubkey", this.user.publickey);
				this.$router.push("/");
				this.disabled = false;
				this.link = "home";
			} else if (stored == "url") {
				this.$router.push(
					"/" +
						"?pub=" +
						this.user.publickey +
						"&prv=" +
						this.user.privatekey
				);
				this.disabled = false;
				this.link = "home";
			} else {
				this.$q.localStorage.set("privkey", this.user.privatekey);
				this.$q.localStorage.set("pubkey", this.user.publickey);
				this.$q.localStorage.set("mnemonic", this.user.passphrase);
				this.$q.localStorage.set(
					"relays",
					JSON.stringify(["wss://nostr-relay.bigsun.xyz"])
				);
				this.$q.localStorage.set("posts", JSON.stringify([]));
				this.addPubFollow(this.user.publickey);

				this.$router.push("/");
				this.disabled = false;
				this.link = "home";
			}
		},
		dialoguegenerate() {
			this.dialoggenerate = true;
		},
		dialoguestarted() {
			this.dialogpublish = true;
		},
	},
	filters: {
		handler(value, value2) {
			if (value != "") {
				return value;
			} else {
				return value2;
			}
		},
		niceDate(value) {
			let formattedString = date.formatDate(value, "YYYY MMM D h:mm A");
			return formattedString;
		},
	},
};
