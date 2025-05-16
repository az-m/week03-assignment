# REQUIREMENTS

~ Fetch upgrade data from the provided API and at least one upgrade from the API update the cookie count.

This was the first thing I did. Once I have the data from the API I put it into a global variable so I can access it from any function I need to (that I call from my main async function of course).

~ Ensure that functions are used effectively to keep code organised and reusable.

I've tried to keep my functions tidy and documented. I have a couple of functions I call in more than one place - the one to update the styling on upgrades, which needs to run immediately following a purchase, and also every second to change the styling when they become affordable. Also one to show how many of each upgrade has been purchased, which needs to run when a purchase is made, and also at load in case there's any in stored in local storage.

~ Implement event listeners to handle user interactions.

Yes, the user can click on the cookie to increment the count, the upgrades to purchase (if they have the cookies for it), and a reset button which clears the local storage and reloads.

~ Use local storage to save and restore the cookie count and relevant game information.

I've used local storage to keep a record of the purchased upgrades and the overall cookie count. It gets loaded in on page load (if it exists).

~ Use setInterval to increment the cookie count and manage the game state each second.

Every second I check the purchased upgrade items, check them against the 'increase' value from the API data, multiply by the number of upgrades purchased and add it all together with the running total. Then I update the displayed counter value and the value in local storage.

~ Consolidate upgrade management by managing all upgrades in a single function.

I have a single function that creates all the div elements for the upgrades, followed by another function to add the event listeners and handle clicks on the upgrades.

# REFLECTIONS

It seemed a lot to do at first but I took it function by function and it seems to work.

I won't be winning prizes for the look of the thing - I need a designer! I don't even have a wireframe because it's entirely too simple. It has hover styles for feedback though!

I approached the project from a functionality first perspective, so my JavaScript was fully written before any CSS happened. Then I just had to add another little function to swap the styles about on the upgrades.
