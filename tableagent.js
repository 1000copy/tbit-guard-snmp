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
var acm = authorizer.getAccessControlModel ();
acm.setCommunityAccess ("public", snmp.AccessLevel.ReadOnly);
acm.setCommunityAccess ("private", snmp.AccessLevel.ReadWrite);
acm.setUserAccess ("fred", snmp.AccessLevel.ReadWrite);
// provider
var tableProvider = {
    name: "ifTable",//table oid - 1.3.6.1.4.1.66666.2
    type: snmp.MibProviderType.Table,
    // oid: "1.3.6.1.2.1.2.2.1",
    oid: "1.3.6.1.4.1.66666.2.1",
    tableColumns: [
        {
            number: 1,
            name: "ifIndex",
            type: snmp.ObjectType.Integer
        },
        {
            number: 2,
            name: "ifDescr",
            type: snmp.ObjectType.OctetString
        },
        {
            number: 3,
            name: "ifType",
            type: snmp.ObjectType.Integer,
            constraints: {
                enumeration: {
                    "1": "goodif",
                    "2": "badif",
                    "6": "someif",
                    "24": "anotherif"
                }
            }
        }
    ],
    tableIndex: [
        {
            columnName: "ifIndex"
        }
    ],
    handler: function ifTable (mibRequest) {
        // e.g. can update the table before responding to the request here
        mibRequest.done ();
    }
};
agent.registerProvider (tableProvider);

var mib = agent.getMib ();
mib.addTableRow ("ifTable", [1, "lo", 24]);
mib.addTableRow ("ifTable", [2, "eth0", 6]);