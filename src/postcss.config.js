const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss")({
	content: [
		"./src/**/*.jsx",
		"./src/**/*.js",
		"./public/index.html",
		"./src/**/*.html",
		"./src/**/*.ts",
		"./src/**/*.tsx",
	],
	css: ["./src/assets/tailwind.css"],
	// Include any special characters you're using in this regular expression
	defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});
module.exports = {
	plugins: [tailwindcss("./tailwind.js"), require("autoprefixer"), purgecss],
};
