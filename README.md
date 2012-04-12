This is the ping-webapp add-on for firefox.

It can be used to ping urls regularly which can
keep the web applications session alive.

The addon's xpi can be created with
$ cfx xpi
once you have installed the addon sdk 
(see https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/installation.html
for details).

How to use it:
- when installed an icon should show up in firefox' addon toolbar
  showing a bell with a green arrow
- on clicking the icon the preferences panel opens and closes
- in the preferences panel 
** new ping urls can be added
** the refresh rate (for all urls) can be changed
** existing urls can be deleted by clicking on the delete icon
** existing urls can be activated or deactivated by clicking on the 'active' icon

Firefox' error console shows what the addon is doing.

Some notes about the current implementation:

- it uses the firefox addon sdk
- 
- main.js contains the addon's main code. It manages the timer to ping the urls
  and provides event handlers for the communication with the preferences panel.
- the preferences panel is implemented in data/content/preferences.html and
  data/js/preferences.js. The ui is not really good, but it works for me.
- the add-on's icons are from http://www.famfamfam.com/lab/icons/silk/. Thanks for the great work!


