"use strict";(self.webpackChunkmoobius_doc=self.webpackChunkmoobius_doc||[]).push([[726],{7458:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>c,frontMatter:()=>a,metadata:()=>r,toc:()=>h});var s=n(4848),i=n(8453);const a={id:"CustomChannelService"},o=void 0,r={id:"tutorial-basics/CustomChannelService",title:"CustomChannelService",description:"A Moobius Channel could be boring or you can make it wonderful as a developer by customizing the behavior of a Channel created by you with a Service program, aka Custom Channel Service (CCS). Basically, a CCS is the mastermind behind a Channel, which controls every aspect of what a User sees in a Channel and what will happen when a User interacts with a Channel. Before we dive deeply into the specifics of how to write code to program a CCS, we may take a glimpse at how CCS works in general.",source:"@site/versioned_docs/version-1.0.0/tutorial-basics/CustomChannelService.md",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/CustomChannelService",permalink:"/moobius/1.0.0/tutorial-basics/CustomChannelService",draft:!1,unlisted:!1,editUrl:"https://github.com/groupultra/moobius/edit/main/versioned_docs/version-1.0.0/tutorial-basics/CustomChannelService.md",tags:[],version:"1.0.0",lastUpdatedBy:"hangyi",lastUpdatedAt:1724772986e3,frontMatter:{id:"CustomChannelService"},sidebar:"docs",previous:{title:"Getting Started",permalink:"/moobius/1.0.0/tutorial-basics/GettingStarted"},next:{title:"Preparation",permalink:"/moobius/1.0.0/tutorial-basics/Preparation"}},l={},h=[{value:"Take Home Message",id:"take-home-message",level:2}];function d(e){const t={admonition:"admonition",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["A Moobius Channel could be boring or you can make it wonderful as a developer by customizing the behavior of a Channel created by you with a ",(0,s.jsx)(t.strong,{children:"Service"})," program, aka Custom Channel Service (CCS). Basically, a CCS is the mastermind behind a Channel, which controls every aspect of what a User sees in a Channel and what will happen when a User interacts with a Channel. Before we dive deeply into the specifics of how to write code to program a CCS, we may take a glimpse at how CCS works in general."]}),"\n",(0,s.jsxs)(t.p,{children:["A CCS is a computer program that establishes network connections to the Moobius Platform, which can be run either on your laptop or a cloud server (no public IP address required). When a User makes an interaction with a Channel (such as sending a Message or clicking a Button), the data containing the full description of the interaction is sent from the User's client (frontend) to the Moobius Platform as an ",(0,s.jsx)(t.strong,{children:"Event"}),". In the case where the Channel is taken over by a CCS, the Event will be dispatched (forwarded) to the corresponding CCS, and CCS could, at its own discretion (business logic), handle the Event in an arbitrary way. Trivially, if the CCS does nothing, then the users will never see any messages or other interactivity. But in a typical use case, the CCS will then send a message or update event to the Moobius Platform as an instruction to make modifications to some Users' clients, like displaying a Message, displaying something on their Canvas, or refreshing the Button list."]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"moobius",src:n(1236).A+"",width:"1280",height:"709"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"moobius",src:n(2576).A+"",width:"1934",height:"1080"})}),"\n",(0,s.jsx)(t.p,{children:'The Event sent from a User\'s client to the Moobius Platform and forwarded to a CCS is called an Upward Event. An Upward Event represents "what a User does" in a Channel, including:'}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Upward Message: A User sends a Message\uff08message_up\uff09"}),"\n",(0,s.jsxs)(t.li,{children:["Action: Other forms of a User's active behavior except sending Messages","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"A User clicks a Button (button_click)"}),"\n",(0,s.jsx)(t.li,{children:"A User right-clicks a Message, and clicks a Context Menu Item (menu_item_click)"}),"\n",(0,s.jsx)(t.li,{children:"A User joins the Channel (join)"}),"\n",(0,s.jsx)(t.li,{children:"A User leaves a Channel (leave)"}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.li,{children:"Refresh: The client automatically requests for view updates when a Channel comes into focus (refresh)"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:'The Event sent from a CCS as an instruction to the Moobius Platform and forwarded to a User\'s Client is called a Downward Event. A Downward Event represents "what a User sees" in a Channel (managed by CCS), including:'}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Downward Message: CCS Displays a Message for certain User(s) (message_down)"}),"\n",(0,s.jsxs)(t.li,{children:["Update: CCS updates the configuration or the view of customizable component(s) for certain User(s)","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Update text and/or image on Canvas (update_canvas)"}),"\n",(0,s.jsx)(t.li,{children:"Update the Button list (update_buttons)"}),"\n",(0,s.jsx)(t.li,{children:"Update the Context Menu (update_menu)"}),"\n",(0,s.jsx)(t.li,{children:"Update the Character list (update_characters)"}),"\n",(0,s.jsx)(t.li,{children:"Update the display style of customizable components (update_style)"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"moobius",src:n(7587).A+"",width:"1280",height:"719"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"moobius",src:n(609).A+"",width:"2271",height:"1274"})}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:'A CCS can ask the Moobius Platform for the "ground truth" of all Users at any time. This is useful when the CCS is interrupted (Users may join and/or leave the Channel during the interval). Upward Events happening during the interruption will be lost so that sometimes it is critical for CCS to establish a mechanism to maintain the consistency of the GBA.'}),"\n",(0,s.jsx)(t.li,{children:"An Upward Event is sent directly from a User's client to the Moobius Platform and forwarded directly to the CCS, which results in a one-to-one information flow (Yes, even for message_up: the User's intended recipients is transferred as a data field of the Event, which does not imply that the Message would reach the recipients as intended; it is entirely up to the CCS)."}),"\n",(0,s.jsx)(t.li,{children:'A Downward Event is sent from a CCS as an instruction for the Moobius Platform to send data to specific Users\' clients (which in most cases results in a modification of their UI display or the message history they see). Any Downward Event has a data field of recipients, which can be more than one User in the Channel, and this recipients field is guaranteed to be strictly observed by the Moobius Platform, which exhibits a one-to-many information flow (The recipients field is removed when the Downward Event is forwarded from the Moobius Platform to User clients, so that Users do not know who else received the same Event). Since any Downward Event could be targeted to any subset of the Users in the Channel, a Moobius Channel facilitates differentiated, or individualized experience. This means different Users in the same Channel could see entirely different Messages, Buttons, Canvas and Characters. This is the most startling feature of Moobius compared to a "traditional" group chat application and allows for enormous space of imagination and creativity.'}),"\n",(0,s.jsx)(t.li,{children:'It is worth mentioning that there is no required chronological or causal relationship between any Upward Event and any Downward Event. When a User receives a message_down, it does not imply that it is a direct result of some user sending a message_up, nor does it even imply someone sends a message_up previously at all. On the other hand, when a User sends a message_up, it does not imply that someone will receive a message_down (or any other Event). The timing and property of any specific Downward Event and its recipients are entirely up to the CCS, and the Upward Events is just "information input" for the CCS to use as a reference.'}),"\n"]})}),"\n",(0,s.jsx)(t.p,{children:"A Moobius GBA developer may need some time to fully grab the idea of the previous statements, and in the next Section we will elaborate some of the concepts with specific GBA examples. You may bookmark this for future reference. For now, the only thing you need to keep in mind is that a GBA is about the logic of Event processing. It is the responsibility of a CCS developer to process the Upward Events and utilize the toolkit of Downward Events to create great individualized experience for your Users."}),"\n",(0,s.jsx)(t.h2,{id:"take-home-message",children:"Take Home Message"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"A Custom Channel Service (CCS) is the core of a GBA, which allows for customization of individualized User experience."}),"\n",(0,s.jsx)(t.li,{children:"A CCS receives Upward Events indicating what Users do from Moobius, and sends out Downward Events to Moobius as instructions to control what Users see."}),"\n",(0,s.jsx)(t.li,{children:"A Moobius Channel with a CCS is substantially different from a common group chat, hence some mindset has to be changed to fully explore the power of CCS."}),"\n"]})]})}function c(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},2576:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/1-2-126c6d26a781cc701962ccbf0b834a81.gif"},1236:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/i-1-562eb7b1b2d085c2398ddd2a7f563bea.jpg"},609:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/i-3-68a844deb731e3d58c5487fd6c00286c.gif"},7587:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/i-3-3549a4896b28583959932544d1937b7c.jpeg"},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>r});var s=n(6540);const i={},a=s.createContext(i);function o(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);