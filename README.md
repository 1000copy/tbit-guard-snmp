## 常用MIB解析

MIB-II MIB文件为rfc1213.mib ,

	mib-2 OBJECT IDENTIFIER ::= { mgmt 1 } 
		system OBJECT IDENTIFIER ::= { mib-2 1 } 
		interfaces OBJECT IDENTIFIER ::= { mib-2 2 } 
		at OBJECT IDENTIFIER ::= { mib-2 3 } 
		ip OBJECT IDENTIFIER ::= { mib-2 4 } 
		icmp OBJECT IDENTIFIER ::= { mib-2 5 } 
		tcp OBJECT IDENTIFIER ::= { mib-2 6 } 
		udp OBJECT IDENTIFIER ::= { mib-2 7 } 
		egp OBJECT IDENTIFIER ::= { mib-2 8 } 
		transmission OBJECT IDENTIFIER ::= { mib-2 10 } 
		snmp OBJECT IDENTIFIER ::= { mib-2 11 } 

SNMPv2-MIB，包括了system,snmp,if-mib定义了interfaces,是rfc1213的一个子集MIB。
	
IF-MIB      包括了interfaces 网络设备接口名称速度物理地址状态和流量统计信息

MIB的历史承继 
 https://en.wikipedia.org/wiki/Management_information_base