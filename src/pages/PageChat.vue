<template>
	<q-page>
		<center>
			<strong class="text-h6 q-pa-lg fixed-top">Chat</strong>
		</center>
		<q-btn
			flat
			color="white"
			icon="arrow_back"
			label="back"
			class="small-screen-only fixed-top-left"
			v-go-back.single
		/>
		<div class="row">
			<br />
			<br />
			<br />
			<div
				class="q-pa-md q-pt-xl column row justify-end"
				style="width:100%"
			>
				<q-chat-message
					v-for="message in messages"
					:avatar="avatarMake($q.localStorage.getItem('pubkey'))"
					:key="[message.text]"
					:name="message.from"
					:text="[message.text]"
					:sent="message.from == 'me' ? true : false"
					bg-color="primary"
				/>
			</div>
			<q-footer class="bg-dark q-mb-lg">
				<q-toolbar>
					<q-toolbar-title>
						<div class="q-pa-md" style="max-width: 400px">
							<q-form
								@submit="messageOnSubmit"
								@reset="onReset"
								class="q-gutter-md"
							>
								<div class="row">
									<div class="col-9">
										<q-input
											filled
											type="text"
											v-model="newMessage"
											hint="500 char message"
										></q-input>
									</div>
									<div class="col-3">
										<q-btn
											unelevated
											class="q-ma-sm"
											label="send"
											type="submit"
											color="primary"
										/>
									</div>
								</div>
							</q-form>
						</div>
					</q-toolbar-title>
				</q-toolbar>
			</q-footer>
		</div>
	</q-page>
</template>

<script>
var crypto = require("crypto");
const secp = require("noble-secp256k1");
import { myHelpers } from "../boot/helpers.js";

export default {
	name: "PageSettings",
	data() {
		return {
			newMessage: "",
			messages: [],
			name: null,
			age: null,
			message: {
				data: {},
			},
			accept: false,
		};
	},
	mixins: [myHelpers],
	methods: {
		messageOnSubmit() {

			this.messages.push({
				text: this.newMessage,
				from:
					this.$q.localStorage.getItem("pubkey").substring(0, 15) +
					"....",
			});

			const sk1 = this.$route.path.split("/")[
				this.$route.path.split("/").length - 1
			];
			const pk1 = secp.getPublicKey(sk1);
			const sk2 = this.$q.localStorage.getItem("pubkey");
			const pk2 = secp.getPublicKey(sk2);
			console.log(this.$q.localStorage.getItem("pubkey"));
			console.log(pk2);

			var key = secp.getSharedSecret(sk2, pk1);
			var cipher = crypto.createCipher("aes-256-cbc", key);
			var decipher = crypto.createDecipher("aes-256-cbc", key);
            console.log("pk2");
			cipher.update(this.newMessage, "utf8", "base64");
			var encryptedMessage = cipher.final("base64");
            console.log("pk2");
			decipher.update(encryptedMessage, "base64", "utf8");
			var decryptedMessage = decipher.final("utf8");
            
			console.log("encrypted :", encryptedMessage);
			console.log("decrypted :", decryptedMessage);
			var tags = [
				[
					"p",
					String(
						this.$route.path.split("/")[
							this.$route.path.split("/").length - 1
						]
					),
					JSON.parse(this.$q.localStorage.getItem("relays"))[0],
				],
			];
			console.log(tags);
			this.sendPost(encryptedMessage, tags, 4);
			this.newMessage = "";
		},

		MessageonReset() {
			this.name = null;
			this.age = null;
			this.accept = false;
		},
	},
	created() {
		this.profile.pubkey = this.getUrlVars()["pub"];
		this.profile.privkey = this.getUrlVars()["prv"];

		if (this.profile.pubkey) {
			this.$q.localStorage.set("pubkey", pubkey);
		}
		this.profile.pubkey = this.$q.localStorage.getItem("pubkey");
		if (!this.profile.pubkey) {
			this.disabled = true;
		}

		if (this.disabled) {
			this.$router.push("/help");
		}
	},
};
</script>
