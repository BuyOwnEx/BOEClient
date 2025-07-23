import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue2'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js'
            ],
            refresh: true,
        }),
        vue({
            template: { transformAssetUrls : {
                    base: null,
                    includeAbsolute: false,
                }
            },
        }),
        VueI18n({
            runtimeOnly: false,
            compositionOnly: false,
            fullInstall: false,
            include: 'js',
        }),
        Components({
            resolvers: [VuetifyResolver()],
        }),
    ],
    css: {
        preprocessorOptions: {
            sass: {
                additionalData: [
                    // Make the variables defined in these files available to all components, without requiring an explicit
                    // @import of the files themselves
                    '@import "./resources/sass/theme.scss"',
                    '@import "./resources/sass/highcharts"',
                    '', // end with newline
                ].join('\n'),
            },
        },
    },
});
