## fan状态监控 - 芯德第一个trap

看到这个设备可以trap的OID还是不少，可以在控制台键入命令alarm来查看trap清单。放在这里备查：

	 alarm
	  all                       Specify all alarm events.
	  download-file-failed      Specify download file failed alarm.
	  upload-file-failed        Specify upload file failed alarm.
	  upgrade-file-failed       Specify upgrade file failed alarm.
	  pon-disable               Specify pon disable alarm.
	  onu-om-lao-detect         Specify onu laser always on alarm.
	  onu-om-lol-detect         Specify onu laser overlapping alarm.
	  dhcp-sn-illegal-server    Specify dhcp sn illegal server alarm.
	  onu-vlan-pool             Specify onu vlan pool alarm.
	  onu-number-limit          Specify onu auth license alarm.
	  onu-time-limit            Specify olt running license alarm.
	  onu-sn-conflict           Specify onu sn conflict alarm.
	  onu-offline-timeout       Specify onu offline timeout alarm.
	  mac-flapping              Specify mac flapping alarm.
	  port-link-flap            Specify port link flap alarm.
	  fan                       Specify olt fan open or close alarm.
	  port-updown               Specify olt lan port up or down alarm.
	  port-loopback             Specify olt uplink port loopback alarm.
	  pon-register-failed       Specify pon register failed alarm.
	  pon-deregister            Specify pon deregister alarm.
	  onu-deregister            Specify onu deregister alarm.
	  onu-link-lost             Specify onu los link alarm.
	  onu-illegal-register      Specify onu illegal register alarm.
	  onu-auth-failed           Specify onu auth fail alarm.
	  onu-mac-conflict          Specify onu mac conflict alarm.
	  onu-loid-conflict         Specify onu loid conflict alarm.
	  onu-critical-event        Specify onu critical event alarm.
	  onu-dying-gasp            Specify onu dying gasp alarm.
	  onu-link-fault            Specify onu link fault alarm.
	  onu-link-event            Specify onu link event alarm.
	  onu-event-notific         Specify onu event notific alarm.
	  onu-pon-rxpower-high      Specify onu pon rx power high alarm.
	  onu-pon-rxpower-low       Specify onu pon rx power low alarm.
	  onu-pon-txpower-high      Specify onu pon tx power high alarm.
	  onu-pon-txpower-low       Specify onu pon tx power low alarm.
	  onu-pon-txbias-high       Specify onu pon tx bias high alarm.
	  onu-pon-txbias-low        Specify onu pon tx bais low alarm.
	  onu-pon-vcc-high          Specify onu pon vcc high alarm.
	  onu-pon-vcc-low           Specify onu pon vcc low alarm.
	  onu-pon-temp-high         Specify onu pon temp high alarm.
	  onu-pon-temp-low          Specify onu pon temp high alarm.
	  onu-port-autoneg-failure  Specify onu port auto neg failure alarm.
	  onu-port-los              Specify onu port los alarm.
	  onu-port-failure          Specify onu port failure alarm.
	  onu-port-loopback         Specify onu port loopback alarm.
	  onu-pots-failure          Specify onu pots failure alarm.
	  pon-txpower-high          Specify pon tx power high alarm.
	  pon-txpower-low           Specify pon tx power low alarm.
	  pon-txbias-high           Specify pon tx bias high alarm.
	  pon-txbias-low            Specify pon tx bias low alarm.
	  pon-vcc-high              Specify pon vcc high alarm.
	  pon-vcc-low               Specify pon vcc low alarm.
	  pon-temp-high             Specify pon temp high alarm.
	  pon-temp-low              Specify pon temp low alarm.
	  pon-los                   Specify pon link down alarm.
	  temp-high                 Specify olt temperature high alarm.
	  temp-low                  Specify olt temperature low alarm.
	  cpu-usage-high            Specify olt cpu usage alarm.
	  mem-usage-high            Specify olt mem usage alarm.
	  debug                     debug flag.
	  oamlog                    Specify onu oam log.


但是我希望从最简单的开始。我选择的是风扇。基本流程就是：

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
