/**
 * @author       Niklas Berg <nkholski@niklasberg.se>
 * @copyright    2018 Niklas Berg
 * @license      {@link https://github.com/nkholski/phaser3-animated-tiles/blob/master/LICENSE|MIT License}
 */

//
// This plugin is based on Photonstorms Phaser 3 plugin template with added support for ES6.
// 

class AnimatedTiles extends Phaser.Plugins.ScenePlugin {
    /*

    TODO: 
    1. Fix property names which is a mess after adding support for multiple maps, tilesets and layers.
    2. Helper functions: Get mapIndex by passing a map (and maybe support it as argument to methods), Get layerIndex, get tile index from properties.
    
    */
    constructor(scene, pluginManager) {
        super(scene, pluginManager);

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
    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot() {
        var eventEmitter = this.systems.events;
        eventEmitter.on('postupdate', this.postUpdate, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    }

    // Initilize support for animated tiles on given map
    init(map) {
        // TODO: Check if map is initilized already, if so do it again but overwrite the old.
        let mapAnimData = this.getAnimatedTiles(map);
        let animatedTiles = {
            map,
            animatedTiles: mapAnimData,
            active: true,
            rate: 1,
            activeLayer: []
        }
        map.layers.forEach(() => animatedTiles.activeLayer.push(true));
        this.animatedTiles.push(animatedTiles);
        if (this.animatedTiles.length === 1) {
            this.active = true; // Start the animations by default
        }
        /* Needed?
        this.animatedTiles[this.animatedTiles.length-1].animatedTiles.forEach(
            (animatedTile) => {
                animatedTile.tiles.forEach((layer) => {
                    this.updateLayer(animatedTile,  layer);
                });
            }
        )*/
    }

    setRate(rate, gid = null, map = null) {
        if (gid === null) {
            if (map === null) {
                this.rate = rate;
            } else {
                this.animatedTiles[map].rate = rate;
            }
        } else {
            let loopThrough = (animatedTiles) => {
                animatedTiles.forEach(
                    (animatedTile) => {
                        if (animatedTile.index === gid) {
                            animatedTile.rate = rate;
                        }
                    }
                );
            }
            if (map === null) {
                this.animatedTiles.forEach(
                    (animatedTiles) => {
                        loopThrough(animatedTiles.animatedTiles);
                    }
                )
            } else {
                loopThrough(this.animatedTiles[map].animatedTiles);
            }
        }
        // if tile is number (gid) --> set rate for that tile
        // TODO: if passing an object -> check properties matching object and set rate
    }

    resetRates(mapIndex = null) {
        if (mapIndex === null) {
            this.rate = 1;
            this.animatedTiles.forEach(
                (mapAnimData) => {
                    mapAnimData.rate = 1;
                    mapAnimData.animatedTiles.forEach(
                        (tileAnimData) => {
                            tileAnimData.rate = 1;
                        }
                    )
                }
            );
        } else {
            this.animatedTiles[mapIndex].rate = 1;
            this.animatedTiles[mapIndex].animatedTiles.forEach(
                (tileAnimData) => {
                    tileAnimData.rate = 1;
                }
            );
        }
    }

    //  Start (or resume) animations
    resume(layerIndex = null, mapIndex = null) {
        let scope = (mapIndex === null) ? this : this.animatedTiles[mapIndex];
        if (layerIndex === null) {
            scope.active = true;
        } else {
            scope.activeLayer[layerIndex] = true;
            scope.animatedTiles.forEach(
                (animatedTile) => {
                    this.updateLayer(animatedTile, animatedTile.tiles[layerIndex]);
                }
            )
        }
    }

    // Stop (or pause) animations
    pause(layerIndex = null, mapIndex = null) {
        let scope = (mapIndex === null) ? this : this.animatedTiles[mapIndex];
        if (layerIndex === null) {
            scope.active = false;
        } else {
            scope.activeLayer[layerIndex] = false;
        }
    }

    postUpdate(time, delta) {
        if (!this.active) {
            return;
        }
        // Elapsed time is the delta multiplied by the global rate and the scene timeScale if folowTimeScale is true
        let globalElapsedTime = delta * this.rate * (this.followTimeScale ? this.scene.time.timeScale : 1);
        this.animatedTiles.forEach(
            (mapAnimData) => {
                if (!mapAnimData.active) {
                    return;
                }
                // Multiply with rate for this map
                let elapsedTime = globalElapsedTime * mapAnimData.rate;
                mapAnimData.animatedTiles.forEach(
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
                                if (!mapAnimData.activeLayer[layerIndex]) {
                                    return;
                                }
                                this.updateLayer(animatedTile, layer, oldTileId);

                            });
                        }
                    }
                ); // animData loop
            }
        ); // Map loop
    }

    updateLayer(animatedTile, layer, oldTileId = -1) {
        let tilesToRemove = [];
        let tileId = animatedTile.frames[animatedTile.currentFrame].tileid;
        layer.forEach(
            (tile) => {
                // If the tile is removed or has another index than expected, it's
                // no longer animated. Mark for removal.
                if (oldTileId > -1 && (tile === null || tile.index !== oldTileId)) {
                    tilesToRemove.push(tile);
                } else {
                    // Finally we set the index of the tile to the one specified by current frame!!!
                    tile.index = tileId;
                }
            }
        );
        // Remove obselete tiles
        tilesToRemove.forEach(
            (tile) => {
                let pos = layer.indexOf(tile);
                if (pos > -1) {
                    layer.splice(pos, 1);
                } else {
                    console.error("This shouldn't happen. Not at all. Blame Phaser Animated Tiles plugin. You'll be fine though.");
                }

            }
        );
    }

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown() {}


    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.shutdown();
        this.scene = undefined;
    }

    getAnimatedTiles(map) {

        // this.animatedTiles is an array of objects with information on how to animate and which tiles.
        let animatedTiles = [];
        // loop through all tilesets
        map.tilesets.forEach(
            // Go through the data stored on each tile (not tile on the tilemap but tile in the tileset)
            (tileset) => {
                let tileData = tileset.tileData;
                Object.keys(tileData).forEach(
                    (index) => {
                        index = parseInt(index);
                        // If tile has animation info we'll dive into it
                        if (tileData[index].hasOwnProperty("animation")) {
                            let animatedTileData = {
                                index: index + tileset.firstgid, // gid of the original tile
                                frames: [], // array of frames
                                currentFrame: 0, // start on first frame
                                tiles: [], // array with one array per layer with list of tiles that depends on this animation data
                                rate: 1, // multiplier, set to 2 for double speed or 0.25 quarter speed
                            };
                            // push all frames to the animatedTileData
                            tileData[index].animation.forEach(
                                (frameData) => {
                                    let frame = {
                                        duration: frameData.duration,
                                        tileid: frameData.tileid + tileset.firstgid
                                    };
                                    animatedTileData.frames.push(frame)
                                });
                            // time until jumping to next frame
                            animatedTileData.next = animatedTileData.frames[0].duration;
                            // Go through all layers for tiles
                            map.layers.forEach(
                                (layer) => {
                                    if (layer.tilemapLayer.type === "StaticTilemapLayer") {
                                        // We just push an empty array if the layer is static (impossible to animate). 
                                        // If we just skip the layer, the layer order will be messed up
                                        // when updating animated tiles and things will look awful.
                                        animatedTileData.tiles.push([]);
                                        return;
                                    }
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
        map.layers.forEach(
            (layer, layerIndex) => {
                // layer indices array of booleans whether to animate tiles on layer or not
                this.activeLayer[layerIndex] = true;
            }
        );

        return animatedTiles;
    }

    putTileAt(layer, tile, x, y) {
        // Replaces putTileAt of the native API, but updates the list of animatedTiles in the process.
        // No need to call updateAnimatedTiles as required for other modificatons of the tile-map
    }

    updateAnimatedTiles() {
        // future args: x=null, y=null, w=null, h=null, container=null 
        let x = null,
            y = null,
            w = null,
            h = null,
            container = null;
        // 1. If no container, loop through all initilized maps
        if (container === null) {
            container = [];
            this.animatedTiles.forEach(
                (mapAnimData) => {
                    container.push(mapAnimData);
                }
            )
        }
        // 2. If container is a map, loop through it's layers
        // container = [container];

        // 1 & 2: Update the map(s)
        container.forEach(
            (mapAnimData) => {
                let chkX = x !== null ? x : 0;
                let chkY = y !== null ? y : 0;
                let chkW = w !== null ? mapAnimData.map.width : 10;
                let chkH = h !== null ? mapAnimData.map.height : 10;

                mapAnimData.animatedTiles.forEach(
                    (tileAnimData) => {
                        tileAnimData.tiles.forEach(
                            (tiles, layerIndex) => {
                                let layer = mapAnimData.map.layers[layerIndex];
                                if (layer.type === "StaticTilemapLayer") {
                                    return;
                                }
                                for (let x = chkX; x < (chkX + chkW); x++) {
                                    for (let y = chkY; y < (chkY + chkH); y++) {
                                        let tile = mapAnimData.map.layers[layerIndex].data[x][y];
                                        // should this tile be animated?
                                        if (tile.index == tileAnimData.index) {
                                            // is it already known? if not, add it to the list
                                            if (tiles.indexOf(tile) === -1) {
                                                tiles.push(tile);
                                            }
                                            // update index to match current fram of this animation
                                            tile.index = tileAnimData.frames[tileAnimData.currentFrame].tileid;
                                        }
                                    }
                                }
                            }
                        )
                    }
                )
            }
        );
        // 3. If container is a layer, just loop through it's tiles
    }
};

//  Static function called by the PluginFile Loader.
AnimatedTiles.register = function (PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.
    PluginManager.register('AnimatedTiles', AnimatedTiles, 'animatedTiles');
}

module.exports = AnimatedTiles;