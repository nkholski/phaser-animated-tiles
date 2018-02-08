/**
* @author       Niklas Berg <nkholski@niklasberg.se>
* @copyright    2018 Niklas Berg
* @license      {@link https://github.com/nkholski/phaser3-animated-tiles/blob/master/LICENSE|MIT License}
*/

//
// This plugin is based on Photonstorms Phaser 3 plugin template.
// The template is ES5 compliant while the added code uses ES6 features,
// but the plan is to turn it all into a ES6 Class. 

var AnimatedTiles = function (scene) {
    //  The Scene that owns this plugin
    this.scene = scene;

    this.systems = scene.sys;

    // TileMap the plugin belong to. 
    // TODO: Array or object for multiple tilemaps support
    // TODO: reference to layers too, and which is activated or not
    this.map = null;

    // Array with all tiles to animate
    // TODO: Turn on and off certain tiles.
    this.animatedTiles = [];

    // Global playback rate
    this.rate = 1;

    // Should the animations play or not?
    this.active = false;

    // Should the animations play or not per layer. If global active is false this value makes no difference
    this.activeLayer = [];

    // Obey timescale?
    this.followTimeScale = true;

    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};

//  Static function called by the PluginFile Loader.
AnimatedTiles.register = function (PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.
    PluginManager.register('AnimatedTiles', AnimatedTiles, 'animatedTiles');
};

AnimatedTiles.prototype = {

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: function () {
        var eventEmitter = this.systems.events;
        eventEmitter.on('postupdate', this.postUpdate, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    // Initilize support for animated tiles on given map
    init: function (map) {
        this.map = map;
        // This is just stupid. Loop through and overwrite with last found tileset. Fixing it later.
        this.animatedTiles = this.getAnimatedTiles(this.map.tilesets);
        /*this.map.tilesets.forEach((tileset) => {
            this.animatedTiles = this.getAnimatedTiles(tileset.tileData);
        }
        )*/
        this.active = true; // Start the animations by default
    },

    setRate(rate, gid = null) {
        if (!gid) {
            this.rate = rate;
        }
        this.animatedTiles.forEach(
            (animatedTile) => {
                if (animatedTile.index === gid) {
                    animatedTile.rate = rate;
                }
            }
        );
        // if tile is number (gid) --> set rate for that tile
        // TODO: if passing an object -> check properties matching object and set rate
    },

    resetRates: function () {
        this.rate = 1;
        this.animatedTiles.forEach(
            (animatedTile) => {
                animatedTile.rate = 1;
            }
        );
    },

    //  Start (or resume) animations
    resume: function (layerIndex = null) {
        if (layerIndex === null) {
            this.active = true;
        }
        else {
            this.activeLayer[layerIndex] = true;
            this.animatedTiles.forEach(
                (animatedTile) => {
                    this.updateLayer(animatedTile, animatedTile.tiles[layerIndex]);
                }
            )
        }
    },

    // Stop (or pause) animations
    pause: function (layerIndex = null) {
        if (layerIndex === null) {
            this.active = false;
        }
        else {
            this.activeLayer[layerIndex] = false;
        }

    },
    postUpdate: function (time, delta) {
        if (!this.active) {
            return;
        }
        // Elapsed time is the delta multiplied by the global rate and the scene timeScale if folowTimeScale is true
        let elapsedTime = delta * this.rate * (this.followTimeScale ? this.scene.time.timeScale : 1);
        this.animatedTiles.forEach(
            (animatedTile) => {
                // Reduce time for current tile, multiply elapsedTime with this tile's private rate
                animatedTile.next -= elapsedTime * animatedTile.rate;
                // Time for current tile is up!!!
                if (animatedTile.next < 0) {
                    // Remember current frame index
                    let currentIndex = animatedTile.currentFrame;
                    // Remember the tileId of current tile
                    let oldTileId = animatedTile.frames[currentIndex].tileid;
                    // Advance to next in line
                    let newIndex = currentIndex + 1;
                    // If we went beyond last frame, we just start over
                    if (newIndex > (animatedTile.frames.length - 1)) {
                        newIndex = 0;
                    }
                    // Set lifelength for current frame
                    animatedTile.next = animatedTile.frames[newIndex].duration;
                    // Set index of current frame
                    animatedTile.currentFrame = newIndex;
                    // Store the tileId (gid) we will shift to
                    // Loop through all tiles (via layers)
                    //this.updateLayer
                    animatedTile.tiles.forEach((layer, layerIndex) => {
                        if (!this.activeLayer[layerIndex]) {
                            return;
                        }
                        this.updateLayer(animatedTile, layer, oldTileId);
                        /*if (!this.activeLayer[layerIndex]) {
                            console.log("NOT ACTIVE", layerIndex);
                            return;
                        }
                        let tilesToRemove = [];
                        layer.forEach(
                            (tile) => {
                                // If the tile is removed or has another index than expected, it's
                                // no longer animated. Mark for removal.
                                if (!this._ignoreInconsistantTiles[layerIndex] && (tile === null || tile.index !== oldTileId)) {
                                    tilesToRemove.push(tile);
                                }
                                else {
                                    // Finally we set the index of the tile to the one specified by current frame!!!
                                    tile.index = tileId;
                                }
                            }
                        );
                        // Remove obselete tiles
                        tilesToRemove.forEach(
                            (tile) => {
                                debugger;
                                let pos = layer.indexOf(tile);
                                if (pos > -1) {
                                    layer.splice(pos, 1);
                                }
                                else {
                                    console.error("This shouldn't happen. Not at all. Blame Phaser Animated Tiles plugin. You'll be fine though.");
                                }

                            }
                        );*/

                    });
                }
            }
        );
    },

    updateLayer(animatedTile, layer, oldTileId = -1) {
        let tilesToRemove = [];
        let tileId = animatedTile.frames[animatedTile.currentFrame].tileid;
        layer.forEach(
            (tile) => {
                // If the tile is removed or has another index than expected, it's
                // no longer animated. Mark for removal.
                if (oldTileId > -1 && (tile === null || tile.index !== oldTileId)) {
                    tilesToRemove.push(tile);
                }
                else {
                    // Finally we set the index of the tile to the one specified by current frame!!!
                    tile.index = tileId;
                }
            }
        );
        // Remove obselete tiles
        tilesToRemove.forEach(
            (tile) => {
                let pos = layer.indexOf(tile);
                debugger;
                if (pos > -1) {
                    layer.splice(pos, 1);
                }
                else {
                    console.error("This shouldn't happen. Not at all. Blame Phaser Animated Tiles plugin. You'll be fine though.");
                }

            }
        );
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function () {
    },


    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function () {
        this.shutdown();
        this.scene = undefined;
    },

    getAnimatedTiles: function (tilesets) {
        // this.animatedTiles is an array of objects with information on how to animate and which tiles.
        let animatedTiles = [];
        // loop through all tilesets
        tilesets.forEach(
            // Go through the data stored on each tile (not tile on the tilemap but tile in the tileset)
            (tileset) => {
                let tileData = tileset.tileData;
                Object.keys(tileData).forEach(
                    (index) => {
                        index = parseInt(index);
                        // If tile has animation info we'll dive into it
                        if (tileData[index].hasOwnProperty("animation")) {
                            let animatedTileData = {
                                index, // gid of the original tile
                                frames: [], // array of frames
                                currentFrame: 0, // start on first frame
                                tiles: [], // array with one array per layer with list of tiles that depends on this animation data
                                rate: 1, // multiplier, set to 2 for double speed or 0.25 quarter speed
                            };
                            // push all frames to the animatedTileData
                            tileData[index].animation.forEach((frame) => { frame.tileid+=tileset.firstgid; animatedTileData.frames.push(frame) });
                            // time until jumping to next frame
                            animatedTileData.next = animatedTileData.frames[0].duration;
                            // Go through all layers for tiles
                            this.map.layers.forEach(
                                (layer) => {
                                    // tiles array for current layer
                                    let tiles = [];
                                    // loop through all rows with tiles...
                                    layer.data.forEach(
                                        (tileRow) => {
                                            // ...and loop through all tiles in that row
                                            tileRow.forEach(
                                                (tile) => {
                                                    // Tiled start index for tiles with 1 but animation with 0. Thus that wierd "-1"
                                                    if ((tile.index - tileset.firstgid) === index) {
                                                        tiles.push(tile);
                                                    }
                                                }
                                            );
                                        }
                                    );
                                    // add the layer's array with tiles to the tiles array.
                                    // this will make it possible to control layers individually in the future
                                    animatedTileData.tiles.push(tiles);
                                }
                            );
                            // animatedTileData is finished for current animation, push it to the animatedTiles-property of the plugin
                            animatedTiles.push(animatedTileData);
                        }
                    }
                );
            }
        );
        this.map.layers.forEach(
            (layer, layerIndex) => {
                // layer indices array of booleans whether to animate tiles on layer or not  
                this.activeLayer[layerIndex] = true;
            }
        );

        return animatedTiles;
    }

};

AnimatedTiles.prototype.constructor = AnimatedTiles;

module.exports = AnimatedTiles;