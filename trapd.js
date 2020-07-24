var snmp = require ("net-snmp");
var snmpOptions = {
    disableAuthorization: true,
    port: 162,    
};
var cb = function(error, trap) {
    var now = new Date().toLocaleString();
    var trapType;
    if (error) {
        console.log(now + ": " + error.message);
    } else {
        if (trap.rinfo.address != '127.0.0.1')return ;
        trapType = snmp.PduType[trap.pdu.type] || "Unknown";
        console.log (now + ": " + trapType + " received:");
        console.log (JSON.stringify(trap.pdu.varbinds, null, 2));
    }
}
var receiver = snmp.createReceiver(snmpOptions, cb);
var authorizer = receiver.getAuthorizer ();
authorizer.addCommunity ("public");
