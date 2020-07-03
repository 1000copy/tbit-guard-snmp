var key = "Answer to the Ultimate Question of Life, the Universe, and Everything"
var snmp = require ("node-net-snmp");
var agent = snmp.createAgent({});
var authorizer = agent.getAuthorizer ();
authorizer.addCommunity ("public");
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
