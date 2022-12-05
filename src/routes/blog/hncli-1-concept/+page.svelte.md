---
title: "An Hacker News Terminal UI: concept and road to release"
description: "Context, motivation, concept, and the future challenges to come for a 1.0 release."
date: "2022-11-25"
published: true
---

# An Hacker News Terminal UI: concept and road to release

## Original Idea

// TODO: spotify-tui + screenshot (I personally use the official application, but to each its own) | image integration in Mdsvex? relative path ideally

## Context

[Hacker News](https://news.ycombinator.com/) is a famous social network mostly aimed at engineers and entrepreneurs alike, ran by [Y Combinator](https://www.ycombinator.com/) which, for those unaware, helped launch companies like **Stripe**, **AirBNB** or what became known as **Twitch** in other famous examples. Both were created by the famous Paul Graham.

A Terminal UI is basically an interactive UI that runs directly in your terminal. You may be aware of [htop](https://htop.dev/), a famous process viewer. To go into more detail, many of such applications use the [ncurses](https://invisible-island.net/ncurses/) library under the hood which allows to implement incredibly powerful or beautiful features. ncurses is written in C but has bindings available in many languages, like Python or Javascript, and more recently both Rust and Go.

// TODO: also: htop screenshot for technical people

## Motivation

I personally really enjoy HackerNews and it is my main tool when it comes to keeping in touch with the rest of the industry in which I work, mainly concerning Computer Engineering at large but also for so many other subjects including entrepreneurship, company culture or AI.

What I find deeply enjoyable and why I learn so much using this website is first of all that almost all the aggregated links posted them are to say the list interesting in themselves. That in itself is great. But my main interest in this unique social network is the discussion these articles trigger, where many professionals from all parts of society (with of course a deep bias on tech) bring the kind of exchange that I've not seen anywhere else.

Many incredibly accomplished people actively go there, and it's not unusual to encounter someone who contributed to or even created things you will use everyday like some critical part of Chrome or Windows, or some incredible new AI project that *will* see use sooner rather than later.

## Project Description

Here is where my project comes together: my usage of HackerNews is largely read-only when it comes to the comments. I love Rust. I encountered and used tools in the terminal that were mind-blowing. This and more all came together to create [hncli](). // TODO: link

Long story short, here's what will greet you when you run the project:

// TODO: home screenshot

You can read, sort, search for the stories most recently published. Comments can be viewed and navigated easily once inside a story. There are global settings persisted in OS-adapted user storage, and a help page.

All user interaction is made directly by a tiny set of keyboard keys, with when required (rarely) Control or Shift modifiers. I could, with some engineering effort, use mouse events but I did not plan to from the beginning. It may be added some day if I rethink the UX, or if users request it.

## Vision for 1.0 release

### Miscellaneous improvements

Here are the various things to do before a proper 1.0 release:

- A lot of polish for the existing features.
- A new screen for viewing the user profile of a comment.
- Maybe a simple static website, or a dedicated section on this website as a temporary stop-gap.

### Technical requirements

This part is a bit more technical, and I hope will be clear enough:

-

// TODO:link

// TODO: list styling

- polish, polish, polish
- very simple static website (didn't think about domain name yet). Same GitHub repository would be convenient but I'll have to think about it. I'm not a designer so it will also be minimalist and heavily rely on tailwindcss to not hurt your eyes... This may well be overkill for a niche tool but it would be nice at least for me. A more pragmatic approach short-term would be to just dedicate a page on this blog but we'll see
- measure binary size on platforms (cross-compile if necessary), see if acceptable, if not try to optimize (switching away from tokio or at the very least tweak its features used is a low hanging fruit as an educated guess)
- packaging (MacOs, Linux, Windows): largest offering possible but prioritize most used solutions like for instance brew on MacOS. Should be fully handled by the CI/CD through GitHub Actions which sounds time consuming to tackle having never done that. Ideally I'd like binaries directly offered in the Releases on GitHub from CI/CD builds, but priority between these two distribution methods will be easier first and I've never done either of those ever. Will decide when I explore both approaches some more.
- publish Docker image? the Dockerfile is there and can be improved with little effort, just check if usage is the same as native running
- optional secure HN account linking to upvote comments (should not be too complicated but password storing must be demonstrably safe for users)
- user account view
- mouse support? It does not fit the UX I've implemented for now, but I'm open to it for very precise features. Technically possible.
- probably more things I've forgotten
- finally: make the network layer a library, could be useful to some people. Probably requires little CI/CD work to integrate with crates.io/docs.rs but will have to dig deeper into that. If a developer requests it in an issue (and I hope so in a sense), this will be prioritized

So lots of new exciting things to learn and probably a long road ahead if I want to do things properly, since in particular there are no shortcuts (at least none I wish to take) when it comes to distributing binaries with trust on all the major platforms.

