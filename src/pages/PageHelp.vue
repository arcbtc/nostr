<template>
	<q-page>
		<center>
			<strong class="text-h6 q-pa-lg fixed-top">Help</strong>
		</center>
		<br />
		<q-btn
			flat
			color="white"
			icon="arrow_back"
			label="back"
			class="small-screen-only fixed-top-left"
			v-go-back.single
		/>

		<br />
		<strong>What is Nostr?</strong>
		<p>
			Nostr (Notes and other stuff relays), is an open-source protocol for
			sending data between users. Instead of using a centralised or P2P
			service, data is signed by a client and sent to a desired relay,
			where other users can follow that data via its public key.
		</p>
		<p>
			In this client example, small 240chars messages are sent through the
			Nostr network, but the Nostr protocol be used for lots of different
			types of information. Anyone is free to participate, by hosting
			relays or building clients!
		</p>
		<p>
			Private messages are made possible by a user using another users
			public key to encrypt the data before posting it on the relay.
		</p>
		<center>
			<q-btn
				v-if="disabled"
				dense
				flat
				class="small-screen-only q-pa-lg"
				color="primary"
				size="md"
				label="Genrate/Restore User Account"
				@click="dialoguegenerate()"
			></q-btn>
		</center>

		<q-dialog v-model="dialoggenerate">
			<q-card class="q-pa-md q-pt-lg">
				<q-stepper v-model="step" vertical color="primary" animated>
					<q-step
						:name="1"
						title="Generate/Restore"
						icon="settings"
						:done="step > 1"
					>
						Nostr.org uses a word list of 12 words is used to create
						your keys, to restore either enter a word list or a
						Nostr private key.
						<q-input
							:loading="user.loading"
							v-model="user.passphrase"
							autogrow
							type="textarea"
							label="Word List/Private Key"
						></q-input
						><br />

						<q-btn
							@click="createKeys()"
							color="primary"
							label="Generate"
							class="q-mr-md"
						/>
						<q-btn
							@click="step = 2"
							color="primary"
							label="Restore"
							class="q-mr-md"
						/>

						<q-btn
							v-if="passphrasegenerated"
							@click="step = 2"
							color="primary"
							label="Continue"
						/>
					</q-step>

					<q-step
						:name="2"
						title="Your keys"
						icon="vpn_key"
						:done="step > 2"
					>
						In this client you can restore from a word list but for
						other clients you will need to use your keys as well.<br /><br />
						Your private key is used to sign/publish posts.
						<br />
						<q-input
							v-model="user.privatekey"
							filled
							:type="user.isPwd ? 'password' : 'text'"
						>
							<template v-slot:prepend>
								<q-icon
									name="content_copy"
									class="cursor-pointer"
									@click="copytoclip(user.privatekey)"
								></q-icon>
							</template>
							<template v-slot:append>
								<q-icon
									:name="
										user.isPwd
											? 'visibility_off'
											: 'visibility'
									"
									class="cursor-pointer"
									@click="user.isPwd = !user.isPwd"
								></q-icon>
							</template>
						</q-input>
						<br />
						Your public key allows other people to read your posts,
						follow you, and send you private messages.
						<br />
						<q-input v-model="user.publickey" filled type="text">
							<template v-slot:prepend>
								<q-icon
									name="content_copy"
									class="cursor-pointer"
									@click="copytoclip(user.publickey)"
								></q-icon>
							</template>
						</q-input>

						<q-stepper-navigation>
							<q-btn
								@click="step = 3"
								color="primary"
								label="Continue"
							/>
							<q-btn
								flat
								@click="step = 1"
								color="primary"
								label="Back"
								class="q-ml-sm"
							/>
						</q-stepper-navigation>
					</q-step>

					<q-step :name="3" title="Key storage" icon="lock">
						To publish your posts this client needs to sign messages
						with your private key. Choose how this client will
						access your private key.
						<template>
							<div class="q-pa-md q-gutter-sm">
								<div class="q-gutter-sm">
									<q-radio
										dense
										v-model="user.keystoreoption"
										val="local"
										label="Local Storage (Recommended)"
									/><br />
									<q-radio
										dense
										v-model="user.keystoreoption"
										val="url"
										label="URL (Bookmark to save)"
									/><br />
									<q-radio
										dense
										v-model="user.keystoreoption"
										val="external"
										label="Externally (Highly experimental)"
									/><br />
								</div>
							</div>
						</template>
						<q-stepper-navigation>
							<q-btn
								color="primary"
								@click="finalgenerate"
								label="Finish"
							/>
							<q-btn
								flat
								@click="step = 2"
								color="primary"
								label="Back"
								class="q-ml-sm"
							/>
						</q-stepper-navigation>
					</q-step>
				</q-stepper>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script>
import { myHelpers } from "../boot/helpers.js";

export default {
	name: "PageHelp",
	mixins: [myHelpers],
	methods: {},
};
</script>
