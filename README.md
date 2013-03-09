**Trello 3000**
===

Installation
---

Open the following link in Chrome: [Trello 3000 in Chrome Web Store](http://bit.ly/12DIpSy)
and follow the instructions on screen.

![Display Sample](https://dl.dropbox.com/u/1618599/trello3000/big_screen.png)

Version 0.1
---

What?
---
Trello 3000 is a open-source Chrome Extension that contains a few enhancements on top of the already great Trello. 
If Trello is a foreign word to you, please take a look over [here](http://trello.com/).
Essentially, it's a very flexibe organising tool built by the pros from [FogCreek](http://www.fogcreek.com/).

Why?
---
I have built Trello 3000 to fill a few gaps which Trello left (probably intentionally) open like:
card and list specific time estimates, spent time and stronger highlighting of cards. 
As I notice more needs and as time permits me, more features will come.

Spent time and estimates are actually abstract indicators of resources. These "units", can
represent any other resource. In Agile or Scrum methodologies, most of the times these
refer to hours. Depending on the scale, they could also mean number of sprints. 

How?
---

**Adding estimate units**

Estimate units represent how many units resources (hours, days, etc.) will be 
needed to solve a card. Add this value in the title of the card, between paranthesis.

![Adding estimate units sample](https://dl.dropbox.com/u/1618599/trello3000/s1_round.png)

**Adding spent units**

Spent units represent how many resource units were actually spent to solve this card.

![Adding spent units sample](https://dl.dropbox.com/u/1618599/trello3000/s2_round.png)

**Legend**

"S:" = Spent units

"E:" = Estimated units

"R:" = Remaining units untill all cards are done

![Display Sample](https://dl.dropbox.com/u/1618599/trello3000/s3_round.png)

![Display Sample](https://dl.dropbox.com/u/1618599/trello3000/s4_round.png)

**Help**

On the top right, there is a "Trello 3000 Help" button. Click that for
quick infos.


Notes
---

+ Similar Chrome extensions

[Points for Trello](https://chrome.google.com/webstore/detail/points-for-trello/mkcpchladphoadhaclmnlphhijboljjk?hl=en-US&utm_source=chrome-ntp-launcher)

[Scrum for Trello](https://chrome.google.com/webstore/detail/scrum-for-trello/jdbcdblgjdpmfninkoogcfpnkjmndgje?hl=en-US&utm_source=chrome-ntp-launcher) - this was the spark that made me think about building Trello 3000

+ Tests

Because Chrome Extensions seem a bit of "reverse engineering", I've decided to write a few basic QUnit tests, 
to easily detect if Trello's underlaying HTML structure changes.
To run the tests, clone this repository, add "app-tests.js" in the manifest.json under loaded js failes and load this extension in Chrome while being in developer mode.

+ Colors

Esthetics are very important to me and for that reason the label colors have been
extracted to a separate colors.css for future extensions. Suggestions and contributions are
welcomed! :) I'm not really happy with the current color scheme, so improvements will come soon.

+ Acknowledgements

I am in no way associated with Trello or FogCreek. The name of
this extension is simply an homage to Trello and the people behind it.

+ Development

For keeping up with the Trello spirit, all the development 
of this Chrome Extension can be followed on [its public Board](https://trello.com/b/6n1pR0SI). 
Anyone is invited to suggest, contribute and share.

---
Follow me [@tudorizer](http://twitter.com/tudorizer) for more updates.

