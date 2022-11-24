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

All user interaction is made directly by a tiny set of keyboard keys, with when required (rarely) Control or Shift modifiers. I could, with some engineering effort, use mouse events but I did not plan to from the beginning. It may be added some day if I rethink the UX, or if users request it.

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

Just for context, I've been learning Rust since 2012, when it was still in beta. I do hope my code is mostly idiomatic but this will be more of a focus on the high-level architectural concepts I've been able to rapidly converge on. I also have the compiler and [clippy](https://github.com/rust-lang/rust-clippy) warnings directly Visual Studio Code, which I exclusively use for Rust. Be aware that some rare clippy hints seem to be false positives in my use case, I might be wrong but this explains why you won't see a zero warnings codebase (yet) if you explore the code. The latest Rust edition (2021) is used, and I've embraced the change away from the "mod.rs" module pattern. All of this is applicable to my other Rust projects, at least those that were worked on since the change.

When you look at the main entry point of hncli (main.rs), you can immediately identify two central structures: the client which fetches the data with HTTP requests, and the UI. The UI is initialized with a rendering target, the Crossterm backend writing to stdout, and the client. Let's go deeper!

#### Client

The client is in charge of fetching data from the Hacker News API, which is public and [documented here](https://github.com/HackerNews/API). All examples I've used in my documentation and unit tests are taken directly from the documentation.

What I did first was the data modelling, an approach I usually take and which tends to work very well in languages like Typescript or Rust.

```rust
/// An `Item` in the HackerNews API covers everything except `User`s.
///
/// Used for deserialization, with dispatch on `type`.
#[derive(Clone, Debug, Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "lowercase")]
pub enum HnItem {
    Story(HnStory),
    Comment(HnComment),
    Job(HnJob),
    // ...
}
```

If you are unfamiliar with Rust enums, it's a powerful construct that allows you to associate data with your enum case. In Computer Science, that is called a tagged union and I've personally quickly fallen in love with what this brings to Rust - basically type-safe domain data modelling and manipulation. Have a peek at the [Rust book section](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html) if you have never written Rust.

The serde macros you can see used here and there allow me to seamlessly deserialize raw data directly into the correct Rust representation, without any further code. The type dispatch I'm speaking of in the comment allows this to work, since every JSON item from the API has a type field that can be "story", "comment" and so on. Similarly, case mismatch between "Story" and "story" is just one line away.

Then came the actual networking code, which sounds trivial but is not that simple due to the usage limits of the API and the concurrency I've used to efficiently fetch the hundreds of comments that regularly answer to a posted story.

I won't show you snippets here since it's quite hard to get the ful picture without viewing the [code itself](https://github.com/pierreyoda/hncli/blob/main/src/api.rs). It was my first time doing asynchronous Rust and using reqwest so there's probably a lot of room for improvement here, and error handling in closures make the implementation a bit awkward-looking at times.

I won't get into the whole `.await` postfix syntax debate which did feel unusual as I'm also a heavy Typescript user, and will just say that in practice it works well for chaining instructions in a functional style, not to mention Rust error propagation working just like in synchronous code.

#### UI Structure

The UI structure is the beating heart of hncli. It makes the terminal handling, client described just above, application describe below and the separate Components all work together, as demonstrated by its fields (some annotations here):

```rust
pub struct UserInterface {
    terminal: TerminalUi, // main tui-rs structure using crossterm to render (custom) widgets in the terminal
    client: HnClient, // our API client
    app: App, // our Application, see below
    /// Components registry.
    components: HashMap<UiComponentId, ComponentWrapper>, // more details later, and a Component wrapper FYI is just for elapsed "ticks" tracking
}
```

At initialization, the config is loaded from persistent storage (more later).

Then comes the setup, which spawns the user events handling thread which also sends the "ticks". The multi-threading primitive I've used is the [mpsc](https://doc.rust-lang.org/std/sync/mpsc/) from the standard library, which is a you knew or maybe guessed a Multi-Producer, Single-Consumer FIFO queue. Since I use crossterm, we retrieve the user events to send to the main thread by polling. All Components are then registered, which boils down to inserting a new instance of each into a HashMap with a globally unique ID as a key, for O(1) access. I chose a tick to be 100 milliseconds, and actual precision is by design more than enough for hncli's needs - refreshing the comments every couple of minutes for instance.

The UI loop of the application, ran in the main thread, looks like this after some cuts and annotations in [the code](https://github.com/pierreyoda/hncli/blob/main/src/ui.rs) for clarity:

```rust
pub async fn run(&mut self, rx: Receiver<UserInterfaceEvent>) -> Result<()> {
        let contextual_helper = ContextualHelper::new();
        'ui: loop {
            let app = &mut self.app;
            let components = &mut self.components;

            // first, we render
            self.terminal
                .draw(|frame| {
                    // ...some layout computation here

                    // refresh application chunks
                    app.update_layout(global_layout_chunks[0]);

                    // render components
                    for (id, wrapper) in components.iter_mut() { // kind of like Object.entries in modern Javascript
                        // get the component placing and size, we'll see later how it's computed; it can be None
                        let component_rendering_rect =
                            app.get_component_rendering_rect(id).cloned();
                        //
                        wrapper.active = component_rendering_rect.is_some();
                        let app_context = app.get_context(); // annoying borrow-checker limitation
                        match component_rendering_rect {
                            None => (), // no rendering
                            Some(inside_rect) => wrapper
                                .component
                                .render(frame, inside_rect, &app_context)
                                .expect("main UI loop: no component rendering error"), // needed invariant so this is an unrecoverable error
                        }
                    }

                    // ...render contextual helper if toggled in the settings
                })
                .map_err(HnCliError::IoError)?; // thiserror avoid me error translation boilerplate

            // do we have a key event sent from the other thread?
            if let UserInterfaceEvent::KeyEvent(event) = rx.recv()? {
                // Propagate it to the Application
                app.pump_event(event);
                let app_context = app.get_context();
                let inputs = app_context.get_inputs();
                if inputs.is_active(&ApplicationAction::Quit) {
                    break 'ui; // a nice feature of Rust you may have picked on: loops can be labeled; useful in nested loops, here used to be mor explicit
                }
                if inputs.is_active(&ApplicationAction::QuitShortcut)
                    && self.can_quit_via_shortcut() // quick shortcut can be toggled in the settings, basically hitting 'q' in any nested screen
                {
                    break 'ui;
                }
                // first, we let the Application handle the inputs, which means the current Screeen handles it
                // it can be "swallowed" (not propagated, more details later) or passed down to the Components via the UI, see later
                if self.app.handle_inputs() && !self.handle_inputs()? {
                    // can't go into details but basically needed for the UX I wanted
                    self.app.update_latest_interacted_with_component(None);
                }
            } else {
              // else: we have a Tick update, which means let's update things that need it (current Screen, active components).
              // You'll see later that components are of course not constantly updated as fast as possible,
              // but this is not the scope of the UI structure. It just fires away.
              self.update().await?; // asynchronous since data fetching needs to happen at some point somewhere
            }
        }

        Ok(())
    }
```

#### Application

This one required quite some iteration, especially due to difficult memory lifetime issues. You may have heard about it if not in Rust, and it's a tough one to learn especially for those coming from a Garbage Collected-only languages, especially coming from a Garbage Collected language like Java, Javascript, C# or Go. In my experience, it's not that often required in typical Rust code, but it does definitely contribute to a high learning curve at the beginning. Maybe by progress in skill, certainly by advances in the compiler, explicit lifetime annotations have been increasingly more rare in my own code for what it's worth.

```rust
/// Interact with application state from the components.
pub struct AppContext<'a> {
    state: &'a mut AppState,
    router: &'a mut AppRouter,
    config: &'a mut AppConfiguration,
    inputs: &'a InputsController,
    /// Stored to change screen on route change.
    screen: &'a mut Box<dyn Screen>, // heap-allocated storage of a generic implementation of a Screen
}
```

Now that you've seen this snippet, you can see that there is everything centrally stored here for usage by components to actually *do* something.

I know, I know. This looks like globally scoped mutable state. Except it's not, it's owned by our UI structure and, thanks to the numerous Rust guarantees. Long story short, the end of it if that the only synchronization issues I can - and did, and will - encounter leading to bugs is due to business logic issues, which no language can prevent - yet?. More precisely, it boils down to the many moving pieces in hncli badly interacting, and most bugs are really easy to fix. Some, I admit, do require a bit of refactoring but not at the architecture level, just in a few sub-modules or Components.

If you look at the [module source code](https://github.com/pierreyoda/hncli/blob/main/src/app.rs), a big chunk of it is in the same file. This was a choice I made to better keep deeply-connected things at the exact same place, and it's a specific architectural aim to not let the Application state grow too much.

##### State management

Speaking of state, this is a big one, as anyone on the front-end side which did React, or jQuery, or anything really can tell you. In React, you can react to Redux, MobX, more recently the React hooks API, or any thing in-between. It's quite a big deal in a React codebase, and an ill-advised choice can lead to great headaches years down the line - or much sooner if you're lucky.

Basically, we have in our state everything that needs to be read and/or written somehow somewhere. You can see just below the kind of data it stores. I've omitted some fields from the snippet for brevity, but there are at the time I'm writing this only 11 fields in our state. This will probably evolve a little over the time, but will not grow much at this point. Some fields came in just for a specific feature I wanted for which I found out some data did need to be in this scope, after quickly exhausting the other options.

```rust
/// Global application state.
#[derive(Debug)]
pub struct AppState {
    /// Latest component interacted with, *i.e.* the latest component having
    /// swallowed an UI event.
    latest_interacted_with_component: Option<UiComponentId>, // small precision: an Option in Rust = can contain something, or None
    /// The currently viewed item (not a comment).
    currently_viewed_item: Option<DisplayableHackerNewsItem>, // comes from our API client
    /// The comments of the currently viewed item, if applicable.
    currently_viewed_item_comments: Option<DisplayableHackerNewsItemComments>, // same thing, Api client
    /// The successive IDs of the viewed comment, starting at the root parent comment.
    currently_viewed_item_comments_chain: Vec<HnItemIdScalar>, // a Vec is an heap-allocated array (equivalent to C++'s std:vector)
}
```

How do you interact with all this data? By good old accessors, manually written. Just a couple of dozen of lines of boilerplate, and I could write a simple Rust macro to make it terser as I've done in my [Game Boy (Color) emulator](https://github.com/pierreyoda/rustboycolor/blob/main/src/bin/config.rs) for instance. Speaking of which, this emulator project probably will be the subject of one or two write-ups once it runs Tetris with no bugs, sound included. It's been worked on and off (mostly off to be honest) for quite some time now, but may very well one day directly run on this blog with WebAssembly :rocket:

One last thing: I've found at very late in the project that some setters *do* need some business logic.

In the first case, I was confused why navigating back from sub-comments was working erratically, to say the least. Turned out, once you get into a sub-comment of any depth, a data fetch is made by the corresponding Component which allows us to get the freshet comments, which is a good thing on many really hot stories. And, since I don't want to fetch too much, this lead to my issue when navigating back from a sub-comment - the same Component displays a comment a any level, in order to not duplicate code but which is sometimes tricky to deal with. So I was erasing comments. The solution was to merge incoming sub-comments within the existing cached comments. Seems obvious in retrospect.

The second case I've encountered more or less randomly on some rare stories posted. The bug I was that the number of comments at the top level displayed looked correct, but once you navigated to one of the comments it could not be displayed due to it missing from our cache. After investigation, there was apparently a mismatch between the IDs of the descendants I was initially fetching and the comments I could actually fetch. It's probably an issue on my end, which was fixed by just enforcing data coherency ensuring before updating the comments cache from any depth. The issue has not reappeared for now.


#### UI component

####


##### Router component

#### UI Components

#### Persistent configuration

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
