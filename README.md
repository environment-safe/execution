@environment-safe/execution
============================
This is for cross environment js code execution, and should best be avoided.

Exports are intentionally cryptic to discourage usage.

Usage
-----

### Function
```javascript
import { ᝪ as Function } from '@environment-safe/execution';
const fn = new Function('return 5');
const value = fn();
// value === 5
```

### Script
```javascript
import { ଠ as Script } from '@environment-safe/execution';
const script = new Script('foo = 5');
const context = {};
script.run(context);
//context.foo === 5
```

### createWorker
```javascript
import { ᱛ as createWorker } from '@environment-safe/execution';
const worker = createWorker(`
    self.onmessage = function(e) {
        self.postMessage('pong:' + e.data);
    };
`);
worker.onmessage = (e)=>{
    // e.data === 'pong: ping';
};
worker.postMessage('ping');
```

### global
```javascript
import { ↂ as globals } from '@environment-safe/execution';
// globals is window in the browser and global in node
```

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

