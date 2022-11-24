---
title: "An Hacker News Terminal UI in Rust: concept, architecture and the road to release"
description: "Motivation, concept, high-level overview of the Rust implementation, and the future challenges to come for a 1.0 release."
date: "2022-11-25"
published: true
---

# An Hacker News Terminal UI in Rust: concept, architecture and the road to release

// TODO: split in two articles

## Context

[Hacker News](https://news.ycombinator.com/) is a famous social network mostly aimed at engineers and entrepreneurs alike, ran by [Y Combinator](https://www.ycombinator.com/) which, for those unaware, helped launched companies like Stripe, AirBNB or what became known as Twitch in other famous examples. Both were created by the famous Paul Graham.

A Terminal UI is basically an interactive UI that runs directly in your terminal. You may be aware of [htop](https://htop.dev/), a famous process viewer. To go into more detail, many of such applications use the [ncurses](https://invisible-island.net/ncurses/) library under the hood which allows to implement incredibly powerful or beautiful features. ncurses is written in C but has bindings available in many languages, like Python or Javascript, and more recently both Rust and Go.

## Motivation

I personally really enjoy HackerNews and it is my main tool when it comes to keeping in touch with the rest of the industry in which I work, mainly concerning Computer Engineering at large but also for so many other subjects including entrepreneurship, company culture or AI.

What I find deeply enjoyable and why I learn so much using this website is first of all that almost all the aggregated links posted them are to say the list interesting in themselves. That in itself is great. But my main interest in this unique social network is the discussion these articles trigger, where many professionals from all parts of society (with of course a deep bias on tech) bring the kind of exchange that I've not seen anywhere else.

Many incredibly accomplished people actively go there, and it's not unusual to encounter someone who contributed to or even created things you will use everyday like some critical part of Chrome or Windows, or some incredible new AI project that *will* see use sooner rather than later.

## Project Description

Here is where my project comes together: my usage of HackerNews is largely read-only when it comes to the comments. I love Rust. I encountered and used tools in the terminal that were mind-blowing. This and more all came together to create [hncli](http://localhost:5173/blog/hncli-architecture).

Long story short, here's what will greet you when you come.

// TODO: screenshot => image integration in Mdsvex? relative path ideally

You can read, sort, search for the stories most recently published. Comments can be viewed and navigated easily once inside a story. There are global settings persisted in OS-adapted user storage, and a help page.

## Architecture Overview

The rest of the article is more aimed at technical people, but I will do my best to make it so that you don't need to know Rust to follow along. Some precisions will be for those with Rust knowledge, but I will try to keep it high-level so I hope you won't get hung up on the trade-offs I had to make along the way since I won't get into most of them in this article at least.

As you can see, this is quite a long post that will probably be slit some time in the future. Don't hesitate to skip to the most juicy parts for you if I'm too boring!

You can follow along on the actual source code if you wish so, and I will try my best to keep this article updated but the architecture described here will probably not change much.

### Goal

The required features listed above in the project description were pretty clear right from the start of my project. I am aware that other Hacker News Terminal UIs already do exist, even [an impressive one](https://github.com/aome510/hackernews-TUI) in Rust. I did not look at the code of any of these projects.

### Stack

#### UI

I chose to not go with ncurses (so [Cursive](https://github.com/gyscos/Cursive) in Rust) in small part due to its apparent complexity but mostly since I aimed at a minimalist design that seemed to perfectly fit a pure Rust library called [tui-rs](https://github.com/fdehau/tui-rs), which I knew from of one of its most famous users, a [Spotify TUI](https://github.com/Rigellute/spotify-tui) which looks very close (with much less scope in my case) to what I envisioned for hncli.

tui-rs is quite low level but offers, out of the box, the fundamental widgets which I needed for my project to work - just look at the README for a demonstration of its capabilities. It is used in what is called [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_(computer_graphics)), a rendering paradigm which I've been dying to try for quite some time with [Dear ImGui](https://github.com/ocornut/imgui) as a well-known example in the game development community.

Additionally, tui-rs promises to allow custom widgets to be implemented via an abstraction of the terminal output buffer. This sounded like a not so small feat to do not knowing the library but the provided widgets use the exact same API and the custom widgets that I did end up having to implement proved to be a very smooth process, almost working from the first try.

Technically, tui-rs offers no input handling but that is taken care of by the excellent backend which it supports by default, [crossterm](https://github.com/crossterm-rs/crossterm), a pure Rust terminal manipulation library.

#### Networking

You may have heard about the asynchronous story in Rust, which has been to say the least a huge community-wide undertaking over years which I won't have the time to get into. Long story short, it's been stable since [November 2019](https://blog.rust-lang.org/2019/11/07/Async-await-stable.html) and the whole asynchronous ecosystem has been improving ever more ever since then, since there were (and to be honest still are) some rough edges here and there.

There was no hesitation for me to pick [reqwest](https://github.com/seanmonstar/reqwest) as my HTTP client. I for now use the most well used and supported runtime, [Tokio](https://tokio.rs). Tokio may well be overkill for my needs, but I would need to dig deeper into alternatives and this was a clear case of premature optimization which is arguably still the case for my first public beta release. If a viable alternative can be easily used and it reduces the binary size with no difference in fetching latency, this will obviously be done.

### Other notable dependencies

I always strive to keep the minimum amount of used dependencies in any project I work on, both open-source and professionally. These are the major ones.

Some notable mentions that will be familiar to most are serde for data (de)serialization, chrono for date conversion (overkill for my case, seeking an alternative), log for logging which I introduced quite late in development when complex bugs arose and quick data inspection was needed; I will  keep it for errors that should be warnings and recoverable errors.

Speaking of errors, I use [thiserror] just like for all my recent binary projects for the convenience and rock-solid error management.

Two small crates of smaller renown but huge importance to me are needed.
The first one is [webbrowser](https://github.com/amodm/webbrowser-rs), which allows me to open a link in the default user browser, a feature I wanted right from the start. I would have liked to contribute to thank back the author but it seems quite stable and feature-complete, and has proven reliable in my usage.
The other one is [html2text](https://github.com/jugglerchris/rust-html2text/), which is basically called twice in my code base but actually does the heavy lifting of converting raw Hacker News content, which means the post itself if it has one and more generally the comments, for display in the terminal. It arguably brings a lot of indirect dependencies with it, which essentially come from Mozilla's [Servo](https://servo.org), an ambitious next-gen web browser written in Rust. It's now essentially abandoned, apparently and unfortunately since some Mozilla layoffs, but from what I've read a lot of the acquired experience helped Mozilla to successfully and gradually integrate Rust components in Firefox itself in what has been called the [Oxidation project](https://wiki.mozilla.org/Oxidation), Servo being a proving ground for some of the rewritten components.

Finally, I did hit a show-stopping road block when I discovered that you couldn't define asynchronous functions in a Trait, but thankfully the [async-trait](https://crates.io/crates/async-trait) crate offers a quite frankly magical one-line macro to make it possible. As of writing this line, official support in the compiler [reached Nightly](https://blog.rust-lang.org/inside-rust/2022/11/17/async-fn-in-trait-nightly.html) one week ago, with one limitation which doesn't seem to apply to my use case. In concrete terms, this should save me some allocation on the heap when compared to the async-trait macro so that's good news!

### High-Level Architecture

Just for context, I've been learning Rust since 2012, when it was still in beta. I do hope my code is mostly idiomatic but this will be more of a focus on the high-level architectural concepts I've been able to rapidly converge on.

## Vision for 1.0 release

It's been a long enough writing, so here's just a dump of all the various things to do, in no particular priority order:

// TODO: list styling

- polish, polish, polish
- very simple static website (didn't think about domain name yet). Same GitHub repository would be convenient but I'll have to think about it. I'm not a designer so it will also be minimalist and heavily rely on tailwindcss to not hurt your eyes... This may well be overkill for a niche tool but it would be nice at least for me. A more pragmatic approach short-term would be to just dedicate a page on this blog but we'll see
- measure binary size on platforms (cross-compile if necessary), see if acceptable, if not try to optimize (switching away from tokio or at the very least tweak its features used is a low hanging fruit as an educated guess)
- packaging (MacOs, Linux, Windows): largest offering possible but prioritize most used solutions like for instance brew on MacOS. Should be fully handled by the CI/CD through GitHub Actions which sounds time consuming to tackle having never done that. Ideally I'd like binaries directly offered in the Releases on GitHub from CI/CD builds, but priority between these two distribution methods will be easier first and I've never done either of those ever. Will decide when I explore both approaches some more.
- publish Docker image? the Dockerfile is there and can be improved with little effort, just check if usage is the same as native running
- optional secure HN account linking to upvote comments (should not be too complicated but password storing must be demonstrably safe for users)
- user account view
- probably more things I've forgotten
- finally: make the network layer a library, could be useful to some people. Probably requires little CI/CD work to integrate with crates.io/docs.rs but will have to dig deeper into that. If a developer requests it in an issue (and I hope so in a sense), this will be prioritized

So lots of new exciting things to learn and probably a long road ahead if I want to do things properly, since in particular there are no shortcuts (at least none I wish to take) when it comes to distributing binaries with trust on all the major platforms.
