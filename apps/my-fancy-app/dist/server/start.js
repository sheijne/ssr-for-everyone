
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite-plugin-ssr/server';

const manifest = {
  "path": "/Users/sibbeheijne/Documents/Divotion/Development/ssr-for-everyone.frontmania/apps/my-fancy-app/index.html",
  "islands": {
    "\n        <island src=\"islands/intro\" />\n      ": {
      "src": "islands/intro",
      "server": "src/islands/intro/entry-server.js",
      "client": "src/islands/intro/entry-client.js",
      "hydrate": false
    },
    "\n          <island src=\"islands/counter-vanilla\" hydrate />\n        ": {
      "src": "islands/counter-vanilla",
      "server": "src/islands/counter-vanilla/entry-server.js",
      "client": "src/islands/counter-vanilla/entry-client.js",
      "hydrate": true
    },
    "\n          <island src=\"islands/counter-svelte\" hydrate />\n        ": {
      "src": "islands/counter-svelte",
      "server": "src/islands/counter-svelte/entry-server.js",
      "client": "src/islands/counter-svelte/entry-client.js",
      "hydrate": true
    },
    "\n          <island src=\"islands/counter-vue\" hydrate />\n        ": {
      "src": "islands/counter-vue",
      "server": "src/islands/counter-vue/entry-server.js",
      "client": "src/islands/counter-vue/entry-client.js",
      "hydrate": true
    },
    "\n          <island src=\"islands/counter-react\" hydrate />\n        ": {
      "src": "islands/counter-react",
      "server": "src/islands/counter-react/entry-server.js",
      "client": "src/islands/counter-react/entry-client.js",
      "hydrate": true
    }
  }
};

createHttpServer(createServer({ manifest })).listen(8080);

console.log('Server listening at: http://localhost:8080');
					