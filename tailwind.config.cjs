const plugin = require('tailwindcss/plugin');

// u<N> is N pixels of the Paper board, scaled by --u (set on the home page).
const boardPx = (n) => `calc(${n} * var(--u, 1px))`;
const range = Array.from({ length: 1201 }, (_, n) => n);
const board = Object.fromEntries(range.map((n) => [`u${n}`, boardPx(n)]));

// Inter's optical size follows the font size, so smaller text sets wider and
// would wrap differently. text-u<N> keeps the board's optical size at any
// scale and never goes below --min-text.
const boardText = plugin(({ addUtilities }) => {
	addUtilities(
		Object.fromEntries(
			range.map((n) => [
				`.text-u${n}`,
				{
					fontSize: `max(var(--min-text, 0px), ${boardPx(n)})`,
					fontVariationSettings: `"opsz" ${n}`
				}
			])
		)
	);
});

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				inter: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif']
			},
			spacing: board,
			maxWidth: board,
			borderRadius: board,
			lineHeight: board
		}
	},

	plugins: [boardText]
};

module.exports = config;
