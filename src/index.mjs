import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));

//export const 𝑓 
export const ᝪ = Function;

const ShimScript = function(text){
    this.text = text;
};
ShimScript.prototype.runInContext = async function(context, options={}){
    try{
        let source = '';
        Object.keys(context).forEach((key)=>{
           source += `let ${key} = ${JSON.stringify( context[key] )}`;
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
        Object.keys(context).forEach((key)=>{
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
        Object.keys(newContext).forEach((key)=>{
           context[key] = newContext[key];
        });
    }catch(ex){ }
};

ShimScript.prototype.run = ShimScript.prototype.runInContext;

export const ↂ = (isBrowser || isJsDom)?window:global;
export const ଠ = function(scriptText){
    if(isBrowser || isJsDom){
        return new ShimScript(scriptText);
    }else{
        ensureRequire();
        const vm = internalRequire('vm');
        const scpt = new vm.Script(scriptText);
        scpt.run = (context)=>{
            vm.createContext(context);
            return scpt.runInContext(context);
        }
        return scpt;
    }
};

export const ᱛ = async (source)=>{
    return await new Promise((resolve, reject)=>{
        if(isBrowser || isJsDom){
            var blob = new Blob([ source ], { 
                type: "text/javascript" 
            });
            // Note: window.webkitURL.createObjectURL() in Chrome 10+.
            var worker = new Worker(window.URL.createObjectURL(blob));
            const self = {
                postMessage: (message)=>{
                    setTimeout(()=>{
                        worker.postMessage(message);
                    });
                },
                terminate: async ()=>{
                    try{
                        let results = {};
                        let resolve = null;
                        let reject = null;
                        let promise = new Promise((rslv, rjct)=>{
                            resolve = rslv;
                            reject = rjct;
                        }).catch((ex)=>{ });;
                        worker.onmessage = (e)=>{
                            worker.terminate();
                            if(e.data.results) resolve(e.data.results);
                        };
                        worker.postMessage({ results: true });
                        return await promise;
                    }catch(ex){ }
                }
            };
            Object.defineProperty(self, "onmessage", {
                get(){
                    return worker.onmessage;
                },
                set(newValue){
                    worker.onmessage = newValue
                },
                enumerable: true,
                configurable: true,
            });
            resolve(self);
        }else{
            ensureRequire();
            const {
                Worker, isMainThread, parentPort, workerData, MessageChannel
            } = internalRequire('node:worker_threads');
            const crypto = internalRequire('node:crypto');
            const fs = internalRequire('node:fs'); 
            const os = internalRequire('node:os'); 
            const path = internalRequire('node:path');
            const url = new URL('../executor.mjs', import.meta.url);
            const worker = new Worker(url, {
                workerData: source,
            });
            worker.on('error', (err)=>{
                console.log('Error', err);
            });
            worker.on('exit', (code)=>{
            });
            let messageHandler = null;
            const self = {
                postMessage: (message)=>{
                    setTimeout(()=>{
                        worker.postMessage(message);
                    });
                },
                terminate: async ()=>{
                    let results = {};
                    let resolve = null;
                    let reject = null;
                    let promise = new Promise((rslv, rjct)=>{
                        resolve = rslv;
                        reject = rjct;
                    });
                    worker.onmessage = (e)=>{
                        worker.terminate();
                        if(e.data.results) resolve(e.data.results);
                    };
                    worker.postMessage({ results: true });
                    worker.terminate();
                    return await promise;
                }
            };
            Object.defineProperty(self, "onmessage", {
                get() {
                    return messageHandler;
                },
                set(newValue){
                    if(messageHandler) worker.off('message', messageHandler);
                    messageHandler = newValue;
                    worker.on('message', messageHandler);
                },
                enumerable: true,
                configurable: true,
            });
            resolve(self);
        }
    }).catch((ex)=>{
    });
}
/**
 * A JSON object
 * @typedef { object } JSON
 */


