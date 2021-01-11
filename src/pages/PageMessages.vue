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
};
</script>
