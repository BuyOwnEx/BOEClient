import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	data() {
		return {
			rules: {
				required: v => !!v || this.$t('forms_validation.required'),
				email: v => (v && /.+@.+\..+/.test(v)) || this.$t('forms_validation.email_invalid'),
				fio: v => (v && /([а-яА-Я-/.'])+(\s)+([а-яА-Я-/.'])+(\s)*([а-яА-Я-/.'])*/.test(v)) || this.$t('forms_validation.fio_invalid'),
				fio_global: v => (v && /([a-zA-Zа-яА-Я-/.'])+(\s)+([a-zA-Zа-яА-Я-/.'])+(\s)*([a-zA-Zа-яА-Я-/.'])*/.test(v)) || this.$t('forms_validation.fio_invalid'),
				company_name: v => (v && /(['\\"А-Яа-я\w\s-]+)/.test(v)) || this.$t('forms_validation.company_name_invalid'),
				company_name_global: v => (v && /([\S\s]{3,256})/.test(v)) || this.$t('forms_validation.company_name_invalid'),
				birthday_18years: v => !v || Math.floor((new Date() - new Date(v).getTime()) / 3.15576e+10) >= 18 || this.$t('forms_validation.birthday_18years'),
				passport_number: v => (v && /\d{4}\s\d{6}/.test(v)) || this.$t('forms_validation.passport_number_invalid'),
				document_number: v => (v && /\w{8,40}/.test(v)) || this.$t('forms_validation.document_number_invalid'),
				reg_no_ru: v => (v && /\d{13}/.test(v)) || (v && /\d{15}/.test(v)) || this.$t('forms_validation.reg_no_ru'),
				reg_no_kg: v => (v && /\d{6}-\d{4}-\S{3}/.test(v)) || this.$t('forms_validation.reg_no_kg'),
				edo_id: v => (v && /\w{3}-\w{32}/.test(v)) || this.$t('forms_validation.edo_id_invalid'),
				ind_inn: v => !v || /\d{12}/.test(v) || this.$t('forms_validation.ind_inn_invalid'),
				ind_inn_global: v => (v && /\w{8,40}/.test(v)) || this.$t('forms_validation.ind_inn_global_invalid'),
				comp_inn: v => (v && /\d{10}/.test(v)) || this.$t('forms_validation.comp_inn_invalid'),
				comp_ip_inn: v => (v && /^(\d{10}|\d{12})$/.test(v)) || this.$t('forms_validation.comp_inn_invalid'),
				comp_inn_kg: v => (v && /^(\d{14})$/.test(v)) || this.$t('forms_validation.comp_inn_kg'),
				comp_kpp: v => (v && /\d{9}/.test(v)) || this.$t('forms_validation.comp_kpp_invalid'),
				bic: v => !v || v.length === 9 || this.$t('forms_validation.bic_invalid'),
				bic_kg: v => !v || v.length === 6 || this.$t('forms_validation.bic_invalid'),
				acc: v => !v || v.length === 20 || this.$t('forms_validation.acc_invalid'),
				acc_kg: v => !v || v.length === 16 || this.$t('forms_validation.acc_kg_invalid'),
				passMatch: v => (v && v === this.user.password) || this.$t('auth.forgot.passwords_not_match'),

				min5char: v => !v || v.length >= 5 || this.$t('forms_validation.min_5char'),
				min6char: v => !v || v.length >= 6 || this.$t('forms_validation.min_6char'),
				min8char: v => !v || v.length >= 8 || this.$t('forms_validation.min_8char'),

				max6char: v => !v || v.length <= 6 || this.$t('forms_validation.max_6char'),
				max40char: v => !v || v.length <= 40 || this.$t('forms_validation.max_40char'),
				max64char: v => !v || v.length <= 64 || this.$t('forms_validation.max_64char'),

				only9char: v => !v || v.length === 9 || this.$t('forms_validation.only9char'),
				only20char: v => !v || v.length === 20 || this.$t('forms_validation.only20char'),
				innChars: v => !v || (v.length === 10 || v.length === 12) || this.$t('forms_validation.only10or12char'),

				latinAndNumbers: v =>
					!v || (v && /^[a-zA-Z0-9-_]+$/g.test(v)) || this.$t('forms_validation.unsupported_char_latinAndNumbers'),
				propName: v => !v || (v && /^[\p{L}\p{N}\p{Zs}\p{Pd}\p{Pc}]+$/u.test(v)) || this.$t('forms_validation.unsupported_char_prop_name'),
				beneficiary_name: v => !v || (v && /^[a-zA-Z0-9\s\/—?:().,‘+]{1,34}$/g.test(v)) || this.$t('forms_validation.unsupported_beneficiary_name'),
				beneficiary_address: v => !v || (v && /^[a-zA-Z0-9\s\/—?:().,‘+]{1,102}$/g.test(v)) || this.$t('forms_validation.unsupported_beneficiary_address'),
				beneficiary_acc_iban: v => !v || (v && /^[A-Z0-9]{1,34}$/g.test(v)) || this.$t('forms_validation.unsupported_beneficiary_acc_iban'),
				bank_swift: v => !v || (v && /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/g.test(v)) || this.$t('forms_validation.unsupported_bank_swift'),
				numbers: v => !v || /^[0-9]+$/.test(v) || this.$t('forms_validation.unsupported_char_numbers'),
				positive: v => !v || BigNumber(v).gt(0) || this.$t('forms_validation.positive'),

				maxFileSize5MB: v => !v || v.size < 5000000 || this.$t('forms_validation.max_filesize_5MB'),
			},
		};
	},
};
