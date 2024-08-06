---
id: Characters
---

## Members vs Characters

When your Service takes over the Channel, the first thing you may notice is that your Character list is empty, even without yourself. It is not a bug as you might think, but rather a reflection of what fancy things Moobius can do. In this case, the Character list seen by a Member may be different from the actual Member list of the Channel (the ground truth), and/or different from what any other Member in the Channel sees.

:::tip
When a User creates a Channel, two things happen: (1) the creator gets permission to take over the Channel with a Service using their credentials; (2) the creator automatically joins the Channel and becomes a Member of that Channel. These are two independent roles of a creator. As a Member per se, the creator is no more special than any other User joining the Channel, and the creator can even leave the Channel but remains in control of the Channel with their Service.
:::

As the creator of a Channel, you (or your Service) always have access to the ground truth. However, it is your option (rather than obligation) as a Service provider to give out the truth to your Channel Members. Before things get complicated, let us just be simple and tell everyone the truth, so that your Channel would look like a traditional group chat.

In your `service.py` file, add the following methods inside `ZeroService` class:

```python
# fetch ground truth of Member list from Moobius and send it to all Members
# automatically called when the Service starts
async def initialize_channel(self, channel_id):
    members = await self.fetch_member_ids(channel_id)
    await self.send_update_characters(character_ids=members, channel_id=channel_id, recipients=members)
```

Press `Ctrl + C` to forcefully stop your Service, and then run it again (but DO NOT refresh your browser):

```shell
python main.py
```

You will see from the browser that your Character list actually updated: you are back in your Character list again. The `initialize_channel()` method is inherited from the super class `Moobius`, which has been predefined by the SDK and is invoked automatically as the Service starts. In the above implementation of the method, the Service first fetches from the Moobius Platform the ground truth of the Members in the Channel using `fetch_member_ids()` method. The return value of the method member is a list of string, each element of which is a `character_id` that uniquely defines a Character. Next, an update_characters Downward Event is sent by `send_update_characters()` to all Members in the Channel (`recipients=member`) , so that the Character list is updated.

However, when you refresh your browser, you will see the Character list becomes empty again. When a User refreshes the browser, the client will reload the Channel's Character list, and will send a `fetch_characters` **Action** (basically an Upward Event but less commonly used) to the Service bound to the Channel. You may see things in console logs like this:

```shell
2024-07-25 04:10:26.583 | INFO     | moobius.network.ws_client:receive:128 - {"type": "action", "body": {"subtype": "fetch_characters", "channel_id": "a95072a4-2869-41c6-a26d-a164065031df", "context": {}, "sender": "e43c5534-ccad-4f7e-b85c-d0a77b1f47b4"}}
```

This data is automatically parsed by the SDK as an `Action` dataclass object containing all the relevant fields and passed into `on_fetch_characters()` method defined by Moobius class. The method is automatically invoked (triggered) whenever a `fetch_characters` Action is sent by a Channel Member. Thus, if the event handler `on_fetch_characters()` is implemented in your Service as follows, you can see the Character list preserves even after you refresh the browser (remember to stop and restart your Service before testing).

```python
# triggered when the browser refreshes
async def on_fetch_characters(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    await self.send_update_characters(character_ids=members, channel_id=action.channel_id, recipients=action.sender)
```

:::tip

1. You may notice a lot of Actions sent to the Service in your log when the browser refreshes. When the Channel is re-rendered by the browser client, it assumes no Characters, Buttons, or Canvas in the Channel until it receives a corresponding `update` event (the history Messages was fetched from the Moobius Platform which does not involve Service). Each type of Action has its trigger defined in the SDK like `on_fetch_buttons()`, `on_fetch_canvas()`, etc. with default trivial implementation. As a result, you need to implement these triggers (event handlers) to send proper Downward Events to the Users. Furthermore, if a User has joined multiple Channels and switch back and forth in the browser, such Actions will be sent each time the current Channel gains focus.
2. The `recipients` argument of `send_update_characters()` can be of `list` type (with any number of recipients) or `str` type (when there is only one recipient, it is not mandatory to make it a list). Similar design appears in the SDK in methods like `send_update_buttons()`.
3. It is highly recommended to initialize the Channel related stuff in initialize_channel() method rather than `__init__()` method, unless you really know what you are doing. This is for three major reasons.
   (1) The `____init____()` method is a synchronous method (note the space), where you may not call most Channel related asynchronous helper methods like `fetch_member_ids()`.
   (2) Network connections are not yet established when `____init____()` is called, even after you call `super().____init____()`.
   (3) Unpicklable objects declared in `____init____()` (like an `openai.OpenAIClient`) may cause the Service ineligible for working in the non-blocking "background" mode with `MoobiusWand`, which does complicated and delicate asynchronous multiprocessing under the hood. This can be avoided by simply moving the object initialization into initialize_channel().
   :::

## Puppets

Now that you know how to tell the truth of who is in the Channel to all Members, let's explore more power of yourself. As you may already know, a striking feature of Moobius is its ability to allow Services to create any number of Characters that do not originally exist at ease. These Characters are also known as Puppets. Unlike Members, a Puppet is not associated with a Moobius User account, and does not directly correspond to any real User.

As the creator of the Channel, only you know which Characters are "real" and which are "virtual", and you are more than encouraged to keep it to yourself, or use it wisely (and create a unique experience to your Users). Of course, the Moobius Platform knows it, too, but the Platform will never give out "official" labels of Member/Puppet, at communication protocol level (which means such information will not be sent to the frontend client at all, even when Users try to use F12 to analyze the data packages).

:::tip
The workflow of creating a Puppet is amazingly simple. Most group chat applications (like Discord and Slack) provide "bot" features, but you would typically need far more effort to make a bot work properly, and the flexibility of bots is obviously less. Furthermore, a User won't technically tell a Puppet from a Member when their Character list contains both types. You can provide hints by providing different style of avatar/name of your puppets, but this is up to you. In extreme cases, a Puppet could be created based on a Member's profile (name, avatar, description, etc), and looks all the same (but with different character_id). Controversial as it may be, this is where our value of human-AI mixture resides.
:::

To create a Puppet, you need to find an image (preferably square-shaped) as its avatar (otherwise it will use default avatar), and give it a name and description (optional). Such information will be shown to Users seeing the Puppet as they appear in real Members (of course).

Let's create a `resources` directory under your project directory, and put an image `avatar.png` inside it (of course you can use any image you like, and not necessarily in `png` format).

![moobius](/img/img-3.png)

Suppose you want every Member to know that this cute Pup-pet, Meow, is among them. What you need to do is two things: Create a Puppet based on this avatar when the Service starts, and put its `character_id` along with the list of all members whenever you send the `update_characters` Downward Event. The implementation in `service.py` would look like this:

```python
async def initialize_channel(self, channel_id):
    self.meow = await self.create_puppet(name='Meow', avatar='resources/avatar.png')
    members = await self.fetch_member_ids(channel_id)
    characters = [self.meow] + members
    await self.send_update_characters(character_ids=characters, channel_id=channel_id, recipients=members)

async def on_fetch_characters(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    characters = [self.meow] + members
    await self.send_update_characters(character_ids=characters, channel_id=action.channel_id, recipients=action.sender)
```

Restart your Service. You will see your Puppet appears in the Character list (even after refreshing your browser). In `initialize_channel`, the Puppet is created with `create_puppet()` method, and its character_id is bound to the `self.meow` property (so that it can be used in other methods). Note that the arguments of `send_update_characters()` are slightly modified: despite the fact that the character_ids argument includes your puppet, the `recipients` argument does not (You have to keep in mind that your Puppets do not actually receive anything, only your Members do). Again, you don't need to pass the `members` or its superset to the `character_ids` argument. It is legit to just pass `character_ids=[self.meow]`, and Meow will be the only Character you see in the Character list (even without yourself!).

:::tip
There are other functions associated with Puppets, like Moobius.update_puppet() that modifies the name/avatar/description of a Puppet without changing the character_id (for now you have to refresh the browser to see the change, which is an implementation issue of us). This tutorial tries to cover most of the common functionalities of the SDK, but is not guaranteed to be an exhaustive list of that. For further reference of such methods in detail, please see our SDK Documentation https://moobius.readthedocs.io/en/latest/index.html.
:::

## Join and Leave Channel

You have got an idea of how to create "virtual reality" for yourself (or trick yourself to believe in something, which seems not fun since you already know the truth), but the real power of Moobius is for a group of Members (as in Group Based Application). Now you need to have another account logged in to a separate browser window (todo: Incognito), or have another person with a Moobius account (not necessarily a developer) working with you (you may want to use another Channel for communication, since your Service does not support message delivery yet). For clarity, we will call the creator of the Channel (you) "User A", and other accounts User B, User C, etc.

:::tip
If you are using one computer to log in to two accounts, make sure you log in with separate windows (or Incognito Windows) or separate browsers and separate accounts (like in Google Chrome) to avoid conflicts, as Moobius does not support multiple logins currently. Also, if you accidentally do something different from what is stated here, don't worry, nothing could be broken. Just restart, refresh, and probably leave the Channel and join again, and you will see it.
:::

Now keep your Service running and User A in the Channel. Let User B know your `channel_id` and join the Channel as well. Pay attention to what both each User sees in their Character list once User B joins.

What you are going to find out is that, although User B sees `A`, `B` and `Meow` immediately after joining, User A can't see User B in the Character list (only `A` and `Meow`is there) until User A refreshes the browser (try it!). Furthermore, when User B leaves the channel after that, User A's Character list won't automatically update until another refresh. You can try this multiple times and switch the roles between User A and User B, and the result will always be the same: the newly joined User always receives the up-to-date Character list, but the User already in the Channel has to refresh the browser manually.

If you take a closer look at your console logs (or the `service.log` file in the `logs` directory), you would see that when User B joins the Channel, a bunch of Upward Actions are sent to the Service, including a `join_channel` Action followed by a series of `fetch` Actions, including `fetch_characters` (as User B's browser needs to render the Channel as if it were just refreshed). The fetch_characters Action is already handled properly by our `on_fetch_characters()` method, which explains why User B sees the 3-Character list. However, we did nothing to "notify" User A when User B joins, so that User A only sees the 2-Character list before the next refresh (when another `fetch_characters` is sent by User A).

As you may already realize, if we want to let User A see User B upon joining, we need to send an `update_characters` Downward Event to User A with the new Character list once the Service receives a `join_channel` Upward Event. Similarly, if we want to remove User B from User A's Character list when User B leaves the channel, we need to send `update_characters` in response to a `leave_channel` Upward Event. The `on_join_channel()` and `on_leave_channel()` handler methods are already defined in the Moobius class, that can be automatically triggered by the corresponding Upward Events. Hence, the implementation would be like:

```python
# triggered when a user joins a channel
async def on_join_channel(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    characters = [self.meow] + members
    await self.send_update_characters(character_ids=characters, channel_id=action.channel_id, recipients=members)

# triggered when a user leaves a channel
async def on_leave_channel(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    characters = [self.meow] + members
    await self.send_update_characters(character_ids=characters, channel_id=action.channel_id, recipients=members)
```

Note that both `send_update_characters()` have their second argument the entire Member list (instead of just "User A"), which means that every Member in the Channel will be notified of the change of Character list once someone joins or leaves even if there are User C, User D, ... in the Channel (which is the expected behavior of a "traditional" group chat). Now you can have more Users playing with it, and test your Channel as much as you can, including join/leave, refresh, start/stop the Service at any time. Chances are that no “inconsistencies” will occur.

:::tip

1. In this implementation, when User B joins the Channel, they will receive two consecutive `update_characters` Downward Events. The first is sent from `on_join_channel()`, and the second is sent from `on_fetch_characters()`, all with the same Character list. This may be somehow redundant, but it does not hurt.
2. Users can still join/leave a Channel even when its Service is offline. The Moobius Platform is always taking care of the ground truth of the Member list, and the Service could ask for it when it's online next time. In this simple scenario, the possible discrepancy of Member list during the "blackout" period does no harm, but for some complex GBAs, this is something that may raise concerns and require careful handling. (todo: what to care about).
   :::

You may notice that the "fetch and update" logic already appears 4 times in your code, which suggests that you may want to refactor your code by defining another method to wrap up this logic, as your Programming 101 teacher may have told you. After this is done, the entire `service.py` would be something as follows, where the `_sync_characters()` helper method does all the tricks (although it is actually an asynchronous function).

```python
# service.py
from moobius import Moobius, types


class ZeroService(Moobius):
    async def initialize_channel(self, channel_id):
        self.meow = await self.create_puppet(name='Meow', avatar='resources/avatar.png')
        await self._sync_characters(channel_id)

    async def on_fetch_characters(self, action):
        await self._sync_characters(action.channel_id, [action.sender])

    async def on_join_channel(self, action):
        await self._sync_characters(action.channel_id)

    async def on_leave_channel(self, action):
        await self._sync_characters(action.channel_id)

    # helper method
    # fetch member list, add Meow and send out
    async def _sync_characters(self, channel_id, recipients=None):
        members = await self.fetch_member_ids(channel_id)
        characters = [self.meow] + members
        await self.send_update_characters(character_ids=characters, channel_id=channel_id, recipients=recipients or members)

        return members    # for future use
```

## Individualized Character List

You may think it is over complicated to have to handle these fetch Events manually if at the end of the day, what you achieve is no more than a "traditional" group chat. It is true, but the point of Moobius is to make all of these things, otherwise automatically handled or taken for granted, flexible and customizable (as in "you are commonly expected to do this but you don't have to"), so as to provide with as much space as possible for your creativity. With that being said, if all you need is no more than a Moobius counterpart of a Discord server with some bots (where everybody sees the same things), you can just use our template Services (todo: templates for that) and make modifications on top of them.

One of the core merits of Moobius is its capacity to create individualized experience. In terms of Character list, it means different Members can see different Character lists. The simplest case is to put every Member at the top of the list they see (remember, a list is ordered), where you can make slight changes to `_sync_characters()`:

```python
async def _sync_characters(self, channel_id, recipients=None):
    members = await self.fetch_member_ids(channel_id)
    characters = [self.meow] + members
    recipients = recipients or members

    for r in recipients:
        ind = characters.index(r)   # find the recipient
        payload = [r] + characters[:ind] + characters[ind + 1:]

        await self.send_update_characters(character_ids=payload, channel_id=channel_id, recipients=r)

    return members
```

Then you can do the join/leave/refresh tests, and you will find everyone sees themselves at the top of their own Character list, followed by Meow. Similarly, it is easy to let everyone see all Members except themselves, or let Meow have the same name as them (todo: use `get_character_profile()` to get names) (try it!).

In later sections, we will demonstrate more ideas about how flexible, individualized Character lists can help create unique User experience when more interaction modalities are introduced.

It could be challenging to develop a GBA when it reaches certain complexity, since you have to always keep in mind (or storage) what EVERY member sees and how they would dynamically change in response to each other's behavior. Also, you may have to always have multiple browser windows open (or with multiple persons) and switch back and forth between your IDE and your browsers when you debug and test your Service. This may explode your mind sometimes, and we are making our best effort trying to spare your mind for the greater good with our SDK. Believe it or not, chances are that it is worth the pain. Remember, all is about group, interaction, and socialization!
