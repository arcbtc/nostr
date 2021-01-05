<template>
	<q-page>
		<h6 class="q-ma-none">Messages</h6>
		<br />
		<div class="column" style="height: 700px">
			<div class="col-11 col-md-11"></div>
			<div class="col-1 col-md-1">
				<q-form @submit="MessageonSubmit" style="max-width: 400px">
					<q-input
						filled
						type="text"
						v-model="message.message"
						hint="500 char message"
					>
						<template v-slot:after>
							<q-btn
								unelevated
								label="Send"
								@click="sendDM()"
								type="submit"
								color="primary"
							/>
						</template>
					</q-input>
				</q-form>
			</div>
		</div>
	</q-page>
</template>

<script>
const crypto = require("crypto");
const secp = require("noble-secp256k1");

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
		sendDM() {
			const sk1 =
				"2ed253ab0ad9aa18d77257c88b29b718e6b911fd37cdf5c81d4c0adb1ab7fa82";
			const pk1 = secp.getPublicKey(sk1);

			console.log(pk1);

			const sk2 =
				"6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
			const pk2 = secp.getPublicKey(sk2);

			console.log(pk2);

			console.log(secp.getSharedSecret(sk1, pk2));
			console.log(secp.getSharedSecret(sk2, pk1));
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
