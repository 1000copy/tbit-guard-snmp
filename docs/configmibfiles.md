

很多snmp测试和验证场景，看这些就够了

## 翻译name和oid

	$ snmptranslate -On SNMPv2-MIB::system.sysContact.0
	.1.3.6.1.2.1.1.4.0

	$ snmptranslate .1.3.6.1.2.1.1.4.0
	SNMPv2-MIB::sysContact.0

## 获取oid值

$ snmpget -v2c -cpublic12 10.27.10.195 .1.3.6.1.2.1.1.4.0
SNMPv2-MIB::sysContact.0 = STRING: ddaaa

## 设置oid值

	$ snmpset -v2c -cprivate12 10.27.10.195 .1.3.6.1.2.1.1.4.0 s "hellocat3"
	SNMPv2-MIB::sysContact.0 = STRING: hellocat3

	$ snmpget -v2c -cpublic12 10.27.10.195 .1.3.6.1.2.1.1.4.0
	SNMPv2-MIB::sysContact.0 = STRING: hellocat3

## 前缀

前缀可以使用mib文件名，会在mib 默认目录内查找mib文件

	snmpset -v2c -cprivate12 10.27.10.195 SNMPv2-MIB::sysContact.0 s "hellocat3"

	$ snmpget -v2c -cpublic12 10.27.10.195 SNMPv2-MIB::sysContact.0
	SNMPv2-MIB::sysContact.0 = STRING: hellocat55


因为这个五年级特别常用，也可以使用system

	snmpset -v2c -cprivate12 10.27.10.195 system.sysContact.0 s "hellocat3"

## 查询mibs目录

到底netsnmp在哪里查找mib文件？可以执行命令获知：

	sudo apt install libsnmp-dev
	net-snmp-config --default-mibdirs

获得目录表：

	ls /home/reco/.snmp/mibs
	ls /usr/share/snmp/mibs
	ls /usr/share/snmp/mibs/iana
	ls /usr/share/snmp/mibs/ietf
	ls /usr/share/mibs/site
	ls /usr/share/snmp/mibs
	ls /usr/share/mibs/iana
	ls /usr/share/mibs/ietf
	ls /usr/share/mibs/netsnmp

其中三个目录有货

	ls /usr/share/snmp/mibs
	ls /usr/share/snmp/mibs/ietf
	ls /usr/share/snmp/mibs/iana

大名鼎鼎的ietf是mibs大户，上文用到的SNMPv2-MIB就在这个目录内。目录ls /usr/share/snmp/mibs是net-snmp的私货，有些就是使用案例，比如：

	/usr/share/snmp/mibs/NET-SNMP-EXAMPLES-MIB.txt 


玩玩SNMP，第一个命令就是snmptranslate吧。执行下：

    snmptranslate .1.3.6.1.4.1
如果返回的是
    iso.3.6.1.4.1
    
就说明MIB没有加载。而且Ubuntu默认是没有MIB的。怎么办？

    
### downloads common SNMP MIBs:

    sudo apt-get install snmp-mibs-downloader

### tells Ubuntu to load SNMP MIB files:

    sudo sed -i 's/mibs :/# mibs :/g' /etc/snmp/snmp.conf

标注掉mibs就可以加载MIBS文件了。如下是此文件的说明：

    # As the snmp packages come without MIB files due to license reasons, loading
    # of MIBs is disabled by default. If you added the MIBs you can reenable
    # loading them by commenting out the following line.
    # mibs :

Now you should be able to lookup your SNMP OIDs and MIBs:

    $ snmptranslate -On -IR ifTable
    .1.3.6.1.2.1.2.2
    $ snmptranslate .1.3.6.1.2.1.2.2
    IF-MIB::ifTable
    
想知道找个下载器把MIB放到哪里了吗？请执行命令查找：

    sudo apt install libsnmp-dev
    net-snmp-config --default-mibdirs

MIB文件肯定在列出的文件夹中

cont.

https://gtcsq.readthedocs.io/en/latest/py_doc/pysnmp_doc.html#

##  TROUBLESHOOTING : Exposing CPU and Memory Information via SNMP

    snmpget -v2c -cpublic localhost  UCD-SNMP-MIB:ssCpuIdle
    UCD-SNMP-MIB::ssCpuIdle = No Such Object available on this agent at this OID

RESULT:

    Issue
    How do I expose CPU and memory statistics via SNMP? What is the MIB/OID?
    Environment
    Cumulus Linux, all versions
    Resolution
    The relevant OIDs are:
    CPU: .1.3.6.1.4.1.2021.11 (UCD-SNMP-MIB::systemStats)
    Memory: .1.3.6.1.4.1.2021.4 (UCD-SNMP-MIB::memory)
    To configure SNMP to expose CPU and memory information:
    
    If snmpd has not already been enabled, follow instructions in the technical documentation to enable and start snmpd.
    Allow access to the OIDs by editing /etc/snmp/snmpd.conf. The following example adds the relevant MIBs to the systemonly view.
    
    ###############################################################################
    #
    #  ACCESS CONTROL
    #
    <CONFIGURATION_TRUNCATED/>
    # Cumulus specific
    view   systemonly  included   .1.3.6.1.4.1.40310.1
    view   systemonly  included   .1.3.6.1.4.1.40310.2
    # Memory utilization
    view   systemonly  included   .1.3.6.1.4.1.2021.4 
    # CPU utilization
    view   systemonly  included   .1.3.6.1.4.1.2021.11
    Restart snmpd to reload the configuration:
    
    cumulus@switch:~$ sudo service snmpd restart
