# 附录：MIB文件内容

	  tbit DEFINITIONS ::= BEGIN
	    IMPORTS
		enterprises, IpAddress, Integer32, Unsigned32, Counter64, 
		OBJECT-TYPE,NOTIFICATION-TYPE
		    FROM SNMPv2-SMI;
	    tbit OBJECT IDENTIFIER ::= { enterprises 66666 }
	    RecoDevice OBJECT-TYPE ::= { tbit 1 }
	    RecoDevice1 OBJECT IDENTIFIER ::= { tbit 2 }    
		dataAlarmTrap NOTIFICATION-TYPE
				OBJECTS { Name }
				STATUS current
				DESCRIPTION 
					"Description."
				::= { tbit 3 }
	END
    
    			



## 把我自己的mib文件放到搜索目录

	$ cd  /home/reco/.snmp/mibs
	bash: cd: /home/reco/.snmp/mibs: No such file or directory
	$ mkdir  /home/reco/.snmp/mibs -p
	$ cd  /home/reco/.snmp/mibs
	$ vi
	>>paste file content here
	
## 注意

前缀不是文件名，是模块名

	$ snmptranslate -On reco.mib::tbit.RecoDevice
	reco.mib::tbit.RecoDevice: Unknown Object Identifier (Sub-id not found: (top) -> reco)

前缀是模块名

	$ snmptranslate -On tbit::tbit.RecoDevice.0
	.1.3.6.1.4.1.66666.1.0
	$ snmptranslate -On tbit::tbit.RecoDevice1.0
	.1.3.6.1.4.1.66666.2.0
	$ snmptranslate -On tbit::tbit.RecoDevice.Name.0
	.1.3.6.1.4.1.66666.1.1.0
	$ snmptranslate -On tbit::tbit.dataAlarmTrap
	.1.3.6.1.4.1.66666.3

## 遍历

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

## v3访问方法

snmpwalk -v3  -l authNoPriv -u betty -a SHA -A "illhavesomeauth" localhost .1
snmpwalk -v3  -l authPriv -u wilma -a SHA -A "illhavesomeauth"  -x DES -X "andsomepriv" localhost .1

