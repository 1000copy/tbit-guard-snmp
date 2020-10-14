
var oid = '1.3.6.1.4.1.66666.1'
// agent
var snmp = require ("net-snmp");
var agent = snmp.createAgent({accessControlModelType: snmp.AccessControlModelType.Simple}, function (error, data) {
    if ( error ) {
        console.error (error);
    } else {
        // console.log (JSON.stringify(data.pdu.varbinds, null, 2));
    }
});
// authorizer
var authorizer = agent.getAuthorizer ();
    authorizer.addCommunity ("public");
    authorizer.addCommunity ("private");
    authorizer.addUser ({
        name: "fred",
        level: snmp.SecurityLevel.noAuthNoPriv
    });
    var acm = authorizer.getAccessControlModel ();
    // Since read-only is the default, explicitly setting read-only access is not required - just shown here as an example
    acm.setCommunityAccess ("public", snmp.AccessLevel.ReadOnly);
    acm.setCommunityAccess ("private", snmp.AccessLevel.ReadWrite);
    acm.setUserAccess ("fred", snmp.AccessLevel.ReadWrite);
// provider

var store = snmp.createModuleStore ();
store.loadFromFile ("C:\\GitHub\\test2\\tbit-guard-snmp\\tbit.mib");
var jsonModule = store.getModule ("tbitinc");
// console.log(jsonModule)
var providers = store.getProvidersForModule ("tbitinc");
var mib = agent.getMib ();
console.log(providers)
providers[0].handler= function (mibRequest) {
       // e.g. can update the MIB data before responding to the request here
       if (mibRequest.operation == 163 ){
            console.log(mibRequest.setValue)
            if ( mibRequest.setValue > 45)
            {                
                var target = '127.0.0.1'
                var community = 'public'
                var options = {version: snmp.Version2c};
                var a = function(){
                    var session = snmp.createSession (target, community, options);
                    // session.inform ( typeOrOid, {upTime: upTime,...varbinds},
                    console.log('inform')
                    var varbinds = [{
                            oid,
                            type: snmp.ObjectType.Integer,
                            value: mibRequest.setValue,
                        }]
                    session.inform ( oid, varbinds,{upTime: 100},
                            function (error, varbinds) {
                        if (error) {
                            console.error (error.toString ());
                        }
                    }); 
                }
                a()
            }
           
       }
       mibRequest.done ();
    }
mib.registerProviders (providers);

var mib = agent.getMib ();
mib.setScalarValue ("RecoSecret", 42);
