export const TextBox = {
	methods: {
		TextValidateE: function (e, value) {
			if (/[\W]/g.test(value)) {
				value = value.replace(/[\W]/g, '');
				//$(e.target).val(value);
				
			}
			return value
		},
	}
}