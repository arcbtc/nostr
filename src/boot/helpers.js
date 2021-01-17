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
			myprofile: {},
			theirprofile: {},
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
		async launchPool() {
			var myProfile = JSON.parse(
				this.$q.localStorage.getItem("myProfile")
			);
			await pool.setPrivateKey(myProfile.pubkey);
			await pool.subKey(myProfile.privkey);
			await this.relayPush();
		},
		async relayPush(theRelay = null) {
			var myProfile = JSON.parse(
				this.$q.localStorage.getItem("myProfile")
			);
			var relays = myProfile.relays;
			if (theRelay != null) {
				relays.push(theRelay);
				myProfile.relays = relays;
				this.$q.localStorage.set(
					"myProfile",
					JSON.stringify(myProfile)
				);
			}
			for (var i = 0; i < relays.length; i++) {
				await pool.addRelay(relays[i], {
					read: true,
					write: true,
				});
			}
		},
		async sendPost(message, theTags = [], theKind = 1) {
			var myProfile = JSON.parse(
				this.$q.localStorage.getItem("myProfile")
			);
			pool.onEvent((event, context, relay) => {
				if (this.$q.localStorage.getItem(event.id) === null) {
					for (var i = 0; i < this.posts.length; i++) {
						if (this.posts[i].id == event.id) {
							this.posts[i].avatar = this.avatarMake(
								event.pubkey
							);
							this.posts[i].loading = false;
							this.posts[i].retry = false;
						}
					}
					var postss = JSON.parse(
						this.$q.localStorage.getItem("kind1")
					);
					postss.unshift(event);
					this.$q.localStorage.set("kind1", JSON.stringify(postss));
				}
				this.publishtext = "";
			});
			const timest = Math.floor(Date.now() / 1000);
			var eventObject = {
				pubkey: myProfile.pubkey,
				created_at: timest,
				kind: theKind,
				tags: theTags,
				content: message,
			};
			var eventObjectId = await getEventHash(eventObject);
			eventObject.id = eventObjectId;
			this.retryPostTimer(eventObjectId);
			this.posts.unshift(eventObject);
			await pool.publish(eventObject);
		},
		async retryPostTimer(postid) {
			var self = this;
			setTimeout(function() {
				for (var i = 0; i < self.posts.length; i++) {
					if (
						postid == self.posts[i].id &&
						self.posts[i].loading == true
					) {
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
			this.sendPost(postData.content);
		},
		avatarMake(theData) {
			const avicon = shajs("sha256")
				.update(theData)
				.digest("hex");
			return identicon.generateSync({ id: avicon, size: 40 });
		},
		addPubFollow(pubKeyFollow) {
			var myProfile = JSON.parse(
				this.$q.localStorage.getItem("myProfile")
			);
			var theirProfile = JSON.parse(
				this.$q.localStorage.getItem("theirProfile")
			);
			for (var i = 0; i < theirProfile.length; i++) {
				if (theirProfile.pubkey == pubKeyFollow) {
					theirProfile.push({
						pubkey: pubKeyFollow,
						avatar: null,
						handle: null,
						about: null,
					});
					this.$q.localStorage.set(
						"theirProfile",
						JSON.stringify(theirProfile)
					);
				} else {
					this.$q.notify({
						message: "Already following",
						color: "secondary",
					});
				}
			}
			this.getFollowing();
			if (this.posts > 20) {
				this.getRelayPosts(3, 0);
			} else {
				this.getRelayPosts(10, 0);
			}
		},
		getFollowing() {
			var theirProfile = JSON.parse(
				this.$q.localStorage.getItem("theirProfile")
			);
			var myProfile = JSON.parse(
				this.$q.localStorage.getItem("myProfile")
			);
			if (theirProfile.length > 1) {
				this.followlist = true;
				for (var i = 0; i < theirProfile.length; i++) {
					this.following.push(theirProfile[i]);
					this.following.push(myProfile[0]);
				}
			}
		},
		getAllPosts() {
			var thePosts = JSON.parse(this.$q.localStorage.getItem("kind1"));
			try {
				if (thePosts.length < 20) {
					this.getRelayPosts(10, 0);
				} else {
					this.getRelayPosts(3, 0);
				}
			} catch {
				this.$q.notify({
					message: "Not able to connect to relay",
					color: "secondary",
				});
			}
			for (var i = 0; i < thePosts.length; i++) {
				this.posts.push(thePosts[i]);
			}
		},
		async unFollow(data) {
			await pool.unsubKey(data);
			var theirProfile = JSON.parse(
				this.$q.localStorage.getItem("theirProfile")
			);
			for (var i = 0; i < theirProfile.length; i++) {
				if (theirProfile[i].pubkey == data) {
					theirProfile.splice(i, 1);
					this.following = theirProfile;
					this.$q.localStorage.set(
						"theirProfile",
						JSON.stringify(theirProfile)
					);
					this.link = "home";
					this.$router.push("/");
				} else {
					this.$q.notify({
						message: "No such user",
						color: "secondary",
					});
				}
			}
		},
		async getRelayPosts(theLimit, theOffset, pubKey = null) {
			if (pubkey == null) {
				await pool.reqFeed({ limit: theLimit, offset: theOffset });
			} else {
				await pool.reqKey({ key: pubKey });
			}
		},
		getUserPosts(user) {
			this.getRelayPosts(20, 0, user);
			var postss = JSON.parse(this.$q.localStorage.getItem("Kind1"));
			for (var i = 0; i < postss.length; i++) {
				var singlePost = JSON.parse(
					this.$q.localStorage.getItem(postss[i])
				);
				console.log(singlePost.kind);

				if (singlePost.kind == 1 && singlePost.pubkey == user) {
					this.profilePosts.push({
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
		createKeys(words = "") {
			var splitWords = words.split(" ");
			var mnemonic;
			if (splitWords.length == 12) {
				this.user.passphrase = words;
				mnemonic = words;
			} else {
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
			this.user.privatekey = root.privateKey.toString("hex");
			const privKey = BigInteger.fromHex(root.privateKey.toString("hex"));
			const pubkey = G.multiply(privKey)
				.getEncoded(true)
				.slice(1)
				.toString("hex");
			this.user.publickey = pubkey;
		},
		finalGenerate() {
			console.log("stored");
			var theRelays = [
				"wss://nostr-relay.bigsun.xyz",
				"wss://relay.nostr.org",
			];
			var stored = this.user.keystoreoption;
			console.log(stored);
			if (stored == "external") {
				this.$q.localStorage.set(
					"myProfile",
					JSON.stringify({
						pubkey: this.user.publickey,
						privkey: null,
						relays: theRelays,
						avatar: null,
						handle: null,
						about: null,
					})
				);
				this.$router.push("/");
				this.disabled = false;
				this.link = "home";
			} else if (stored == "url") {
				this.$q.localStorage.set(
					"myProfile",
					JSON.stringify({
						pubkey: this.user.publickey,
						privkey: null,
						relays: theRelays,
						avatar: null,
						handle: null,
						about: null,
					})
				);
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
				this.$q.localStorage.set(
					"myProfile",
					JSON.stringify({
						pubkey: this.user.publickey,
						privkey: this.user.privatekey,
						relays: theRelays,
						avatar: null,
						handle: null,
						about: null,
					})
				);
				this.$q.localStorage.set("kind0", JSON.stringify([]));
				this.$q.localStorage.set("kind1", JSON.stringify([]));
				this.$q.localStorage.set("kind2", JSON.stringify([]));
				this.$q.localStorage.set("kind3", JSON.stringify([]));
				this.$q.localStorage.set("kind4", JSON.stringify([]));

				this.addPubFollow(this.user.publickey);

				this.$router.push("/");
				this.disabled = false;
				this.link = "home";
			}
		},
		dialogueGenerate() {
			this.dialoggenerate = true;
		},
		dialogueStarted() {
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
