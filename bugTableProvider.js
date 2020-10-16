var filename,modulename;
filename = 'mib\\ex1.mib'
modulename = 'NET-SNMP-EXAMPLES-MIB'
var snmp = require ("net-snmp");
var store = snmp.createModuleStore ();
store.loadFromFile (__dirname+"\\"+filename);
var jsonModule = store.getModule (modulename);
// console.log(jsonModule,__dirname)
var providers = store.getProvidersForModule (modulename);
console.log(providers)
