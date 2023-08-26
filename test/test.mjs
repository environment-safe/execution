/* global describe:false, it:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { 
    ଠ as Script,
    ↂ as globals,
    ᝪ as Function,
    ᱛ as createWorker
 } from '../src/index.mjs';
const should = chai.should();

describe('@environment-safe/execution', ()=>{
    describe('Function', ()=>{
        it('executes', async ()=>{
            const fn = new Function('return 5');
            fn().should.equal(5);
        });
    });
    
    describe('Script', ()=>{
        
        it('does not leak local or imprint variable', async ()=>{
            const script = new Script('const foo = "bar";');
            const context = {};
            script.run(context);
            Object.keys(context).length.should.equal(0);
            should.not.exist(context.foo);
            should.not.exist(globals.foo);
        });
        
        it('imprints global variable without leaking', async ()=>{
            const script = new Script('foo = "bar";');
            const context = {};
            await script.run(context);
            Object.keys(context).length.should.equal(1);
            should.exist(context.foo);
            should.not.exist(globals.foo);
        });
    });
    
    describe('createWorker', ()=>{
        const testString = 'u32or77g327ge';
        it('can respond via worker', async ()=>{
            const worker = await createWorker(`
                self.onmessage = function(e) {
                    self.postMessage('${testString}');
                };
            `);
            const promise = new Promise((resolve, reject)=>{
                try{
                    worker.onmessage = function(e){
                        try{
                           testString.should.equal(e.data);
                           const newContext = worker.terminate();
                           resolve();
                        }catch(ex2){ reject(ex2); }
                    }
                }catch(ex){ reject(ex); }
            })
            worker.postMessage("start");
            await promise;
        });
        
    });
});

