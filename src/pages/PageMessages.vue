<template>
	<q-page>
		<center>
			<strong class="text-h6 q-pa-lg fixed-top"
				>Encrypted Messages</strong
			>
		</center>
		<q-btn
			flat
			color="white"
			icon="arrow_back"
			label="back"
			class="small-screen-only fixed-top-left"
			v-go-back.single
		/>

		<br /><br />

		<q-list>
			<q-item
				clickable
				v-ripple
				v-for="followed in following"
				v-if="followed.pubkey != $q.localStorage.getItem('pubkey')"
				:key="followed.id"
				:to="'/chat/' + followed.pubkey"
			>
				<q-item-section avatar>
					<q-avatar round>
						<img :src="avatarMake(followed.pubkey)" />
					</q-avatar>
				</q-item-section>

				<q-item-section>{{
					followed.pubkey.substring(0, 10) + "..."
				}}</q-item-section>
			</q-item>
		</q-list>

		<q-footer class="bg-dark q-mb-lg">
			<q-form
				@submit="MessageonSubmit"
				style="max-width: 400px"
				class="q-gutter-md"
			>
				<p>
					All private messages are end-to-end encrypted.
				</p>

				<div class="row">
					<div class="col-10">
						<q-input
							filled
							type="text"
							v-model="newMessage"
							hint="Public key"
						></q-input>
					</div>
					<div class="col-2">
						<q-btn
							unelevated
							class="q-ma-sm"
							label="Start"
							type="submit"
							color="primary"
						/>
					</div>
				</div>
			</q-form>
		</q-footer>
	</q-page>
</template>

<script>
const crypto = require("crypto");
const secp = require("noble-secp256k1");
import { relayPool } from "nostr-tools";
import { myHelpers } from "../boot/helpers.js";

export default {
	name: "PageSettings",
	data() {
		return {
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
		async sendDM(message, pubkey) {
			const pool = relayPool();

			pool.setPrivateKey(this.$q.localStorage.getItem("privkey")); // optional

			pool.addRelay("wss://nostr-relay.bigsun.xyz", {
				read: true,
				write: true,
			});

			pool.onEvent((event, context, relay) => {
				console.log(
					`got a relay with context ${context} from ${relay.url} which is already validated.`,
					event
				);
			});
			console.log(pool);
			// subscribing to users and requesting specific users or events:
			pool.subKey(
				"f9e10c85f4baf021b88b4d19534ac25b81a5ca2a1fc99c8fe2e3bb40e85f9d10"
			);

			await pool.reqFeed();
			//pool.reqEvent({id: '<hex>'})
			//pool.reqKey({key: '<hex>'})
			// upon request the events will be received on .onEvent above

			// publishing events:
			//pool.publish(<event object>)
			// it will be signed automatically with the key supplied above
			// or pass an already signed event to bypass this

			// subscribing to a new relay
			//pool.addRelay('<url>')
			// will automatically subscribe to the all the keys called with .subKey above

			console.log(pool);
		},

		MessageonReset() {
			this.name = null;
			this.age = null;
			this.accept = false;
		},
	},
	created: function() {
		var follows = JSON.parse(this.$q.localStorage.getItem("follow"));
		if (follows.length > 1) {
			this.followlist = true;
			//  var user = JSON.parse(this.$q.localStorage.getItem(follows[i]));

			for (var i = 0; i < follows.length; i++) {
				this.following.push({
					id: i,
					pubkey: follows[i],
				});
			}
		}
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
