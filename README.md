# Phaser 3 Animated Tiles Plugin

A simple plugin with a simple purpose: to add support for animated tiles to Phaser 3 (3.8.0+) as exported from Tiled.

The bundled example is available live here: http://metroid.niklasberg.se/phaser-animated-tiles/

The plugin is also used in this platformer example: https://github.com/nkholski/phaser3-es6-webpack

The plugin is based on Photonstorms plugin template: https://github.com/photonstorm/phaser3-plugin-template

Latest build can be found in the dist folder or NPM: https://www.npmjs.com/package/phaser-animated-tiles

Run `npm install` and then `npm run build` to build the plugin.

## Features
This plugin supports unlimited maps, layers and tilesets simultaneously. There are methods to control animations globally, within specified tilemaps or layers. Those methods can control such things as playback-rate both for all tiles and for specified tiles. ATM it's up to you to keep track on indicies for maps you add and their layers. For most cases that shouldn't be a problem. If you just want to support animated tiles exactly as specified in Tiled you need three lines; one to preload the plugin, one to register it in your create method and one to initilize it for your map.

### Future
I have a few stuff I would like to add, of which some might be [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it):
1. PutTile as the native API but will push the tile to the update list for that tile gid. If you put a tile over an animated tile, that tile should instead be removed from the list. The latter is just needed if the new gid is a part of the current anim, but still nice to have.
2. Define animations programmatically.
3. And if 2 is done: Allow animated rotation (probably 45 degree steps only), flipping and alpha. Tint? Stuff that Phaser supports.
4. Method to reset everything to their first frame.
5. The webpack configuration is the first working hack/update from the Plugin template and could probably improve a lot, like a serve function to run the example.

## Example
Install http-server
```
npm i http-server
```
Start http-server in the repository root and go to localhost:8080/example in your browser. Port number might be different. You might want to install http-server globally using "-g". Sorry for this. I lack the skills to serve the example by config for npm.


## How to use the plugin

### 1. Load the plugin and add it to a scene

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

### 2. Use the plugin API

To initilize the plugin you just need to pass the tilemap you want to animate to the plugin. The plugin requires a dynamic layers to work.

```
function create ()
{
    this.sys.animatedTiles.init(map);
}
```

This is actually all you need to do but you may control the plugin calling methods with "this.sys.animatedTiles.methodName()". (The inconsistency between passing a tilemap and a mapindex will be solved by excepting both in all concerned methods. Methods to find tilemaps, layers and tiles will be added.)

Current list of methods:

| Method        | Args          | Usage  |
| ------------- |---------------| -----|
| resetRates     | mapIndex?: int | Sets playback rate to 1 globally and for each individual tile, pass mapIndex to limit the method to that map |
| setRate       | rate: int, gid?: int, map?: Phaser.Tilemap      |  Sets playback multiplier to 'rate'. A rate of 2 will play the animation twice as fast as configured in Tiled, and 0.5 half as fast. If a gid is specified the rate is exclusively set for that tile. If the global rate is set to 0.5 and the rate of a tile is set to 2 it will play as configured in Tiled (0.5*2 = 1). Pass tilemap to limit the method to that map.|
| resume         | layerIndex?:int, mapIndex?:int     | Resume tile animations globally if no layerIndex is set (may be overridden by layers), otherwise for that layer only. Pass mapIndex to limit the method to that map. |
| pause          | layerIndex?:int, mapIndex?:int     | Resume tile animations globally if no layerIndex is set and overrides layer settingsm, otherwise for that layer only. Pass mapIndex to limit the method to that map.|
| updateAnimatedTiles | TODO | Tell the plugin when you have added new animated tiles to layers after initialization. Needed to detect new animations. |
