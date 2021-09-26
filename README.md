# SvelteIO

[![NodeJS CI](https://github.com/foxfriends/svelte-io/actions/workflows/nodejs.yml/badge.svg)](https://github.com/foxfriends/svelte-io/actions/workflows/nodejs.yml)

[Basic Usage][] | [API Reference][]

The IO [monad][] for [Svelte][]. [Fantasy Land][] compatible.

[Fantasy Land]: https://github.com/fantasyland/fantasy-land
[monad]: https://github.com/fantasyland/fantasy-land#monad
[Svelte]: https://svelte.dev/
[Basic Usage]: #Usage
[API Reference]: ./API.md

> Disclaimer: This package, as written, has not been actually used in any practical way.
> It very well may not work the way you see it today. The documentation below also
> may very well not work as written. If this concept is interesting to you, but you
> find that the package is not working, please reach out and we'll get something
> sorted out!

## Installation

Not currently published to NPM, so install from Github:

```sh
npm i -S github:foxfriends/svelte-io
```

For obvious reasons, `svelte ^3.39` is also a (peer) dependency.

## Usage

For a significant number of cases, usage of this package should come quite naturally.
Such usage will be covered first.

```svelte
<!-- Hello.svelte -->
<script>
  export let name;
</script>

Hello {name}!
```

```svelte
<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import Driver, { render } from 'svelte-io';
  import Hello from './Hello.svelte';

  let driver;

  onMount(() => {
    driver.run(render(Hello, { name: 'World' }));
  });
</script>

<Driver bind:this={driver} />
```

This example shows the most fundamental parts of this package:
1.  The `Driver` represents where in the Svelte component hierarchy each `SvelteIO` will be run.
2.  Pass a `SvelteIO` to `driver.run()`, and it will be run by that driver.
3.  `render(Component, props)` is a built in `SvelteIO` that renders a component from the position of the `Driver`.

>   For those who want TypeScript types, and are finding they are missing from the package, here they are:
>   *   `render(Component: SvelteComponent, props?: Record<string, any>): SvelteIO`
>   *   `driver.run(io: SvelteIO<T>) -> Promise<T>`

Of course, the ability to render a single component is not all that exciting. What *is* exciting about
`SvelteIO` is that these `SvelteIO` values are *composable*.

```svelte
<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import Driver, { doIO, render } from 'svelte-io';
  import Hello from './Hello.svelte';
  import GetName from './GetName.svelte';

  let driver;

  onMount(() => {
    const main = doIO(async function* () {
      const name = yield render(GetName);
      yield render(Hello, { name });
    })
    driver.run(main);
  });
</script>

<Driver bind:this={driver} />
```

In this example, `doIO(generator: AsyncGenerator): SvelteIO<T>` is used to construct a more
complex `SvelteIO` by transforming a generator that itself yields other `SvelteIO`s.
Here, `main` is a `SvelteIO` that first renders the `GetName` component then, using the
*output value* of `GetName`, renders the `Hello` as before.

Different than in regular Svelte, `SvelteIO` components are generally expected to be displayed,
interacted with, and then be removed when its job is done, outputting some final value. Let's
take a look at how `GetName` is implemented:

```svelte
<!-- GetName.svelte -->
<script>
  import { useSvelteIO } from 'svelte-io';

  const { next } = useSvelteIO();

  let name = '';
</script>

<input bind:value={name} />

<button on:click={() => next(name)}>
  Submit
</button>
```

`SvelteIO` components call `useSvelteIO()` to get access to a function `next(value: T)`.
This `next(value)` function is the one that causes the generator from which the component
was `yield`ed to continue, very much like you called the `.next()` function on that
generator. Similarly, the value passed to this `next(value)` is the one that gets returned
from the `yield` statement!

There are a bunch more things you can do from SvelteIO: pretty much anything that you can do with
a regular Svelte component, including accessing context (`getContext(key: any): SvelteIO<T>`),
accessing the props passed to the `<Driver>` (`getProp(prop: string): SvelteIO<T>`), and
dispatching events from the `<Driver>` (`dispatch(event: string, detail?: any): SvelteIO<void>`).
Check out all the details in the [API reference][].

## Advanced Usage

As mentioned in the header, `SvelteIO` is actually implemented as a [monad][] (as defined
by [Fantasy Land][]). For those versed in Haskell, `doIO` is the closest thing we can get to
`do`-notation for Javascript, providing the intuitive interface seen above.

Given this knowledge, it should become apparent that all the usual things you can do to monads
apply to `SvelteIO`s. The example of `main` from above could have equivalently been written
using monad operators as follows:

```javascript
import { chain } from 'fantasy-land';
const main = render(GetName)[chain]((name) => render(Hello, { name }));
```

Or, since [Ramda][] is also Fantasy Land compatible:

[Ramda]: https://ramdajs.com/

```javascript
import { chain } from 'ramda';
const main = chain((name) => render(Hello, { name }), render(GetName));
```

Of course, this example does not show a great reason to use this syntax over that of `doIO`,
but if you are using this library in situations advanced enough that you need this level of
power, you likely know what you need anyway.

Something I have not tried, but would like to believe works, is using this Monad as the base
monad of other monad transforms (such as those from [Akh][]) to further add to their flexibility.

[Akh]: https://github.com/mattbierner/akh

## Contributing

Suggestions and improvements are welcome. Feel free to create issues, pull requests, or just
message me somewhere to discuss anything.
