const mix = require('laravel-mix');
const { VuetifyLoaderPlugin } = require('vuetify-loader');

/*
|---------------------------------------------------------------------
| Inject Vuetify variables in SASS
|---------------------------------------------------------------------
*/
Mix.listen('configReady', (config) => {
	const scssRule = config.module.rules.find((r) => r.test.toString() === /\.scss$/.toString());

	scssRule.oneOf.forEach((ruleset) => {
		const scssOptions = ruleset.use.find((l) => l.loader === 'sass-loader').options;

		scssOptions.additionalData = '@import \'./resources/sass/vuetify/variables\';';
	});

	const sassRule = config.module.rules.find((r) => r.test.toString() === /\.sass$/.toString());

	sassRule.oneOf.forEach((ruleset) => {
		const sassOptions = ruleset.use.find((l) => l.loader === 'sass-loader').options;

		sassOptions.additionalData = '@import \'./resources/sass/vuetify/variables\'';
	});
});

/*
|---------------------------------------------------------------------
| Load the Vuetify Loader Plugin
|---------------------------------------------------------------------
*/
mix.extend('vuetify', new class {
	webpackConfig(config) {
		config.plugins.push(new VuetifyLoaderPlugin());
	}
});

mix.vuetify();

/*
|---------------------------------------------------------------------
| Build and copy Vue application assets to 'public/dist' folder
|---------------------------------------------------------------------
*/
mix.js('resources/js/app.js', 'public/dist/js')
	.js('resources/js/trading.js', 'public/dist/js')
	.js('resources/js/overview.js', 'public/dist/js')
	.js('resources/js/main.js', 'public/dist/js')
	.js('resources/js/auth.js', 'public/dist/js')
	.js('resources/js/error.js', 'public/dist/js')
	.js('resources/js/plugins/gt4.js', 'public/dist/js')
	.js('resources/js/plugins/hero-canvas.js', 'public/dist/js').vue()
	.sass('resources/sass/app.scss', 'public/dist/css')
	.sass('resources/sass/highcharts.scss', 'public/dist/css')
	.copyDirectory('resources/js/assets/images', 'public/images');
if (mix.inProduction()) {
	mix.version();
} else {
	mix.sourceMaps();
}
