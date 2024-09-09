"use strict";(self.webpackChunkmoobius_doc=self.webpackChunkmoobius_doc||[]).push([[980],{6826:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>d});var t=n(4848),a=n(8453);const i={id:"Messages"},o=void 0,r={id:"tutorial-basics/Messages",title:"Messages",description:"Upward and Downward Messages",source:"@site/docs/tutorial-basics/Messages.md",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/Messages",permalink:"/moobius/tutorial-basics/Messages",draft:!1,unlisted:!1,editUrl:"https://github.com/groupultra/moobius/edit/main/docs/tutorial-basics/Messages.md",tags:[],version:"current",lastUpdatedBy:"hangyi",lastUpdatedAt:1725873532e3,frontMatter:{id:"Messages"},sidebar:"docs",previous:{title:"Members and Characters",permalink:"/moobius/tutorial-basics/Members_Characters"},next:{title:"Canvas & Button & Context Menu",permalink:"/moobius/tutorial-basics/CanvasButton"}},c={},d=[{value:"Upward and Downward Messages",id:"upward-and-downward-messages",level:2},{value:"Messaging Logic",id:"messaging-logic",level:2},{value:"Message Subtypes",id:"message-subtypes",level:2}];function l(e){const s={a:"a",admonition:"admonition",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h2,{id:"upward-and-downward-messages",children:"Upward and Downward Messages"}),"\n",(0,t.jsxs)(s.p,{children:["The messaging system is the most essential part of any GBA. Users always see the messages in reverse chronological order and the Service controls who gets what messages. However, just like the case of Characters, the default ",(0,t.jsx)(s.code,{children:"Moobius"})," instance does nothing to handle Messages."]}),"\n",(0,t.jsxs)(s.p,{children:['Keep your Service running and send a text Message from User A, saying "hello world", to the Channel. You can specify any targets (if you already have ',(0,t.jsx)(s.code,{children:"A"}),", ",(0,t.jsx)(s.code,{children:"B"}),", ",(0,t.jsx)(s.code,{children:"C"})," and ",(0,t.jsx)(s.code,{children:"Meow"}),") if you want to. Although nothing could be observed from other Users' perspective, you will notice a console log like this:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-shell",children:'2024-07-26 13:28:25.975 | INFO     | moobius.network.ws_client:receive:128 - {"type": "message_up", "body": {"subtype": "text", "content": {"text": "hello world"}, "channel_id": "a95072a4-2869-41c6-a26d-a164065031df", "timestamp": 1722014904438, "recipients": "51e59300-e58f-46ea-a7ab-4052d66d137c", "message_id": "15ec8005-ad17-4f7c-8c19-51a0bea94682", "context": {"group_id": "51e59300-e58f-46ea-a7ab-4052d66d137c", "group_name": "Meow", "character_num": 1, "channel_type": "ccs"}, "sender": "e43c5534-ccad-4f7e-b85c-d0a77b1f47b4"}}\n'})}),"\n",(0,t.jsxs)(s.p,{children:["This corresponds to a ",(0,t.jsx)(s.code,{children:"message_up"})," Upward Event sent to the Service that includes the details of the Message, including its sender, intended recipients, and Message body, etc. The data is then parsed into a ",(0,t.jsx)(s.code,{children:"MessageBody"})," object and passed into the handler function ",(0,t.jsx)(s.code,{children:"on_message_up()"}),", which is invoked automatically (just like what happened for other triggers starting with ",(0,t.jsx)(s.code,{children:"on_"}),", like ",(0,t.jsx)(s.code,{children:"on_refresh()"}),"). Therefore, you can handle the Message by implementing ",(0,t.jsx)(s.code,{children:"on_message_up()"})," in your ",(0,t.jsx)(s.code,{children:"ZeroService"})," class. The easiest way to implement a simple Message forwarding system is just a one-liner:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-python",children:"async def on_message_up(self, message):\n    await self.send_message(message)\n"})}),"\n",(0,t.jsxs)(s.p,{children:["The ",(0,t.jsx)(s.code,{children:"send_message()"})," method will automatically extract the Message content and intended recipients from ",(0,t.jsx)(s.code,{children:"message"}),", and send a ",(0,t.jsx)(s.code,{children:"message_down"})," Downward Event to the Moobius Platform to instruct it to send the Message to all intended recipients. With this implementation, the Service will try to send the message as intended, which seems like the default behavior of a Moobius Channel where no CCS is involved."]}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.p,{children:["If you carefully inspect the ",(0,t.jsx)(s.code,{children:"message_up"})," data in the log, you will find that the ",(0,t.jsx)(s.code,{children:"recipients"}),' field is always just ONE string, no matter how many intended recipients there are. This is due to our internal mechanism to convert a list of Character IDs into a Group ID, which is what actually passes through the websocket connection between the Moobius Platform and Users/Services. This mechanism can prevent the data package from exceeding the size limit for large Channels (say, 10K recipients). Moobius has a separate HTTP service for this conversion (both ways). However, our SDK takes care of these overhead, and you never need to take care of the "Group" issue, and you can safely assume that in all high-level dataclasses and methods (like the ',(0,t.jsx)(s.code,{children:"message_up"})," argument, which is of type ",(0,t.jsx)(s.code,{children:"MessageBody"})," with a ",(0,t.jsx)(s.code,{children:"recipients"})," field, and ",(0,t.jsx)(s.code,{children:"send_message()"}),", which accepts a ",(0,t.jsx)(s.code,{children:"recipients"})," optional argument), ",(0,t.jsx)(s.code,{children:"recipients"})," means a list of Character IDs (actually you can pass just ONE Character ID when there is only one recipient for simplicity, but still it is just an alias of the one-element list, and has nothing to do with the Group ID)."]})}),"\n",(0,t.jsxs)(s.p,{children:["However, it should be kept in mind that if the CCS uses Agents, the intended recipients of a ",(0,t.jsx)(s.code,{children:"message_up"})," may contain Members as well as Agents. The Service ignores any recipient in the ",(0,t.jsx)(s.code,{children:"message_down"})," that is not a current Member of that Channel (it ignores Agents, former Members, or fake Character IDs) at the time Moobius receives it. Only current Members in the given channel receive the Message. For example, if User A selects ",(0,t.jsx)(s.code,{children:"B"})," and ",(0,t.jsx)(s.code,{children:"Meow"})," as intended recipients and sends a ",(0,t.jsx)(s.code,{children:"message_up"}),", and the Service sends a ",(0,t.jsx)(s.code,{children:"message_down"})," with the same recipients, then only ",(0,t.jsx)(s.code,{children:"B"})," receives the Message."]}),"\n",(0,t.jsx)(s.p,{children:"Here are some nuances that are worth paying attention to, which could easily be overlooked if you are in the mindset of a traditional group chat software:"}),"\n",(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsx)(s.p,{children:"A User's intended recipients may or may not include the User's own Character ID. In other words, if the User appears in its own Character list, they have a choice to send a Message to themselves or not. You can try it by sending two Messages from User A, one including User A in the target and one does not, and see the difference."}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.ol,{start:"2",children:["\n",(0,t.jsxs)(s.li,{children:['When a User chooses to send a Message to "Service(\u221e)" from the browser client, the ',(0,t.jsx)(s.code,{children:"message_up"}),' will have an empty list as its intended recipients. In other words, this literally means "sends to nobody". But the Service receives ',(0,t.jsx)(s.code,{children:"message_up"})," messages regardless of who they are sent to. The recipient list will be empty for messages sent to the service."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.ol,{start:"3",children:["\n",(0,t.jsxs)(s.li,{children:['There is nothing special when a User chooses to send a Message to "All". This is simply a shortcut for the browser to use the entire current Character list as the recipients. The list is not necessarily equivalent to the ground truth (Remember, only Service knows the ground truth), but just a User\'s perception. One User\'s "All" may change over time (when an ',(0,t.jsx)(s.code,{children:"update_charaters"}),' is received), and it can be different from any other User\'s "All" at the same time (unless the Service gives every user the same list).']}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(s.p,{children:["TL,DR: Every Character in the Character list can be independently included in/excluded from the intended recipient list of a Message. For an ",(0,t.jsx)(s.code,{children:"N"}),"-member Character list, there will be ",(0,t.jsx)(s.code,{children:"2^N"})," different intended recipient lists that can be selected from the browser client (and more if one wants to use our API/User-mode SDK and manipulate the data directly, but we can safely ignore that for now)."]}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.p,{children:["When the Service of a Channel is offline, all the Messages sent by Users in that Channel are handled (trivially) in a lazy way, which means Moobius would do nothing but saving the ",(0,t.jsx)(s.code,{children:"message_up"}),' into its own database. Even next time the Service is online, Moobius will not attempt to forward these messages to the Service again. In other words, the Messages are "missed" by the Service during the blackout period. With that being said, the Message history is preserved for each and every User. The User is always able to see their own message history.']})}),"\n",(0,t.jsx)(s.h2,{id:"messaging-logic",children:"Messaging Logic"}),"\n",(0,t.jsx)(s.p,{children:'Now it\'s time to dig deeper into the Messages and have some fun. Actually, you can do almost whatever you want with the Messages. Suppose you want to modify a Message, like appending " lol~" to every text Message, you may want to do this:'}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-python",children:"async def on_message_up(self, message):\n    if message.subtype == types.TEXT:\n        new_text = message.content.text + ' lol~'\n        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)\n    else:\n        await self.send_message(message)\n"})}),"\n",(0,t.jsxs)(s.p,{children:["Notice how you can extract the Message subtype and its text from the ",(0,t.jsx)(s.code,{children:"message"})," argument and how you can specify ",(0,t.jsx)(s.code,{children:"channel_id"})," (it is true that you can send a Message to another Channel you control!), ",(0,t.jsx)(s.code,{children:"sender"})," and ",(0,t.jsx)(s.code,{children:"recipients"})," for ",(0,t.jsx)(s.code,{children:"send_message()"}),'. When you restart the service, any text Message sent from anybody should be appended the " lol~" string and reach the intended recipients.']}),"\n",(0,t.jsxs)(s.p,{children:["It is easy to specify any ",(0,t.jsx)(s.code,{children:"sender"}),' as long as it is a valid Character ID (of a current Member or a Puppet created by the Service controlling the Channel) (todo: check whether a Service and use other Service\'s Puppet) and send a Message on their behalf, sometimes without their knowledge (you have to read Terms and Conditions (todo) carefully! The Users in your Channel grant you the power, but please use that wisely!). For example, if you want Meow to respond as long as a user says something that contains the string "cat" (test it yourself!):']}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-python",children:"async def on_message_up(self, message):\n    if message.subtype == types.TEXT:\n        new_text = message.content.text + ' lol~'\n        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)\n\n        if 'cat' in message.content.text:\n            await self.send_message('Meow! I am here!', channel_id=message.channel_id, sender=self.meow, recipients=message.sender)\n        else:\n            pass\n    else:\n        await self.send_message(message)\n"})}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.p,{children:["The ",(0,t.jsx)(s.code,{children:"sender"})," does not have to be in the Character list of any Member in the ",(0,t.jsx)(s.code,{children:"recipients"}),". If you add a ",(0,t.jsx)(s.code,{children:"return"})," at the beginning of ",(0,t.jsx)(s.code,{children:"on_channel_checkin()"}),' (so that everyone\'s Character list is empty). The above code will still work. Users will see messages from characters not in thier Character list, which is called "haunting Characters", or, more formally, "hyperceptive Characters". Given the dynamic nature of the Character list, this phenomenon occurs more frequently than you might think, even in traditional group chat -- what happens if someone quits the group and you are looking at their old messages?']})}),"\n",(0,t.jsxs)(s.p,{children:["Of course, you can do far more in ",(0,t.jsx)(s.code,{children:"on_message_up()"})," (just as in any other function). For example automatically creating an Agent for everyone if a User types something like ",(0,t.jsx)(s.code,{children:"create <name of the Agent>"}),". For this feature, you have to make some changes to ",(0,t.jsx)(s.code,{children:"before_channel_init()"})," and ",(0,t.jsx)(s.code,{children:"on_channel_checkin()"})," to properly handle these custom Agents."]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-python",children:"async def before_channel_init(self):\n    self.meow = await self.create_agent(name='Meow', avatar='resources/avatar.png')  # the path could be a local file or an url\n    self.members = {}\n    self.custom_agents = []    # create an empty list for custom Agents\n\nasync def on_message_up(self, message):\n    if message.subtype == types.TEXT:\n        text = message.content.text\n        new_text = text + ' lol~'\n        await self.send_message(new_text, channel_id=message.channel_id, sender=message.sender, recipients=message.recipients)\n\n        if 'cat' in text:\n            await self.send_message('Meow! I am here!', channel_id=message.channel_id, sender=self.meow, recipients=message.sender)\n        elif text.startswith('create'):\n            name = text.replace('create', '').strip()   # remove the \"create\"\n            agent = await self.create_agent(name, avatar=self.meow.avatar)    # You can use the same avatar\n            self.custom_agents.append(agent)\n            await self.sync_channel(message.channel_id)\n        else:\n            pass\n    else:\n        await self.send_message(message)\n\nasync def send_member_view(self, channel_id, member_id):\n    characters = [self.meow.character_id] + members + self.custom_agents    # Note the change\n    ind = characters.index(member_id)  # find the recipient\n    characters = [member_id] + characters[:ind] + characters[ind + 1:]    # reordered\n\n    await self.send_characters(characters=payload, channel_id=channel_id, recipients=member_id)\n"})}),"\n",(0,t.jsx)(s.p,{children:'Now if User A sends a message with the text "create Dog" everyone will see an Agent names "Dog" with Meow\'s avatar appearing.'}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsxs)(s.li,{children:["These Characters are ephemeral: if you restart your Service, all the custom Agents will be gone (except Meow, of course). If you want to make them persistent, you have to save the relevant data to external storage (like a hard drive or a cloud database service), and fetch it properly next time you start your Service. This is made easier by the ",(0,t.jsx)(s.code,{children:"MoobiusStorage"})," class. Please refer to our Advanced Tutorial for details."]}),"\n",(0,t.jsxs)(s.li,{children:['In real-world practice, you may want to modify the above code so that the "create" messages are not sent out at all, but used as some instruction message so that spamming could be minimized (if you are a chatbot developer, you would know what we are talking about). Alternatively, you may want to create an Agent just for instruction messages and guide your user to target their instructions to the Agent (not to other Members) and you can tell it from the ',(0,t.jsx)(s.code,{children:"recipients"})," field (for instance, all messages targeted to Meow are interpreted as instructions). This tutorial won't say too much about this; the design is totally up to the Service provider!"]}),"\n"]})}),"\n",(0,t.jsxs)(s.p,{children:["Also, ",(0,t.jsx)(s.code,{children:"send_message()"})," could be used outside ",(0,t.jsx)(s.code,{children:"on_message()"}),',for example, you can make all new members "say" a hello and a goodbye when they join or leave a channel:']}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-python",children:'async def on_join(self, action):\n    await self.sync_channel(action.channel_id)\n    await self.send_message("Hello! I just joined!", channel_id=action.channel_id, sender=action.sender, recipients=self.members)\n    await self.send_message("Welcome!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)\n\nasync def on_leave(self, action):\n    await self.sync_channel(action.channel_id)\n    await self.send_message("Adios! I just left!", channel_id=action.channel_id, sender=action.sender, recipients=self.members)\n    # await self.send_message("See you next time!", channel_id=action.channel_id, sender=self.meow, recipients=action.sender)\n'})}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.p,{children:["The ",(0,t.jsx)(s.code,{children:"on_leave()"}),' is triggered AFTER the User leaves the Channel. Hence the "See you next time" will not be received by the User who just left the Channel (but the next time they join the same channel the Message will appear in the history. This is a bug of our platform.).']})}),"\n",(0,t.jsxs)(s.p,{children:["If you really think your Channel as a Group Based Application, you can treat ",(0,t.jsx)(s.code,{children:"send_message()"})," as a fancy version of ",(0,t.jsx)(s.code,{children:"print()"}),". Messages are versatile: it can be input/output of your GBA itself, your debug logs, your user's feedback, your AI Characters' special abilities, or, at the end of the day, most of the information exchange happening in your Channel, the world of human-AI mixtures."]}),"\n",(0,t.jsx)(s.h2,{id:"message-subtypes",children:"Message Subtypes"}),"\n",(0,t.jsxs)(s.p,{children:["The current version of Moobius supports multiple Message subtypes, including ",(0,t.jsx)(s.code,{children:"text"}),", ",(0,t.jsx)(s.code,{children:"image"}),", ",(0,t.jsx)(s.code,{children:"audio"})," and ",(0,t.jsx)(s.code,{children:"file"}),". For ",(0,t.jsx)(s.code,{children:"text"})," subtype, the ",(0,t.jsx)(s.code,{children:"content"})," field (you can find it in the log, or use ",(0,t.jsx)(s.code,{children:"message.content"})," field of the ",(0,t.jsx)(s.code,{children:"message"})," argument passed in ",(0,t.jsx)(s.code,{children:"on_message()"}),") contains a ",(0,t.jsx)(s.code,{children:"text"})," field that is the raw plain text of the message (rich text and code blocks are supported, but this is purely a frontend thing). For ",(0,t.jsx)(s.code,{children:"image"}),", ",(0,t.jsx)(s.code,{children:"audio"})," and ",(0,t.jsx)(s.code,{children:"file"}),", the ",(0,t.jsx)(s.code,{children:"content"})," field contains a ",(0,t.jsx)(s.code,{children:"path"})," field that indicates the url of the resource. Additionally, for ",(0,t.jsx)(s.code,{children:"file"})," subtype, there is an extra ",(0,t.jsx)(s.code,{children:"filename"})," field indicating the original filename intended when sent (the filename will automatically be changed when uploaded to the file service)."]}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsx)(s.p,{children:"For Messages that involve a resource file, the data passed through the websocket connections between Moobius and Service, and between Moobius and User client, is always the url of the resource, which is typically hosted on a file Service accessible via Internet (mostly the dedicated file service for Moobius) and the resource itself is retrieved via HTTP. Due to its bulky size, the resource file is typically not suitable for transmitting through websockets. A User or a Service has to upload the intended resource to the file Service, and then put the url to the payload of the Message to be sent. Fortunately, our SDK (as well as our browser clients) wraps up the dirty work and you can send/download a file/image/audio message with a one-liner, nothing more complicated than a text Message."})}),"\n",(0,t.jsx)(s.p,{children:"The following code snippet demonstrates basic operations involving non-text Messages:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-python",children:"async def on_message_up(self, message):\n    if message.subtype in [types.IMAGE, types.AUDIO]:\n        await self.download(source=message, auto_dir='recv')    # the directory is automatically created and filename is generated\n        await self.send_message('resources/avatar.png', channel_id=message.channel_id, subtype=types.IMAGE, sender=self.meow, recipients=message.sender)\n\n    elif message.subtype == types.FILE:\n        await self.download(source=message, file_path=f'files/{message.content.filename}')    # dir auto created, filename specified\n        await self.send_message(f'File {message.content.filename} saved!', channel_id=message.channel_id, sender=self.meow, recipients=message.sender)\n    else:\n        pass\n\n    await self.send_message(message)\n"})}),"\n",(0,t.jsxs)(s.p,{children:["After you run the Service and send some file/audio/image Messages with your test accounts to the Channel, you will notice a ",(0,t.jsx)(s.code,{children:"recv"})," and a ",(0,t.jsx)(s.code,{children:"files"})," directory automatically created under your project directory. The resource files from the Messages are downloaded there."]}),"\n",(0,t.jsxs)(s.p,{children:["Tip: As you might have noticed, the ",(0,t.jsx)(s.code,{children:"download()"})," method and ",(0,t.jsx)(s.code,{children:"send_message()"})," method are highly polymorphic. This simplifies writing CCS code. For detailed documentation of these methods, please refer to the SDK Documentation (",(0,t.jsx)(s.a,{href:"https://moobius.readthedocs.io/en/latest/index.html",children:"https://moobius.readthedocs.io/en/latest/index.html"}),")."]})]})}function h(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>o,x:()=>r});var t=n(6540);const a={},i=t.createContext(a);function o(e){const s=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),t.createElement(i.Provider,{value:s},e.children)}}}]);