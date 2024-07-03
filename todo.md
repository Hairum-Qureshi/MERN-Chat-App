1. There's a minor bug where if you change your profile picture, it changes to the new profile picture, but if you exit out of settings and revisit the settings panel, it'll show the old profile picture until you refresh.

2. When User A searches for User B, it creates a contact between the two successfully, however, User A gets User B's contact to appear and User B gets User A's contact to appear despite the fact User A hadn't sent User B a message yet. See if you can resolve this so that only User B gets User A's contact until User A sends User B a message.

3. Need to add some middleware to prevent other users to access other people's DMs if they have the chat ID

4. Need to encrypt user messages in the database

5. Need to figure out a way for users to delete conversations

6. Add a loading effect when clicking on a message

7. Make the user go offline when they sign out

8. Allow users to enable website notifications

9. Need to resolve making the typing indicator immediately vanish when the user sends the message

   - Also need to resolve bug where if you change chats, the typing indicator from the previous chat stays until it vanishes after a few milliseconds

10. Need to make the delete account functionality work

11. The latest messages functionality is buggy. It somewhat works.

12. **REMOVE THE CHANGE PASSWORD FEATURE** - If you ever implement it, don't forget you'll have to invalidate the old JWT and create a new JWT for that new password

13. Make the search bar work
