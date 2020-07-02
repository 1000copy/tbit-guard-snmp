var snmp = require ("net-snmp");
var agent = snmp.createAgent({}, function (error, data) {
    if ( error ) {
        console.error (error);
    } else {
        console.log (JSON.stringify(data.pdu.varbinds, null, 2));
    }
});
var authorizer = agent.getAuthorizer ();
authorizer.addCommunity ("public");
var scalarProvider = {
    name: "RecoDevice",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.4.1.66666.1",
    scalarType: snmp.ObjectType.OctetString
};
agent.registerProvider (scalarProvider);
var mib = agent.getMib ();
mib.setScalarValue ("RecoDevice", "Rage inside the machine!");
mib.dump ()

// $snmpget -v2c -cpublic 127.0.0.1 .1.3.6.1.4.1.66666.1.0
// SNMPv2-MIB::sysDescr.0 = STRING: Rage inside the machine!

// $snmpset -v2c -cpublic 127.0.0.1 .1.3.6.1.4.1.66666.1.0 s "ab"
// SNMPv2-MIB::sysDescr.0 = STRING: ab
