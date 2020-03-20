export const Text = {
	methods: {
		TextSize: function (e, value, Reduction, LastValue, color, o_color) {
			if (Reduction && $(e.target).css("font-size") === value) {
				$(e.target).css("font-size", LastValue);
				if (o_color != undefined)
					$(e.target).css("color", o_color)
			}
			else {
				$(e.target).css("font-size", value);
				if (color != undefined)
				{
					$(e.target).css("color", color)
				}
			}
		}
	}
}