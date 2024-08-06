"use strict";(self.webpackChunkmoobius_doc=self.webpackChunkmoobius_doc||[]).push([[106],{4111:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>o,toc:()=>h});var a=n(4848),r=n(8453);const s={id:"Characters"},i=void 0,o={id:"tutorial-basics/Characters",title:"Characters",description:"Members vs Characters",source:"@site/versioned_docs/version-1.0.0/tutorial-basics/Characters.md",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/Characters",permalink:"/moobius/tutorial-basics/Characters",draft:!1,unlisted:!1,tags:[],version:"1.0.0",frontMatter:{id:"Characters"},sidebar:"docs",previous:{title:"Run Demo",permalink:"/moobius/tutorial-basics/Run Demo"},next:{title:"Messages",permalink:"/moobius/tutorial-basics/Messages"}},c={},h=[{value:"Members vs Characters",id:"members-vs-characters",level:2},{value:"Puppets",id:"puppets",level:2},{value:"Join and Leave Channel",id:"join-and-leave-channel",level:2},{value:"Individualized Character List",id:"individualized-character-list",level:2}];function l(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h2,{id:"members-vs-characters",children:"Members vs Characters"}),"\n",(0,a.jsx)(t.p,{children:"When your Service takes over the Channel, the first thing you may notice is that your Character list is empty, even without yourself. It is not a bug as you might think, but rather a reflection of what fancy things Moobius can do. In this case, the Character list seen by a Member may be different from the actual Member list of the Channel (the ground truth), and/or different from what any other Member in the Channel sees."}),"\n",(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsx)(t.p,{children:"When a User creates a Channel, two things happen: (1) the creator gets permission to take over the Channel with a Service using their credentials; (2) the creator automatically joins the Channel and becomes a Member of that Channel. These are two independent roles of a creator. As a Member per se, the creator is no more special than any other User joining the Channel, and the creator can even leave the Channel but remains in control of the Channel with their Service."})}),"\n",(0,a.jsx)(t.p,{children:"As the creator of a Channel, you (or your Service) always have access to the ground truth. However, it is your option (rather than obligation) as a Service provider to give out the truth to your Channel Members. Before things get complicated, let us just be simple and tell everyone the truth, so that your Channel would look like a traditional group chat."}),"\n",(0,a.jsxs)(t.p,{children:["In your ",(0,a.jsx)(t.code,{children:"service.py"})," file, add the following methods inside ",(0,a.jsx)(t.code,{children:"ZeroService"})," class:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:"# fetch ground truth of Member list from Moobius and send it to all Members\n# automatically called when the Service starts\nasync def initialize_channel(self, channel_id):\n    members = await self.fetch_member_ids(channel_id)\n    await self.send_update_characters(character_ids=members, channel_id=channel_id, recipients=members)\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Press ",(0,a.jsx)(t.code,{children:"Ctrl + C"})," to forcefully stop your Service, and then run it again (but DO NOT refresh your browser):"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell",children:"python main.py\n"})}),"\n",(0,a.jsxs)(t.p,{children:["You will see from the browser that your Character list actually updated: you are back in your Character list again. The ",(0,a.jsx)(t.code,{children:"initialize_channel()"})," method is inherited from the super class ",(0,a.jsx)(t.code,{children:"Moobius"}),", which has been predefined by the SDK and is invoked automatically as the Service starts. In the above implementation of the method, the Service first fetches from the Moobius Platform the ground truth of the Members in the Channel using ",(0,a.jsx)(t.code,{children:"fetch_member_ids()"})," method. The return value of the method member is a list of string, each element of which is a ",(0,a.jsx)(t.code,{children:"character_id"})," that uniquely defines a Character. Next, an update_characters Downward Event is sent by ",(0,a.jsx)(t.code,{children:"send_update_characters()"})," to all Members in the Channel (",(0,a.jsx)(t.code,{children:"recipients=member"}),") , so that the Character list is updated."]}),"\n",(0,a.jsxs)(t.p,{children:["However, when you refresh your browser, you will see the Character list becomes empty again. When a User refreshes the browser, the client will reload the Channel's Character list, and will send a ",(0,a.jsx)(t.code,{children:"fetch_characters"})," ",(0,a.jsx)(t.strong,{children:"Action"})," (basically an Upward Event but less commonly used) to the Service bound to the Channel. You may see things in console logs like this:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell",children:'2024-07-25 04:10:26.583 | INFO     | moobius.network.ws_client:receive:128 - {"type": "action", "body": {"subtype": "fetch_characters", "channel_id": "a95072a4-2869-41c6-a26d-a164065031df", "context": {}, "sender": "e43c5534-ccad-4f7e-b85c-d0a77b1f47b4"}}\n'})}),"\n",(0,a.jsxs)(t.p,{children:["This data is automatically parsed by the SDK as an ",(0,a.jsx)(t.code,{children:"Action"})," dataclass object containing all the relevant fields and passed into ",(0,a.jsx)(t.code,{children:"on_fetch_characters()"})," method defined by Moobius class. The method is automatically invoked (triggered) whenever a ",(0,a.jsx)(t.code,{children:"fetch_characters"})," Action is sent by a Channel Member. Thus, if the event handler ",(0,a.jsx)(t.code,{children:"on_fetch_characters()"})," is implemented in your Service as follows, you can see the Character list preserves even after you refresh the browser (remember to stop and restart your Service before testing)."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:"# triggered when the browser refreshes\nasync def on_fetch_characters(self, action):\n    members = await self.fetch_member_ids(action.channel_id)\n    await self.send_update_characters(character_ids=members, channel_id=action.channel_id, recipients=action.sender)\n"})}),"\n",(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsxs)(t.li,{children:["You may notice a lot of Actions sent to the Service in your log when the browser refreshes. When the Channel is re-rendered by the browser client, it assumes no Characters, Buttons, or Canvas in the Channel until it receives a corresponding ",(0,a.jsx)(t.code,{children:"update"})," event (the history Messages was fetched from the Moobius Platform which does not involve Service). Each type of Action has its trigger defined in the SDK like ",(0,a.jsx)(t.code,{children:"on_fetch_buttons()"}),", ",(0,a.jsx)(t.code,{children:"on_fetch_canvas()"}),", etc. with default trivial implementation. As a result, you need to implement these triggers (event handlers) to send proper Downward Events to the Users. Furthermore, if a User has joined multiple Channels and switch back and forth in the browser, such Actions will be sent each time the current Channel gains focus."]}),"\n",(0,a.jsxs)(t.li,{children:["The ",(0,a.jsx)(t.code,{children:"recipients"})," argument of ",(0,a.jsx)(t.code,{children:"send_update_characters()"})," can be of ",(0,a.jsx)(t.code,{children:"list"})," type (with any number of recipients) or ",(0,a.jsx)(t.code,{children:"str"})," type (when there is only one recipient, it is not mandatory to make it a list). Similar design appears in the SDK in methods like ",(0,a.jsx)(t.code,{children:"send_update_buttons()"}),"."]}),"\n",(0,a.jsxs)(t.li,{children:["It is highly recommended to initialize the Channel related stuff in initialize_channel() method rather than ",(0,a.jsx)(t.code,{children:"__init__()"})," method, unless you really know what you are doing. This is for three major reasons.\n(1) The ",(0,a.jsx)(t.code,{children:"____init____()"})," method is a synchronous method (note the space), where you may not call most Channel related asynchronous helper methods like ",(0,a.jsx)(t.code,{children:"fetch_member_ids()"}),".\n(2) Network connections are not yet established when ",(0,a.jsx)(t.code,{children:"____init____()"})," is called, even after you call ",(0,a.jsx)(t.code,{children:"super().____init____()"}),".\n(3) Unpicklable objects declared in ",(0,a.jsx)(t.code,{children:"____init____()"})," (like an ",(0,a.jsx)(t.code,{children:"openai.OpenAIClient"}),') may cause the Service ineligible for working in the non-blocking "background" mode with ',(0,a.jsx)(t.code,{children:"MoobiusWand"}),", which does complicated and delicate asynchronous multiprocessing under the hood. This can be avoided by simply moving the object initialization into initialize_channel()."]}),"\n"]})}),"\n",(0,a.jsx)(t.h2,{id:"puppets",children:"Puppets"}),"\n",(0,a.jsx)(t.p,{children:"Now that you know how to tell the truth of who is in the Channel to all Members, let's explore more power of yourself. As you may already know, a striking feature of Moobius is its ability to allow Services to create any number of Characters that do not originally exist at ease. These Characters are also known as Puppets. Unlike Members, a Puppet is not associated with a Moobius User account, and does not directly correspond to any real User."}),"\n",(0,a.jsx)(t.p,{children:'As the creator of the Channel, only you know which Characters are "real" and which are "virtual", and you are more than encouraged to keep it to yourself, or use it wisely (and create a unique experience to your Users). Of course, the Moobius Platform knows it, too, but the Platform will never give out "official" labels of Member/Puppet, at communication protocol level (which means such information will not be sent to the frontend client at all, even when Users try to use F12 to analyze the data packages).'}),"\n",(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsx)(t.p,{children:"The workflow of creating a Puppet is amazingly simple. Most group chat applications (like Discord and Slack) provide \"bot\" features, but you would typically need far more effort to make a bot work properly, and the flexibility of bots is obviously less. Furthermore, a User won't technically tell a Puppet from a Member when their Character list contains both types. You can provide hints by providing different style of avatar/name of your puppets, but this is up to you. In extreme cases, a Puppet could be created based on a Member's profile (name, avatar, description, etc), and looks all the same (but with different character_id). Controversial as it may be, this is where our value of human-AI mixture resides."})}),"\n",(0,a.jsx)(t.p,{children:"To create a Puppet, you need to find an image (preferably square-shaped) as its avatar (otherwise it will use default avatar), and give it a name and description (optional). Such information will be shown to Users seeing the Puppet as they appear in real Members (of course)."}),"\n",(0,a.jsxs)(t.p,{children:["Let's create a ",(0,a.jsx)(t.code,{children:"resources"})," directory under your project directory, and put an image ",(0,a.jsx)(t.code,{children:"avatar.png"})," inside it (of course you can use any image you like, and not necessarily in ",(0,a.jsx)(t.code,{children:"png"})," format)."]}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"moobius",src:n(9774).A+"",width:"560",height:"560"})}),"\n",(0,a.jsxs)(t.p,{children:["Suppose you want every Member to know that this cute Pup-pet, Meow, is among them. What you need to do is two things: Create a Puppet based on this avatar when the Service starts, and put its ",(0,a.jsx)(t.code,{children:"character_id"})," along with the list of all members whenever you send the ",(0,a.jsx)(t.code,{children:"update_characters"})," Downward Event. The implementation in ",(0,a.jsx)(t.code,{children:"service.py"})," would look like this:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:"async def initialize_channel(self, channel_id):\n    self.meow = await self.create_puppet(name='Meow', avatar='resources/avatar.png')\n    members = await self.fetch_member_ids(channel_id)\n    characters = [self.meow] + members\n    await self.send_update_characters(character_ids=characters, channel_id=channel_id, recipients=members)\n\nasync def on_fetch_characters(self, action):\n    members = await self.fetch_member_ids(action.channel_id)\n    characters = [self.meow] + members\n    await self.send_update_characters(character_ids=characters, channel_id=action.channel_id, recipients=action.sender)\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Restart your Service. You will see your Puppet appears in the Character list (even after refreshing your browser). In ",(0,a.jsx)(t.code,{children:"initialize_channel"}),", the Puppet is created with ",(0,a.jsx)(t.code,{children:"create_puppet()"})," method, and its character_id is bound to the ",(0,a.jsx)(t.code,{children:"self.meow"})," property (so that it can be used in other methods). Note that the arguments of ",(0,a.jsx)(t.code,{children:"send_update_characters()"})," are slightly modified: despite the fact that the character_ids argument includes your puppet, the ",(0,a.jsx)(t.code,{children:"recipients"})," argument does not (You have to keep in mind that your Puppets do not actually receive anything, only your Members do). Again, you don't need to pass the ",(0,a.jsx)(t.code,{children:"members"})," or its superset to the ",(0,a.jsx)(t.code,{children:"character_ids"})," argument. It is legit to just pass ",(0,a.jsx)(t.code,{children:"character_ids=[self.meow]"}),", and Meow will be the only Character you see in the Character list (even without yourself!)."]}),"\n",(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsxs)(t.p,{children:["There are other functions associated with Puppets, like Moobius.update_puppet() that modifies the name/avatar/description of a Puppet without changing the character_id (for now you have to refresh the browser to see the change, which is an implementation issue of us). This tutorial tries to cover most of the common functionalities of the SDK, but is not guaranteed to be an exhaustive list of that. For further reference of such methods in detail, please see our SDK Documentation ",(0,a.jsx)(t.a,{href:"https://moobius.readthedocs.io/en/latest/index.html",children:"https://moobius.readthedocs.io/en/latest/index.html"}),"."]})}),"\n",(0,a.jsx)(t.h2,{id:"join-and-leave-channel",children:"Join and Leave Channel"}),"\n",(0,a.jsx)(t.p,{children:'You have got an idea of how to create "virtual reality" for yourself (or trick yourself to believe in something, which seems not fun since you already know the truth), but the real power of Moobius is for a group of Members (as in Group Based Application). Now you need to have another account logged in to a separate browser window (todo: Incognito), or have another person with a Moobius account (not necessarily a developer) working with you (you may want to use another Channel for communication, since your Service does not support message delivery yet). For clarity, we will call the creator of the Channel (you) "User A", and other accounts User B, User C, etc.'}),"\n",(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsx)(t.p,{children:"If you are using one computer to log in to two accounts, make sure you log in with separate windows (or Incognito Windows) or separate browsers and separate accounts (like in Google Chrome) to avoid conflicts, as Moobius does not support multiple logins currently. Also, if you accidentally do something different from what is stated here, don't worry, nothing could be broken. Just restart, refresh, and probably leave the Channel and join again, and you will see it."})}),"\n",(0,a.jsxs)(t.p,{children:["Now keep your Service running and User A in the Channel. Let User B know your ",(0,a.jsx)(t.code,{children:"channel_id"})," and join the Channel as well. Pay attention to what both each User sees in their Character list once User B joins."]}),"\n",(0,a.jsxs)(t.p,{children:["What you are going to find out is that, although User B sees ",(0,a.jsx)(t.code,{children:"A"}),", ",(0,a.jsx)(t.code,{children:"B"})," and ",(0,a.jsx)(t.code,{children:"Meow"})," immediately after joining, User A can't see User B in the Character list (only ",(0,a.jsx)(t.code,{children:"A"})," and ",(0,a.jsx)(t.code,{children:"Meow"}),"is there) until User A refreshes the browser (try it!). Furthermore, when User B leaves the channel after that, User A's Character list won't automatically update until another refresh. You can try this multiple times and switch the roles between User A and User B, and the result will always be the same: the newly joined User always receives the up-to-date Character list, but the User already in the Channel has to refresh the browser manually."]}),"\n",(0,a.jsxs)(t.p,{children:["If you take a closer look at your console logs (or the ",(0,a.jsx)(t.code,{children:"service.log"})," file in the ",(0,a.jsx)(t.code,{children:"logs"})," directory), you would see that when User B joins the Channel, a bunch of Upward Actions are sent to the Service, including a ",(0,a.jsx)(t.code,{children:"join_channel"})," Action followed by a series of ",(0,a.jsx)(t.code,{children:"fetch"})," Actions, including ",(0,a.jsx)(t.code,{children:"fetch_characters"})," (as User B's browser needs to render the Channel as if it were just refreshed). The fetch_characters Action is already handled properly by our ",(0,a.jsx)(t.code,{children:"on_fetch_characters()"}),' method, which explains why User B sees the 3-Character list. However, we did nothing to "notify" User A when User B joins, so that User A only sees the 2-Character list before the next refresh (when another ',(0,a.jsx)(t.code,{children:"fetch_characters"})," is sent by User A)."]}),"\n",(0,a.jsxs)(t.p,{children:["As you may already realize, if we want to let User A see User B upon joining, we need to send an ",(0,a.jsx)(t.code,{children:"update_characters"})," Downward Event to User A with the new Character list once the Service receives a ",(0,a.jsx)(t.code,{children:"join_channel"})," Upward Event. Similarly, if we want to remove User B from User A's Character list when User B leaves the channel, we need to send ",(0,a.jsx)(t.code,{children:"update_characters"})," in response to a ",(0,a.jsx)(t.code,{children:"leave_channel"})," Upward Event. The ",(0,a.jsx)(t.code,{children:"on_join_channel()"})," and ",(0,a.jsx)(t.code,{children:"on_leave_channel()"})," handler methods are already defined in the Moobius class, that can be automatically triggered by the corresponding Upward Events. Hence, the implementation would be like:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:"# triggered when a user joins a channel\nasync def on_join_channel(self, action):\n    members = await self.fetch_member_ids(action.channel_id)\n    characters = [self.meow] + members\n    await self.send_update_characters(character_ids=characters, channel_id=action.channel_id, recipients=members)\n\n# triggered when a user leaves a channel\nasync def on_leave_channel(self, action):\n    members = await self.fetch_member_ids(action.channel_id)\n    characters = [self.meow] + members\n    await self.send_update_characters(character_ids=characters, channel_id=action.channel_id, recipients=members)\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Note that both ",(0,a.jsx)(t.code,{children:"send_update_characters()"}),' have their second argument the entire Member list (instead of just "User A"), which means that every Member in the Channel will be notified of the change of Character list once someone joins or leaves even if there are User C, User D, ... in the Channel (which is the expected behavior of a "traditional" group chat). Now you can have more Users playing with it, and test your Channel as much as you can, including join/leave, refresh, start/stop the Service at any time. Chances are that no \u201cinconsistencies\u201d will occur.']}),"\n",(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsxs)(t.li,{children:["In this implementation, when User B joins the Channel, they will receive two consecutive ",(0,a.jsx)(t.code,{children:"update_characters"})," Downward Events. The first is sent from ",(0,a.jsx)(t.code,{children:"on_join_channel()"}),", and the second is sent from ",(0,a.jsx)(t.code,{children:"on_fetch_characters()"}),", all with the same Character list. This may be somehow redundant, but it does not hurt."]}),"\n",(0,a.jsx)(t.li,{children:'Users can still join/leave a Channel even when its Service is offline. The Moobius Platform is always taking care of the ground truth of the Member list, and the Service could ask for it when it\'s online next time. In this simple scenario, the possible discrepancy of Member list during the "blackout" period does no harm, but for some complex GBAs, this is something that may raise concerns and require careful handling. (todo: what to care about).'}),"\n"]})}),"\n",(0,a.jsxs)(t.p,{children:['You may notice that the "fetch and update" logic already appears 4 times in your code, which suggests that you may want to refactor your code by defining another method to wrap up this logic, as your Programming 101 teacher may have told you. After this is done, the entire ',(0,a.jsx)(t.code,{children:"service.py"})," would be something as follows, where the ",(0,a.jsx)(t.code,{children:"_sync_characters()"})," helper method does all the tricks (although it is actually an asynchronous function)."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:"# service.py\nfrom moobius import Moobius, types\n\n\nclass ZeroService(Moobius):\n    async def initialize_channel(self, channel_id):\n        self.meow = await self.create_puppet(name='Meow', avatar='resources/avatar.png')\n        await self._sync_characters(channel_id)\n\n    async def on_fetch_characters(self, action):\n        await self._sync_characters(action.channel_id, [action.sender])\n\n    async def on_join_channel(self, action):\n        await self._sync_characters(action.channel_id)\n\n    async def on_leave_channel(self, action):\n        await self._sync_characters(action.channel_id)\n\n    # helper method\n    # fetch member list, add Meow and send out\n    async def _sync_characters(self, channel_id, recipients=None):\n        members = await self.fetch_member_ids(channel_id)\n        characters = [self.meow] + members\n        await self.send_update_characters(character_ids=characters, channel_id=channel_id, recipients=recipients or members)\n\n        return members    # for future use\n"})}),"\n",(0,a.jsx)(t.h2,{id:"individualized-character-list",children:"Individualized Character List"}),"\n",(0,a.jsx)(t.p,{children:'You may think it is over complicated to have to handle these fetch Events manually if at the end of the day, what you achieve is no more than a "traditional" group chat. It is true, but the point of Moobius is to make all of these things, otherwise automatically handled or taken for granted, flexible and customizable (as in "you are commonly expected to do this but you don\'t have to"), so as to provide with as much space as possible for your creativity. With that being said, if all you need is no more than a Moobius counterpart of a Discord server with some bots (where everybody sees the same things), you can just use our template Services (todo: templates for that) and make modifications on top of them.'}),"\n",(0,a.jsxs)(t.p,{children:["One of the core merits of Moobius is its capacity to create individualized experience. In terms of Character list, it means different Members can see different Character lists. The simplest case is to put every Member at the top of the list they see (remember, a list is ordered), where you can make slight changes to ",(0,a.jsx)(t.code,{children:"_sync_characters()"}),":"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-python",children:"async def _sync_characters(self, channel_id, recipients=None):\n    members = await self.fetch_member_ids(channel_id)\n    characters = [self.meow] + members\n    recipients = recipients or members\n\n    for r in recipients:\n        ind = characters.index(r)   # find the recipient\n        payload = [r] + characters[:ind] + characters[ind + 1:]\n\n        await self.send_update_characters(character_ids=payload, channel_id=channel_id, recipients=r)\n\n    return members\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Then you can do the join/leave/refresh tests, and you will find everyone sees themselves at the top of their own Character list, followed by Meow. Similarly, it is easy to let everyone see all Members except themselves, or let Meow have the same name as them (todo: use ",(0,a.jsx)(t.code,{children:"get_character_profile()"})," to get names) (try it!)."]}),"\n",(0,a.jsx)(t.p,{children:"In later sections, we will demonstrate more ideas about how flexible, individualized Character lists can help create unique User experience when more interaction modalities are introduced."}),"\n",(0,a.jsx)(t.p,{children:"It could be challenging to develop a GBA when it reaches certain complexity, since you have to always keep in mind (or storage) what EVERY member sees and how they would dynamically change in response to each other's behavior. Also, you may have to always have multiple browser windows open (or with multiple persons) and switch back and forth between your IDE and your browsers when you debug and test your Service. This may explode your mind sometimes, and we are making our best effort trying to spare your mind for the greater good with our SDK. Believe it or not, chances are that it is worth the pain. Remember, all is about group, interaction, and socialization!"})]})}function d(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},9774:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/img-3-c490ce1fad57c5190b74118cbbafc66b.png"},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>o});var a=n(6540);const r={},s=a.createContext(r);function i(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);