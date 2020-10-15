var snmp = require ("net-snmp");
var store = snmp.createModuleStore ();
store.loadFromFile (__dirname+"\\tbittable.mib");
var jsonModule = store.getModule ("tbitinc");
// console.log(jsonModule,__dirname)
var providers = store.getProvidersForModule ("tbitinc");
console.log(providers)
