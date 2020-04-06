假设已经完成了一个mib编写，名字为tbit.mib。其中就定义了一个对象标识符tbit：

    tbit DEFINITIONS ::= BEGIN
        IMPORTS
            enterprises, IpAddress, Integer32, Unsigned32, Counter64, 
            OBJECT-TYPE         
                FROM SNMPv2-SMI;
        tbit OBJECT IDENTIFIER ::= { enterprises 66666 }
    END

如果我希望net-snmp库的系列命令可以引入此MIB文件。

具体做法

## 把tbit.mib放到mibs目录内。

MIB文件有一个默认的位置，在不同的系统可能不同。可以使用命令查询

    net-snmp-config --default-mibdirs
    /Users/lcjun/.snmp/mibs:/usr/local/share/snmp/mibs:/usr/share/snmp/mibs

把tbit.mib放到mibs目录内。使mibs文件生效。我把它放到此目录内:

    /usr/share/snmp/mibs/中

## 加载模块
加载模块需要在snmp.conf文件内定义，首先snmp.conf在此：/etc/snmp/snmp.conf,没有就创建即可。文件内写入：

    mibs +ALL 

即可加载指明目录内的全部mib文件。精细控制的方法是一个个的文件的指定加载，像是这样：

    mibs +IF-MIB
    mibs +IP-MIB
    mibs +SOME-OTHER-SPIFFY-MIB

## 执行查询验证

  $ snmptranslate  -On SNMPv2-SMI::enterprises.tbit
  .1.3.6.1.4.1.66666

  $snmptranslate .1.3.6.1.4.1.66666
  tbit::tbit

