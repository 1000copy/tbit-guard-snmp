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
