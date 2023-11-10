import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// @ts-ignore
import m from './web_assembly/hello3.js'
import { BrowserRouter } from 'react-router-dom'
import OrgContextProvider from './context/orgContext.tsx'
require('dotenv').config()
m().then(function(Module: any) {
  // @ts-ignore
  const ccallArrays = (func, returnType, paramTypes=[], params, {heapIn="HEAPF32", heapOut="HEAPF32", returnArraySize=1}={}) => {

// @ts-ignore
    const heapMap:any = {}
    heapMap.HEAP8 = Int8Array // int8_t
    heapMap.HEAPU8 = Uint8Array // uint8_t
    heapMap.HEAP16 = Int16Array // int16_t
    heapMap.HEAPU16 = Uint16Array // uint16_t
    heapMap.HEAP32 = Int32Array // int32_t
    heapMap.HEAPU32 = Uint32Array // uint32_t
    heapMap.HEAPF32 = Float32Array // float
    heapMap.HEAPF64 = Float64Array // double

    let res
    let error
    const returnTypeParam = returnType=="array" ? "number" : returnType
    const parameters = []
    const parameterTypes = []
    const bufs = []

    try {
        if (params) {
            for (let p=0; p<params.length; p++) {

                if (paramTypes[p] == "array" || Array.isArray(params[p])) {

// @ts-ignore
                    const typedArray = new heapMap[heapIn](params[p].length)

                    for (let i=0; i<params[p].length; i++) {
                        typedArray[i] = params[p][i]
                    }

                    const buf = Module._malloc(typedArray.length * typedArray.BYTES_PER_ELEMENT)

                    switch (heapIn) {
                        case "HEAP8": case "HEAPU8":
                            Module[heapIn].set(typedArray, buf)
                            break
                        case "HEAP16": case "HEAPU16":
                            Module[heapIn].set(typedArray, buf >> 1)
                            break
                        case "HEAP32": case "HEAPU32": case "HEAPF32":
                            Module[heapIn].set(typedArray, buf >> 2)
                            break
                        case "HEAPF64":
                            Module[heapIn].set(typedArray, buf >> 3)
                            break
                    }

                    bufs.push(buf)
                    parameters.push(buf)
                    parameters.push(params[p].length)
                    parameterTypes.push("number")
                    parameterTypes.push("number")

                } else {
                    parameters.push(params[p])
                    parameterTypes.push(paramTypes[p]==undefined ? "number" : paramTypes[p])
                }
            }
        }

        res = Module.ccall(func, returnTypeParam, parameterTypes, parameters)
    } catch (e) {
        error = e
    } finally {
        for (let b=0; b<bufs.length; b++) {
            Module._free(bufs[b])
        }
    }

    if (error) throw error

    if (returnType=="array") {
        const returnData = []

        for (let v=0; v<returnArraySize; v++) {
          // @ts-ignore
          // @ts-ignore
            returnData.push(Module[heapOut][res/heapMap[heapOut].BYTES_PER_ELEMENT+v])
        }

        return returnData
    } else {
        return res
    }
}
// Wrap around cwrap also, as a bonus
// @ts-ignore
const cwrapArrays = (func, returnType, paramTypes, {heapIn="HEAPF32", heapOut="HEAPF32", returnArraySize=1}={}) => {
    
// @ts-ignore
  return params => ccallArrays(func, returnType, paramTypes, params, {heapIn, heapOut, returnArraySize})
}
// https://github.com/DanRuta/wasm-arrays
let ar = []
for (let i=0; i< 1000; i++) {
  ar.push(i)
}
let start = 0
  let end = 0
  start = Date.now()
  // @ts-ignore
const result = ccallArrays("addNums", "number", ["array"], [ar])
console.log(result)
end = Date.now()
console.log("ws:", end-start)
start = Date.now()
  // @ts-ignore
  let t = 0
  for (const i of ar) {
    t += i
  }
console.log(t)
end = Date.now()
console.log("js:", end-start)
  // const int_sqrt = mymod.cwrap('int_sqrt', 'array', ['number']);
  // // mymod.ccall('int_sqrt', // name of C function
  // // 'number', // return type
  // // ['number'], // argument types
  // // [28]); // arguments
  // // const sqrt = (int: number) => Math.sqrt(int)
  // let start = 0
  // let end = 0
  // start = Date.now()
  // console.log(int_sqrt(1010000121));
  // end = Date.now()
  // console.log("ws:", end-start)
  // // start = Date.now()
  // // console.log(sqrt(1012121));
  // // end = Date.now()
  // // console.log("js:", end-start)
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrgContextProvider>
          <App />
      </OrgContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
