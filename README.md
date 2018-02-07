# Phaser3 Animated Tiles Plugin

A simple plugin with a simple purpose: to add support for animated tiles to Phaser 3 as exported from Tiled. 

A showcase: https://github.com/nkholski/phaser3-es6-webpack

The plugin is based on Photonstorms plugin template (https://github.com/photonstorm/phaser3-plugin-template). 

Run `npm install` and then `npm run build` to build the plugin.

## Current state
The plugin is being developed and the source code isn't optimized nor clean. The webpack configuration is the first working hack/update from the Plugin template and could probably improve a lot.

## Using the plugin

### Load the plugin and add it to a scene

You can load plugins externally, or include them in your bundle.

To load an external plugin:

```
function preload ()
{
    this.load.plugin('AnimatedTiles', 'path/to/AnimatedTiles.js');
}
```

Then to install it into a Scene:

```
    this.sys.install('AnimatedTiles');
```

If you load the plugins in a Preloader scene then you can add them to any other Scenes by specifying them in the plugins array:

```
var config = {
    scene: {
        create: create,
        plugins: [ 'AnimatedTiles' ],
        map: {
            'base': 'base'
        }
    }
};
```

### Use the plugin

To initilize the plugin you just need to pass the tilemap you want to animate to the plugin. The plugin requires a dynamic tilemap to work.

```
function create ()
{
    this.sys.animatedTiles.init(map);
}
```

This is actually all you need to do but you may control the plugin calling methods with "this.sys.animatedTiles.methodName()". Current list of methods:

| Method        | Args          | Usage  |
| ------------- |---------------| -----|
| resetRates     |  | Sets playback rate to 1 globally and for each individual tile |
| setRate       | rate: int, gid?: int      |  Sets playback multiplier to 'rate'. A rate of 2 will play the animation twice as fast as configured in Tiled, and 0.5 half as fast. If a gid is specified the rate is exclusively set for that tile. If the global rate is set to 0.5 and the rate of a tile is set to 2 it will play as configured in Tiled (0.5*2 = 1).|
| resume         | layerIndex?:int      | Resume tile animations globally if no layerIndex is set (may be overridden by layers), otherwise for that layer only. |
| pause          | layerIndex?:int      | Resume tile animations globally if no layerIndex is set and overrides layer settingsm, otherwise for that layer only. |
