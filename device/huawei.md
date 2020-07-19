## 设置huawei OLT的trap

设置trap host

display snmp-agent target-host
snmp-agent target-host trap-hostname reco address 10.27.10.80 trap-paramsname test
display system handshake
config
system handshake enable
system handshake interval 10


##  接收trap

打开软件 mib browser ，点击菜单
 
 | menu - tools - trap-receiver 
 
点击绿色的run图标，可以每隔几分钟接收到华为发过来的uptime信息。


## 需要工具

- telnet | nc
- snmpwalk for linux 或者
- iReasoning MIB Brower 
- Huawei OLT MT5680T
- 一根网线，用来连接Linux 到

##  连接方式

网线直连控制板的当前激活版的eth网口
本机地址配置和OLT的地址在同一个网段，比如ifconfig eth0 10.11.1.99 netmask 255.255.255.0
使用telnet 访问，比如telnet 10.11.1.98
或者使用nc替代telnet，因为前者的命令输入错可以通过backspace删除，而telnet是没有办法的。太不方便。nc 10.11.1.98 23 使用nc需要自己指定端口，这里的telnet端口为23。

当前版本ubuntu的eth0，都改为了这样的名字，ens6s0。请留意，使用ifconfig先查询eth0的名字。

## 远程登录到OLT

用户名和密码 ，默认是root/admin123

    nc 10.11.1.98 23

进入配置模式

    enable
    config

可以使用命令修改用户密码,按照提示即可修改root默认密码：

    terminal user password 

## 配置snmp

snmp命令为snmp-agent，需要设置snmp版本

    snmp-agent sys-info version 1

和可读团体名，版本和团体名称必须在snmp-client提供，并且必须和snmp-agent内设置的一致。

    snmp-agent community read public
    
此处会报一个错误：

    "Failure: The user password must be equal to or more than 8 characters"

需要执行命令，撤销当前的安全级别：

    undo system snmp-user password security

退出。开始客户端验证

## 客户端

    snmpwalk -v1 -c public 10.11.1.98 .1
    
你会看到一堆输出。那就对了。不然就是no response。我遇到的问题就是public团体没有设置成功导致的。

## 连通后可以做的

换不同的参数，看输出结果。

note from : https://ixnfo.com/en/oid-and-mib-for-huawei-olt-and-onu.html

    snmpwalk -v 2c -c public 192.168.1.10 .1

The following is a list of OIDs and a brief description of them.

ONT Description:

    .1.3.6.1.4.1.2011.6.128.1.1.2.43.1.9
    Name lineprofile:
    
    .1.3.6.1.4.1.2011.6.128.1.1.2.43.1.7
    Name ont-srvprofile:
    

    .1.3.6.1.4.1.2011.6.128.1.1.2.43.1.8
    Optical power ONU:
    
    ONT RX Power:
    

    .3.6.1.4.1.2011.6.128.1.1.2.51.1.4
    OLT RX Power:
    

    .1.3.6.1.4.1.2011.6.128.1.1.2.51.1.6
    ONT in byte:
    

    .1.3.6.1.4.1.2011.6.128.1.1.4.23.1.4
    ONT out byte:
    

    .1.3.6.1.4.1.2011.6.128.1.1.4.23.1.3
    ONT Mac/Serial:
    

    .1.3.6.1.4.1.2011.6.128.1.1.2.43.1.3
    Board temperature:
    

    .3.6.1.4.1.2011.2.6.7.1.1.2.1.10 (hwMusaBoardTemperature)
    Slot temperature:
    

    .3.6.1.4.1.2011.6.3.3.2.1.13 (hwSlotTemprature)
    Loading of processors of boards:
    

    .3.6.1.4.1.2011.2.6.7.1.1.2.1.5 (hwMusaBoardCpuRate)
    Frame power:
    

    .3.6.1.4.1.2011.2.6.7.1.1.1.1.11 (hwMusaFramePower)
    Slot table:
    

    .3.6.1.4.1.2011.6.3.3.2 (hwSlotTable)
    The status of the link of the GPON ports (Online – 1, Offline – 2):
    

    .3.6.1.4.1.2011.6.128.1.1.2.21.1.10 (hwGponDeviceOltControlStatus)
    Vlan status (up/down):
    

    .3.6.1.4.1.2011.5.6.1.2.1.5 (hwVlanInterfaceAdminStatus)
    ONT Status (Online – 1, Offline – 2):
    
    .1.3.6.1.4.1.2011.6.128.1.1.2.46.1.15
    .1.3.6.1.4.1.2011.6.128.1.1.2.62.1.22 (hwGponDeviceOntEthernetOnlineState)
    Optical temperature ONT:
    

    .3.6.1.4.1.2011.6.128.1.1.2.51.1.1 (hwGponOntOpticalDdmTemperature)
    The number of mac addresses connected to ONT:
    

    .3.6.1.4.1.2011.6.128.1.1.2.46.1.21 (hwGponDeviceOntControlMacCount)
    Distance to ONT:
    

    .3.6.1.4.1.2011.6.128.1.1.2.46.1.20 (hwGponDeviceOntControlRanging)
    Uptime OLT:
    

    .3.6.1.2.1.1.3 (sysUpTime)
    Total number of SNMP packets to OLT:

    .3.6.1.2.1.11.1 (snmpInPkts)
    .3.6.1.2.1.11.2 (snmpOutPkts)
    A few more OIDs:
    

    hwMaxMacLearn 1.3.6.1.4.1.2011.5.14.1.4.1.6
    hwMacExpire 1.3.6.1.4.1.2011.5.14.1.3
    hwOpticsMDWaveLength 1.3.6.1.4.1.2011.5.14.6.1.1.15
    hwOpticsMDVendorName 1.3.6.1.4.1.2011.5.14.6.1.1.11
    hwRingCheckAdminStatus 1.3.6.1.4.1.2011.5.21.1.7
    hwVlanInterfaceID 1.3.6.1.4.1.2011.5.6.1.2.1.1
    hwVlanInterfaceTable 1.3.6.1.4.1.2011.5.6.1.2
    hwVlanName 1.3.6.1.4.1.2011.5.6.1.1.1.2
    icmpInEchos 1.3.6.1.2.1.5.8
    ipAddrEntry 1.3.6.1.2.1.4.20.1

## 一个德国的ISP用户给出的方案

note from : https://ispforum.cz/viewtopic.php?t=23544

## "Failure: The user password must be equal to or more than 8 characters"

snazim se nastavim snmp communitu v SmartAX MA5608T (verze: MA5600V800R017C10) a nechce me to pustit pres hlasku pri prikazu:
MA5608T(config)#snmp-agent community read public
"Failure: The user password must be equal to or more than 8 characters"

projel jsem dokumentaci a nikde nic. Nastavil jsem tedy pro vsechny loginy komplexni heslo o vetsi delce nez 8 znaku. Tovarni nastaveni, nastaveni hesel ale bez zmeny vysledku.
Omezeni verze snmp na v1 stale stejna hlaska. Nikde jsem o tom nenasel zadne info.
Nejake zkusenosti ci navrhy co vyzkouset?

##

resi to prikaz:
    
    undo system snmp-user password security

nebot huawei v defaultu vyzaduje komplexnejsi nazvy komunit.

## 配置trap

巨长的命令，必须记录下来才可以：

     snmp-agent community read  public123
     snmp-agent community write private123
     snmp-agent sys-info version v2c
     snmp-agent target-host trap-hostname huawei address 192.168.0.188 udp-port 162  trap-paramsname ABC
     snmp-agent target-host trap-paramsname ABC v2C securityname private123
     snmp-agent trap enable standard
     save
     
其中关键是第三行设置版本为v2c，以及4,5行两个命令的trap-paramsname ABC 必须一致，配置目标主机地址192.168.0.188 。配置完毕可以通过如下命令检查配置:

    display snmp-agent target-host 
    
在接受trap的主机输入命令

    sudo snmptrapd --f -Le
    
应该看到ups报警，像是这写关键字的：
    
    3.6.1.6.3.1.1.4.1.0 // 类型trap报警 snmpTrapOID
    1.3.6.1.4.1.2011.2.13 // ups 报警
    
等就说明配置成功。其中的这个常常的数字字符串，表达的是如下信息，具体信息1：
    
    3.6.1.6.3.1.1.4.1.0 – this is the snmpTrapOID, identifying the type of trap. However as opposed to RFC 3877 style traps the trap type is not defined in RFC 3877, this is because we created this type of trap ourselves- it’s a CLEARWATER-ENTERPRISE-MIB::alarmTrap.

具体信息2：

    ups	OBJECT IDENTIFIER	::= { hwProducts 13  }	 
    -- 1.3.6.1.4.1.2011.2.13
    -- iso(1). org(3). dod(6). internet(1). private(4). enterprises(1). huawei(2011). hwProducts(2). ups(13)
    
有一个数据库，可以查看所有的HW的MIB OID：

    http://www.mibdepot.com/cgi-bin/getmib3.cgi?win=mib_a&i=1&n=HUAWEI-MIB&r=huawei&f=HUAWEI-MIB-V3.29.mib&v=v2&t=def#ups
    
顺便学习下删除刚刚建立的target-host：

    undo snmp-agent target-host trap-paramsname ABC

