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

## 正文

今天在园区走了走，然后突然想明白了几天来思考的snmp trap的逻辑。结合若干工具

1. node包node-net-snmp
2. mib browser 
3. 一个我写的mib文件，其中有一个oid，和一个trap oid，指向对象为第一个oid

把这个过程run成功。快速记录下。


# 先准备好接收snmp trap的应用

下载node-net-snmp 的源代码库，然后：

        cd example    
        node snmp-receiver.js -v

其中-v表示输出要罗嗦一点，这样我们才看得到具体的trap内容。

# 通过mib browser记载mib文件，并发送trap到本机的trap接收器

![](a.png)
![](b.png)

# output 
        
        2020-4-9 17:46:09: TrapV2 received:
        {
          "pdu": {
            "type": 167,
            "id": 402812005,
            "varbinds": [
              {
                "oid": "1.3.6.1.2.1.1.3.0",
                "type": 67,
                "value": 0
              },
              {
                "oid": "1.3.6.1.6.3.1.1.4.1.0",
                "type": 6,
                "value": "1.3.6.1.4.1.66666.3"
              },
              {
                "oid": "1.3.6.1.4.1.66666.1.1.0",
                "type": 4,
                "value": {
                  "type": "Buffer",
                  "data": [
                    97,
                    98,
                    99,
                    100
                  ]
                }
              }
            ],
            "scoped": false
          },
          "rinfo": {
            "address": "127.0.0.1",
            "family": "IPv4",
            "port": 63984,
            "size": 90
          }
        }
        
# 解释

varbinds共三个，其中
1. oid "1.3.6.1.2.1.1.3."表示sysuptime,每个trap都会发的varbind
2. oid “1.3.6.1.6.3.1.1.4.1”表示trap本身的oid指向。mib文件内定义的dataAlarmTrap.objects内的名称指向的就是此名称都用的oid。
3. oid "1.3.6.1.4.1.66666.1.1"就是trap的oid本身的新的值。value中每个"data": [97，98，99，100 ]是数字的asccii表达，可以toString()获取它的字符串

# 附录：MIB文件内容

    tbit DEFINITIONS ::= BEGIN
        IMPORTS
            enterprises, IpAddress, Integer32, Unsigned32, Counter64, 
            OBJECT-TYPE,NOTIFICATION-TYPE
                FROM SNMPv2-SMI;
        tbit OBJECT IDENTIFIER ::= { enterprises 66666 }
        RecoDevice OBJECT IDENTIFIER ::= { tbit 1 }
        RecoDevice1 OBJECT IDENTIFIER ::= { tbit 2 }
        Name OBJECT-TYPE
            SYNTAX OCTET STRING
            MAX-ACCESS read-write
            STATUS current
            DESCRIPTION
                "Description."
            ::= { RecoDevice 1 }
    	dataAlarmTrap NOTIFICATION-TYPE
    			OBJECTS { Name }
    			STATUS current
    			DESCRIPTION 
    				"Description."
    			::= { tbit 3 }
    END
    
    			
## fan状态监控 - 芯德第一个trap

看到这个设备可以trap的OID还是不少，希望从最简单的开始。我选择的是风扇。基本流程就是：

1. 设置好守护进程，准备接受设备发过来的trap
2. 在设备内填写trap 目标地址，也就是守护进程所在的电脑的ip
3. 在设备内激活fan状态改变通知到trap
4. 反复对设备fan的激活关闭，查看守护进程输出结果

现在开始。

首先准备好trapd，具体做法在此，记得一定使用-v参数，打印具体发过来的trap： 
    
    https://github.com/1000copy/tbit-guard-snmp
    

把自己的trapd所在电脑的ip地址设置到对应设备的snmptrap配置内

![](https://user-gold-cdn.xitu.io/2020/4/26/171b55f76cf3b9fb?w=453&h=245&f=png&s=12516)

还有必须在telnet命令行内，激活fan状态改变通知,因为对fan的all激活，因此状态变化时，会打印到terminal，也会trap发出到制定的trapd守护进程：


    alarm fan all enable

打印出来的varbinds内容很多，看着茫然无须，乱翻手册，看到在芯德的MIB手册内，58页面，也是最后一页，提到了发送trap的格式:

    dataUpLinkPort,dataPon, dataOnu, dataPort, dataTrapOID, dataTrapClass, 
    dataMac, dataTime, dateAlarmLevel, dataValue, dataAlarmType,
    dataSynOID

再使用Web UI打开风扇，

![](https://user-gold-cdn.xitu.io/2020/4/26/171b55dcafc85116?w=408&h=141&f=png&s=7229)


VarBinds内的第10个对象就是DataValue，我们希望buffer是一个字符串，值为”Close!“，结果不负期待：
    
    {
        "oid": "1.3.6.1.4.1.37950.1.1.5.10.13.2.10.0",
        "type": 4,
        "value": {
          "type": "Buffer",
          "data": [67,08,11,15,01,33]
        }
    },
    
    var b = Buffer.from([67,08,11,15,01,33]).toString() // Close!

再使用Web UI打开风扇，打印输出的结果：

    > var b = Buffer.from([79,112,101,110, 33]).toString()
    undefined
    > b
    'Open!'

## translate

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
