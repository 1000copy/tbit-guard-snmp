
// Copyright 2013 Stephen Vickers

var snmp = require ("../");

if (process.argv.length < 6) {
	console.log ("usage: specify-sysuptime-to-inform <target> <community> <oid> <sysuptime>");
	process.exit (1);
}

var target = process.argv[2];
var community = process.argv[3];

var typeOrOid = process.argv[4];

var upTime = parseInt(process.argv[5]);

var options = {version: snmp.Version2c};
var varbinds = [
    {
        oid: "1.3.6.1.4.1.2000.2",
        type: snmp.ObjectType.OctetString,
        value: "Hardware health status changed"
    },
    {
        oid: "1.3.6.1.4.1.2000.3",
        type: snmp.ObjectType.OctetString,
        value: "status-error"
    }
];
var session = snmp.createSession (target, community, options);
console.log(snmp.TrapType,typeOrOid,snmp.TrapType[typeOrOid])
// session.inform ( typeOrOid, {upTime: upTime},
session.inform ( typeOrOid, varbinds,
// session.inform (snmp.TrapType.LinkDown || typeOrOid, {upTime: upTime},

		function (error, varbinds) {
	if (error) {
		console.error (error.toString ());
	} else {
		for (var i = 0; i < varbinds.length; i++) {
			if (snmp.isVarbindError (varbinds[i]))
				console.error (snmp.varbindError (varbinds[i]));
			else
				console.log (varbinds[i].oid + "|" + varbinds[i].value);
		}
	}
});
