<template>
	<q-page>
		<h6 class="q-ma-none">Messages</h6>

		<div class="column" style="height: 450px; max-height: 100%">
			<div class="col-10"></div>
			<div class="col-2">
				<q-form @submit="MessageonSubmit" class="q-gutter-md">
					<q-input
						filled
						type="text"
						v-model="message.message"
						hint="500 char message"
					/>
					<q-input
						filled
						type="text"
						v-model="message.publickey"
						hint="Recipients public key"
						lazy-rules
						:rules="[
							(val) =>
								(val !== null && val !== '') || 'Enter key',
						]"
					>
						<template v-slot:after>
							<q-btn
								unelevated
								label="Send"
								@click="sendDM(message.message)"
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


import { myHelpers } from "../boot/helpers.js";
const crypto = require('crypto')
const openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp
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


	async sendDM(message) {
	  const pubkey = this.$q.localStorage.getItem("pubkey")
	  const privkey = this.$q.localStorage.getItem("privkey")
      let sodium = await SodiumPlus.auto()
      let Keypair = await sodium.crypto_box_keypair(pubkey, privkey)
      let secretKey = await sodium.crypto_box_secretkey(Keypair)
      let publicKey = await sodium.crypto_box_publickey(Keypair)
      let encrypted = await sodium.crypto_box_seal(message, publicKey)
      let decrypted = await sodium.crypto_box_seal_open(encrypted, publicKey, secretKey)
      var string = new TextDecoder("utf-8").decode(decrypted)
      console.log(string)
    },

		async workeron(){
           await openpgp.initWorker({ path: 'openpgp.worker.js' });
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
