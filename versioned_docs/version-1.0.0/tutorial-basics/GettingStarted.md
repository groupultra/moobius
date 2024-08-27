---
id: GettingStarted
description: To use Moobius, you have to register an account as a User. A user is always associated with a registered account. Moobius supports third-party logins like Google, but if you would like to explore the interesting features for developers, you have to register with an email and a password for now.
---

To use Moobius, you have to register an account as a **User**. A user is always associated with a registered account. Moobius supports third-party logins like Google, but if you would like to use it as a developer, you have to register with an email and a password for now.

:::tip
Correct terminology is critical to conveying ideas accurately. There are a lot of technical terms introduced in this tutorial, each has its specific meaning. When a term appears for the first time, it will be boldfaced, and it will almost always be capitalized in this tutorial (except when it appears in code).
:::

As a Moobius User, you can create a **Channel** or join a Channel created by other Users like you do in other group chat applications (like Discord, Slack and Telegram). When a User joins a Channel, they become a **Member** of that Channel. A Channel is conceptually similar as a group chat where Members can interact with each other by sending **Messages**, including text, file, image, audio, etc.

A Channel Member can see a list of **Characters**, which appears as a list of profiles that the user can view and choose to send Messages to. If no **Custom Channel Service (CCS)** is associated with a Channel, Moobius has a **Default Channel Service (DCS)** handling communication and display logic, where each Character corresponds to a Member in a Channel, and every Member sees the same list of Characters.

An major difference between a Moobius Channel and a "group" in a traditional group chat software is that all Messages are targeted. When a User sends a Message, they can specify a set of Characters in the Character list as the **Intended Recipients** of the Message. In the default service, only the Intended Recipients of a Message can receive the Message, and any recipient won't know whether any other Member is one of the Intended Recipients. This does not apply to CCS services, unless they implement such a feature themselves.

You may also notice a **Canvas** area and a list of **Buttons** in some Channels you join (todo: a demo). When you right-click a Message, a pop-up **Context Menu** may appear. These are Moobius components for various advanced interactions. When a Channel is taken over by a Service, the developer of the Service could make use of these Components to quickly build a light-weight "application" out of a Channel with complex user interaction logic in various use cases at ease. Such applications are known as **Group Based Applications (GBA)** since it takes the form of a group chat, but could be functionally equivalent to an application in its entirety.

:::tip
A Channel is the basic unit of GBAs. A User can join multiple Channels, each controlled by a different Service (like installing multiple Apps on your phone). Typically, one Channel is enough for a simple GBA. Nonetheless, in some cases, one Service could take control of more than one functionally related Channels to orchestrate a complicated GBA where User behavior in one Channel could affect other Channels.
:::

GBA is the core concept of Moobius. In the remaining part of this tutorial, you will learn how to write a program with python for a simple GBA controlling your own channel.
