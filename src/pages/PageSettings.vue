<template>
	<q-page>
		<center>
			<strong class="text-h6 q-pa-lg fixed-top">Settings</strong>
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

		<div
			class="q-mx-auto
"
			style="max-width: 400px"
		>
			<q-form @submit="sendMeta" class="q-gutter-md">
				<p>
					If your desired handle is available our relay will use
					open-timestamps to secure it to your public key, and share
					it with other relays.
				</p>
				<q-input
					filled
					type="text"
					v-model="newpost.handle"
					hint="Disired handle (3-10 chars)"
					lazy-rules
					:rules="[
						(val) =>
							(val !== null && val !== '') ||
							'Between 3 - 10 chars',
					]"
				>
					<template v-slot:before>
						<q-icon name="alternate_email" />
					</template>
				</q-input>
				<q-input
					filled
					type="text"
					v-model="newpost.about"
					hint="About (in 150 chars)"
					maxlength="150"
				/>
				<q-input
					filled
					type="text"
					v-model="newpost.imagetemp"
					hint="Profile picture (imagur url)"
					maxlength="150"
				/>
				<q-btn
					class="float-right"
					unelevated
					label="Submit"
					type="submit"
					color="primary"
				/>
				<br />
			</q-form>
			<br /><br />
			<q-separator />
			<br /><br />
			<q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
				<q-input
					filled
					type="text"
					v-model="settings.follow"
					autogrow
					hint="Batch follow input seperated by spaces"
				/>
				<q-input
					filled
					type="textarea"
					v-model="settings.relays"
					autogrow
					hint="Relays seperated by spaces"
				/>

				<div>
					<q-btn
						class="float-right"
						unelevated
						label="Submit"
						type="submit"
						color="primary"
					/>
				</div>
			</q-form>
			<br /><br />
			<q-separator />
			<br /><br />
			<q-btn
				unelevated
				label="Delete Local Storage"
				@click="deletels"
				color="negative"
			/>
		</div>
	</q-page>
</template>

<script>
import { relayPool } from "nostr-tools";

import { myHelpers } from "../boot/helpers.js";

export default {
	name: "PageSettings",
	data() {
		return {
			publishtext: "",
			emojiOn: false,
			activatevideohome: false,
			imageCaptured: false,
			hasCamerasuport: true,
			homeembedimage: false,
			imagefile: "",
			name: null,
			age: null,
			newpost: {
				user: "",
				message: "",
				image: null,
				date: Date.now(),
			},
			settings: {
				data: {},
			},
			accept: false,
		};
	},
	mixins: [myHelpers],
	methods: {
		ProfileonSubmit() {
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

		ProfileonReset() {
			this.name = null;
			this.age = null;
			this.accept = false;
		},
		RelaysonSubmit() {
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

		RelaysonReset() {
			this.name = null;
			this.age = null;
			this.accept = false;
		},
		deletels() {
			this.$q.localStorage.clear();
			window.location.reload();
		},
		async sendMeta() {
			const pool = relayPool();

			pool.setPrivateKey(this.$q.localStorage.getItem("privkey"));
			var relays = JSON.parse(this.$q.localStorage.getItem("relays"));

			for (var i = 0; i < relays.length; i++) {
				console.log(relays[i]);
				pool.addRelay(relays[i], {
					read: true,
					write: true,
				});
			}
			var message = JSON.stringify({
				picture: this.newpost.imagetemp,
				name: this.newpost.handle,
				about: this.newpost.about,
			});
			this.$q.localStorage.set("profile", message);
			pool.onEvent((event, context, relay) => {
				this.profile.avatar = this.newpost.imagetemp;
				this.profile.about = this.newpost.about;
				this.profile.name = this.newpost.name;
			});

			var eventObject = {
				pubkey: String(this.$q.localStorage.getItem("pubkey")),
				created_at: timest,
				kind: 0,
				tags: [],
				content: message,
			};

			const timest = Math.floor(Date.now() / 1000);

			pool.publish(eventObject);
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
