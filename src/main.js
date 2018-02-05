/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var AnimatedTiles = function (scene) {
    //  The Scene that owns this plugin
    this.scene = scene;

    this.systems = scene.sys;

    this.animatedTiles = {};

    this.rate = 1;
    // this.rate - Int , this.tileRate - int[]

    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};

//  Static function called by the PluginFile Loader.
AnimatedTiles.register = function (PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.

    //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
    //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
    //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
    //  it has an entry in the InjectionMap.
    PluginManager.register('AnimatedTiles', AnimatedTiles, 'animatedTiles');
};

AnimatedTiles.prototype = {

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: function () {
        var eventEmitter = this.systems.events;

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.

        eventEmitter.on('start', this.start, this);

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  A test method.
    activate: function (layer) {
        this.map = layer.tilemap;
        this.tileset = layer.tileset;
        this.animatedTiles = this.findAnimatedTiles(this.tileset.tileData);
    },

    setRate(rate, tile = null){
        if(!index){
            this.rate = rate;
        }
        // if tile == number == gid
        // if tile === object === kolla mot properties
    },

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start: function () {
    },

    //  Called every Scene step - phase 1
    preUpdate: function (time, delta) {
    },

    //  Called every Scene step - phase 2
    update: function (time, delta) {
    },

    //  Called every Scene step - phase 3
    postUpdate: function (time, delta) {
        // We know the position
        /*console.log(this.animatedTiles);
        debugger;*/


        this.animatedTiles.forEach(
            (animatedTile) => {
                //let animatedTile = this.animatedTiles[tilkey];
                animatedTile.next -= delta * this.rate;
                if (animatedTile.next < 0) {
                    let currentIndex = animatedTile.currentFrame;
                    let newIndex = currentIndex + 1;
                    if (newIndex > (animatedTile.frames.length - 1)) {
                        newIndex = 0;
                    }
                    animatedTile.next = animatedTile.frames[newIndex].duration;
                    animatedTile.currentFrame = newIndex;
                    /**
                     * 
                     * TODO: 1. Gå på AnimationIndex, 
                     * 2. ändra bara inom vyn: MEN då måste räkna ut nya tiles som inte syntes nyss. Kom ihåg förra området!
                     * 
                     */
                    this.map.replaceByIndex(animatedTile.frames[currentIndex].tileid, animatedTile.frames[newIndex].tileid);
                }
                else {
                    // TODO: Uppdatera sådana som inte synts i förra uppdateringen

                }
            }
        );
    },

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause: function () {
    },

    //  Called when a Scene is resumed from a paused state.
    resume: function () {
    },

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep: function () {
    },

    //  Called when a Scene is woken from a sleeping state.
    wake: function () {
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function () {
    },

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function () {
        this.shutdown();

        this.scene = undefined;
    },

    findAnimatedTiles: function (tileData) {
        // poor choice, should have been an array, but I'll abandon this later when I have my plugin anyway
        let animatedTiles = [];
        Object.keys(tileData).forEach(
            (key) => {
                console.log(key);
                if (tileData[key].hasOwnProperty("animation")) {
                    let tile = { 
                        key,
                        frames: [],
                        currentFrame: 0
                    };
                    tileData[key].animation.forEach((frame) => { frame.tileid++; tile.frames.push(frame) });
                    tile.next = tile.frames[0].duration;
                    animatedTiles.push(tile);
                    /**
                     * 
                     *  TODO: Add animationIndex to all
                     * 
                     */

                }
            }
        )
        return animatedTiles;
    }

};

AnimatedTiles.prototype.constructor = AnimatedTiles;

//  Make sure you export the plugin for webpack to expose

module.exports = AnimatedTiles;
