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
    if len(message.recipients) == 1 and message.recipients[0] == self.meow.character_id:
        if message.subtype == types.TEXT:
            if message.content.text == 'up':
                c = types.CanvasElement(text='I am up!', path='resources/avatar.png')    # the path could be a local file or an url
                await self.send_update_canvas(canvas_elements=c, channel_id=message.channel_id, recipients=message.sender)
            elif message.content.text == 'down':
                c = types.CanvasElement(text='I am down!')
                await self.send_update_canvas(canvas_elements=c, channel_id=message.channel_id, recipients=message.sender)
            else:
                await self.send_message("Sorry I don't get it!", channel_id=message.channel_id, sender=self.meow.character_id, recipients=message.sender)
        else:
            pass
    else:
        await self.send_message(message)
```

The canvas in the Channel is by default hidden, and you have to show it by clicking the

![moobius](/img/img-4.png)

icon next to "Canvas" on the upper right-hand side of the webpage. Now try sending "up", "down" or anything else targeted to Meow. You will find your Channel's Canvas updated. Like Characters and Messages, The Canvas of different Members are independent (Meow could be on User A's Canvas but not on User B's). In the above code, the `send_update_canvas()` method of our SDK sends an `update_canvas` Downward Event, which is somehow similar as `send_message()`, but its argument `canvas_elements` should be a `CanvasElement` instance, or a list of that, to be sent as the data payload to the Canvas. A `CanvasElement` consists of two optional fields: `path` (for image) and `text` (for text), which determines what to display on the Canvas.

:::tip

1. If `path` and `text` are both `None` (by default), the result will be an empty Canvas.
2. You can pass the file path of a local image to `path` argument, but the SDK will upload it to the file Service of Moobius under the hood, and use the url of the uploaded file as the actual payload sent to the Moobius Platform. Large files are not sent directly through websocket.
3. If you pass a list of `CanvasElement` objects, they will appear in the client's Canvas area as one "frame" with multiple canvas elements so that a User can scroll left/right to view each of them. When a subsequent frame is sent, all of them will be overwritten.
   :::

The Canvas is hidden (instead of turned off) on a User's client by default, which is purely a frontend thing. Even if it is hidden, `update_canvas` still reaches the User. If a User shows the Canvas after an `update_canvas` Downward Event, they will still see the content. With that being said, if your Service utilizes the Canvas and you don't want your User to be even unaware of that, you might want to send an `update_style` Downward Event to instruct the frontend to automatically show the Canvas in response to a `fetch_style` Upward Event which is automatically sent (along with other `fetch` Events) when a User joins or refreshes a channel.

```python
async def on_fetch_style(self, action):
    s = types.StyleElement(widget=types.CANVAS, display='visible', expand=True)
    await self.send_update_style(style_content=s, channel_id=action.channel_id, recipients=action.sender)
```

The content on the Canvas would remain there on the screen, independent of the flow of Messages, which can be useful if you want to display something that needs to be "pinned" for a while (before the Service sends another `update_canvas` Downward Event). However, unlike Messages, Moobius doesn't store the history of Canvas for Users, which means that a Member can only see the content from the last `update_canvas`; old things happening when the Member is offline or not paying attention are gone for good (well, this may not be true if the User is using a customized client from our Agent SDK, which is covered in our Advanced Tutorial).

In the above example, the content of the Canvas wouldn't persist if the User refreshes the browser, or switches the current Channel away and comes back, which is exactly what happened to the Character list if we don't respond properly to `fetch_characters` Actions. In either case above, the Service will receive a fetch_canvas Upward Event (alongside a `fetch_characters`, which you can see in the logs) , which would automatically trigger the `on_fetch_canvas()` method:

```python
async def on_fetch_canvas(self, action):
    c = types.CanvasElement(path='resources/avatar.png', text='Refreshed!')
    await self.send_update_canvas(canvas_elements=c, channel_id=action.channel_id, recipients=action.sender)
```

When a new User joins a Channel, a `fetch_canvas` will also be sent to the Service after join_channel, so that you can send some welcome stuff.

Again, if you have some variables in your Service that are related to individual Members's state of Canvas, they may be lost if you restart the Service. Extra effort is required to handle these situations, which involves storage and retrieve of each Member's state in an elegant way. As previously mentioned, `MoobiusStorage` would be of great help in these situations, and the usage will be covered in Advanced Tutorial.

## Button

Buttons are a characteristic feature of Moobius. Buttons provide an alternative means of interaction along with Messages, and what makes a GBA more "application". The Service of a Channel could display a list of Buttons to a Member with an `update_buttons` Downward Event (like other things, the Button list is also individualized, which means different Members can see different Buttons), and when a Member clicks a Button, a `button_click` Upward Event is sent to the Service. Moreover, when a User joins a Channel or refreshes the browser, a `fetch_buttons` Upward Event is sent to the Service. You can see all these things in logs, similar as in previous sections, and we will avoid being verbose on that. Our Python SDK has implemented senders and triggers for buttons.

Below is an example for a simple Button that says Meow.

```python
async def on_fetch_buttons(self, action):
    b = types.Button(button_id='meow', button_name='MEOW', new_window=False)
    await self.send_update_buttons([b], channel_id=action.channel_id, recipients=action.sender)
```

### on_button_click

### new_window

## Context Menu
