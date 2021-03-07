<template>
	<v-container fluid>
		<v-row align="start" justify="center">
			<v-col cols="12" class="text-center">
				<v-card tile>
					<v-tabs
						v-model="tab"
						background-color="indigo lighten-2"
						center-active
						show-arrows
						dark
					>
						<v-tab v-for="item in items" :key="item.id">
							{{ item.name }}
						</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tab">
						<v-tab-item v-for="item in items" :key="item.id">
							<v-card color="basil" flat>
								<v-card-text v-if="item.id === 1">
									<v-form>
										<v-container fluid>
											<v-row>
												<span class="pa-2 ml-2">[current_ref_type]</span>
												<v-spacer />
												<v-select
													v-model="ref_type"
													@change="setEnabled"
													:items="all_ref_types"
													:item-text="
														item =>
															item.percent + '% during ' + item.days + 'days'
													"
													item-value="id"
													label="Referral type"
													hint="Select new referral type from available options"
													persistent-hint
													hide-details="auto"
													clearable
												/>
												<v-btn
													class="ma-2"
													tile
													color="primary"
													:disabled="disabled"
													@click="setRefType"
												>
													Apply
												</v-btn>
											</v-row>
										</v-container>
									</v-form>
								</v-card-text>
								<v-card-text v-else-if="item.id === 2">
									text2
								</v-card-text>
								<v-card-text v-else-if="item.id === 3">
									text3
								</v-card-text>
								<v-card-text v-else> </v-card-text>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'Settings',

	data() {
		return {
			tab: null,
			items: [
				{ id: 1, name: 'Referral settings' },
				{ id: 2, name: 'API' },
				{ id: 3, name: 'Security' },
			],
			disabled: true,
			ref_type: null,
			ref_types: [],
		};
	},

	computed: {
		all_ref_types() {
			return this.ref_types;
		},
	},

	methods: {
		setEnabled() {
			this.disabled = false;
		},
		setRefType() {
			this.disabled = true;
			axios
				.post('/trader/ext/set_referral_type', {
					type: this.ref_type,
				})
				.then(response => {
					if (response.data.success === true) {
						this.setEnabled();
						this.ref_type = response.data.type;
					}
				})
				.catch(function(error) {
					console.log(error);
				})
				.finally(function() {
					// always executed
				});
		},
	},

	created() {
		axios.get('/trader/ext/all_referral_types').then(response => {
			this.ref_types = response.data;
		});
	},
};
</script>

<style scoped></style>
