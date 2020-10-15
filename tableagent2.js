var oid = '1.3.6.1.4.1.66666.1'
// agent
var snmp = require ("net-snmp");
var agent = snmp.createAgent({accessControlModelType: snmp.AccessControlModelType.Simple}, function (error, data) {
    if ( error ) {
        console.error (error);
    }
});
// authorizer
var authorizer = agent.getAuthorizer ();
authorizer.addCommunity ("public");
authorizer.addCommunity ("private");
var acm = authorizer.getAccessControlModel ();
acm.setCommunityAccess ("public", snmp.AccessLevel.ReadOnly);
acm.setCommunityAccess ("private", snmp.AccessLevel.ReadWrite);
// provider
var store = snmp.createModuleStore ();
store.loadFromFile ("C:\\GitHub\\test2\\tbit-guard-snmp\\tbittable.mib");
var jsonModule = store.getModule ("tbitinc");
console.log(jsonModule)
var providers = store.getProvidersForModule ("tbitinc");

// var providers = {
//     name: "ifTable",
//     type: snmp.MibProviderType.Table,    
//     oid: "1.3.6.1.4.1.66666.2.1",
//     tableColumns: [
//         {
//             number: 1,
//             name: "ifIndex",
//             type: snmp.ObjectType.Integer
//         },
//         {
//             number: 2,
//             name: "ifType",
//             type: snmp.ObjectType.Integer           
//         }
//     ],
//     tableIndex: [
//         {
//             columnName: "ifIndex"
//         }
//     ],
//     handler: function ifTable (mibRequest) {
//         mibRequest.done ();
//     }
// };
console.log(providers)
agent.registerProvider (providers);
var mib = agent.getMib ();
mib.addTableRow ("ifTable", [1, 24]);
mib.addTableRow ("ifTable", [2, 6]);