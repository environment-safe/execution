"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ↂ = exports.ᱛ = exports.ᝪ = exports.ଠ = void 0;
var _browserOrNode = require("browser-or-node");
var mod = _interopRequireWildcard(require("module"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
let internalRequire = null;
if (typeof require !== 'undefined') internalRequire = require;
const ensureRequire = () => !internalRequire && (internalRequire = mod.createRequire(require('url').pathToFileURL(__filename).toString()));

//export const 𝑓 
const ᝪ = Function;
exports.ᝪ = ᝪ;
const ShimScript = function (text) {
  this.text = text;
};
ShimScript.prototype.runInContext = async function (context, options = {}) {
  try {
    let source = '';
    Object.keys(context).forEach(key => {
      source += `let ${key} = ${JSON.stringify(context[key])}`;
    });
    source += 'const preRun = Object.keys(self);';
    source += this.text;
    source += 'const results = {};';
    source += `
            const handler = self.onmessage;
            self.onmessage = (e, f)=>{
                if(typeof e.data === 'object' && e.data.results === true){
                    self.postMessage({ results });
                }else{
                    if(handler) handler(e);
                }
                console.log('MESS', e.data, f);
            };
            console.log(self.onmessage, handler);
        `;
    Object.keys(context).forEach(key => {
      source += `results['${key}'] = ${key};`;
    });
    source += 'const postRun = Object.keys(self);';
    source += 'let difference = postRun.filter(x => !preRun.includes(x));';
    source += `
            difference.forEach((key)=>{
                results[key] = self[key];
            });
        `;
    source += 'console.log("RESULTS", results, difference)';
    const worker = await ᱛ(`
            try{
                ${source}
            }catch(ex){
                console.log('$ERR', ex);
            }`);
    const newContext = await worker.terminate();
    Object.keys(newContext).forEach(key => {
      context[key] = newContext[key];
    });
  } catch (ex) {
    console.log(ex);
  }
};
ShimScript.prototype.run = ShimScript.prototype.runInContext;
const ↂ = _browserOrNode.isBrowser || _browserOrNode.isJsDom ? window : global;
exports.ↂ = ↂ;
const ଠ = function (scriptText) {
  if (_browserOrNode.isBrowser || _browserOrNode.isJsDom) {
    return new ShimScript(scriptText);
  } else {
    ensureRequire();
    const vm = internalRequire('vm');
    const scpt = new vm.Script(scriptText);
    scpt.run = context => {
      vm.createContext(context);
      return scpt.runInContext(context);
    };
    return scpt;
  }
};
exports.ଠ = ଠ;
const ᱛ = async source => {
  return await new Promise((resolve, reject) => {
    if (_browserOrNode.isBrowser || _browserOrNode.isJsDom) {
      var blob = new Blob([source], {
        type: 'text/javascript'
      });
      // Note: window.webkitURL.createObjectURL() in Chrome 10+.
      var worker = new Worker(window.URL.createObjectURL(blob));
      const self = {
        postMessage: message => {
          setTimeout(() => {
            worker.postMessage(message);
          });
        },
        terminate: async () => {
          let resolve = null;
          let reject = null;
          try {
            let promise = new Promise((rslv, rjct) => {
              resolve = rslv;
              reject = rjct;
            }).catch(ex => {});
            worker.onmessage = e => {
              worker.terminate();
              if (e.data.results) resolve(e.data.results);
            };
            worker.postMessage({
              results: true
            });
            return await promise;
          } catch (ex) {
            if (reject) reject(ex);
          }
        }
      };
      Object.defineProperty(self, 'onmessage', {
        get() {
          return worker.onmessage;
        },
        set(newValue) {
          worker.onmessage = newValue;
        },
        enumerable: true,
        configurable: true
      });
      resolve(self);
    } else {
      ensureRequire();
      const {
        Worker
      } = internalRequire('node:worker_threads');
      const url = new URL("../executor.cjs", require('url').pathToFileURL(__filename).toString());
      const worker = new Worker(url, {
        workerData: source
      });
      worker.on('error', err => {
        console.log('Error', err);
      });
      worker.on('exit', code => {});
      let messageHandler = null;
      const self = {
        postMessage: message => {
          setTimeout(() => {
            worker.postMessage(message);
          });
        },
        terminate: async () => {
          let resolve = null;
          let reject = null;
          try {
            let promise = new Promise((rslv, rjct) => {
              resolve = rslv;
              reject = rjct;
            });
            worker.onmessage = e => {
              worker.terminate();
              if (e.data.results) resolve(e.data.results);
            };
            worker.postMessage({
              results: true
            });
            return await promise;
          } catch (ex) {
            if (reject) reject(ex);
          }
        }
      };
      Object.defineProperty(self, 'onmessage', {
        get() {
          return messageHandler;
        },
        set(newValue) {
          if (messageHandler) worker.off('message', messageHandler);
          messageHandler = newValue;
          worker.on('message', messageHandler);
        },
        enumerable: true,
        configurable: true
      });
      resolve(self);
    }
  }).catch(ex => {});
};
/**
 * A JSON object
 * @typedef { object } JSON
 */
exports.ᱛ = ᱛ;