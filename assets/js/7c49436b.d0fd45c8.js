"use strict";(self.webpackChunkmoobius_doc=self.webpackChunkmoobius_doc||[]).push([[979],{7985:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var t=i(4848),r=i(8453);const s={id:"Quick_Reference",label:"Quick Reference",title:"Quick Reference"},l=void 0,a={id:"tutorial-basics/Quick_Reference",title:"Quick Reference",description:"This part is a quick summary to read after you worked through the tutorial. Detailed reference please refer to our SDK documentation. It lists the most commonly used methods to implement a typical CCS.",source:"@site/docs/tutorial-basics/Quick_Reference.md",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/Quick_Reference",permalink:"/moobius/tutorial-basics/Quick_Reference",draft:!1,unlisted:!1,editUrl:"https://github.com/groupultra/moobius/edit/main/docs/tutorial-basics/Quick_Reference.md",tags:[],version:"current",lastUpdatedBy:"hangyi",lastUpdatedAt:1725873532e3,frontMatter:{id:"Quick_Reference",label:"Quick Reference",title:"Quick Reference"},sidebar:"docs",previous:{title:"Canvas & Button & Context Menu",permalink:"/moobius/tutorial-basics/CanvasButton"},next:{title:"Advanced Reference",permalink:"/moobius/tutorial-basics/AdvancedReference"}},d={},c=[{value:"Triggers (to be implemented)",id:"triggers-to-be-implemented",level:2},{value:"Upward Event Triggers",id:"upward-event-triggers",level:3},{value:"Special Triggers",id:"special-triggers",level:3},{value:"Event Senders and Helpers (to be utilized)",id:"event-senders-and-helpers-to-be-utilized",level:2},{value:"Downward Event Senders",id:"downward-event-senders",level:3},{value:"Helpers",id:"helpers",level:3},{value:"Data Fields",id:"data-fields",level:2}];function o(e){const n={h2:"h2",h3:"h3",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"This part is a quick summary to read after you worked through the tutorial. Detailed reference please refer to our SDK documentation. It lists the most commonly used methods to implement a typical CCS."}),"\n",(0,t.jsx)(n.h2,{id:"triggers-to-be-implemented",children:"Triggers (to be implemented)"}),"\n",(0,t.jsx)(n.h3,{id:"upward-event-triggers",children:"Upward Event Triggers"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"User Sends Message: message_up -> on_message_up"}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"User Clicks Button: button_click -> on_button_click"}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"User Clicks Menu Item: menu_item_click -> on_menu_item_click"}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"User Join: join -> on_join"}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"User Leave: leave -> on_leave"}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"User Refresh: refresh -> on_refresh"}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"special-triggers",children:"Special Triggers"}),"\n",(0,t.jsx)(n.p,{children:"After login and before Channel Initialization: before_channel_init"}),"\n",(0,t.jsx)(n.p,{children:"Channel Initialization: on_channel_init -> by default calls on_channel_checkin for each channel after a database is created"}),"\n",(0,t.jsx)(n.p,{children:"Service periodical checkin and synchronization: on_channel_checkin"}),"\n",(0,t.jsx)(n.p,{children:"After all Channels are initialized and immediately before Service starts: on_start"}),"\n",(0,t.jsx)(n.p,{children:"Unknown/Undefined payload received: on_unknown_payload"}),"\n",(0,t.jsx)(n.p,{children:"External event from MoobiusWand: on_spell"}),"\n",(0,t.jsx)(n.h2,{id:"event-senders-and-helpers-to-be-utilized",children:"Event Senders and Helpers (to be utilized)"}),"\n",(0,t.jsx)(n.h3,{id:"downward-event-senders",children:"Downward Event Senders"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Downward Message: send_message"}),"\n",(0,t.jsx)(n.li,{children:"Update Character List: send_characters"}),"\n",(0,t.jsx)(n.li,{children:"Update Button List: send_buttons"}),"\n",(0,t.jsx)(n.li,{children:"Update Context Menu: send_menu"}),"\n",(0,t.jsx)(n.li,{children:"Update Canvas: send_canvas"}),"\n",(0,t.jsx)(n.li,{children:"Update Display Style: send_style"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"helpers",children:"Helpers"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Create an Agent: create_agent"}),"\n",(0,t.jsx)(n.li,{children:"Update the profile of an Agent: update_agent"}),"\n",(0,t.jsx)(n.li,{children:"Get all real members: fetch_member_ids"}),"\n",(0,t.jsx)(n.li,{children:"Fetch the detailed profiles of a bunch of characters: fetch_character_profile"}),"\n",(0,t.jsx)(n.li,{children:"Update Channel Information: update_channel_info"}),"\n",(0,t.jsx)(n.li,{children:"Upload, download"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"data-fields",children:"Data Fields"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Character"}),"\n",(0,t.jsx)(n.li,{children:"MessageBody"}),"\n",(0,t.jsx)(n.li,{children:"Canvas"}),"\n",(0,t.jsx)(n.li,{children:"Style"}),"\n",(0,t.jsx)(n.li,{children:"ChannelInfo"}),"\n",(0,t.jsx)(n.li,{children:"Dialog"}),"\n",(0,t.jsx)(n.li,{children:"BottomButton"}),"\n",(0,t.jsx)(n.li,{children:"Button"}),"\n",(0,t.jsx)(n.li,{children:"ContextMenu"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>l,x:()=>a});var t=i(6540);const r={},s=t.createContext(r);function l(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);