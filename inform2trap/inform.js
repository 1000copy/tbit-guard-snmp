
var snmp = require ("net-snmp");
var target = '127.0.0.1'
var community = 'public'
var typeOrOid = '1.3.6.1.4.1.2000.23'
var upTime = '2020'
var options = {version: snmp.Version2c};
var varbinds = [
    {
        oid: "1.3.6.1.4.1.2000.2",
        type: snmp.ObjectType.OctetString,
        value: "heartbeat"
    },
    {
        oid: "1.3.6.1.4.1.2000.3",
        type: snmp.ObjectType.OctetString,
        value: "heartbeat1"
    }
];
var a = function(){
	var session = snmp.createSession (target, community, options);
	// session.inform ( typeOrOid, {upTime: upTime,...varbinds},
	session.inform ( typeOrOid, varbinds,
			function (error, varbinds) {
		if (error) {
			console.error (error.toString ());
		}
	});	
}

setInterval(a,3000)
// snmptrap -v 1 [COMMON OPTIONS] [-Ci] enterprise-oid agent generic-trap specific-trap uptime [OID TYPE VALUE]...
// snmptrap -v 1 -c public manager enterprises.spider test-hub 3 0 '' interfaces.iftable.ifentry.ifindex.1 i 1

// will send a generic linkUp trap to manager, for interface 1.
/* 
   前两个变量
   在InformRequest-PDU的变量绑定列表中的绑定为
   sysUpTime.0 [RFC3418] 和 snmpTrapOID.0 [RFC3418]。 

   如果有任何额外的变量被,那么每一个都复制到变量绑定字段。

   有两种不同的方法用于在SNMP traps中编码报警数据。第一种是使用所谓的 "颗粒状陷阱"。颗粒陷阱每个都有一个独特的对象标识符（OID）号，以便SNMP管理器可以将它们彼此区分开来。

从网络设备或代理获取SNMP陷阱的SNMP管理器将把OID存储在一个翻译文件中，这个文件被称为管理信息库或MIB。

现在，由于细粒度的traps使用唯一的数字来支持这种方法，并且所有的细节都在MIB中可用，所以SNMP trap中不需要包含有关警报的实际信息。

所以，管理者只需要OID在MIB中查询信息。

这种方式可以防止SNMP trap通过网络发送冗余信息，而且对带宽的消耗非常小。

在第二种类型中，SNMP traps可以被配置为包含有关警报的信息作为有效载荷。在这种情况下，从设备发送的所有SNMP traps都使用相同的OID，这是非常正常的。

要了解这些类型的陷阱，SNMP管理器需要分析每个Trap中包含的数据。

数据以简单的键值对配置存储在SNMP trap中。每个键值对被称为 "变量绑定"，包含与Trap相关的额外信息。

举个例子，一个SNMP trap可能有 "站点名称"、"严重性 "和 "报警描述 "的变量绑定。
*/
