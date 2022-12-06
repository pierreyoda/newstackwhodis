<script lang="ts">
</script>

# About Me

Hi! :wave:

My name is Pierre-Yves.

I'm a French Software Engineer in his late twenties.

## Short version

I started programming at the age of 13, with C and C++, and have not stopped ever since. Having used (ranging from hacking around to **real-world usage**) many languages and libraries, I've been continuously adding to the toolbox at my disposal to **solve problems**.

Professionally, my specialization is in **web technologies** conceived and implemented as a team to work at an **increasingly large scale**, current or future or both depending on employer. It is a goal in which I strive to include ease of contribution and onboarding of new contributors, among many other concerns.

In particular, I've extensively worked with Typescript. On the back-end, this meant Node.js with either NestJS, or a Serverless stack on AWS. On the front-end, I usually use modern React (often with Next.js), but did use Angular and Vue.js 2 early in my career.

I also do **a lot** of Rust for my [personal projects](https://github.com/pierreyoda)!

## More details

I'm increasingly more eager (and required) to learn new approaches or tweak existing ones, based on feedback, for things including:

- Efficient and enjoyable technical mentoring for both sides (pair programming, code reviews, _etc._).
- Exploring the trade-offs that a given piece of software will bring, not only for software but for the business problem being solved. Making the "best" choice is hard and often requires top-down buy-in.
- Knowledge sharing, both inside and outside the codebase. Be it from technical or functional perspectives, in writing form or as a live presentation for others (side-node: I really enjoy [marp](https://marp.app/)).
- Making the trade-off between immediate technical debt and business priorities. This has meant for me justifying it, documenting it, and keeping track of it.
- Anticipating production issues that could arise, or solving them as a team.

My most recent experience has been as a Lead Software Engineer for an ambitious 25-person startup, including six other engineers.

You can check out my [LinkedIn profile](https://www.linkedin.com/in/pierre-yves-diallo-567028113/) for more information about my career.

# Context and Stack for this website

The first iteration of this blog was called **newstackwhodis** (which I still to this day think is very funny), and used React and Next.js with [MDX](https://mdxjs.com/), a project which in short allows use of React components directly in your markdown, which was needed for the kind of articles I had in mind.

The current naming came from a startup branding generator which came up with **Prava** in a logo that I liked so much that I bought the corresponding full branding kit, which you won't see anywhere currently as I iterated towards a minimalist style that was more to my personal taste. **I'm obviously no designer though.**

After a typo in Google, I found out that **Praca** roughly means job or occupation in Polish (technically in Old Czech), and this website is more for the occupation side - my job but as a passion, both growing mutually from each other. For more pragmatic concerns, Praca meaning nothing in English is a real advantage for domain name availability and SEO purposes.

The kind of articles you will see here will generally be backed by fully independent sub-modules in Typescript, with a minimal set of unit tests; they are almost micro-libraries on their own. Not that I would ever publish them on NPM, mind you, since they all are scoped for specific usage inside an article on this website only. They are agnostic from front-end usage though.

To go into more details about these, I'm not using established libraries if possible since they many not exist, and if they do may be too heavy due to scope or indirect dependencies among other criteria. More importantly, the fun of learning and discovering whole new applications and trade-offs in the space explored by the article is the whole point, both for me and I hope for the reader.

As a teaser, here's the kind of articles in my pipeline, at a more or less advanced stage:

- An introduction to Genetic Algorithms and their applications. The planned interactive demo is the automatic optimization feature of 2D inventory space you can see in many video games, especially Action-RPGs, such as Diablo 2 or Titan Quest.
- The famous

Early along the way I was finally able to try **SvelteKit** when Sapper was deprecated. It's proven amazing to use but with some caveats. For instance, be aware that SvelteKit has been through some breaking changes on the road to 1.0, transparently explained by Svelte (and rollup) creator [Rich Harris](https://github.com/Rich-Harris) but closely following the announcements and issues on GitHub has been required for me.

I also use [mdsvex](https://mdsvex.com/), Svelte's flavor of React, with a mostly smooth experience apart from tooling: eslint or prettier cannot work with it 100% yet, far from it.

I've stuck with Vercel for hosting despite letting go of Next.js for hosting, since this website is also fully static so it's completely free. The website at large should be quite performant using Svelte, but the same may not be true of an interactive component in one of my articles especially as I go for more ambitious projects. For instance, I have an almost™ finished Game Boy (Color) emulator in Rust that I would very much like to bring to this website through WebAssembly. The issue I risk to encounter would not be from the Rust side of course, but more on the rendering side if I go for naive solutions while offering a high refresh rate. This could be be the opportunity to go for some low-level WebGL usage, which sounds like a great fun if maybe overkill.
