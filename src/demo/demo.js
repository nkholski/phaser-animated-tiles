import datGuiSetup from './dat.gui.setup.js';

export default class Demo extends Phaser.Scene {

    preload() {
        this.load.tilemapTiledJSON('map', './assets/map.json');
        this.load.tilemapTiledJSON('map2', './assets/map2.json');
        this.load.image('tiles', './assets/tiles.png');
        this.load.image('super-mario-16bit', './assets/super-mario-16bit.png');
        this.load.scenePlugin('AnimatedTiles', 'AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        let map = this.make.tilemap({
            key: 'map'
        });
        // Add two tilesets
        let tileset = map.addTilesetImage('tiles', 'tiles');
        let tileset2 = map.addTilesetImage('super-mario-16bit', 'super-mario-16bit');
        // Add first maps three layers with corresponing tilesets (the third having a tileset of it's own)
        let layer1 = map.createDynamicLayer('ground', tileset, 0, 0);
        let layer2 = map.createDynamicLayer('aboveGround', tileset, 0, 0);
        let layer3 = map.createDynamicLayer('another', tileset2, 0, 0);
        // Init animations on map
        this.animatedTiles.init(map);

        // Add a second map, it's layer and init naimations
        let map2 = this.make.tilemap({
            key: 'map2'
        });
        let map2layer = map2.createDynamicLayer('ground', tileset, 160, 0);
        this.animatedTiles.init(map2);

        // start dat.gui
        new datGuiSetup(this.animatedTiles);
        // countdown 5 sek until change
        this.countdown = 5000;
    }

    update(time, delta) {
        // countdown is done, but the change hasn't been done
        if (this.countdown < 0 && !this.changed) {
            // Native API-method to fill area with tiles
            layer3.fill(1525, 1, 1, 3, 3);
            // Need to tell the plugin about the new tiles.
            // ATM it will go through all tilemaps and layers,
            // but I'll add support for limiting the task to
            // maps, layers and areas within that. 
            this.animatedTiles.updateAnimatedTiles();
            // Ok. don't hammer tiles on each update-loop. the change is done.
            this.changed = true;
        }

    }
}