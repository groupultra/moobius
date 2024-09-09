---
id: Members_Characters
title: Members and Characters
---

## Members

When your Service takes over the Channel, the first thing you may notice is that your Character list is empty, even without yourself. This is not a bug! It just means that you have to tell Moobius what each Member (including yourself) sees. In this case, the Character list seen by a Member may be different from the actual “Member list” of the Channel (the ground truth), and/or different from what any other Member in the Channel sees.

:::tip
When a User creates a Channel, two things happen: (1) the creator gets permission to take over the Channel with a Service using their credentials; (2) the creator automatically joins the Channel and becomes a Member of that Channel. These are two independent roles of a creator. As a Member per se, the creator is no more special than any other User joining the Channel, and the creator can even leave the Channel but remains in control of the Channel with their Service.
:::

As the creator of a Channel, you (or your Service) always have access to the ground truth. However, it is your option (rather than obligation) as a Service provider to give out the truth to your Channel Members. Before things get complicated, let us just be simple and tell everyone the truth, so that your Channel would look like a traditional group chat.

In your `service.py` file, add the following methods inside `ZeroService` class:

```python
async def on_channel_checkin(self, channel_id):
members = await self.fetch_member_ids(channel_id)
await self.send_characters(characters=members, channel_id=channel_id, recipients=members)
```

Press `Ctrl + C` to forcefully stop your Service, and then run it again (but DO NOT refresh your browser):

```shell
python service.py
```

You will see from the browser that your Character list actually updated: you are back in your Character list again. The `on_channel_checkin()` method is inherited from the super class `Moobius`, which has been predefined by the SDK and is invoked automatically as the Service starts, and periodically afterwards. In the above implementation of the method, the Service first fetches from the Moobius Platform the ground truth of the Members in the Channel using `fetch_member_ids()` method. The return value of the method `member` is a list of strings, each element of which is a `character_id` that uniquely defines a Character. Next, an update_characters Downward Event is sent by `send_characters()` to all Members in the Channel (`recipients=members`), so that the Character list is updated.

However, when you refresh your browser, you will see the Character list becomes empty again. When a User refreshes the browser, the client will reload the Channel's Character list, and will send a `refresh` Upward Event to the Service bound to the Channel. You may see things in console logs like this:

```json
2024-07-25 04:10:26.583 | INFO | moobius.network.ws_client:receive:128 - {"type": "action", "body": {"subtype": "refresh", "channel_id": "a95072a4-2869-41c6-a26d-a164065031df", "context": {}, "sender": "e43c5534-ccad-4f7e-b85c-d0a77b1f47b4"}}
```

This data is automatically parsed by the SDK as an `RefreshBody` dataclass object containing all the relevant fields and passed into `on_refresh()` method defined by `Moobius` class. The method is automatically invoked (triggered) whenever a `refresh` Event is sent by a Channel Member. Thus, if the event handler `on_refresh()` is implemented in your Service as follows, you can see the Character list preserves even after you refresh the browser (remember to stop and restart your Service before testing).

```python
# triggered when the browser refreshes

async def on_refresh(self, action):
members = await self.fetch_member_ids(action.channel_id)
await self.send_characters(characters=members, channel_id=action.channel_id, recipients=action.sender)
```

:::tip

1. When the Channel is re-rendered by the browser client, it assumes no Characters, Buttons, or Canvas in the Channel until it receives a corresponding update event (the history Messages is an exception to this rule. It is fetched from the Moobius Platform which does not involve Service). Furthermore, if a User has joined multiple Channels and switches back and forth in the browser, a refresh Event will be sent each time the current Channel gains focus.
2. The recipients argument of send_characters() can be alist(with any number of recipients) or astr type (when there is only one recipient, it is not mandatory to make it a list). A similar design appears in the SDK in methods like send_buttons(). This flexibility simplifies developing your CCS app.
   :::

## Agents

Now that you know how to tell the truth of who is in the Channel to all Members, let's explore more power of yourself. As you may already know, a striking feature of Moobius is its ability to create any number of Characters that do not exist (do not coorespond to user accounts). These Characters are also known as Agents. Unlike Members, an Agent is not associated with a Moobius User account, and does not directly correspond to any real User.

As the creator of the Channel, only you know which Characters are "real" and which are "virtual", and you are more than encouraged to keep it to yourself, or use it wisely (and create a unique experience to your Users). Of course, the Moobius Platform knows it, too, but the Platform will never give out "official" labels of Member/Agent, at communication protocol level (which means such information will not be sent to the frontend client at all, even when Users try to use F12 to analyze the data packages).

Tip: The workflow of creating an Agent is amazingly simple. Most group chat applications (like Discord and Slack) provide "bot" features, but you would typically need far more effort to make a bot work properly, and the flexibility of bots is obviously less. Furthermore, a User won't technically tell an Agent from a Member when their Character list contains both types. You can provide hints by providing different style of avatar/name of your Agents, but this is up to you. In extreme cases, an Agent could be created based on a Member's profile (name, avatar, description, etc), and looks all the same (but with different `character_id`). Controversial as it may be, this is where our value of human-AI mixture resides.

To create an Agent, you need to find an image (preferably square-shaped) as its avatar (otherwise it will use default avatar), and give it a name and description (optional). Such information will be shown to Users seeing the Agent as they appear in real Members (of course).

Let's create a `resources` directory under your project directory, and put an image `avatar.png` inside it (of course you can use any image you like, and not necessarily in `png` format).

![moobius](/img/img-3.png)

Suppose you want every Member to know that this cute Agent, Meow, is among them. What you need to do is two things: Create an Agent based on this avatar when the Service starts, and put its `character_id` along with the list of all members whenever you send the `update_characters` Downward Event. The implementation in `service.py` would look like this:

```python
async def before_channel_init(self):
    self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png') # the path could be a local file or an url

async def on_channel_checkin(self, channel_id):
    members = await self.fetch_member_ids(channel_id)
    characters = [self.meow] + members
    await self.send_characters(characters=characters, channel_id=channel_id, recipients=members)

async def on_refresh(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    characters = [self.meow] + members
    await self.send_characters(characters=characters, channel_id=action.channel_id, recipients=action.sender)
```

Restart your Service. You will see your Agent appears in the Character list (even after refreshing your browser). The method `before_channel_init()` has already been defined in class `Moobius`, and is invoked automatically right after the very basic things gets ready (mainly establishing the network connection to the Moobius platform with account credentials and determining the channels to operate on based on the config files), but before any detailed work on each specific channel (please refer to the "Life Cycle" Section later for details). Since our `ZeroService` is a subclass of `Moobius`, we can override this method to add some initialization stuff.

In `before_channel_init()`, the Agent is created with `create_agent()` method, and its return value, a `Character` instance is assigned to the `self.meow` attribute (so that it can be used in other methods in the class). Note that the arguments of `send_characters()` are slightly modified: despite the fact that the `characters` argument includes your Agent, the `recipients` argument does not (You have to keep in mind that your Agents do not actually receive anything, only your Members do). Again, you don't need to pass the `members` or its superset to the `characters` argument. It is legit to just pass `characters=[self.meow]`, and Meow will be the only Character you see in the Character list (even without yourself!).

:::tip
It is highly recommended to initialize the Service-related stuff in `before_channel_init()` method rather than `__init__()` method, unless you really know what you are doing. This is for three major reasons.

(1) The `__init__()` method is a synchronous method (note the space), where you may not call any asynchronous methods directly, including most of the helper methods defined in our SDK such ascreate_agent().

(2) Network connections to the Moobius Platform are not yet established when `__init__()` is called, even after you call `super().__init__()`.

(3) Unpicklable objects declared in `__init__()` (which include most "ordinary" objects, such as an openai.OpenAIClient) will not allow running the service in the non-blocking "background" mode with MoobiusWand. This can be avoided by simply moving the object initialization into `before_channel_init()`. For code readability, it is best not to declare instance attributes outside `__init__()`, but you can set `self.the_attribute=None` in the `__init__()` and then set them to their real value in `before_channel_init()`. We will omit showing this in the tutorial for brevity.
:::

There are other functions associated with Agents, for example `Moobius.update_agent()` modifies the name/avatar/description of an Agent without changing the `character_id` (for now you have to refresh the browser to see the change, which is a minor bug we will fix).

This tutorial tries to cover most of the common functionalities of the SDK, but is not guaranteed to be an exhaustive list of that. For a searchable reference, this lists every method in detail, please see our SDK Documentation https://moobius.readthedocs.io/en/latest/index.html.

## Join and Leave Channel

You now can make a "virtual reality" for yourself, but the real power of Moobius is in having a group of Members interact with eachother. At this point, it helps to have another account logged in to a separate browser window (todo: Incognito), or have another person with a Moobius account (not necessarily a developer) working with you (you can use an empty Channel running the default service for communication, since your Service does not support message delivery yet). For clarity, we will call the creator of the Channel (you) "User A", and other accounts User B, User C, etc.

:::tip
If you are using one computer to log in to two accounts, make sure you log in with separate windows (or Incognito Windows) or separate browsers and separate accounts (like in Google Chrome) to avoid conflicts, as Moobius does not support multiple logins currently. Also, if you accidentally do something different from what is stated here, don't worry, nothing could be broken. Just restart, refresh, (and maybe leave the Channel and join again), and you will see it.
:::

Now keep your Service running and User A in the Channel. Let User B know your `channel_id` and join the Channel as well. Pay attention to what both each User sees in their Character list once User B joins.

What you are going to find out is that, although User B sees `A`, `B` and `Meow` immediately after joining, User A can't see User B in the Character list (only `A` and `Meow` is there) until User A refreshes the browser (try it!). Furthermore, when User B leaves the channel after that, User A's Character list won't automatically update until another refresh. You can try this multiple times and switch the roles between User A and User B, and the result will always be the same: the newly joined User always receives the up-to-date Character list, but the User already in the Channel has to refresh the browser manually.

If you take a closer look at your console logs (or the `service.log` file in the `logs` directory), you would see that when User B joins the Channel, a bunch of Upward Actions are sent to the Service, including a `join` Action followed by a `refresh` Event (since User B's browser needs to render the Channel as if it were just refreshed). The `refresh` Event is already handled properly by our `on_refresh()` method, which explains why User B sees the 3-Character list. However, we did nothing to "notify" User A when User B joins, so that User A only sees the 2-Character list before the next refresh (before another `refresh` is sent by User A).

As you may already realize, if we want to let User A see User B upon joining, we need to send an `update_characters` Downward Event to User A with the new Character list once the Service receives a `join` Event. Similarly, if we want to remove User B from User A's Character list when User B `leaves` the channel, we need to send update_characters in response to a leave Upward Event. The `on_join()` and `on_leave()` handler methods are already defined in the `Moobius` class, that can be automatically triggered by the corresponding Upward Events. Hence, the implementation would be like:

```python
# triggered when a user joins a channel
async def on_join(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    characters = [self.meow] + members
    await self.send_characters(characters=characters, channel_id=action.channel_id, recipients=members)

# triggered when a user leaves a channel
async def on_leave(self, action):
    members = await self.fetch_member_ids(action.channel_id)
    characters = [self.meow] + members
    await self.send_characters(characters=characters, channel_id=action.channel_id, recipients=members)
```

Note that both `send_characters()` have their second argument the entire Member list (instead of just "User A"), which means that every Member in the Channel will be notified of the change of Character list once someone joins or leaves even if there are User C, User D, ... in the Channel (which is the expected behavior of a "traditional" group chat). Now you can have more Users playing with it, and test your Channel as much as you can, including join/leave, refresh, start/stop the Service at any time. Chances are that no “inconsistencies” will occur.

:::tip

1. In this implementation, when User B joins the Channel, they
   will receive two consecutive `update_characters` Downward Events. The
   first is sent from `on_join()`, and the second is sent from `on_refresh()`,
   all with the same Character list. This may be somehow redundant, but it
   does not hurt.

2. Users can still join/leave a Channel even when its Service is
   offline. The Moobius Platform is always taking care of the ground truth
   of the Member list, and the Service could ask for it when it\'s online
   next time. In this simple scenario, the possible discrepancy of Member
   list during the \"blackout\" period does no harm, but for some complex
   GBAs it may cause desyncs require careful handling. (todo: what to care
   about).
   :::

You may notice that the logic for `on_join()` and `on_leave()` is similar as `on_channel_checkin()`, hence we can define a `sync_channel()` method (it is async!) for this logic. After this is done, the entire `service.py` would be something like this. A dict `self.members` is created to store the mapping of `channel_id -> members`, which can be referred to later in different methods.

:::tip
`self.members` in this case is an example of a "status" variable that needs to be stored and retrieved. For a real-world functional GBA, there could be much more such things and can be very complicated. The `MoobiusStorage` provides a simple way of mapping a database on external storage to a runtime variable, which is covered in our Advanced Tutorial.
:::

```python
# service.py
from moobius import Moobius, MoobiusWand, types


class ZeroService(Moobius):
    async def before_channel_init(self):
        self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')
        self.members = {}

    async def on_channel_checkin(self, channel_id):
        await self.sync_channel(channel_id)

    async def on_refresh(self, action):
        await self.sync_channel(action.channel_id)

    async def on_join(self, action):
        await self.sync_channel(action.channel_id)

    async def on_leave(self, action):
        await self.sync_channel(action.channel_id)

    async def sync_channel(self, channel_id):
        self.members[channel_id] = await self.fetch_member_ids(channel_id)
        members = self.members[channel_id]
        characters = [self.meow] + members
        await self.send_characters(characters=characters, channel_id=channel_id, recipients=members)


if __name__ == '__main__':
    MoobiusWand().run(ZeroService, config='config/config.json')

```

## Individualized Character List

You may think it is over complicated to have to handle these `fetch` Events manually if at the end of the day, what you achieve is no more than a "traditional" group chat. However, you don't always want to do that. For example, if users can mute each-other you will have to limit who sees the message to whoever is not muting the sender. Moobius allows implementing every permutation of group-based messaging you can imagine. With that being said, if all you need is no more than a Moobius counterpart of a Discord server with some bots (where everybody sees the same things), you can just use our template Services (todo: templates for that) and make modifications on top of them.

One of the core merits of Moobius is its capacity to create individualized experience. In terms of Character list, it means different Members can see different Character lists (among others), i.e., they have different **Views**. The simplest case is to put every Member at the top of the list they see (remember, a list is ordered), as shown in these slight changes to `sync_channel()`:

```python
async def sync_channel(self, channel_id):
    members = await self.fetch_member_ids(channel_id)
    self.members[channel_id] = members
    characters = [self.meow] + members

    for member in members:
        ind = characters.index(member)  # find the recipient
        payload = [member] + characters[:ind] + characters[ind + 1:]

        await self.send_characters(characters=payload, channel_id=channel_id, recipients=member)

```

At this point, if you test join, leave, and refresh, you will find everyone sees themselves at the top of their own Character list, followed by Meow. Similarly, it is easy to let everyone see all Members except themselves, or let Meow have the same name as them (todo: use `get_character_profile()` to get names) (try it!).

You may notice that in the above implementation, `sync_channel()` is called in `on_refresh()`, which means that every Member will receive a full update whenever any Member refreshes. This seems inefficient, especially when the Channel has more Members. Hence we can define another method, `send_member_view()`, for performance improvement. After such modification, the code of the entire `service.py` will look like this:

```python
# service.py
from moobius import Moobius, MoobiusWand, types


class ZeroService(Moobius):
    async def before_channel_init(self):
        self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')
        self.members = {}

    async def on_channel_checkin(self, channel_id):
        await self.sync_channel(channel_id)

    async def on_refresh(self, action):
        await self.send_member_view(action.channel_id, action.sender)

    async def on_join(self, action):
        await self.sync_channel(action.channel_id)

    async def on_leave(self, action):
        await self.sync_channel(action.channel_id)

    async def sync_channel(self, channel_id):
        self.members[channel_id] = await self.fetch_member_ids(channel_id)

        for member_id in self.members[channel_id]:
            await self.send_member_view(channel_id, member_id)

    async def send_member_view(self, channel_id, member_id):
        characters = [self.meow] + self.members[channel_id]
        ind = characters.index(member_id)  # find the recipient
        payload = [member_id] + characters[:ind] + characters[ind + 1:]

        await self.send_characters(characters=payload, channel_id=channel_id, recipients=member_id)


if __name__ == "__main__":
    MoobiusWand().run(ZeroService, config='config/config.json')

```

:::tip

1.  The `sync_channel()` implementation here uses an `await` expression inside a `for` loop (Line 26), which results in each Member's view being sent sequentially, instead of in parallel, because it awaits for each request to complete before sending the next one. If you want to take advantage of the speed-up offered by asynchronous execution, you can change this line into `asyncio.create_task(self.send_member_view(channel_id, member_id))` (you will need to also import asyncio). With that being said, this tutorial does not focus on asynchronous programming itself, and beginners can safely ignore such performance differences untill performance becomes an issue.

2.  Another way of making `sync_channel()` more efficient is to reduce the total number of packets sent to the websocket by combining the recipients with the same payload (for example, send Canvas to all Members with "Meow Up" state and then send Canvas to all Members with "Meow Down" state), given the fact that only one packet is sent with one `send_canvas()` call (and similarly, almost all `send_something()` calls defined by class `Moobius`). For the purposes of this tutorial and for ease of modification, it is easier to just give each Member their own view.
    :::

In later sections, we will demonstrate more ideas about how flexible, individualized Character lists can help create unique User experience when more interaction modalities are introduced.

It can be challenging to develop a GBA when it reaches certain complexity, since you have to always keep in mind (or storage) what EVERY member sees and how they would dynamically change in response to each other's behavior. Also, you may have to always have multiple browser windows open (or with multiple persons) and switch back and forth between your IDE and your browsers when you debug and test your Service. This is an issue when developing any online group-chat app. There are so many moving parts! Thankfully the SDK is designed to keep this complexity to a minimum.
