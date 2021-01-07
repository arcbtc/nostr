<template>
	<q-page>
		<h6 class="q-ma-none">Messages</h6>
		<br />

		<q-form
			@submit="MessageonSubmit"
			style="max-width: 400px"
			class="q-gutter-md"
		>
			<p>
				All private messages are end-to-end encrypted.
			</p>
			<q-input
				filled
				type="text"
				v-model="message.message"
				hint="500 char message"
			/>

			<q-select
				filled
				v-model="message.publickey"
				:options="follows"
				use-input
				multiple
				option-value="pub"
				option-label="name"
				use-chips
				stack-label
				input-debounce="0"
				style="width: 300px"
			>
				<template v-slot:after>
					<q-btn
						unelevated
						label="Send"
						@click="sendDM(message.message, message.publickey[1])"
						type="submit"
						color="primary"
					/>
				</template>
			</q-select>
		</q-form>
	</q-page>
</template>

<script>
const crypto = require("crypto");
const secp = require("noble-secp256k1");
import {relayConnect} from 'nostr-tools'
import {pubkeyFromPrivate} from 'nostr-tools'
import {signEvent} from 'nostr-tools'
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
	 sendDM(message, pubkey) {
        console.log(this.$q.localStorage.getItem("privkey"))
	 	var pub = pubkeyFromPrivate(this.$q.localStorage.getItem("privkey"))
	 	console.log(pub)
	    console.log('got event with context')
		console.log(message)
		console.log(pubkey)
		var context = "n"
		var preEventSig = [0,"373838592a228bb188c4100e12aa14366c3d6748fa98cef30c26df75dda20734".toString("hex"),Math.floor(Date.now() / 1000),1,[],"Hello world"]
		console.log(preEventSig)
        var postEventSig = signEvent(preEventSig, this.$q.localStorage.getItem("privkey"))
        console.log(postEventSig)
		const relay = relayConnect('https://nostr-relay.bigsun.xyz/', ("p", 
         postEventSig
			) => {
	    console.log('got event with context', event, context)})

		console.log(relay.url)
		relay.subkey('<hexkey>')
		relay.homeFeed()
		relay.sendEvent(event)

		},
		MessageonSubmit() {
			if (this.accept !== true) {
				this.$q.notify({
					color: "red-5",
					textColor: "white",
					icon: "warning",
					message: "You need to accept the license and terms first",
				});
			} else {
				this.$q.notify({
					color: "green-4",
					textColor: "white",
					icon: "cloud_done",
					message: "Submitted",
				});
			}
		},

		MessageonReset() {
			this.name = null;
			this.age = null;
			this.accept = false;
		},
	},
};
</script>
