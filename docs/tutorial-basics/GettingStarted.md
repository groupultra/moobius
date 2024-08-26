---
id: GettingStarted
description: To use Moobius, you have to register an account as a User. A user is always associated with a registered account. Moobius supports third-party logins like Google, but if you would like to explore the interesting features for developers, you have to register with an email and a password for now.
---

> To use Moobius, you have to register an account as a User. A user is always associated with a registered account. Moobius supports third-party logins like Google, but if you would like to explore the interesting features for developers, you have to register with an email and a password for now.

:::tip
It is recommended that you register at least 2 accounts for development purposes. In a Moobius Channel, different users can see entirely different things and you typically want to make sure you can monitor everything.
:::

As a Moobius User, you can create a Channel or join a Channel created by other Users like you do in other group chat applications (like Discord, Slack and Telegram). When a User joins a Channel, they become a Member of that Channel. A Channel is conceptually similar as a group chat where Members can interact with each other by sending Messages, including text, file, image, audio, etc.

A Channel Member can see a Character list of the Channel, which contains all subjects the Member is supposed to believe in the Channel. By default, each Character corresponds to a Member in a Channel, and every Member sees the same list of Characters.

An major difference between a Moobius Channel and a "group" in a traditional group chat software is that all Messages are targeted. When a User sends a Message, they can specify a set of Characters in the Characters list as the intended recipients (a Whisper). By default, only the intended recipients of a Message can receive the Message, and any recipient won't know whether any other Member is among the intended recipients.

:::tip
The phrase "by default" appeared twice in the previous section. This means the default behavior of a Moobius Channel not taken over by a Custom Channel Service (CCS). A Service could drastically modify a Channel's behavior, and this is a core feature of Moobius which will be introduced in later sections.
:::

You may also notice a Canvas area and a list of Buttons in some Channels you join (todo: a demo). When you right-click a Message, a pop-up Context Menu may appear. These are Moobius Components for various advanced interactions. When a Channel is taken over by a Service, the developer of the Service could make use of these Components to quickly build a light-weight "application" out of a Channel with complex user interaction logic in various use cases at ease. Such applications are known as Group Based Applications (GBA) since it takes the form of a group chat, but could be functionally equivalent to an application in its entirety.

:::tip
A Channel is the basic unit of GBAs. A User can join multiple Channels, each controlled by a different Service (like installing multiple Apps on your phone). Typically, one Channel is enough for a simple GBA. Nonetheless, in some cases, one Service could take control of more than one functionally related Channels to orchestrate a complicated GBA where User behavior in one Channel could affect other Channels.
:::

GBA is the core concept of Moobius. In the remaining part of this tutorial, you will learn how to write a program with python for a simple GBA controlling your own channel.

## Take Home Message

1. Moobius Users can create Channels and join Channels.
2. A Moobius Channel is similar as a group chat, but with enhanced features.
3. Targeted Messages (Whispers) could be sent in a Channel.
4. Certain Components could be utilized for a Channel to become a Group Based Application.
