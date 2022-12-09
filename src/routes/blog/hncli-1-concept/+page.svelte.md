---
title: "An Hacker News Terminal UI: concept and road to release"
description: "Context, motivation, concept, and the future challenges to come for a 1.0 release."
date: "2022-11-25"
published: true
---

# An Hacker News Terminal UI: concept and road to release

## Original Idea

A couple of years ago, I stumbled across a Spotify client that runs in the console ([GIF source](https://github.com/Rigellute/spotify-tui)):

![spotify-tui GIF from the GitHub README](/hncli/spotify-tui.gif)

(I still use the official Spotify client like most people, but to each its own)

As an avid reader of [Hacker News](https://news.ycombinator.com/), I've been wanting to make the same experience but for Hacker News.

Here's what it looks like:

![hncli Home Screen](/hncli/home.png)

## Context

Hacker News is a famous social network mostly aimed at engineers and entrepreneurs alike, ran by [Y Combinator](https://www.ycombinator.com/) which, for those unaware, helped launch companies like **Stripe**, **AirBNB** or what became known as **Twitch** in other famous examples.

A Terminal UI is basically an interactive UI that runs directly in your terminal. You may be aware of [htop](https://htop.dev/), a famous process viewer. To go into more detail, many of such applications use the [ncurses](https://invisible-island.net/ncurses/) library under the hood which allows to implement incredibly powerful or beautiful features. ncurses is written in C but has bindings available in many languages, like Python or Javascript, and more recently both Rust and Go.

## Motivation

I personally really enjoy HackerNews and it is my main way of keeping in touch with the rest of the industry in which I work, mainly concerning software engineering at large but also for so many other subjects including hardware, entrepreneurship or AI.

What I find deeply enjoyable and why I learn so much using this website is first of all that almost all the aggregated links posted them are to say the least interesting in themselves. That in itself is great. But my main interest in this in my opinion unique social network is the discussion these articles trigger, where many professionals from many backgrounds (with of course a big bias on tech) bring the kind of exchange that I've personally not seen anywhere else on the internet.

Many incredibly accomplished people actively go there, and it's not unusual to encounter someone who contributed to or even created things you will use everyday - like some critical part of Chrome or Windows, or some incredible new AI project that may see user-facing applications some day.

## Project Description

Here is where my project comes together: my usage of HackerNews is largely read-only when it comes to the comments. I've been learning and using Rust for almost 10 years now. I've encountered and used tools in the terminal that were awesome. This and more all came together to create [hncli](https://github.com/pierreyoda/hncli).

A picture is worth a thousand words, so here's a couple of them!

A comment with sub-comments (username masked) on a typical thread:

![hncli comment screen](/hncli/comment-example.png)

Show Hacker News section with Best ranking applied:

![hncli Show HN screen with best sorting](/hncli/show-hn-best-ranking.png)

Settings panel:

![hncli settings screen](/hncli/settings.png)

You can read, sort, search for the stories most recently published. Comments can be viewed and navigated easily once inside a story. There are global settings persisted in OS-adapted user storage, and a help page.

All user interactions are performed by a tiny set of keyboard keys, with when required (which is rare) Control or Shift modifiers. I could, with some effort, use mouse events but I did not plan to from the beginning. It may be added some day if I rethink the UX, or if many users request it.

## Vision for 1.0 release

Here are the things to do before a proper 1.0 release (this list may be updated).

### Polish

All existing features must be polished as best as possible, with no directly visible bugs.

There is also a new screen to implement, which would allow to see a user's profile from one of its comments.

### Packaging & distribution methods

I apologize if this section is a bit technical. Binaries (executables, like `.exe` on Windows) distribution is a very sensitive subject that needs a lot of work to guarantee the end-user's safety.

I intend to offer binaries/packages for Windows, macOS, and Linux. The goal is to have the largest offering possible long-term but the most used solutions must be prioritized, with for instance brew on macOS.
The entire process should happen in GitHub Actions, with ideally releases in the corresponding GitHub section.

### Upvoting

Eventually, I would like to offer end-users the possibility to link their account inside the application, with a secure way of storing credentials.

hncli still being intended to be a mostly read-only experience, there is no planned way of answering comments at the moment (it would require heavy refactoring anyway).

### Mouse support

As said above, mouse support does not fit the scope I had at the start of this project but it may be appropriate for certain features. It would require some refactoring of the architecture though.

## Conclusion

I sure hope this article was clear enough!

You can read more about the software implementation [here](/blog/hncli-2-architecture).
