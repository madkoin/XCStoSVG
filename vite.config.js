import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';

const pageData = {
    '/index.html': {
        title: ' :: Free converter (BETA!)',
        page: 'main',
        home_active: 'active',
        meta_description: 'Free .XCS (XTOOL Creative space file format) to .SVG file converter.'
    },
    '/about.html': {
        title: ' :: About',
        page: 'about',
        about_active: 'active',
        meta_description: 'About the converter.'
    },
    '/contact.html': {
        title: ' :: Contact',
        page: 'contact',
        contact_active: 'active',
        meta_description: 'Contact page with information about the author of the service and links to social networks and mail address.'
    }
};

export default defineConfig(({command, mode, ssrBuild}) => {
    return {
        base: "/XCStoSVG/",
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    about: resolve(__dirname, 'about.html'),
                    contact: resolve(__dirname, 'contact.html')
                }
            }
        },
        plugins: [
            handlebars({
                partialDirectory: resolve(__dirname, 'partials'),
                context(pagePath) {
                    let oData = pageData[pagePath];

                    if (command === "serve") {
                        oData.env_dev = true;
                    } else {
                        oData.env_prod = true;
                    }

                    return oData;
                }
            })
        ]
    };
});