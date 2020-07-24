var oid = '1.3.6.1.4.1.66666.1'
// agent
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
    name: "RecoSecret",
    type: snmp.MibProviderType.Scalar,
    oid,
    scalarType: snmp.ObjectType.OctetString
};
agent.registerProvider (scalarProvider);
var mib = agent.getMib ();
mib.setScalarValue ("RecoSecret", "42");
mib.dump ()
// get by  1.3.6.1.4.1.66666.1   ERROR: Instance node has provider which should never happen
// get by  1.3.6.1.4.1.66666.1.0 SUCCESS
// upgrade to 2.7.1 from 2.5.6 ,then everything is fit .

// info 

var target = '127.0.0.1'
var community = 'public'
var options = {version: snmp.Version2c};
var a = function(){
    var session = snmp.createSession (target, community, options);
    // session.inform ( typeOrOid, {upTime: upTime,...varbinds},
    session.inform ( oid, {},
            function (error, varbinds) {
        if (error) {
            console.error (error.toString ());
        }
    }); 
}

// setInterval(a,3000)
setTimeout(a,3000)


// info 
// snmpget -v2c -cpublic localhost 1.3.6.1.4.1.66666.1.0


// Snmptrapd.conf
// This is required to specify community you described in SNMP Trap package configuration, to describe Trap port and how to handle caught Trap messages.
// Edit snmptrapd.conf file, it can be found in /etc/snmp/ directory. Example of the command:

// 配置conf
// $ sudo nano /etc/snmp/snmptrapd.conf

// authcommunity log,execute,net public

// 启动守护进程
// snmptrapd -f -Le -F  "%02.2h:%02.2j from %B %v\n"
// -f Do not fork() from the calling shell.
// -L[efos] Specify where logging output should be directed (standard error or output, to a file or via syslog)

// 发送一个trap
// snmptrap -v 2c -c public 127.0.0.1:162 .1.3.6.1.4.1.3.1.1.5.3 1.3.6.1.4.1.66666.1
// snmpinform -v 2c -c public 127.0.0.1:162 .1.3.6.1.4.1.3.1.1.5.3 1.3.6.1.4.1.66666.1