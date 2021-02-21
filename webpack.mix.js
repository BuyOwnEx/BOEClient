const path = require('path');
const fs = require('fs-extra');
const mix = require('laravel-mix');
const { VuetifyLoaderPlugin } = require('vuetify-loader');

const publicDir = path.resolve(__dirname, './public');

/*
|---------------------------------------------------------------------
| Inject Vuetify variables in SASS
|---------------------------------------------------------------------
*/
Mix.listen('configReady', (config) => {
  const scssRule = config.module.rules.find((r) => r.test.toString() === /\.scss$/.toString());

  scssRule.oneOf.forEach((ruleset) => {
    const scssOptions = ruleset.use.find((l) => l.loader === 'sass-loader').options;

    scssOptions.additionalData = '@import \'./resources/sass/vuetify/variables\';'
  });

  const sassRule = config.module.rules.find((r) => r.test.toString() === /\.sass$/.toString());

  sassRule.oneOf.forEach((ruleset) => {
    const sassOptions = ruleset.use.find((l) => l.loader === 'sass-loader').options;

    sassOptions.additionalData = '@import \'./resources/sass/vuetify/variables\''
  })
});

/*
|---------------------------------------------------------------------
| Load the Vuetify Loader Plugin
|---------------------------------------------------------------------
*/
mix.extend('vuetify', new class {
  webpackConfig (config) {
    config.plugins.push(new VuetifyLoaderPlugin())
  }
});

mix.vuetify();

if (mix.inProduction()) {
  mix.version()
} else {
  mix.sourceMaps()
}

/*
|---------------------------------------------------------------------
| Build and copy Vue application assets to 'public/dist' folder
|---------------------------------------------------------------------
*/
mix.js('resources/js/app.js', 'public/dist/js')
    .js('resources/js/trading.js', 'public/dist/js')
    .js('resources/js/auth.js', 'public/dist/js')
    .js('resources/js/plugins/hero-canvas.js', 'public/dist/js').vue()
  .sass('resources/sass/app.scss', 'public/dist/css')
  .sass('resources/sass/highcharts.scss', 'public/dist/css')
  .webpackConfig({
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.join(__dirname, './resources/js'),
        '~': path.join(__dirname, './resources/js')
      }
    },
    output: {
      chunkFilename: 'dist/js/[chunkhash].js',
      path: path.resolve(__dirname, './public/build')
    }
  });

mix.then(() => {
  process.nextTick(publishAssets)
});

function publishAssets () {
  if (mix.inProduction()) {
    const dist = path.join(publicDir, 'dist');

    // clean dist folder
    if (fs.existsSync(dist)) fs.removeSync(dist)
  }

  if (fs.existsSync(path.join(publicDir, 'build', 'dist'))) fs.copySync(path.join(publicDir, 'build', 'dist'), path.join(publicDir, 'dist'));
  if (fs.existsSync(path.join(publicDir, 'build', 'images'))) fs.copySync(path.join(publicDir, 'build', 'images'), path.join(publicDir, 'images'));
  if (fs.existsSync(path.join(publicDir, 'build'))) fs.removeSync(path.join(publicDir, 'build'))
}
