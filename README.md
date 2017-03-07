# u-wave-gravatars

Use [Gravatar]s for user avatars.

## Installation

```
npm install --save u-wave-gravatars
```

## Usage

With [üWave Core][u-wave-core]:

```js
import gravatars from 'u-wave-gravatars';

uw.use(gravatars());
```

If users have configured [Gravatar], their avatars will be used from there in the
future.

## License

[MIT][]

[Gravatar]: https://gravatar.com/
[MIT]: ./LICENSE
[u-wave-core]: https://github.com/u-wave/core
