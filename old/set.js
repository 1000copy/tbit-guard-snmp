var snmp = require ("net-snmp");
var session = snmp.createSession ("127.0.0.1", "private",{version:1}); // version 1 - version 2c
var prefix = '1.3.6.1.4.1.66666.'
var varbinds = [
    {
        oid: prefix+"1.1.0",
        type: snmp.ObjectType.OctetString,
        value: "host12"
    }, ];
session.set (varbinds, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }
});
