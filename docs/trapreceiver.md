发送一个trap无比简单：

    var snmp = require ("../");
    var session = snmp.createSession ("127.0.0.1", "public");
    session.trap (snmp.TrapType.LinkUp, function (error) {
        if (error)
            console.error (error);
    });
    
可以使用mib browser内的trap receiver 接收：


![](https://user-gold-cdn.xitu.io/2020/7/3/17312a567979682b?w=608&h=342&f=png&s=20771)

或者自己编写代码接收：

    var snmp = require ("../");
    var cb = function(error, trap) {
        var now = new Date().toLocaleString();
        var trapType;
        if (error) {
            console.log(now + ": " + error.message);
        } else {
            trapType = snmp.PduType[trap.pdu.type] || "Unknown";
            if ( true ) {
                console.log (now + ": " + trapType + " received:");
                console.log (JSON.stringify(trap, null, 2));
            } else {
                if (trap.pdu.type == snmp.PduType.Trap ) {
                    console.log (now + ": " + trapType + ": " + trap.rinfo.address + " : " + trap.pdu.enterprise);
                } else {
                    console.log (now + ": " + trapType + ": " + trap.rinfo.address + " : " + trap.pdu.varbinds[1].value);
                }
            }
        }
    }
    var receiver = snmp.createReceiver({}, cb);
    var authorizer = receiver.getAuthorizer ();
    authorizer.addCommunity ("public");
