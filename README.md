# Phaser3 Plugin Template

A base plugin template for Phaser 3 to allow you to create your own plugins.

Run `npm install` and then `npm run build` to build the plugin.

## Using Plugins in Phaser 3

You can load plugins externally, or include them in your bundle.

To load an external plugin:

```
function preload ()
{
    this.load.plugin('BasePlugin', 'path/to/BasePlugin.js');
}
```

Then to install it into a Scene:

```
    this.sys.install('BasePlugin');
```

If you load the plugins in a Preloader scene then you can add them to any other Scenes by specifying them in the plugins array:

```
var config = {
    scene: {
        create: create,
        plugins: [ 'BasePlugin' ],
        map: {
            'base': 'base'
        }
    }
};
```

More examples and instructions will follow, but for now see the [Phaser 3 Examples](https://github.com/photonstorm/phaser3-examples) repo for details.
