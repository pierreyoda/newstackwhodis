---
title: "An Hacker News Terminal UI: deep-dive into the Rust architecture"
description: "High-level overview of the Rust architecture and implementation."
date: "2022-11-26"
published: true
---

# hncli Rust Architecture Overview

This article is aimed at technical people, but I will do my best to make it so that you don't need to know Rust to follow along. Some precisions will be for those with Rust knowledge, but I will try to keep it high-level so I hope you won't get hung up on the trade-offs I had to make along the way since I won't get into most of them, at least in this article.

As you can see, this is quite a long post that will probably be split some time in the future. Don't hesitate to skip to the most juicy parts for you if I'm too boring!

You can follow along on the actual source code if you wish so, and I will try my best to keep this article updated but the architecture described here will probably not change much.

## Goal

If you haven'haven't read it yet, I advise you to take a look at the [concept article](/blog/hncli-1-concept).

The required features listed in the project description were pretty clear right from the start of my project. I am aware that other Hacker News Terminal UIs already do exist, even [an impressive one](https://github.com/aome510/hackernews-TUI) in Rust. I did not look at the code of any of these projects.

### Stack

#### UI

I chose to not go with ncurses (so [Cursive](https://github.com/gyscos/Cursive) in Rust) in small part due to its apparent complexity but mostly since I aimed at a minimalist design that seemed to really fit a pure Rust library called [tui-rs](https://github.com/fdehau/tui-rs), which I knew from of one of its most famous use cases, a [Spotify TUI](https://github.com/Rigellute/spotify-tui) - with much less scope in the case of hncli.

tui-rs is quite low level but offers, out of the box, the fundamental widgets which I needed for my project to work - just look at the README for a demonstration of its capabilities. It is used in what is called [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_(computer_graphics)), a rendering paradigm which I've been eager to try for quite some time with [Dear ImGui](https://github.com/ocornut/imgui) as a well-known example in the game development community.

Additionally, tui-rs promises to allow custom widgets to be implemented via an abstraction of the terminal output buffer. This sounded like a not so small feat to do, not knowing the library beforehand. Fortunately, the provided widgets use the exact same API and the custom widgets that I did end up implementing proved it to be a rather smooth-sailing process.

Technically, tui-rs offers no input handling but that is taken care of by the excellent backend which it uses by default, [crossterm](https://github.com/crossterm-rs/crossterm), a pure Rust terminal handling library.

#### Networking

You may have heard about the asynchronous story in Rust, which has been to say the least a huge community-wide undertaking over years which I won't have the time nor the credentials to get into. Long story short, it's been stable since [November 2019](https://blog.rust-lang.org/2019/11/07/Async-await-stable.html) and the whole asynchronous ecosystem has been improving ever more ever since, even though there have been some rough edges here and there.

There was no hesitation for me to pick [reqwest](https://github.com/seanmonstar/reqwest) as my HTTP client. For now, the most used and supported runtime, [Tokio](https://tokio.rs), is used. Tokio may well be overkill for my needs, but I would need to dig deeper into alternatives and this was a clear case of premature optimization which is arguably still the case for my first public beta release. If a viable alternative can be easily used and it reduces the binary size with no difference in fetching latency, Tokio will be replaced.

### Other notable dependencies

I always strive to keep the minimum amount of used dependencies in any project I work on, both open-source and professionally. These are the major ones.

Some notable mentions that will be familiar to most are `serde` for data (de)serialization, `chrono` for timestamp conversion (overkill for my case, seeking an alternative), and `log` for logging which I introduced quite late in development - when complex bugs arose and quick data inspection was needed. I will keep `log` for errors that should be warnings and recoverable errors.

Speaking of errors, I use [thiserror](https://github.com/dtolnay/thiserror) just like for all my recent binary projects for the convenient error management.

Two small crates of smaller renown but of huge importance to hncli were needed.
The first one is [webbrowser](https://github.com/amodm/webbrowser-rs), which allows me to open a link in the default user browser, a feature I wanted right from the start. I would have liked to contribute to thank back the author but it seems quite stable and feature-complete, and has proven reliable in my usage.
The other one is [html2text](https://github.com/jugglerchris/rust-html2text/), which is basically called twice in my code base but actually does the heavy lifting of converting raw Hacker News content for display in the terminal. This means that the post itself (if it has content) and more generally the comments. It arguably brings a lot of transitive dependencies with it, which essentially come from Mozilla's [Servo](https://servo.org), an ambitious next-gen web browser written in Rust. It's now essentially abandoned, apparently and unfortunately since some Mozilla layoffs. Despite this, from what I've read, a lot of the acquired experience helped Mozilla to successfully and gradually integrate Rust components in Firefox itself in what has been called the [Oxidation project](https://wiki.mozilla.org/Oxidation), Servo being a proving ground for some of the rewritten components.

Finally, I did hit a show-stopping road block when I discovered that you couldn't define asynchronous functions in a Trait, but thankfully the [async-trait](https://crates.io/crates/async-trait) crate offers a quite frankly magical one-line macro to make it possible. As of writing this line, official support in the compiler recently [reached Nightly](https://blog.rust-lang.org/inside-rust/2022/11/17/async-fn-in-trait-nightly.html) , with one limitation which doesn't seem to apply to my use case. In concrete terms, this would save me some allocation on the heap when compared to the `async-trait` macro so that's good news!

## High-Level Architecture

Just for context, I've been learning Rust since 2012, when it was still in beta. I do hope my code is mostly idiomatic but this will be more of a focus on the high-level architectural concepts I've been able to rapidly converge on. I also have the compiler and [clippy](https://github.com/rust-lang/rust-clippy) warnings directly in Visual Studio Code, which I exclusively use for Rust. Be aware that some rare clippy hints seem to be false positives in my use case, I might be wrong but this explains why you won't see a zero warnings codebase (yet) if you explore the code. The latest Rust edition (2021) is used, and I've embraced the change away from the `mod.rs` module pattern. All of this is applicable to my other Rust projects, at least those that were actively worked on since the 2021 edition.

Do note that many trade-offs taken will need some context, so I do apologize for the length of this article. This context may be the iterations I've made before reaching the current state the codebase is in, or a show-stopping bug I've encountered and the solution I've found to solve it.

When you look at the main entry point of hncli (main.rs), you can immediately identify two central structures: the client which fetches the data with HTTP requests, and the UI. The UI is initialized with a rendering target, the Crossterm backend writing to stdout, and the client. Let's go deeper!

### Client

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

#### Internal Hacker News data representation

The [DisplayableHackerNewsItem](https://github.com/pierreyoda/hncli/blob/main/src/ui/displayable_item.rs) structure allows transparent
handling of any displayable Hacker News data, as the name suggests. It uses the [TryFrom trait](https://doc.rust-lang.org/std/convert/trait.TryFrom.html)
to instantiate from raw Hacker News data from the client, with error handling.

### UI Structure

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

### Application

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

#### State management

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

One last thing: I've found quite after some time spent on the project that some setters *do* need some business logic.

In the first case, I was confused why navigating back from sub-comments was working erratically, to say the least. Turned out, once you get into a sub-comment of any depth, a data fetch is made by the corresponding Component which allows us to get the freshet comments, which is a good thing on many really hot stories. And, since I don't want to fetch too much, this lead to my issue when navigating back from a sub-comment. This is due to the same Component displaying a comment a any level, in order to not duplicate code and this proved sometimes really tricky to deal with, including in this case. So I was erasing comments. The solution was to merge incoming sub-comments within the existing cached comments. Seems obvious in retrospect.

The second case, I've encountered more or less randomly on some rare stories posted. The bug I was encountering was that the number of comments at the top level displayed looked correct, but once you navigated to one of the comments it could not be displayed due to it missing from our cache. After investigation, there was apparently a mismatch between the IDs of the descendants I was initially fetching and the comments I could actually fetch. It's probably an issue on my end, which was fixed by just enforcing data coherency, before updating the comments cache from any depth. The issue has not reappeared for now.

#### Router component

Just like in a React application for instance (with [react-router](https://reactrouter.com/en/main) being the most used library), the router is responsible for keeping track of the current and previous routes navigated, which (roughly) corresponds to a particular Screen.

Here are all the application routes:

```rust
/// All the possible routes in the application.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum AppRoute {
    /// Home screen.
    Home(HnStoriesSections), // stores the particular Hacker News top section: Home, Ask, Show, Jobs
    /// Item details screen.
    ItemDetails(DisplayableHackerNewsItem), //  stores the currently viewed item (in this case top-level = story, job, poll)
    /// Item sub-comments screen.
    ItemSubComments(DisplayableHackerNewsItem), // stores the currently viewed item (in this case a comment)
    /// Settings screen.
    Settings,
    /// Help screen.
    Help,
}
```

Here's the definition of the router structure, and its interface (stripped of the [code](https://github.com/pierreyoda/hncli/blob/main/src/ui/router.rs)):

```rust
/// Stack-based global application router.
pub struct AppRouter {
    /// The current navigation stack.
    ///
    /// Example: home > story #1 details > comment #2 thread.
    navigation_stack: Vec<AppRoute>,
}

impl AppRouter {
    /// Are we on the root screen, *i.e.* the initial screen showed on application launch?
    ///
    /// NB: section tabs like "Ask HN" or similar **do** count as being on the initial screen.
    pub fn is_on_root_screen(&self) -> bool

    /// Get the current route state.

    /// Push a new navigation route state.
    pub fn push_navigation_stack(&mut self, route: AppRoute)

    /// Go to the previous navigation route state.
    pub fn pop_navigation_stack(&mut self) -> Option<AppRoute>

    pub fn build_screen_from_route(route: AppRoute) -> Box<dyn Screen> // in this case, pointer to a heap-allocated generic implementation of the Screen trait (see later)
```

#### Persistent configuration

The required configuration files are stored as a TOML file in the OS-appropriate local user folder, thanks to the [directories](https://github.com/dirs-dev/directories-rs) crate. serde is used for (de)serialization purposes. Loading the configuration, if it already exists, is done at setup by the Ui structure.

#### Inputs handling

Basically a bridge between low-level events from crossterm and high-level application actions which are the following (for now):

```rust
pub enum ApplicationAction {
    // general
    OpenExternalOrHackerNewsLink,
    OpenHackerNewsLink,
    SelectItem,
    ToggleHelp,
    Back,
    Quit,
    QuitShortcut,
    // navigation
    NavigateUp,
    NavigateDown,
    NavigateLeft,
    NavigateRight,
    // input
    InputClear,
    InputDelete,
    // home screen
    HomeToggleSortingOption,
    HomeToggleSearchMode,
    // item screen
    ItemToggleComments,
    ItemExpandFocusedComment,
    // settings screen
    SettingsToggleControl,
}
```

I've looked at mouse support, which is technically possible with crossterm, but it does not fit my current UX concept as said in the [concept article](/blog/hncli-1-concept).

The low-level abstraction is as following:

```rust
/// Abstraction over a key event.
///
/// Used to abstract over tui's backend, and to facilitate user configuration.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Key {
    None, // needed when no event
    /// Escape key.
    Escape,
    /// Enter/Return and Numpad Enter.
    Enter,
    /// Backspace key.
    Backspace,
    /// Tabulation key.
    Tab,
    /// Up arrow.
    Up,
    /// Down arrow.
    Down,
    /// Left arrow.
    Left,
    /// Right arrow.
    Right,
    /// Keyboard character.
    Char(char),
    /// Unhandled.
    Other,
}
```

There's a key representation function associated for the UI to display, with emojis expect for individual characters. There's also a conversion function from crossterm events to hncli's representation (as `From` for the Rust public).

Same goes for key modifiers:

```rust
/// Abstraction over a key event modifier.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum KeyModifier {
    None, // needed when no key modifier
    Shift,
    Control,
}
```

Here's how it all comes together (short snippet):

```rust
impl ApplicationAction {
    pub fn matches_event(&self, inputs: &InputsController) -> bool {
        use ApplicationAction::*;
        match self {
            OpenExternalOrHackerNewsLink => inputs.key == Key::Char('o'),
            OpenHackerNewsLink => {
                inputs.modifier == KeyModifier::Shift && inputs.key == Key::Char('o')
            }
            // ...
        }
    }
}
```

Finally, the inputs controller which is the interface exposed to individual Components:

```rust
/// Application inputs controller.
///
/// Bridges between raw inputs and application-level events.
#[derive(Debug)]
pub struct InputsController {
    key: Key,
    modifier: KeyModifier,
    active_input_key: Key,
    active_input_mode: bool,
}

impl InputsController {
    pub fn new() -> Self {
        Self {
            key: Key::None,
            modifier: KeyModifier::None,
            active_input_key: Key::None,
            active_input_mode: false,
        }
    }

    pub fn pump_event(&mut self, event: KeyEvent, state: &AppState) {
        // ...from a raw crossterm event, update the internal state of self
    }

    pub fn is_active(&self, action: &ApplicationAction) -> bool {
        action.matches_event(self)
    }

    pub fn has_ctrl_modifier(&self) -> bool {
        self.modifier == KeyModifier::Control
    }

    pub fn has_shift_modifier(&self) -> bool {
        self.modifier == KeyModifier::Shift
    }

    pub fn get_active_input_key(&self) -> Option<(Key, char)> {
        // get the active (keyboard key, ASCII representation) tuple
    }
}
```

### Screens

Screens in hncli must implement the following trait:

```rust
/// Defines layout state by associating each visible component
/// with a defined target `Rect`.
pub type ScreenComponentsRegistry = HashMap<UiComponentId, Rect>;

/// A Screen is a self-contained state of the application with its own update and rendering logic.
pub trait Screen: Debug + Send {
    /// Called after instantiation and before mounting the screen.
    fn before_mount(&mut self, state: &mut AppState, config: &AppConfiguration) {}

    /// Handle an incoming key event, at the application level. Returns true if
    /// the event is to be captured (swallowed) and not passed down to components.
    ///
    /// Returns the (event_response, new_route_if_navigated) tuple.
    fn handle_inputs(
        &mut self,
        inputs: &InputsController,
        router: &mut AppRouter,
        state: &mut AppState,
    ) -> (ScreenEventResponse, Option<AppRoute>);

    /// Compute the components' layout according to current terminal frame size.
    fn compute_layout(
        &self,
        frame_size: Rect,
        components_registry: &mut ScreenComponentsRegistry,
        state: &AppState,
    );
}
```

An active screen handles inputs *before* its active components, which are determined in `compute_layout`. When handling inputs, a tuple containing both the event response and, optionally, the new route to push to the navigation stack.

A screen event response takes the following form:

```rust
/// Actions requested by a Screen when handling an input event.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ScreenEventResponse {
    /// Swallow the event, preventing it from bubbling down to the components.
    Caught,
    /// Ignore the event, passing it down to the components.
    PassThrough,
}
```

As you can see, it is kind of inspired from event handling in web browsers - you may be familiar with [event.stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation).

#### Screen example: Home

This is the first Screen the user sees when launching hncli, and is very representative of the other ones ([full version](https://github.com/pierreyoda/hncli/blob/main/src/ui/screens/home.rs)):

```rust
/// The Home screen of hncli.
///
/// The current layout is as following:
///
/// ```md
/// ------------------------------------------
/// |              navigation                |
/// ------------------------------------------
/// |                                        |
/// |                                        |
/// |               stories                  |
/// |                                        |
/// |                                        |
/// ------------------------------------------
/// |          options (eg. sorting)         |
/// ------------------------------------------
/// ```
#[derive(Debug)]
pub struct HomeScreen {
    section: HnStoriesSections, // home, ask, show HN, jobs
}

impl HomeScreen {
    pub fn new(section: HnStoriesSections) -> Self {
        Self { section }
    }
}

impl Screen for HomeScreen {
    fn before_mount(&mut self, state: &mut AppState, config: &AppConfiguration) {
        state.set_main_stories_section(self.section);
    }

    fn handle_inputs(
        &mut self,
        inputs: &InputsController,
        router: &mut AppRouter,
        state: &mut AppState,
    ) -> (ScreenEventResponse, Option<AppRoute>) {
        if inputs.is_active(&ApplicationAction::HomeToggleSearchMode) {
            state.set_main_search_mode_query(if state.get_main_search_mode_query().is_some() {
                None
            } else {
                Some("".into())
            });
            (ScreenEventResponse::Caught, None)
        } else {
            (ScreenEventResponse::PassThrough, None)
        }
    }

    fn compute_layout(
        &self,
        frame_size: Rect,
        components_registry: &mut ScreenComponentsRegistry,
        state: &AppState,
    ) {
        // main layout chunks (think of it as a kind of a column-first flexbox in CSS3)
        let main_layout_chunks = Layout::default()
            .direction(Direction::Vertical)
            .margin(2)
            .constraints(
                [
                    Constraint::Percentage(6),
                    Constraint::Percentage(89),
                    Constraint::Percentage(5),
                ]
                .as_ref(),
            )
            .split(frame_size);

        // ...now we just insert the appropriate components in each of our "chunks"
        components_registry.insert(
            if state.get_main_search_mode_query().is_some() {
                SEARCH_ID
            } else {
                NAVIGATION_ID
            },
            main_layout_chunks[0],
        );
        components_registry.insert(STORIES_PANEL_ID, main_layout_chunks[1]);
        components_registry.insert(OPTIONS_ID, main_layout_chunks[2]);
    }
}

unsafe impl Send for HomeScreen {}

```

### UI Components

UI components, as popularized by React or Vue.js, are nowadays a very (to say the least) common way to architecture a front-end. From my own experience in front-end frameworks, I wanted right from the start to use them in hncli somehow. After getting the hang of tui-rs by displaying a very basic list, a Component trait was converged upon (with few modifications since):

```rust
/// A `tick` is a UI update, in the order of the hundred milliseconds.
pub type UiTickScalar = u64;

/// A hashable type for application-unique component IDs.
pub type UiComponentId = &'static str;

/// A `Component` in this Terminal UI context is a self-contained
/// widget or group of widgets with each their own updating,
/// events handling and rendering logic.
#[async_trait]
pub trait UiComponent {
    /// Must return a constant, **application-unique** component ID.
    fn id(&self) -> UiComponentId;

    /// Called at instantiation, before any update or render pass.
    fn before_mount(&mut self, _ctx: &mut AppContext) {}

    /// Must return `true` if the state should update itself.
    fn should_update(&mut self, elapsed_ticks: UiTickScalar, ctx: &AppContext) -> Result<bool>;

    /// Update the state from various sources.
    async fn update(&mut self, client: &mut HnClient, ctx: &mut AppContext) -> Result<()>;

    /// Inputs handler for the component.
    ///
    /// Returns true if the active event is to be captured, that is swallowed
    /// and no longer passed to other components.
    fn handle_inputs(&mut self, ctx: &mut AppContext) -> Result<bool>;

    /// Renderer for the component.
    fn render(
        &mut self,
        f: &mut Frame<CrosstermBackend<Stdout>>, // the tui-rs rendering handle
        inside: Rect, // where to render exactly
        ctx: &AppContext,
    ) -> Result<()>;
}
```

#### Example of a Component - heavily stripped ([code](https://github.com/pierreyoda/hncli/blob/main/src/ui/components/item_details.rs))

```rust
/// Item details component.
///
/// Does not do any fetching, everything is pre-cached.
///
/// ```md
/// ___________________________________________
/// |                                         |
/// |                <TITLE>                  |
/// |            <URL HOSTNAME?>              |
/// |      <SCORE> POINTS / BY <USERNAME>     |
/// |   <#COMMENTS COUNT>  / POSTED <X> AGO   |
/// |_________________________________________|
/// ```
#[derive(Debug, Default)]
pub struct ItemDetails {
    text: Option<String>,
}

pub const ITEM_DETAILS_ID: UiComponentId = "item_details";

#[async_trait]
impl UiComponent for ItemDetails {
    fn id(&self) -> UiComponentId {
        ITEM_DETAILS_ID
    }

    fn should_update(&mut self, _elapsed_ticks: UiTickScalar, ctx: &AppContext) -> Result<bool> {
      // ...text of currently viewed item must have changed
      Ok(should_update)
    }

    async fn update(&mut self, _client: &mut HnClient, ctx: &mut AppContext) -> Result<()> {
        self.text = if let Some(item) = ctx.get_state().get_currently_viewed_item() {
            item.text.clone()
        } else {
            None
        };
        Ok(())
    }

    fn handle_inputs(&mut self, _ctx: &mut AppContext) -> Result<bool> {
        Ok(false) // passive component: no inputs handling
    }

    fn render(
        &mut self,
        f: &mut tui::Frame<CrosstermBackend<Stdout>>,
        inside: Rect,
        ctx: &AppContext,
    ) -> Result<()> {
        // ...rendering

        Ok(())
    }
}
```

## Conclusion

I hope this was not too long! As I hope you could see, the architecture kind of wrote itself after some deep thinking about the concept and the associated technical constraints. I hope you enjoy `hncli` as much as I've been enjoying working on it :tada:
