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
			<q-form @submit="sendMetaSettings()" class="q-gutter-md">
				<p>
					If your desired handle is available our relay will use
					open-timestamps to secure it to your public key, and share
					it with other relays.
				</p>
				<q-input
					filled
					type="text"
					v-model="settings.handle"
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
					v-model="settings.about"
					hint="About (in 150 chars)"
					maxlength="150"
				/>
				<q-input
					filled
					type="text"
					v-model="settings.imagetemp"
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
			<q-form @submit="relayAdd(settings.relays)" class="q-gutter-md">
				<q-input
					filled
					type="textarea"
					v-model="settings.relays"
					autogrow
					hint="Add a relay"
				/>

				<div>
					<q-btn
						class="float-right"
						unelevated
						label="Add"
						type="submit"
						color="primary"
					/>
				</div>
			</q-form>
			<br /><br />
			<q-separator />
			<br /><br />
			<q-form @submit="relayRem(settings.relay)" class="q-gutter-md">
				<q-select
					filled
					v-model="settings.relay"
					multiple
					:options="myprofile.relays"
					label="Remove relay(s)"
					style="width: 250px"
				/>

				<div>
					<q-btn
						class="float-right"
						unelevated
						label="Remove"
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
			settings: [],
			accept: false,
		};
	},
	mixins: [myHelpers],
	methods: {
		async sendMetaSettings() {
            var myProfile = JSON.parse(this.$q.localStorage.getItem("myProfile"))
            console.log(myProfile)
			myProfile.avatar = this.settings.imagetemp
			myProfile.handle = this.settings.handle
			myProfile.about = this.settings.about

			this.$q.localStorage.set("myProfile", myProfile);

            
            const timest = Math.floor(Date.now() / 1000);

			var eventObject = {
				pubkey: myProfile.pubkey,
				created_at: timest,
				kind: 0,
				tags: [],
				content: JSON.stringify(name:myProfile.handle, about:myProfile.about, picture:myProfile.avatar),
			};

			var eventObjectId = await getEventHash(eventObject);
			eventObject.id = eventObjectId
			pool.publish(eventObject);
		},
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
		relayAdd(relay) {
			this.settings.relays = "";
			this.relayPush(relay);
		},
		relayRem(relay) {
			this.settings.relay = "";
			this.relayRemove(relay);
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


	},
	created() {
		var myProfile = JSON.parse(this.$q.localStorage.getItem("myProfile"));
		this.myprofile = myProfile;
		if (!myProfile) {
			this.disabled = true;
			this.$router.push("/help");
		} else {
			var theirProfile = JSON.parse(
				this.$q.localStorage.getItem("theirProfile")
			);
			this.myprofile = myProfile;
			this.theirProfile = theirProfile;
		}
		this.relayPush();
	},
};
</script>
