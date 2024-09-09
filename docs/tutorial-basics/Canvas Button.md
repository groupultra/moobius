---
id: CanvasButton
label: Canvas Button
title: Canvas, Button and Context Menu
---

## Canvas

Although Message is arguably the most commonly used means of interaction for a Group Based Application, Moobius supports a few other modalities that could substantially enrich the Users' experience.

It is easy to display some text and/or image in the Canvas area. For example, if you want Meow to crawl in and out in response to your instruction Message targeted exclusively to it:

```python
async def on_message_up(self, message):
    if message.subtype == types.TEXT:
        text = message.content.text
        new_text = text + ' lol~'
        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

        if len(message.recipients) == 1 and message.recipients[0] == self.meow.character_id:
            if text == 'up':
                c = types.CanvasItem(text='I am up!',
                                     path='resources/avatar.png')  # the path could be a local file or an url
                await self.send_canvas(canvas_items=c, channel_id=message.channel_id,
                                       recipients=message.sender)
            elif text == 'down':
                c = types.CanvasItem(text='I am down!')
                await self.send_canvas(canvas_items=c, channel_id=message.channel_id,
                                       recipients=message.sender)
            else:
                await self.send_message("Sorry I don't get it!", channel_id=message.channel_id,
                                        sender=self.meow, recipients=message.sender)
        else:
            pass

    else:
        await self.send_message(message)
```

The canvas in the Channel is by default hidden, and you have to show it by clicking the

![moobius](/img/img-4.png)

icon next to "Canvas" on the upper right-hand side of the webpage. Now try sending "up", "down" or anything else targeted to Meow. You will find your Channel's Canvas updated. Like Characters and Messages, The Canvas of different Members are independent (Meow could be on User A's Canvas but not on User B's). In the above code, the `send_canvas()` method of our SDK sends an `update_canvas` Downward Event, which is somehow similar as `send_message()`, but its argument `canvas_items` should be a `CanvasItem` instance, or a list of that, to be sent as the data payload to the Canvas. A `CanvasItem` consists of two optional fields: `path` (for image) and `text` (for text), which determines what to display on the Canvas.

:::tip

1. If `path` and `text` are both `None` (by default), the result will be an empty Canvas.
2. You can pass the file path of a local image to `path` argument, but the SDK will upload it to the file Service of Moobius under the hood, and use the url of the uploaded file as the actual payload sent to the Moobius Platform. Large files are not sent directly through websocket.
3. If you pass a list of `CanvasItem` instances, they will appear in the client's Canvas area as one "frame" with multiple Canvas items so that a User can scroll left/right to view each of them. When a subsequent frame is sent, all of them will be overwritten.

:::

In the above example, the content of the Canvas won't persist if the User refreshes the browser, or switches the current Channel away and comes back, which is exactly what happened to the Character list untill the code was added to the `refresh` Event. Hence, we may want to call `send_canvas()` in your customized `send_member_view()`, but before this, we have to know what exactly should be sent (with Meow or not), which means we need to store the state of each Member in each Channel, which means that we need to initialize a storage first:

```python
async def on_channel_init(self, channel_id):
    self.channels[channel_id] = {}    # member_id -> True/False meaning up/down
    await self.sync_channel(channel_id)
```

The `on_channel_init()` is another callback defined in `Moobius` that is invoked almost right after `before_channel_init()`. It accepts a `channel_id` argument and is supposed to be called in a loop for each Channel the Service is supposed to operate on. At the time when it is invoked for the first time, the attribute `self.channels` (automatically created by the SDK core code) contains all ChannelIDs as its keys, and the values are initially set to `None`. In this simple demo, we assign an empty dict for each Channel, which will later be filled with `member_id: True` or `member_id: False` to store the Canvas state for each member (`True` means Meow up, and `False` means Meow down). Therefore, we need to do this in `sync_channel()`:

```python
async def sync_channel(self, channel_id):
    self.members[channel_id] = await self.fetch_member_ids(channel_id)

    for member_id in self.members[channel_id]:
        if member_id not in self.channels[channel_id]:
            self.channels[channel_id][member_id] = False    # initialize
        else:
            pass

        await self.send_member_view(channel_id, member_id)

```

:::tip

1.  The default implementation of `Moobius.on_channel_init()` invokes `on_channel_checkin()` if we don't override it, which is why the Users' Views can be updated immediately after the Service restarts in our previous implementation. However, if we override it, we have to manually call `sync_channel()` (or `on_channel_checkin()`) to ensure the initialization.
2.  As you may notice, `self.members` and `self.channels` both have the same keys now (all `channel_id`s). Also `self.members[channel_id]` and (keys of) `self.channels[channel_id]` have the same set of `member_id`. It seems to be better practice to do refactoring now by removing `self.members` and substituting all occurrences of `recipients=self.members[channel_id]` to `recipients=self.channels[channel_id]` (these `recipients` arguments actually accept any iterables) as indicated by Single Responsibility Principle (SRP). However, such changes may cause extra confusion for some readers and we would like to refrain from doing this now. For better practice of this sort of state management, we can use `MoobiusStorage` covered in Advanced Tutorial.
    :::

Next, `send_member_view()` will also be modified to send a proper CanvasItem to a User (a `send_member_canvas()` helper function is defined), and the Character part is moved to `send_member_characters()`:

```python
async def send_member_view(self, channel_id, member_id):
    await self.send_member_characters(channel_id, member_id)
    await self.send_member_canvas(channel_id, member_id)

async def send_member_characters(self, channel_id, member_id):
    characters = [self.meow.character_id] + self.members[channel_id] + self.custom_agents  # Note the change
    ind = characters.index(member_id)  # find the recipient
    characters = [member_id] + characters[:ind] + characters[ind + 1:]  # reordered

    await self.send_characters(characters=characters, channel_id=channel_id, recipients=member_id)

async def send_member_canvas(self, channel_id, member_id):
    if self.channels[channel_id][member_id]:    # Meou Up
        c = types.CanvasItem(text='I am up!', path='resources/avatar.png')
        await self.send_canvas(canvas_items=c, channel_id=channel_id, recipients=member_id)
    else:
        c = types.CanvasItem(text='I am down!')
        await self.send_canvas(canvas_items=c, channel_id=channel_id, recipients=member_id)

```

Finally, in `on_message_up()`, we can let the state value be modified by a User's Message:

```python
async def on_message_up(self, message):
    if message.subtype == types.TEXT:
        text = message.content.text
        new_text = text + ' lol~'
        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

        if len(message.recipients) == 1 and message.recipients[0] == self.meow.character_id:
            if message.content.text == 'up':
                self.channels[message.channel_id][message.sender] = True
                await self.send_member_canvas(message.channel_id, message.sender)
            elif message.content.text == 'down':
                self.channels[message.channel_id][message.sender] = False
                await self.send_member_canvas(message.channel_id, message.sender)
            else:
                await self.send_message("Sorry I don't get it!", channel_id=message.channel_id, sender=self.meow,
                                        recipients=message.sender)
        else:
            pass
    else:
        await self.send_message(message)
```

The Canvas is hidden (instead of turned off) on a User's client by default, which is purely a frontend thing. Even if it is hidden, `update_canvas` still reaches the User. If a User shows the Canvas after an `update_canvas` Downward Event, they will still see the content. With that being said, if your Service utilizes the Canvas and you want your User to be aware of the change, you might want to send an `update_style` Downward Event to instruct the frontend to automatically show the Canvas when your Service starts and when a User refreshes:

```python
async def on_channel_init(self, channel_id):
    self.channels[channel_id] = {}
    await self.sync_channel(channel_id)

    s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
    await self.send_style(style_items=s, channel_id=channel_id, recipients=self.members[channel_id])

async def on_refresh(self, action):
    await self.sync_channel(channel_id)

    s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
    await self.send_style(style_items=s, channel_id=action.channel_id, recipients=self.members[action.channel_id])

```

:::tip
the reason we don't put Style update into `send_member_view()` is that we want to avoid it being called in the periodic `on_checkin()`, since if a User hides the Canvas manually, we don't want it to be automatically expanded every now and then. This is a demonstration of fine-grained control of User experience. However, if you or your Users don't care about this, just send `update_style` in `send_member_view()` for simplicity.
:::

The content on the Canvas would remain there on the screen, independent of the flow of Messages, which can be useful if you want to display something that needs to be "pinned" for a while (before the Service sends another `update_canvas` Downward Event). However, unlike Messages, Moobius doesn't store the history of Canvas for Users, which means that a Member can only see the content from the last `update_canvas`; old things happening when the Member is offline or not paying attention are gone for good (well, this may not be true if the User is using a customized client from our User-mode SDK, which is covered in our Advanced Tutorial).

Again, even if we have `self.channels` storing values that are related to individual Members's state of Canvas, they will be lost if you restart the Service. Extra effort is required to handle these situations, which involves storage and retrieve of each Member's state in an elegant way. As previously mentioned, `MoobiusStorage` would be of great help in these situations, and its usage is covered in Advanced Tutorial.

The entire code of `service.py` up to now looks like this:

```python
# service.py
from moobius import Moobius, MoobiusWand, types


class ZeroService(Moobius):
    async def before_channel_init(self):
        self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')
        self.members = {}
        self.custom_agents = []

    async def on_channel_init(self, channel_id):
        self.channels[channel_id] = {}
        await self.sync_channel(channel_id)

        s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
        await self.send_style(style_items=s, channel_id=channel_id, recipients=self.members[channel_id])

    async def on_channel_checkin(self, channel_id):
        await self.sync_channel(channel_id)

    async def on_refresh(self, action):
        await self.send_member_view(action.channel_id, action.sender)

        s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
        await self.send_style(style_items=s, channel_id=action.channel_id, recipients=self.members[action.channel_id])

    async def on_join(self, action):
        await self.sync_channel(action.channel_id)
        await self.send_message("Hello! I just joined!", channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
        await self.send_message("Welcome!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)

    async def on_leave(self, action):
        await self.sync_channel(action.channel_id)
        await self.send_message("Adios! I just left!", channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
        await self.send_message("See you next time!", channel_id=action.channel_id, sender=self.meow,
                                recipients=action.sender)

    async def on_message_up(self, message):
        if message.subtype == types.TEXT:
            text = message.content.text
            new_text = text + ' lol~'
            await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

            if len(message.recipients) == 1 and message.recipients[0] == self.meow.character_id:
                if message.content.text == 'up':
                    self.channels[message.channel_id][message.sender] = True
                    await self.send_member_canvas(message.channel_id, message.sender)
                elif message.content.text == 'down':
                    self.channels[message.channel_id][message.sender] = False
                    await self.send_member_canvas(message.channel_id, message.sender)
                else:
                    await self.send_message("Sorry I don't get it!", channel_id=message.channel_id, sender=self.meow,
                                            recipients=message.sender)
            else:
                pass

        else:
            if message.subtype in [types.IMAGE, types.AUDIO]:
                await self.download(source=message, auto_dir='recv')
                await self.send_message('resources/avatar.png', channel_id=message.channel_id, subtype=types.IMAGE,
                                        sender=self.meow, recipients=message.sender)

            elif message.subtype == types.FILE:
                await self.download(source=message,
                                    file_path=f'files/{message.content.filename}')  # dir auto created, filename specified
                await self.send_message(f'File {message.content.filename} saved!', channel_id=message.channel_id,
                                        sender=self.meow, recipients=message.sender)

            else:
                pass

            await self.send_message(message)

    async def sync_channel(self, channel_id):
        self.members[channel_id] = await self.fetch_member_ids(channel_id)

        for member_id in self.members[channel_id]:
            if member_id not in self.channels[channel_id]:
                self.channels[channel_id][member_id] = False  # initialize
            else:
                pass

            await self.send_member_view(channel_id, member_id)

    async def send_member_view(self, channel_id, member_id):
        await self.send_member_characters(channel_id, member_id)
        await self.send_member_canvas(channel_id, member_id)

    async def send_member_characters(self, channel_id, member_id):
        characters = [self.meow.character_id] + self.members[channel_id] + self.custom_agents  # Note the change
        ind = characters.index(member_id)  # find the recipient
        characters = [member_id] + characters[:ind] + characters[ind + 1:]  # reordered

        await self.send_characters(characters=characters, channel_id=channel_id, recipients=member_id)

    async def send_member_canvas(self, channel_id, member_id):
        if self.channels[channel_id][member_id]:    # Meow Up
            c = types.CanvasItem(text='I am up!', path='resources/avatar.png')
            await self.send_canvas(canvas_items=c, channel_id=channel_id, recipients=member_id)
        else:
            c = types.CanvasItem(text='I am down!')
            await self.send_canvas(canvas_items=c, channel_id=channel_id, recipients=member_id)


if __name__ == "__main__":
    MoobiusWand().run(ZeroService, config='config/config.json')

```

## Button and Dialog

Buttons are a characteristic feature of Moobius. Buttons provide an alternative means of interaction along with Messages, and what makes a GBA more "application". The Service of a Channel could display a list of Buttons to a Member with an `update_buttons` Downward Event (like other things, the Button list is also individualized, which means different Members can see different Buttons), and when a Member clicks a Button, a `button_click` Upward Event is sent to the Service. You can see these things in logs, similar as in previous sections, and we will avoid being verbose on that. Our Python SDK has implemented senders and triggers for Buttons.

Below is an example of displaying a simple Button that says Meow. You can create a Button by specifying its `button_id` (for your own reference about which Button is clicked) and its `button_text` (the text displayed on the Button). As you may realize, you can add the logic of sending buttons `send_member_buttons()` to `send_member_view()` like this:

```python
async def send_member_view(self, channel_id, member_id):
    await self.send_member_characters(channel_id, member_id)
    await self.send_member_canvas(channel_id, member_id)
    await self.send_member_buttons(channel_id, member_id)

async def send_member_buttons(self, channel_id, member_id):
    simple_button = types.Button(button_id='meow', button_text='MEOW')
    await self.send_buttons(buttons=simple_button, channel_id=channel_id, recipients=member_id)
```

:::tip
the `button_id` field is for your own reference. It is recommended to be unique for each of your Buttons, so that you will know which Button is clicked in an easy way, but it does not have to be so.
:::

Restart your Service, and you will find a Button with text "MEOW" appearing on top of your Message input area. Click the Button, and you will find a `button_click` Action in your log. The Action contains a `button_id` field that indicates the Button the User clicked.

```json
2024-08-21 14:24:24.432 | INFO     | moobius.network.ws_client:receive:142 -  {"type": "action", "body": {"subtype": "button_click", "button_id": "meow", "channel_id": "21cbc716-41ea-4f22-92ef-345516d92892", "arguments": [], "bottom_button_id": "confirm", "context": {}, "sender": "e91aa5bc-0001-70e8-cbf5-2fcafefa322b"}}
```

This Action will trigger the `on_button_click()` method defined in our SDK, so that the Service can handle accordingly. For instance:

```json
async def on_button_click(self, action):
    if action.button_id == 'meow':
        await self.send_message('I clicked Meow!', channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
    else:
        pass
```

With this implementation, whenever a Member clicks the Button `meow`, a Message will be sent to all Members in the Channel on the clicker's behalf.

The Button demonstrated above is a simple one, and a `button_click` Action is sent right after the Button is clicked. You can also have a "complex" version of Button that pops up a Dialog so that a User can input some arguments there, and a `button_click` Action is sent when the User submits the arguments by clicking a Bottom Button that appears at the Bottom of the Dialog. Here is an example, and you can just copy-paste the code and restart the Service, then we will explain what happened:

```python
async def send_member_buttons(self, channel_id, member_id):
    simple_button = types.Button(button_id='meow', button_text='MEOW')

    ic1 = types.InputComponent(label='What would you like to say?', type=types.TEXT)
    ic2 = types.InputComponent(label='How many times to repeat?', type=types.DROPDOWN, choices=['1', '2', '3'], required=True)
    dialog = types.Dialog(title='REPEAT', components=[ic1, ic2])

    dialog_button = types.Button(button_id='repeat', button_text='REPEAT', dialog=dialog)

    await self.send_buttons(buttons=[simple_button, dialog_button], channel_id=channel_id, recipients=member_id)

async def on_button_click(self, action):
    if action.button_id == 'meow':
        await self.send_message('I clicked Meow!', channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
    elif action.button_id == 'repeat':
        text = action.arguments[0].value
        rep = int(action.arguments[1].value)  # The value is a str
        text = text * rep

        await self.send_message(text, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
    else:
        pass
```

You can find a `repeat` Button in your Channel, and after you click it, a Dialog will pop up. The Dialog consists of a title, a list of input components (each with a label and an input area), and one or more Bottom Buttons. Line 4-6 in the previous code snippet shows how to construct an InputComponent and how to construct a Dialog on top of that.
![moobius](/img/img-5.jpeg)

Once we have the Dialog, we can construct a Button that pops up the Dialog by passing the `dialog` argument to it (Line 8), and send an `update_buttons` Downward Event in `send_member_buttons()`. Once a User clicks the "Confirm" button after filling in the form shown on the Dialog, a `button_click` Action will be sent to the Service, which contains an `argument` field that is a list of `InputArgument` instances that encapsulates the input arguments from the User. The `value` of each argument can be extracted and further handled in the `on_button_click()` method. Note that the arguments appears in the same order as in the `InputComponents` that defined the Button, and a `value` is always a string even if it seems to be a number. (todo: filename?)

:::tip
There are a lot of GUI details about the Dialog, including the placeholder text, the input modality, and whether the field is a required one, etc. We may modify these details or introduce new interaction patterns/components in the future (for example, adding custom color to the label text) and update our SDK correspondingly. These things are not covered in this tutorial, and please refer to our API and SDK Documentation for the latest specifications.
:::

By default, the "Confirm" button is the only Bottom Button that appears in a Dialog. Alternatively, you can specify a customized list of Bottom Buttons. Each Bottom Button is defined by an `id` field (recommended to be unique but not required), a `text` field and a `submit` field. `text` specifies the text on the Bottom Button, and `submit` is a boolean value that indicates whether a `button_click` Event is actually sent (along with the form). A typical use case is the "Confirmation Dialog" scenario (like when you try to delete some file from your own computer and the operating system asks for confirmation). When a User clicks any Bottom Button, the dialogue will always be closed, but the `button_click` Action will not be sent unless the submit field of the clicked Bottom Button is true. Obviously, the `submit` field of the default "Confirm" Button is `true`. We can modify our "repeat" Button's Dialog to have multiple Bottom Buttons for extra repeats:

```python
async def send_member_buttons(self, channel_id, member_id):
    simple_button = types.Button(button_id='meow', button_text='MEOW')

    ic1 = types.InputComponent(label='What would you like to say?', type=types.TEXT)
    ic2 = types.InputComponent(label='How many times to repeat?', type=types.DROPDOWN, choices=['1', '2', '3'],
                               required=True)

    bottom1 = types.BottomButton(id='cancel', text='NO!', submit=False)
    bottom2 = types.BottomButton(id='double', text='Extra 2x', submit=True)
    bottom3 = types.BottomButton(id='triple', text='Extra 3x', submit=True)

    dialog = types.Dialog(title='REPEAT', components=[ic1, ic2], bottom_buttons=[bottom1, bottom2, bottom3])

    dialog_button = types.Button(button_id='repeat', button_text='REPEAT', dialog=dialog)

    await self.send_buttons(buttons=[simple_button, dialog_button], channel_id=channel_id, recipients=member_id)

async def on_button_click(self, action):
    if action.button_id == 'meow':
        await self.send_message('I clicked Meow!', channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
    elif action.button_id == 'repeat':
        text = action.arguments[0].value
        rep = int(action.arguments[1].value)  # The value is a str

        if action.bottom_button_id == 'double':
            text = text * rep * 2
        elif action.bottom_button_id == 'triple':
            text = text * rep * 3
        else:
            pass

        await self.send_message(text * rep, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
    else:
        pass
```

Note that if the User clicks the Bottom Button "NO!", then no `button_click` Action will even be sent to the Service (which is the same behavior as in the case when the User just clicks 'x' to close the Dialog). Also, the `bottom_button_id` will be encapsulated in the `action` argument passed into `on_button_click()` so that we will know which Bottom Button is actually clicked, and the text for `message_down` sent to the User can be generated accordingly.

The code up to now looks like this:

```python
# service.py
from moobius import Moobius, MoobiusWand, types


class ZeroService(Moobius):
    async def before_channel_init(self):
        self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')
        self.members = {}
        self.custom_agents = []

    async def on_channel_init(self, channel_id):
        self.channels[channel_id] = {}
        await self.sync_channel(channel_id)

        s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
        await self.send_style(style_items=s, channel_id=channel_id, recipients=self.members[channel_id])

    async def on_channel_checkin(self, channel_id):
        await self.sync_channel(channel_id)

    async def on_refresh(self, action):
        await self.send_member_view(action.channel_id, action.sender)

        s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
        await self.send_style(style_items=s, channel_id=action.channel_id, recipients=self.members[action.channel_id])

    async def on_join(self, action):
        await self.sync_channel(action.channel_id)
        await self.send_message("Hello! I just joined!", channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
        await self.send_message("Welcome!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)

    async def on_leave(self, action):
        await self.sync_channel(action.channel_id)
        await self.send_message("Adios! I just left!", channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
        await self.send_message("See you next time!", channel_id=action.channel_id, sender=self.meow,
                                recipients=action.sender)

    async def on_button_click(self, action):
        if action.button_id == 'meow':
            await self.send_message('I clicked Meow!', channel_id=action.channel_id, sender=action.sender,
                                    recipients=self.members[action.channel_id])
        elif action.button_id == 'repeat':
            text = action.arguments[0].value
            rep = int(action.arguments[1].value)  # The value is a str

            if action.bottom_button_id == 'double':
                text = text * rep * 2
            elif action.bottom_button_id == 'triple':
                text = text * rep * 3
            else:
                pass

            await self.send_message(text, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
        else:
            pass

    async def on_message_up(self, message):
        if message.subtype == types.TEXT:
            text = message.content.text
            new_text = text + ' lol~'
            await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

            if len(message.recipients) == 1 and message.recipients[0] == self.meow.character_id:
                if message.content.text == 'up':
                    self.channels[message.channel_id][message.sender] = True
                    await self.send_member_canvas(message.channel_id, message.sender)
                elif message.content.text == 'down':
                    self.channels[message.channel_id][message.sender] = False
                    await self.send_member_canvas(message.channel_id, message.sender)
                else:
                    await self.send_message("Sorry I don't get it!", channel_id=message.channel_id, sender=self.meow,
                                            recipients=message.sender)
            else:
                pass

        else:
            if message.subtype in [types.IMAGE, types.AUDIO]:
                await self.download(source=message,
                                    auto_dir='recv')  # the directory is automatically created and filename is generated
                await self.send_message('resources/avatar.png', channel_id=message.channel_id, subtype=types.IMAGE,
                                        sender=self.meow, recipients=message.sender)

            elif message.subtype == types.FILE:
                await self.download(source=message,
                                    file_path=f'files/{message.content.filename}')  # dir auto created, filename specified
                await self.send_message(f'File {message.content.filename} saved!', channel_id=message.channel_id,
                                        sender=self.meow, recipients=message.sender)

            else:
                pass

            await self.send_message(message)

    async def sync_channel(self, channel_id):
        self.members[channel_id] = await self.fetch_member_ids(channel_id)

        for member_id in self.members[channel_id]:
            if member_id not in self.channels[channel_id]:
                self.channels[channel_id][member_id] = False  # initialize
            else:
                pass

            await self.send_member_view(channel_id, member_id)

    async def send_member_view(self, channel_id, member_id):
        await self.send_member_characters(channel_id, member_id)
        await self.send_member_canvas(channel_id, member_id)
        await self.send_member_buttons(channel_id, member_id)

    async def send_member_characters(self, channel_id, member_id):
        characters = [self.meow.character_id] + self.members[channel_id] + self.custom_agents  # Note the change
        ind = characters.index(member_id)  # find the recipient
        characters = [member_id] + characters[:ind] + characters[ind + 1:]  # reordered

        await self.send_characters(characters=characters, channel_id=channel_id, recipients=member_id)

    async def send_member_canvas(self, channel_id, member_id):
        if self.channels[channel_id][member_id]:    # Meow Up
            c = types.CanvasItem(text='I am up!', path='resources/avatar.png')
            await self.send_canvas(canvas_items=c, channel_id=channel_id, recipients=member_id)
        else:
            c = types.CanvasItem(text='I am down!')
            await self.send_canvas(canvas_items=c, channel_id=channel_id, recipients=member_id)

    async def send_member_buttons(self, channel_id, member_id):
        simple_button = types.Button(button_id='meow', button_text='MEOW')

        ic1 = types.InputComponent(label='What would you like to say?', type=types.TEXT)
        ic2 = types.InputComponent(label='How many times to repeat?', type=types.DROPDOWN, choices=['1', '2', '3'],
                                   required=True)

        bottom1 = types.BottomButton(id='cancel', text='NO!', submit=False)
        bottom2 = types.BottomButton(id='double', text='Extra 2x', submit=True)
        bottom3 = types.BottomButton(id='triple', text='Extra 3x', submit=True)

        dialog = types.Dialog(title='REPEAT', components=[ic1, ic2], bottom_buttons=[bottom1, bottom2, bottom3])

        dialog_button = types.Button(button_id='repeat', button_text='REPEAT', dialog=dialog)

        await self.send_buttons(buttons=[simple_button, dialog_button], channel_id=channel_id, recipients=member_id)


if __name__ == "__main__":
    MoobiusWand().run(ZeroService, config='config/config.json')

```

## Context Menu

A Context Menu is a pop-up menu which appears when a User right-clicks a Message. A Context Menu typically has one or more clickable Menu Items, each item is very similar as a Button. A Menu Item may or may not pop up a new Dialog, and the Dialog triggered by a Menu Item is basically the same as those triggered by Buttons. When a Member clicks a Menu Item (and submits the arguments from Dialog, if applicable), a `menu_item_click` Action is sent to the Service which can be seen in the log. This Action will invoke the `on_menu_item_click()` method defined in the class `Moobius` in our Python SDK.

In order to allow users to use context menus, the Service must call `send_menu()` to send an `update_menu` Downward Event to the Member(s). The first argument can be one `MenuItem` instance or a list of it. Each `MenuItem` has a `message_subtypes` attribute that indicates which Message subtypes this Menu Item will appear for, which allows different Menu Items to be "assembled" differently for different Message subtypes. For instance, you may want an "OCR" Menu Item to appear only in image Messages, but not text or audio Messages.

The data fields of a `menu_item_click` Action are similar as a `button_click` Action, but with extra fields of `message_id`, `message_subtype` and `message_content` indicating the clicked Message (which can be either a `message_up` or a `message_down`).

:::tip
The Message is not entirely repeated in the `menu_item_click` Event. Some fields like `timestamp`, `recipients` etc are amiss. However, the `message_id` provides a unique reference to a `previous` Message, which should be received by the Service. For typical usages, the Service does not have to store the entire Message history, and `message_content` and `message_subtype` provides enough information. However, the Service can choose to do that and query the `message_id` if they really want every detail of the Message that is right-clicked.
:::

The following code snippet demonstrates two types of Menu Items. The `mi_type` ("What type is it?") does not pop up a Dialog and appears for text, image and audio Messages. The `mi_repeat` ("Repeat!") pops up a Dialog, and only appears for text Messages. (Note no Context Menu for file Messages). Given the fact that we are using similar Dialogs for the "REPEAT" Button and `mi_repeat` Menu Item, we can just refactor and move the initialization for these UI resources, among others, into `before_channel_init()` and simplify `send_member_buttons()` and `send_member_canvas()` as well:

```python
async def before_channel_init(self):
    self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')
    self.members = {}
    self.custom_agents = []

    self.meow_up_canvas = types.CanvasItem(text='I am up!', path='resources/avatar.png')
    self.meow_down_canvas = types.CanvasItem(text='I am down!')

    ic1 = types.InputComponent(label='What would you like to say?', type=types.TEXT)
    ic2 = types.InputComponent(label='How many times to repeat?', type=types.DROPDOWN, choices=['1', '2', '3'],
                               required=True)

    bottom1 = types.BottomButton(id='cancel', text='NO!', submit=False)
    bottom2 = types.BottomButton(id='double', text='Extra 2x', submit=True)
    bottom3 = types.BottomButton(id='triple', text='Extra 3x', submit=True)

    button_dialog = types.Dialog(title='REPEAT', components=[ic1, ic2], bottom_buttons=[bottom1, bottom2, bottom3])
    menu_dialog = types.Dialog(title='REPEAT THE MESSAGE', components=[ic2], bottom_buttons=[bottom1, bottom2, bottom3])

    self.simple_button = types.Button(button_id='meow', button_text='MEOW')
    self.dialog_button = types.Button(button_id='repeat', button_text='REPEAT', dialog=button_dialog)

    self.simple_menu_item = types.MenuItem(menu_item_id='mi_type', menu_item_text='What type is it?', message_subtypes=[types.TEXT, types.AUDIO, types.IMAGE])
    self.dialog_menu_item = types.MenuItem(menu_item_id='mi_repeat', menu_item_text='Repeat!', message_subtypes=[types.TEXT], dialog=menu_dialog)

async def send_member_view(self, channel_id, member_id):
    await self.send_member_characters(channel_id, member_id)
    await self.send_member_canvas(channel_id, member_id)
    await self.send_member_buttons(channel_id, member_id)
    await self.send_member_menus(channel_id, member_id)

async def send_member_canvas(self, channel_id, member_id):
    if self.channels[channel_id][member_id]:    # Meow Up
        await self.send_canvas(canvas_items=self.meow_up_canvas, channel_id=channel_id, recipients=member_id)
    else:
        c = types.CanvasItem(text='I am down!')
        await self.send_canvas(canvas_items=self.meow_down_canvas, channel_id=channel_id, recipients=member_id)

async def send_member_buttons(self, channel_id, member_id):
    await self.send_buttons(buttons=[self.simple_button, self.dialog_button], channel_id=channel_id, recipients=member_id)

async def send_member_menus(self, channel_id, member_id):
    await self.send_menu(menu_items=[self.simple_menu_item, self.dialog_menu_item], channel_id=channel_id, recipients=member_id)
```

Now restart your Service, and send different types of Messages and right-click on each one (Both Upward and Downward), and you can find Menu Items appearing (or not appearing) as expected.

Tip: Although not demonstrated here, the Buttons and Menu can be individualized and the management of these UI components can be non-trivial in a more complex CCS app. For this simple example, we can put everything inside `before_channel_init()`, but for complicated scenarios, `MoobiusStorage` could be really helpful. Please see our Advanced Tutorial.

The last step is to handle the `menu_item_click` Action properly (which, like `button_click`, you can see in console logs). We hope you already know the drill and can write something like this:

```python
async def on_menu_item_click(self, action):
    if action.menu_item_id == 'mi_type':
        reply = f'The type of the message you clicked is {action.message_subtype}'
        await self.send_message(reply, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
    elif action.menu_item_id == 'mi_repeat':
        text = action.message_content.text
        rep = int(action.arguments[0].value)

        if action.bottom_button_id == 'double':
            await self.send_message(text * rep * 2, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
        elif action.bottom_button_id == 'triple':
            await self.send_message(text * rep * 3, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
        else:
            pass
    else:
        pass
```

Restart your Service and test your Menu. If everything works fine, that means you have already graduated from the Basic Tutorial and you are able to develop a new Moobius GBA on your own now! Let's congratulate it by giving your Channel a new name and description with `update_channel()` (of course you can call it anywhere you like, but `sync_channel()` is a convenient place to put all the updates):

```python
async def sync_channel(self, channel_id):
    await self.update_channel(channel_id=channel_id, channel_name='Graduated!', channel_desc='I know Moobius now!')
    self.members[channel_id] = await self.fetch_member_ids(channel_id)

    for member_id in self.members[channel_id]:
        if member_id not in self.channels[channel_id]:
            self.channels[channel_id][member_id] = False  # initialize
        else:
            pass

        await self.send_member_view(channel_id, member_id)
```

The code of the entire `service.py` is still less than 200 lines, but it is a full-fledged real-world demo of what a GBA could look like and covers most of the important features. We hope you already get some idea of how Moobius Platform and SDK works. We encourage you to share your GBA with your fellows (they will be excited about your work!). Also, you can learn our Advanced Tutorial (Coming Soon) for a deeper grasp of other amazing features of our SDK for those who want to deal with complex scenarios with Moobius as an expert. Again, let's share the final code, but rename `ZeroService` to `TutorialService`.

```python
# service.py
from moobius import Moobius, MoobiusWand, types


class TutorialService(Moobius):
    async def before_channel_init(self):
        self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')
        self.members = {}
        self.custom_agents = []

        self.meow_up_canvas = types.CanvasItem(text='I am up!', path='resources/avatar.png')
        self.meow_down_canvas = types.CanvasItem(text='I am down!')

        ic1 = types.InputComponent(label='What would you like to say?', type=types.TEXT)
        ic2 = types.InputComponent(label='How many times to repeat?', type=types.DROPDOWN, choices=['1', '2', '3'],
                                   required=True)

        bottom1 = types.BottomButton(id='cancel', text='NO!', submit=False)
        bottom2 = types.BottomButton(id='double', text='Extra 2x', submit=True)
        bottom3 = types.BottomButton(id='triple', text='Extra 3x', submit=True)

        button_dialog = types.Dialog(title='REPEAT', components=[ic1, ic2], bottom_buttons=[bottom1, bottom2, bottom3])
        menu_dialog = types.Dialog(title='REPEAT THE MESSAGE', components=[ic2], bottom_buttons=[bottom1, bottom2, bottom3])

        self.simple_button = types.Button(button_id='meow', button_text='MEOW')
        self.dialog_button = types.Button(button_id='repeat', button_text='REPEAT', dialog=button_dialog)

        self.simple_menu_item = types.MenuItem(menu_item_id='mi_type', menu_item_text='What type is it?', message_subtypes=[types.TEXT, types.AUDIO, types.IMAGE])
        self.dialog_menu_item = types.MenuItem(menu_item_id='mi_repeat', menu_item_text='Repeat!', message_subtypes=[types.TEXT], dialog=menu_dialog)

    async def on_channel_init(self, channel_id):
        self.channels[channel_id] = {}
        await self.sync_channel(channel_id)

        s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
        await self.send_style(style_items=s, channel_id=channel_id, recipients=self.members[channel_id])

    async def on_channel_checkin(self, channel_id):
        await self.sync_channel(channel_id)

    async def on_refresh(self, action):
        await self.send_member_view(action.channel_id, action.sender)

        s = types.StyleItem(widget=types.CANVAS, display='visible', expand=True)
        await self.send_style(style_items=s, channel_id=action.channel_id, recipients=self.members[action.channel_id])

    async def on_join(self, action):
        await self.sync_channel(action.channel_id)
        await self.send_message("Hello! I just joined!", channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
        await self.send_message("Welcome!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)

    async def on_leave(self, action):
        await self.sync_channel(action.channel_id)
        await self.send_message("Adios! I just left!", channel_id=action.channel_id, sender=action.sender,
                                recipients=self.members[action.channel_id])
        await self.send_message("See you next time!", channel_id=action.channel_id, sender=self.meow,
                                recipients=action.sender)

    async def on_button_click(self, action):
        if action.button_id == 'meow':
            await self.send_message('I clicked Meow!', channel_id=action.channel_id, sender=action.sender,
                                    recipients=self.members[action.channel_id])
        elif action.button_id == 'repeat':
            text = action.arguments[0].value
            rep = int(action.arguments[1].value)  # The value is a str

            if action.bottom_button_id == 'double':
                text = text * rep * 2
            elif action.bottom_button_id == 'triple':
                text = text * rep * 3
            else:
                pass

            await self.send_message(text, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
        else:
            pass

    async def on_menu_item_click(self, action):
        if action.menu_item_id == 'mi_type':
            reply = f'The type of the message you clicked is {action.message_subtype}'
            await self.send_message(reply, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
        elif action.menu_item_id == 'mi_repeat':
            text = action.message_content.text
            rep = int(action.arguments[0].value)

            if action.bottom_button_id == 'double':
                await self.send_message(text * rep * 2, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
            elif action.bottom_button_id == 'triple':
                await self.send_message(text * rep * 3, channel_id=action.channel_id, sender=self.meow, recipients=action.sender)
            else:
                pass
        else:
            pass

    async def on_message_up(self, message):
        if message.subtype == types.TEXT:
            text = message.content.text
            new_text = text + ' lol~'
            await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)

            if len(message.recipients) == 1 and message.recipients[0] == self.meow.character_id:
                if message.content.text == 'up':
                    self.channels[message.channel_id][message.sender] = True
                    await self.send_member_canvas(message.channel_id, message.sender)
                elif message.content.text == 'down':
                    self.channels[message.channel_id][message.sender] = False
                    await self.send_member_canvas(message.channel_id, message.sender)
                else:
                    await self.send_message("Sorry I don't get it!", channel_id=message.channel_id, sender=self.meow,
                                            recipients=message.sender)
            else:
                pass

        else:
            if message.subtype in [types.IMAGE, types.AUDIO]:
                await self.download(source=message,
                                    auto_dir='recv')  # the directory is automatically created and filename is generated
                await self.send_message('resources/avatar.png', channel_id=message.channel_id, subtype=types.IMAGE,
                                        sender=self.meow, recipients=message.sender)

            elif message.subtype == types.FILE:
                await self.download(source=message,
                                    file_path=f'files/{message.content.filename}')  # dir auto created, filename specified
                await self.send_message(f'File {message.content.filename} saved!', channel_id=message.channel_id,
                                        sender=self.meow, recipients=message.sender)

            else:
                pass

            await self.send_message(message)

    async def sync_channel(self, channel_id):
        await self.update_channel(channel_id=channel_id, channel_name='Graduated!', channel_desc='I know Moobius now!')
        self.members[channel_id] = await self.fetch_member_ids(channel_id)

        for member_id in self.members[channel_id]:
            if member_id not in self.channels[channel_id]:
                self.channels[channel_id][member_id] = False  # initialize
            else:
                pass

            await self.send_member_view(channel_id, member_id)

    async def send_member_view(self, channel_id, member_id):
        await self.send_member_characters(channel_id, member_id)
        await self.send_member_canvas(channel_id, member_id)
        await self.send_member_buttons(channel_id, member_id)
        await self.send_member_menus(channel_id, member_id)

    async def send_member_characters(self, channel_id, member_id):
        characters = [self.meow.character_id] + self.members[channel_id] + self.custom_agents  # Note the change
        ind = characters.index(member_id)  # find the recipient
        characters = [member_id] + characters[:ind] + characters[ind + 1:]  # reordered

        await self.send_characters(characters=characters, channel_id=channel_id, recipients=member_id)

    async def send_member_canvas(self, channel_id, member_id):
        if self.channels[channel_id][member_id]:    # Meow Up
            await self.send_canvas(canvas_items=self.meow_up_canvas, channel_id=channel_id, recipients=member_id)
        else:
            c = types.CanvasItem(text='I am down!')
            await self.send_canvas(canvas_items=self.meow_down_canvas, channel_id=channel_id, recipients=member_id)

    async def send_member_buttons(self, channel_id, member_id):
        await self.send_buttons(buttons=[self.simple_button, self.dialog_button], channel_id=channel_id, recipients=member_id)

    async def send_member_menus(self, channel_id, member_id):
        await self.send_menu(menu_items=[self.simple_menu_item, self.dialog_menu_item], channel_id=channel_id, recipients=member_id)


if __name__ == "__main__":
    MoobiusWand().run(TutorialService, config='config/config.json')
```
