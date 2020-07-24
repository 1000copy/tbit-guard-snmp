var snmp = require ("net-snmp");


var snmpOptions = {
    // disableAuthorization: true,
    port: 161,    
    debug:true,
};

var callback = function (error, data) {
    if ( error ) {
        console.error (error);
    } else {
        console.log (JSON.stringify(data.pdu.varbinds, null, 2));
    }
};

var agent = snmp.createAgent(snmpOptions, callback);
var authorizer = agent.getAuthorizer ();
authorizer.addCommunity ("public");
authorizer.addCommunity ("private");
// console.log(JSON.stringify(agent.getAuthorizer().getUsers(), null, 2));
var prefix = '1.3.6.1.4.1.66666.'

var key = "Answer to the Ultimate Question of Life, the Universe, and Everything"
var scalarProvider = {
    name: key,
    type: snmp.MibProviderType.Scalar,
    oid: "1",
    scalarType: snmp.ObjectType.OctetString
};
agent.registerProvider (scalarProvider);
var mib = agent.getMib ();
mib.setScalarValue (key, "43");
// 客户端使用net-snmp工具集来查询：
// # snmpget -v2c -cpublic 127.0.0.1 .1.0
// 复制代码
// 返回结果：
// iso.3.6.1 = STRING: "42"
// 复制代码
// 或者修改它：
// $snmpset -v2c -cpublic 127.0.0.1 .1.0 s "43"
