---
id: Members_Characters
title: Members and Characters
---

## Members

When your Service takes over the Channel, the first thing you may notice is that your Character list is empty, even without yourself. This is not a bug! It just means that you have to tell Moobius what each Member (including yourself) sees. In this case, the Character list seen by a Member may be different from the actual “Member list” of the Channel (the ground truth), and/or different from what any other Member in the Channel sees.

Tip: When a User creates a Channel, two things happen: (1) the creator gets permission to take over the Channel with a Service using their credentials; (2) the creator automatically joins the Channel and becomes a Member of that Channel. These are two independent roles of a creator. As a Member per se, the creator is no more special than any other User joining the Channel, and the creator can even leave the Channel but remains in control of the Channel with their Service.

As the creator of a Channel, you (or your Service) always have access to the ground truth. However, it is your option (rather than obligation) as a Service provider to give out the truth to your Channel Members. Before things get complicated, let us just be simple and tell everyone the truth, so that your Channel would look like a traditional group chat.

In your service.py file, add the following methods inside ZeroService class:
async def on_channel_checkin(self, channel_id):
members = await self.fetch_member_ids(channel_id)
await self.send_characters(characters=members, channel_id=channel_id, recipients=members)
Press Ctrl + C to forcefully stop your Service, and then run it again (but DO NOT refresh your browser):
python service.py
You will see from the browser that your Character list actually updated: you are back in your Character list again. The on_channel_checkin() method is inherited from the super class Moobius, which has been predefined by the SDK and is invoked automatically as the Service starts, and periodically afterwards. In the above implementation of the method, the Service first fetches from the Moobius Platform the ground truth of the Members in the Channel using fetch_member_ids() method. The return value of the method member is a list of strings, each element of which is a character_id that uniquely defines a Character. Next, an update_characters Downward Event is sent bysend_characters() to all Members in the Channel (recipients=members), so that the Character list is updated.

However, when you refresh your browser, you will see the Character list becomes empty again. When a User refreshes the browser, the client will reload the Channel's Character list, and will send a refresh Upward Event to the Service bound to the Channel. You may see things in console logs like this:
2024-07-25 04:10:26.583 | INFO | moobius.network.ws_client:receive:128 - {"type": "action", "body": {"subtype": "refresh", "channel_id": "a95072a4-2869-41c6-a26d-a164065031df", "context": {}, "sender": "e43c5534-ccad-4f7e-b85c-d0a77b1f47b4"}}
This data is automatically parsed by the SDK as an RefreshBody dataclass object containing all the relevant fields and passed into on_refresh() method defined by Moobius class. The method is automatically invoked (triggered) whenever a refresh Event is sent by a Channel Member. Thus, if the event handler on_refresh() is implemented in your Service as follows, you can see the Character list preserves even after you refresh the browser (remember to stop and restart your Service before testing).

### triggered when the browser refreshes

async def on_refresh(self, action):
members = await self.fetch_member_ids(action.channel_id)
await self.send_characters(characters=members, channel_id=action.channel_id, recipients=action.sender)
Tip: 1. When the Channel is re-rendered by the browser client, it assumes no Characters, Buttons, or Canvas in the Channel until it receives a corresponding update event (the history Messages is an exception to this rule. It is fetched from the Moobius Platform which does not involve Service). Furthermore, if a User has joined multiple Channels and switches back and forth in the browser, a refresh Event will be sent each time the current Channel gains focus. 2. The recipients argument of send_characters() can be alist(with any number of recipients) or astr type (when there is only one recipient, it is not mandatory to make it a list). A similar design appears in the SDK in methods like send_buttons(). This flexibility simplifies developing your CCS app.

## Agents

Now that you know how to tell the truth of who is in the Channel to all Members, let's explore more power of yourself. As you may already know, a striking feature of Moobius is its ability to create any number of Characters that do not exist (do not coorespond to user accounts). These Characters are also known as Agents. Unlike Members, an Agent is not associated with a Moobius User account, and does not directly correspond to any real User.

As the creator of the Channel, only you know which Characters are "real" and which are "virtual", and you are more than encouraged to keep it to yourself, or use it wisely (and create a unique experience to your Users). Of course, the Moobius Platform knows it, too, but the Platform will never give out "official" labels of Member/Agent, at communication protocol level (which means such information will not be sent to the frontend client at all, even when Users try to use F12 to analyze the data packages).

Tip: The workflow of creating an Agent is amazingly simple. Most group chat applications (like Discord and Slack) provide "bot" features, but you would typically need far more effort to make a bot work properly, and the flexibility of bots is obviously less. Furthermore, a User won't technically tell an Agent from a Member when their Character list contains both types. You can provide hints by providing different style of avatar/name of your Agents, but this is up to you. In extreme cases, an Agent could be created based on a Member's profile (name, avatar, description, etc), and looks all the same (but with different character_id). Controversial as it may be, this is where our value of human-AI mixture resides.

To create an Agent, you need to find an image (preferably square-shaped) as its avatar (otherwise it will use default avatar), and give it a name and description (optional). Such information will be shown to Users seeing the Agent as they appear in real Members (of course).

Let's create a resources directory under your project directory, and put an image avatar.png inside it (of course you can use any image you like, and not necessarily in png format).
