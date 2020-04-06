snmpwalk -v3   -u fred localhost  .1

	Air:tbit-guard-snmp lcjun$ snmpwalk -v3   -u fred localhost .1
	tbit::Name.0 = STRING: "Rage inside the machine!"
	tbit::RecoPonInx.1 = INTEGER: 1
	tbit::RecoPonInx.2 = INTEGER: 2
	tbit::RecoOnuInx.1 = Wrong Type (should be INTEGER): STRING: "lo"
	tbit::RecoOnuInx.2 = Wrong Type (should be INTEGER): STRING: "eth0"
	tbit::RecoOnuPName.1 = Wrong Type (should be OCTET STRING): INTEGER: 24
	tbit::RecoOnuPName.2 = Wrong Type (should be OCTET STRING): INTEGER: 6
	tbit::RecoOnuPName.2 = No more variables left in this MIB View (It is past the end of the MIB tree)

snmpwalk -v3   -u fred1 localhost .1

	Timeout: No Response from localhost

snmpwalk -v3  -l authNoPriv -u betty -a SHA -A "illhavesomeauth" localhost .1


snmpwalk -v3  -l authPriv -u wilma -a SHA -A "illhavesomeauth"  -x DES -X "andsomepriv" localhost .1

