var snmp = require ("net-snmp");
var session = snmp.createSession ("127.0.0.1", "public",{version:1}); // version 1 - version 2c
var prefix = '1.3.6.1.4.1.66666.'
var oids = [prefix+"1.1.0"];//postfix .0,else agent will error info "Instance node has provider which should never happen"

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }    
    session.table (prefix+"2.2", function (error, table) {
        if (error) {
            console.error (error);
        } else {
            console.log (table);
        }
        session.close ();
    });
});
// snmptable -v 2c -c public  localhost .1.3.6.1.2.1.2.2
/*
    $node snmpclient.js
    1.3.6.1.2.1.1.1.0 = Rage inside the machine!
    {
      '1': { '1': 1, '2': <Buffer 6c 6f>, '3': 24 },
      '2': { '1': 2, '2': <Buffer 65 74 68 30>, '3': 6 }
    }

    node snmp-table.js -v 2c -c public localhost 1.3.6.1.2.1.2.2
*/
