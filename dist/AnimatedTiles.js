(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("AnimatedTiles", [], factory);
	else if(typeof exports === 'object')
		exports["AnimatedTiles"] = factory();
	else
		root["AnimatedTiles"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* @author       Niklas Berg <nkholski@niklasberg.se>
* @copyright    2018 Niklas Berg
* @license      {@link https://github.com/nkholski/phaser3-animated-tiles/blob/master/LICENSE|MIT License}
*/

//
// This plugin is based on Photonstorms Phaser 3 plugin template.
// The template is ES5 compliant while the added code uses ES6 features,
// but the plan is to turn it all into a ES6 Class. 

var AnimatedTiles = function AnimatedTiles(scene) {
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
    boot: function boot() {
        var eventEmitter = this.systems.events;
        eventEmitter.on('postupdate', this.postUpdate, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    // Initilize support for animated tiles on given map
    init: function init(map) {
        this.map = map;
        // This is just stupid. Loop through and overwrite with last found tileset. Fixing it later.
        this.animatedTiles = this.getAnimatedTiles(this.map.tilesets);
        /*this.map.tilesets.forEach((tileset) => {
            this.animatedTiles = this.getAnimatedTiles(tileset.tileData);
        }
        )*/
        this.active = true; // Start the animations by default
    },

    setRate: function setRate(rate) {
        var gid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!gid) {
            this.rate = rate;
        }
        this.animatedTiles.forEach(function (animatedTile) {
            if (animatedTile.index === gid) {
                animatedTile.rate = rate;
            }
        });
        // if tile is number (gid) --> set rate for that tile
        // TODO: if passing an object -> check properties matching object and set rate
    },


    resetRates: function resetRates() {
        this.rate = 1;
        this.animatedTiles.forEach(function (animatedTile) {
            animatedTile.rate = 1;
        });
    },

    //  Start (or resume) animations
    resume: function resume() {
        var _this = this;

        var layerIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (layerIndex === null) {
            this.active = true;
        } else {
            this.activeLayer[layerIndex] = true;
            this.animatedTiles.forEach(function (animatedTile) {
                _this.updateLayer(animatedTile, animatedTile.tiles[layerIndex]);
            });
        }
    },

    // Stop (or pause) animations
    pause: function pause() {
        var layerIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (layerIndex === null) {
            this.active = false;
        } else {
            this.activeLayer[layerIndex] = false;
        }
    },
    postUpdate: function postUpdate(time, delta) {
        var _this2 = this;

        if (!this.active) {
            return;
        }
        this.animatedTiles.forEach(function (animatedTile) {
            // Reduce time for curent tile
            animatedTile.next -= delta * _this2.rate * animatedTile.rate;
            // Time for current tile is up!!!
            if (animatedTile.next < 0) {
                // Remember current frame index
                var currentIndex = animatedTile.currentFrame;
                // Remember the tileId of current tile
                var oldTileId = animatedTile.frames[currentIndex].tileid;
                // Advance to next in line
                var newIndex = currentIndex + 1;
                // If we went beyond last frame, we just start over
                if (newIndex > animatedTile.frames.length - 1) {
                    newIndex = 0;
                }
                // Set lifelength for current frame
                animatedTile.next = animatedTile.frames[newIndex].duration;
                // Set index of current frame
                animatedTile.currentFrame = newIndex;
                // Store the tileId (gid) we will shift to
                // Loop through all tiles (via layers)
                //this.updateLayer
                animatedTile.tiles.forEach(function (layer, layerIndex) {
                    if (!_this2.activeLayer[layerIndex]) {
                        return;
                    }
                    _this2.updateLayer(animatedTile, layer, oldTileId);
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
        });
    },

    updateLayer: function updateLayer(animatedTile, layer) {
        var oldTileId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

        var tilesToRemove = [];
        var tileId = animatedTile.frames[animatedTile.currentFrame].tileid;
        layer.forEach(function (tile) {
            // If the tile is removed or has another index than expected, it's
            // no longer animated. Mark for removal.
            if (oldTileId > -1 && (tile === null || tile.index !== oldTileId)) {
                tilesToRemove.push(tile);
            } else {
                // Finally we set the index of the tile to the one specified by current frame!!!
                tile.index = tileId;
            }
        });
        // Remove obselete tiles
        tilesToRemove.forEach(function (tile) {
            var pos = layer.indexOf(tile);
            debugger;
            if (pos > -1) {
                layer.splice(pos, 1);
            } else {
                console.error("This shouldn't happen. Not at all. Blame Phaser Animated Tiles plugin. You'll be fine though.");
            }
        });
    },


    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function shutdown() {},

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function destroy() {
        this.shutdown();
        this.scene = undefined;
    },

    getAnimatedTiles: function getAnimatedTiles(tilesets) {
        var _this3 = this;

        // this.animatedTiles is an array of objects with information on how to animate and which tiles.
        var animatedTiles = [];
        // loop through all tilesets
        tilesets.forEach(
        // Go through the data stored on each tile (not tile on the tilemap but tile in the tileset)
        function (tileset) {
            var tileData = tileset.tileData;
            Object.keys(tileData).forEach(function (index) {
                index = parseInt(index);
                // If tile has animation info we'll dive into it
                if (tileData[index].hasOwnProperty("animation")) {
                    var animatedTileData = {
                        index: index, // gid of the original tile
                        frames: [], // array of frames
                        currentFrame: 0, // start on first frame
                        tiles: [], // array with one array per layer with list of tiles that depends on this animation data
                        rate: 1 // multiplier, set to 2 for double speed or 0.25 quarter speed
                    };
                    // push all frames to the animatedTileData
                    tileData[index].animation.forEach(function (frame) {
                        frame.tileid += tileset.firstgid;animatedTileData.frames.push(frame);
                    });
                    // time until jumping to next frame
                    animatedTileData.next = animatedTileData.frames[0].duration;
                    // Go through all layers for tiles
                    _this3.map.layers.forEach(function (layer) {
                        // tiles array for current layer
                        var tiles = [];
                        // loop through all rows with tiles...
                        layer.data.forEach(function (tileRow) {
                            // ...and loop through all tiles in that row
                            tileRow.forEach(function (tile) {
                                // Tiled start index for tiles with 1 but animation with 0. Thus that wierd "-1"
                                if (tile.index - tileset.firstgid === index) {
                                    tiles.push(tile);
                                }
                            });
                        });
                        // add the layer's array with tiles to the tiles array.
                        // this will make it possible to control layers individually in the future
                        animatedTileData.tiles.push(tiles);
                    });
                    // animatedTileData is finished for current animation, push it to the animatedTiles-property of the plugin
                    animatedTiles.push(animatedTileData);
                }
            });
        });
        this.map.layers.forEach(function (layer, layerIndex) {
            // layer indices array of booleans whether to animate tiles on layer or not  
            _this3.activeLayer[layerIndex] = true;
        });

        return animatedTiles;
    }

};

AnimatedTiles.prototype.constructor = AnimatedTiles;

module.exports = AnimatedTiles;

/***/ })
/******/ ]);
});