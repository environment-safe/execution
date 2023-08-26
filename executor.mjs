import { Worker, workerData, MessageChannel, parentPort } from 'node:worker_threads';
let messageHandler = null;
const self = {
    postMessage: (message)=>{
        setTimeout(()=>{
            parentPort.postMessage({ data: message });
        });
    }
};
Object.defineProperty(self, "onmessage", {
    get() {
        return messageHandler;
    },
    set(newValue){
        if(messageHandler) parentPort.off('message', messageHandler);
        messageHandler = newValue;
        parentPort.on('message', messageHandler);
    },
    enumerable: true,
    configurable: true,
});
eval(workerData);