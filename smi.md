https://en.wikipedia.org/wiki/Structure_of_Management_Information

the Structure of Management Information (SMI), an adapted subset of ASN.1, operates in Simple Network Management Protocol (SNMP) to define sets ("modules") of related managed objects in a Management Information Base (MIB).

SMI subdivides into three parts: 

- module definitions
- object definitions,
- notification definitions (aka "traps").

Module definitions are used when describing information modules. An ASN .1 macro, MODULE-IDENTITY, is used to concisely convey the semantics of an information module.

Object definitions describe managed objects. An ASN.1 macro, OBJECT-TYPE, is used to concisely convey the syntax and semantics of a managed object.

Notification definitions are used when describing unsolicited transmissions of management information. An ASN.1 macro, NOTIFICATION-TYPE, concisely conveys the syntax and semantics of a notification.

NOTE: https://blog.paessler.com/snmp-deep-dive-how-smi-contributes-to-snmp


## The Need for Independence

As you surely remember, the communication partners in an SNMP conversation are the

    managing entity and the 
    managed devices. 

They send and receive messages containing management information through the network via SNMP, no matter what operating systems, programming languages, and compilers are involved.

Obviously, independence is what you need to achieve. To be independent from operating systems, programming languages, and other sorts of components that create difference. How does SNMP become free? 

## The answer is

Structure! More precisely, a commonly understood and standardized structure, known as SMI (which stands for Structure of Management Information).

Firstly, this includes a **type-structure for the data** that you use when using SNMP, or, in other words, a definition for the description of integers, strings, OIDs, and so on. 

And secondly, you need a binary mapping structure to express what happens to these data types, i.e. you need rules for how to transmit these data types in networks. Thanks to these definitions, the format becomes clear and independent. And since the format is a known standard, any machine in your network can receive and "understand" a given piece of SNMP management information and then decide on how to store it in the format that corresponds to its architecture. Of course, these principles also apply to the sending part of the SNMP communication.

## SMI - The Structure of Management Information

Remember, for the Structure of Management Information to create independency, we need definitions for

    the data types that are used, and
    the rules that apply to the information transfer.

The definition of SMI data types is derived from ASN.1 (Abstract Syntax Notation One). We can only cover a very small and simple subset of ASN.1 here. If you want more, check out, for example, ASN.1 related ISO/OSI sources.

The ASN.1/SMI data types can be broken down into two categories: 
    simple or basic
    complex or higher-level 

Let's look at an example of both data types. 

## Basic Data Types


There's one basic data type that you must have heard about when dealing with SNMP. It is the OBJECT IDENTIFIER, or OID. The most common notation is the sequence of digits, for example

    1.3.6.1.2.1.2

This OID includes the names of the respective OID tree nodes if you note it as defined in ASN.1 (You can find out more about the actual definition of OBJECT IDENTIFIER in the table below):

    {iso(1) identified-organization(3) dod(6) internet(1) mgmt(2) mib-2(1)}

In total, there are 11 basic data types for SMI MIB modules that have been defined in RFC-2578:

    INTEGER
    Integer32
    Unsigned32
    OCTET STRING
    OBJECT IDENTIFIER
    IpAddress
    Counter32
    Counter64
    Gauge32
    TimeTicks
    Opaque
    
 Here is an insight into some data type descriptions:

    Data Type	Description
    INTEGER	    32-bit integer with a value between -2^31 and 2^31-1 inclusive, or a value from a list of possible named constant values
    OCTET STRING byte string representing arbitrary binary or textual data, up to 65,535 bytes long
    OBJECT IDENTIFIER	Its value is an ordered list of non-negative numbers, each called a sub-identifier. Maximum is 128 sub-identifiers (tuples), each one having a maximum value of 2^31-1.
    Opaque	uninterpreted ASN.1 value, needed for backward compatibility

However, these are not the only basic data types, there are many more data types out there in the internet.

## Higher Level Constructs

Remember the MIB-2, one of the most important standard MIB module for SNMP? One of its sub-MIB modules is the Interfaces-MIB file (also well known as IF-MIB). You can find it in RFC 1213. Among many others, it contains the ifPhysAddress entry, an instance of the higher-level construct OBJECT-TYPE, which is used to specify the data type, status, and semantics of a managed object, in this case the physical address of an interface.
    
    ifPhysAddress OBJECT-TYPE
         SYNTAX PhysAddress
         ACCESS read-only
         STATUS mandatory
         DESCRIPTION
              “The interface’ address at the protocol layer
              immediately ‘below’ the network layer in the
              protocol stack. For interfaces which do not have
              such an address (e.g., a serial line), this object
              should contain an octet string of zero length.”
         : := { ifEntry 6 }


PS: How do you know which OID belongs to the object ifPhysAddress? Take the OID of ifEntry and add a 6! (Umm... What is an OID?)

Other higher-level constructs are, for example, the MODULE IDENTITY and NOTIFICATION TYPE constructs. You want more? See RFC 2578.

## BER - Basic Encoding Rules

After defining the data types and constructs, it's now time to take a look at the rules that define how SMI object instances are sent through a network. They are called Basic Encoding Rules . The structure that they provide is TLV - which means Type, Length, and Value. This order is always the same. Yes, always. This way, a byte stream sent through a network is recognized immediately on every machine. Let's illustrate this with (part of) an SNMP message, say, an SNMP request. Every request needs a request ID. For our example, we will use the ID 9336.

    The question is: What are the bytes transferred in your network that convey the information 9336 in the context of an SNMP request ID?
    The answer is: The bytes transferred are 02 02 24 78 (hex), assuming **big-endian order**.

Why is that? Because 02 is Type, 02 is Length, and 24 87 is Value. And according to BER, the order is T-L-V.
What does this mean? 02 02 24 78 means that the data type is an integer (02 stands for integer) with a length of 2 bytes and a value of 9336.
 

    Binary value	0010	0010	0010  0100  0111  1000
    Bytestream (hex value)	02	02	24 87
    BER	Type	Length	Value
    Meaning	Integer	2 Bytes	9336
    Direction	→	→	→

With these rules in place, every entity in the SNMP communication knows exactly how to interpret the sent or received bytes and translate them to the defined data types and constructs, regardless of the entity's own implementation and platform.

Wrapping It Up

SMI offers a unified basis for definitions that regard the management information and their transfer in networks, for the sake of platform independence. SMI belongs to MIB and MIB belongs to SNMP. They are all inextricably tied together.

New Horizons
Stay tuned on our SNMP blog series if at least one of the following questions has already crossed your mind:

What's behind SNMP, its versions, and FCAPS?
How do I enable SNMP on Windows, Linux, or MacOS?
What exactly are OIDs and MIB and why should every admin have heard of them?
SNMP doesn't work, can somebody out there help me!?