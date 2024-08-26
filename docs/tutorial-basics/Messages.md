---
id: Messages
---

## Upward and Downward Messages

Messaging system is arguably the most important and most commonly used feature of Moobius as far as a GBA is concerned. The workflow of Message is straightforward for Users, and often determines a User's experience. However, just like the case of Characters, the default `Moobius` instance does nothing to handle Messages.

Now keep your Service running, and send a text Message from User A, say "hello world", to the Channel. You can specify any targets (if you already have `A`, `B`, `C` and `Meow`, there is a bunch of combinations of your intended recipients), which doesn't matter much. Although nothing could be observed from other Users' perspective, you will notice a console log like this:

```shell
2024-07-26 13:28:25.975 | INFO     | moobius.network.ws_client:receive:128 - {"type": "message_up", "body": {"subtype": "text", "content": {"text": "hello world"}, "channel_id": "a95072a4-2869-41c6-a26d-a164065031df", "timestamp": 1722014904438, "recipients": "51e59300-e58f-46ea-a7ab-4052d66d137c", "message_id": "15ec8005-ad17-4f7c-8c19-51a0bea94682", "context": {"group_id": "51e59300-e58f-46ea-a7ab-4052d66d137c", "group_name": "Meow", "character_num": 1, "channel_type": "ccs"}, "sender": "e43c5534-ccad-4f7e-b85c-d0a77b1f47b4"}}
```

This corresponds to a `message_up` Upward Event sent to the Service that includes the details of the Message, including its sender, intended recipients, and Message body, etc. The data is then parsed into a MessageBody object and passed into the handler function `on_message_up()`, which is invoked automatically (just like what happened for other triggers starting with `on_`, like `on_fetch_characters()`). Therefore, you can handle the Message by implementing `on_message_up()` in your `ZeroService` class. The easiest way to implement a simple Message forwarding system is just a one-liner:

```python
async def on_message_up(self, message):
    await self.send_message(message)
```

The `send_message()` method will automatically extract the Message content and intended recipients from `message`, and send a `message_down` Downward Event to the Moobius Platform to instruct it to send the Message to all intended recipients. With this implementation, the Service will try to send the message as intended, which seems like the default behavior of a Moobius Channel where no CCS is involved.

:::tip
If you carefully inspect the `message_up` data in the log, you will find that the `recipients` field is always just ONE string, no matter how many intended recipients there are. This is due to our internal mechanism to convert a list of Character IDs into a Group ID, which is what actually passes through the websocket connection between the Moobius Platform and Users/Services. This mechanism can prevent the data package from exceeding the size limit for large Channels (say, 10K recipients). Moobius has a separate HTTP service for this conversion (both ways). However, our SDK takes care of these overhead, and you never need to take care of the "Group" issue, and you can safely assume that in all high-level dataclasses and methods (like the `message_up` argument, which is of type `MessageBody` with a `recipients` field, and `send_message()`, which accepts a `recipients` optional argument), `recipients` means a list of Character IDs (actually you can pass just ONE Character ID when there is only one recipient for simplicity, but still it is just an alias of the one-element list, and has nothing to do with the Group ID).
:::

However, it should be kept in mind that if CCS does some tricks to the Character list and let a User believe in the existence of Puppets, the intended recipients of a `message_up` may contain Members as well as Puppets. Furthermore, if a Service indicates any recipient in the `message_down` sent to Moobius that is not a current Member of that Channel (Puppets, former Members, or fake Character IDs) at the time Moobius receives it, those recipients would be ignored by the Moobius Platform (as there are no actual clients for them establishing network connection to Moobius), and only current Members would receive the Message. For example, if User A selects `B` and `Meow` as intended recipients and sends a `message_up`, and the Service sends a `message_down` with the same recipients, then only `B` would receive the Message.

Here are some nuances that are worth paying attention to, which could easily be overlooked if you are in the mindset of a traditional group chat software:

1. A User's intended recipients may or may not include the User's own Character ID. In other words, if the User appears in its own Character list, they have a choice to send a Message to themselves or not. You can try it by sending two Messages from User A, one including User A in the target and one does not, and see the difference.

2. When a User chooses to send a Message to "Service(∞)" from the browser client, the `message_up` will have an empty list as its intended recipients. In other words, this literally means "sends to nobody". But the Service will definitely receive the `message_up`, which is nothing special except from an empty recipient list, which is no more than some value of a field.

3. There is nothing special when a User chooses to send a Message to "All". This is simply a shortcut for the browser to use the entire current Character list as the recipients. The list is not at all equivalent to the ground truth (Remember, only Service knows the ground truth), but just a User's perception. One User's "All" may change over time (when an `update_charaters` is received), and it can be different from any other User's "All" at the same time (unless the Service takes effort to maintain the consistency). In other words, don't interpret "All" as some magical "broadcast address"; it is no more than `Ctrl + A`.

TL,DR: Every Character in the Character list can be independently included in/excluded from the intended recipient list of a Message. For an N-member Character list, there will be 2^N different intended recipient list that can be selected from the browser client (and more if one wants to use our API/Agent SDK and manipulate the data directly, but we can safely ignore that for now).

:::tip
When the Service of a Channel is offline, all the Messages sent by Users in that Channel are handled (trivially) in a lazy way, which means Moobius would do nothing but saving the `message_up` into its own database. Even next time the Service is online, Moobius will not attempt to forward these messages to the Service again. In other words, the Messages are "missed" by the Service during the blackout period. With that being said, the Message history is preserved for each and every User. The User will be able to see their activity of sending the Messages.
:::

## Messaging Logic

Now it's time to dig deeper into the Messages and have some fun. Actually, you can do almost whatever you want with the Messages. Suppose you want to modify a Message, like appending " lol~" to every text Message, you may want to do this:

```python
async def on_message_up(self, message):
    if message.subtype == types.TEXT:
        new_text = message.content.text + ' lol~'
        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)
    else:
        await self.send_message(message)
```

Notice how you can extract the Message subtype and its text from the `message` argument and how you can specify `channel_id` (it is true that you can send a Message to another Channel you control!), `sender` and `recipients` for `send_message()`. When you restart the service, any text Message sent from anybody should be appended the " lol~" string and reach the intended recipients.

It is easy to specify any `sender` as long as it is a valid Character ID (of a current Member or a Puppet created by the Service controlling the Channel) (todo: check whether a Service and use other Service's Puppet) and send a Message on their behalf, sometimes without their knowledge (you have to read Terms and Conditions (todo) carefully! The Users in your Channel grant you the power, but please use that wisely!). For example, if you want Meow to respond as long as a user says something that contains the string "cat" (test it yourself!):

```python
async def on_message_up(self, message):
    if message.subtype == types.TEXT:
        new_text = message.content.text + ' lol~'
        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

        if 'cat' in message.content.text:
            await self.send_message('Meow! I am here!', channel_id=message.channel_id, sender=self.meow, recipients=message.sender)
        else:
            pass
    else:
        await self.send_message(message)
```

:::tip
For the `sender` field to be valid, it does not have to be in the Character list of any Member in the `recipients`. In an extreme case, you can change the implementation of `_sync_characters()` into a mere `return` (so that it is basically a noop and everyone's Character list is empty). Restart your Service and you will find the above code still works (amazingly, although your Users may believe there is some bug). The Characters appearing to send Message but are not in a User's Character list are sometimes called "haunting Characters" , or, more formally, "hyperceptive Characters". Given the dynamic nature of the Character list, this phenomenon occurs more frequently than you might think, even in traditional group chat -- what happens if someone quits the group and you are looking at their old messages?
:::

Of course, you can do something more in `on_message()` (just as in any other function), like automatically creating a Puppet for everyone if a User types something like `create <name of the puppet>`. For this feature, you have to make some changes to `initialize_channel()` and `_sync_characters()` to properly handle these custom Puppets.

```python
async def initialize_channel(self, channel_id):
    self.meow = await self.create_puppet(name='Meow', avatar='resources/avatar.png')
    self.custom_puppets = []    # create an empty list for custom puppets
    await self._sync_characters(channel_id)

async def on_message_up(self, message):
    if message.subtype == types.TEXT:
        text = message.content.text
        new_text = text + ' lol~'
        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

        if 'cat' in text:
            await self.send_message('Meow! I am here!', channel_id=message.channel_id, sender=self.meow, recipients=message.sender)
        elif text.startswith('create'):
            name = text.replace('create', '').strip()   # remove the "create"
            puppet = await self.create_puppet(name, avatar=self.meow.avatar)    # You can use the same avatar
            self.custom_puppets.append(puppet)
            await self._sync_characters(message.channel_id)
        else:
            pass
    else:
        await self.send_message(message)

# helper method
# fetch member list, add Meow and send out
async def _sync_characters(self, channel_id, recipients=None):
    members = await self.fetch_member_ids(channel_id)
    characters = [self.meow.character_id] + members + self.custom_puppets    # Note the change
    recipients = recipients or members

    for r in recipients:
        try:
            ind = characters.index(r)   # find the recipient
            payload = [r] + characters[:ind] + characters[ind + 1:]
        except ValueError:
            payload = characters

        await self.send_update_characters(character_ids=payload, channel_id=channel_id, recipients=r)
```

Now send "create Dog" from User A, and there supposed to be a Puppet named "Dog" with Meow's avatar appearing in every Member's Character list.

:::tip

1. These Characters are ephemeral: if you restart your Service, all the custom Puppets will be gone (except Meow, of course). If you want to make them persistent, you have to save the relevant data to external storage (like a hard drive or a cloud database service), and fetch it properly next time you start your Service. We know it can be frustrating, and that's what the `MoobiusStorage` class of SDK is specifically designed for. Please refer to our advanced tutorial (todo: link) for details.
2. In real-world practice, you may want to modify the above code so that the "create" messages are not sent out at all, but used as some instruction message so that spamming could be minimized (if you are a chatbot developer, you would know what we are talking about). Alternatively, you may want to create a Puppet just for instruction messages and guide your user to target their instructions to the Puppet (not to other Members) and you can tell it from the `recipients` field (for instance, all messages targeted to Meow are interpreted as instructions). This tutorial won't say too much about this; the design is totally up to the Service provider!
   :::

Also, `send_message()` could be used outside `on_message()`, like if you want to be polite (note the Member does not actually say those things, but the Service makes other Members believe otherwise):

```python
async def on_join_channel(self, action):
    members = await self._sync_characters(action.channel_id)
    await self.send_message("Hello! I just joined!", channel_id=action.channel_id, sender=action.sender, recipients=members)
    await self.send_message("Welcome!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)

async def on_leave_channel(self, action):
    members = await self._sync_characters(action.channel_id)
    await self.send_message("Adios! I just left!", channel_id=action.channel_id, sender=action.sender, recipients=members)
    await self.send_message("See you next time!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
```

:::tip
The `on_leave_channel()` is triggered AFTER the User leaves the Channel. Hence the "See you next time" would not be actually sent out. (todo: this is not true. Should this be allowed?)
:::

If you really think your Channel as a Group Based Application, you can treat `send_message()` as a fancy version of `print()`. Messages are versatile: it can be input/output of your GBA itself, your debug logs, your user's feedback, your AI Characters' special abilities, or, at the end of the day, most of the information exchange happening in your Channel, the world of human-AI mixtures.

## Message Subtypes

The current version of Moobius supports multiple Message subtypes, including `text`, `image`, `audio` and `file`. For `text` subtype, the `content` field (you can find it in the log, or use `message.content` field of the `message` argument passed in `on_message()`) contains a `text` field that is the raw plain text of the message (rich text and code blocks are supported, but this is purely a frontend thing). For `image`, `audio` and `file`, the `content` field contains a `path` field that indicates the url of the resource. Additionally, for `file` subtype, there is an extra `filename` field indicating the original filename intended when sent (the filename will automatically be changed when uploaded to the file service).

:::tip
For Messages that involve a resource file, the data passed through the websocket connections between Moobius and Service, and between Moobius and User client, is always the url of the resource, which is typically hosted on a file Service accessible via Internet (mostly the dedicated file service for Moobius) and the resource itself is retrieved via HTTP. Due to its bulky size, the resource file is typically not suitable for transmitting through websockets. A User or a Service has to upload the intended resource to the file Service, and then put the url to the payload of the Message to be sent. Fortunately, our SDK (as well as our browser clients) wraps up the dirty work and you can send/download a file/image/audio message with a one-liner, nothing more complicated than a text Message.
:::

The following code snippet demonstrates some basic operations involving non-text Messages:

```python
async def on_message_up(self, message):
    if message.subtype in [types.IMAGE, types.AUDIO]:
        await self.download(source=message, auto_dir='recv')    # the directory is automatically created and filename is generated
        await self.send_message('resources/avatar.png', channel_id=message.channel_id, subtype=types.IMAGE, sender=self.meow, recipients=message.sender)
    elif message.subtype == types.FILE:
        await self.download(source=message, fullpath=f'files/{message.content.filename}')    # dir auto created, filename specified
        await self.send_message(f'File {message.content.filename} saved!', channel_id=message.channel_id, sender=self.meow, recipients=message.sender)
    else:
        pass

    await self.send_message(message)
```

After you run the Service and send some file/audio/image Messages with your test accounts to the Channel, you will notice a `recv` and a `files` directory automatically created under your project directory, and the resource files from the Messages are properly downloaded.

:::tip
As you might have already noticed, the `download()` method and `send_message()` method are highly polymorphic. We hope such design can make it easy for you to focus on core logic without having to care about those low-level overheads. For detailed documentation of these methods, please refer to the [SDK Documentation](https://moobius.readthedocs.io/en/latest/index.html).
:::
