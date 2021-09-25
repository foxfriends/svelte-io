# SvelteIO API Reference

[Svelte]: https://svelte.dev/

## `class Driver`

```svelte
<script>
  import Driver from 'svelte-io';

  let driver;
</script>

<Driver bind:this={driver} />
```

`<Driver>` is a [Svelte][] component which serves as the anchor from which `SvelteIO`s are run.

The `<Driver>` itself expects no props, but does expose those props to the `SvelteIO` that it is
running via the builtin `getProp(prop)`.

Similarly, the `<Driver>` itself emits no events, but may emit events that were dispatched by the
`SvelteIO` it is running via the builtin `dispatch(event, detail)`.

The driver exposes two methods which are used to run `SvelteIO`s:
*   `driver.run(io)`: Runs a `SvelteIO`, returning its final value, or throwing the error that caused
     it to abort.
*   `driver.runOrDefault(io, fallback)`: Runs a `SvelteIO`, returning its final value, or throwing
    the error that caused it to abort. In the case of the internal builtin `Cancel` error being
    the cause of abort, the fallback is returned instead. This option is provided as a *convenience*
    due to the common situation of needing to cancel a `SvelteIO` chain without crashing the
    application.

## `function render(Component, props)`

```javascript
import { render } from 'svelte-io';

const io = render(Component, { prop });
```

Creates an instance of `SvelteIO<T>` that will render the provided `Component`, passing `props`, at the
position in the DOM of the `Driver` from which it is run.

The rendered component is able to output a value (of type `T`) or abort a SvelteIO chain by calling the
appropriate functions returned by `useSvelteIO()`.

## `function dispatch(event, detail)`

```javascript
import { dispatch } from 'svelte-io';

const io = dispatch('event', detail);
```

Creates an instance of `SvelteIO<void>` that will dispatch the `event`, with optionally provided `detail`,
from the `Driver` from which it is run. This works much like Svelte's usual [`dispatch`](https://svelte.dev/docs#createEventDispatcher).

## `function getContext(key)`

```javascript
import { getContext } from 'svelte-io';

const io = getContext('key');
```

Creates an instance of `SvelteIO<T>` that gets a value from the Svelte context of the `Driver` from
which it is run. This works much like Svelte's usual [`getContext`](https://svelte.dev/docs#getContext).

## `function getProp(prop)`

```javascript
import { getProp } from 'svelte-io';

const io = getProp('prop');
```

Creates an instance of `SvelteIO<T>` that gets the value of a prop that was passed to the `Driver` from which
it was run.

>   Note that at this time there is no accompanying `setProp` function. Such a feature would only make sense
>   in the context of Svelte's [`bind:`](https://svelte.dev/docs#bind_element_property) directive, but since
>   we are accessing these props using [`$$props`](https://svelte.dev/docs#Attributes_and_props), and Svelte
>   does not properly reflect changes to props used this way to the parent, being able to set props would
>   only lead to confusion.
>
>   If you do want to have mutable props, simply pass a [store](https://svelte.dev/docs#svelte_store).

## `function doIO(generator)`

```javascript
import { doIO } from 'svelte-io';

const io = doIO(async function* () {});
```

Creates an instance of `SvelteIO<T>` by transforming a generator that `yield`s other instances of `SvelteIO`.
The return value of this generator (of type `T`) becomes the output value of the resulting `SvelteIO<T>`.

This is a simulation of Haskell's do-notation, so users of Haskell may find it somewhat familiar.
It is also quite similar to the usage of `async` functions, but instead of `await`ing `Promise`s,
we are `yield`ing `SvelteIO`s.

Note that the generator will never receive parameters. In order to make parameterized `SvelteIO`s,
simply write a function that calls `doIO(generator)` to return a new `SvelteIO`:

```javascript
const ioWithParameters = (param) => doIO(async function* () {});
```

## `function useSvelteIO()`

```svelte
<script>
  import { useSvelteIO } from 'svelte-io';

  const { next, cancel, abort } = useSvelteIO();
</script>
```

Provides an interface by which a Svelte component can become a `SvelteIO` component. `useSvelteIO()`
returns 3 functions:
*   `next(value: T)`: Continues the `SvelteIO` chain with the provided value as the output value.
*   `cancel()`: Aborts the `SvelteIO` chain by throwing a special `Cancel` error. This error can
    be automatically converted to a fallback value if the `SvelteIO` is run using the
    `driver.runOrDefault(io, fallback)` method. When run using the usual `driver.run(io)` method,
    the `Cancel` will be thrown like any other error.
*   `abort(error: Error)` Aborts the `SvelteIO` chain by throwing the provided error.

Worth noting is that (at this time at least), "aborts" caused by calling `cancel()` or `abort(error)`
cannot be caught and recovered from inside of the chain. Such errors will immediately cancel the
entire `SvelteIO` and cause the error to be thrown from `driver.run(io)`. This is best explained by
an example:

```svelte
<!-- ComponentThatWillAbort.svelte -->
<script>
  import { useSvelteIO } from 'svelte-io';

  const { abort } = useSvelteIO();
  abort(new Error('Oops!'));
</script>

<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import Driver, { doIO, render } from 'svelte-io';
  import ComponentThatWillAbort from './ComponentThatWillAbort.svelte';

  const main = doIO(async function* () {
    try {
      yield render(ComponentThatWillAbort);
    } catch (error) {
      // This will never be reached!
      console.log('Unreachable');
    }
  });

  let driver;

  onMount(() => {
    driver.run(main).catch((error) => {
      // Error is caught here!
      console.log('Caught: ', error);
    });
  });
</script>

<Driver bind:this={driver} />
```
 
## `class SvelteIO`

```javascript
import { SvelteIO } from 'svelte-io';

const io = new SvelteIO(async (driver) => 'Hello World');
```

The actual definition of the underlying `SvelteIO` type.

This class defines 4 members, which work as explained by [Fantasy Land][]:
*   `static [fantasy-land/of](value: T): SvelteIO<T>`
*   `[fantasy-land/chain](f: (T) => SvelteIO<U>): SvelteIO<U>`
*   `[fantasy-land/map](f: (T) => U): SvelteIO<U>`
*   `[fantasy-land/ap](b: SvelteIO<(T) => U>): SvelteIO<U>`

[Fantasy Land]: https://github.com/fantasyland/fantasy-land

## `class Cancel`

```javascript
import { Cancel } from 'svelte-io';
```

The special `Cancel` error that is thrown by the `cancel()` function returned by `useSvelteIO()`.
You may use this to implement special error handling after running a `SvelteIO`.
