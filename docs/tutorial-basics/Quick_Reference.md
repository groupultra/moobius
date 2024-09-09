---
id: Quick_Reference
label: Quick Reference
title: Quick Reference
---

This part is a quick summary to read after you worked through the tutorial. Detailed reference please refer to our SDK documentation. It lists the most commonly used methods to implement a typical CCS.

## Triggers (to be implemented)

### Upward Event Triggers

- User Sends Message: message_up -> on_message_up
- User Clicks Button: button_click -> on_button_click
- User Clicks Menu Item: menu_item_click -> on_menu_item_click

- User Join: join -> on_join
- User Leave: leave -> on_leave
- User Refresh: refresh -> on_refresh

### Special Triggers

After login and before Channel Initialization: before_channel_init

Channel Initialization: on_channel_init -> by default calls on_channel_checkin for each channel after a database is created

Service periodical checkin and synchronization: on_channel_checkin

After all Channels are initialized and immediately before Service starts: on_start

Unknown/Undefined payload received: on_unknown_payload

External event from MoobiusWand: on_spell

## Event Senders and Helpers (to be utilized)

### Downward Event Senders

- Downward Message: send_message
- Update Character List: send_characters
- Update Button List: send_buttons
- Update Context Menu: send_menu
- Update Canvas: send_canvas
- Update Display Style: send_style

### Helpers

- Create an Agent: create_agent
- Update the profile of an Agent: update_agent
- Get all real members: fetch_member_ids
- Fetch the detailed profiles of a bunch of characters: fetch_character_profile
- Update Channel Information: update_channel_info
- Upload, download

## Data Fields

- Character
- MessageBody
- Canvas
- Style
- ChannelInfo
- Dialog
- BottomButton
- Button
- ContextMenu
