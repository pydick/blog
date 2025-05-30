var obj = {};
obj.key = "value";
var descriptor = {
    writable: false
}
descriptor.__proto__.enumerable = true;
Object.defineProperty(obj, 'key', descriptor);
console.log(Object.getOwnPropertyDescriptor(obj, 'key')); //返回的enumerable为true