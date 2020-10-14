//  用法：
// info 
// nodemon agent.js
// snmpget -v2c -cpublic localhost 1.3.6.1.4.1.66666.1.0
// snmpset -v2c -cprivate localhost 1.3.6.1.4.1.66666.1.0 i 43
// nodemon trapd.js 接收通知
/*2020-10-14 2:08:27 ├F10: PM┤: InformRequest received:
[
  {
    "oid": "1.3.6.1.2.1.1.3.0",
    "type": 67,
    "value": 100
  },
  {
    "oid": "1.3.6.1.6.3.1.1.4.1.0",
    "type": 6,
    "value": "1.3.6.1.4.1.66666.1"
  },
  {
    "oid": "1.3.6.1.4.1.66666.1",
    "type": 2,
    "value": 5034
  }
]*/
//  使用MIB在客户端的用法
// snmpget -v2c -cpublic localhost tbitinc::RecoSecret.0
// snmpset -v2c -cprivate localhost tbitinc::RecoSecret.0 i 46
// snmptranslate -On tbitinc::RecoSecret.0
// snmptranslate -mALL 1.3.6.1.4.1.66666.1
// -mALL 加载所有在目录内的MIB，必须明确说明加载。否则它不加载的。

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
    authorizer.addUser ({
        name: "fred",
        level: snmp.SecurityLevel.noAuthNoPriv
    });
    var acm = authorizer.getAccessControlModel ();
    // Since read-only is the default, explicitly setting read-only access is not required - just shown here as an example
    acm.setCommunityAccess ("public", snmp.AccessLevel.ReadOnly);
    acm.setCommunityAccess ("private", snmp.AccessLevel.ReadWrite);
    acm.setUserAccess ("fred", snmp.AccessLevel.ReadWrite);
// provider
var scalarProvider = {
    name: "RecoSecret",
    type: snmp.MibProviderType.Scalar,
    oid,
    // scalarType: snmp.ObjectType.OctetString,
    scalarType: snmp.ObjectType.Integer,    
    handler: function (mibRequest) {
       // e.g. can update the MIB data before responding to the request here
       if (mibRequest.operation == 163 ){
            console.log(mibRequest.setValue)
            if ( mibRequest.setValue > 45)
            {                
                var target = '127.0.0.1'
                var community = 'public'
                var options = {version: snmp.Version2c};
                var a = function(){
                    var session = snmp.createSession (target, community, options);
                    // session.inform ( typeOrOid, {upTime: upTime,...varbinds},
                    console.log('inform')
                    var varbinds = [{
                            oid,
                            type: snmp.ObjectType.Integer,
                            value: mibRequest.setValue,
                        }]
                    session.inform ( oid, varbinds,{upTime: 100},
                            function (error, varbinds) {
                        if (error) {
                            console.error (error.toString ());
                        }
                    }); 
                }
                a()
            }
           
       }
       mibRequest.done ();
    }
};
agent.registerProvider (scalarProvider);
var mib = agent.getMib ();
mib.setScalarValue ("RecoSecret", 42);
