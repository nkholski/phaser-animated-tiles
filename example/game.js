var config = {
    type: Phaser.WEBGL,
    width: 320,
    height: 160,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var map, map2, tileset, layer1, layer2, layer3, map2layer, countdown, changed;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.tilemapTiledJSON('map', './map.json');
    this.load.tilemapTiledJSON('map2', './map2.json');
    this.load.image('tiles', './tiles.png');
    this.load.image('super-mario-16bit', './super-mario-16bit.png');
    this.load.plugin('AnimatedTiles', '../dist/AnimatedTiles.js');
}

function create ()
{
    // Install plugin
    this.sys.install('AnimatedTiles');
    // Add first map
    map = this.make.tilemap({ key: 'map' });
    // Add two tilesets
    tileset = map.addTilesetImage('tiles', 'tiles');
    tileset2 = map.addTilesetImage('super-mario-16bit', 'super-mario-16bit');
    // Add first maps three layers with corresponing tilesets (the third having a tileset of it's own)
    layer1 = map.createDynamicLayer('ground', tileset, 0, 0);
    layer2 = map.createDynamicLayer('aboveGround', tileset, 0, 0);
    layer3 = map.createDynamicLayer('another', tileset2, 0, 0);
    // Init animations on map
    this.sys.animatedTiles.init(map);

    // Add a second map, it's layer and init naimations
    map2 = this.make.tilemap({ key: 'map2' });
    map2layer = map2.createDynamicLayer('ground', tileset, 160, 0);
    this.sys.animatedTiles.init(map2);

    // start dat.gui
    window.startGui(this.sys.animatedTiles);

    // countdown 5 sek until change
    countdown = 5000;
}

function update (time, delta)
{       
    countdown-=delta;
    // countdown is done, but the change hasn't been done
    if(countdown <0 && !changed){
        // Native API-method to fill area with tiles
        layer3.fill(1525, 1, 1, 3, 3);
        // Need to tell the plugin about the new tiles.
        // ATM it will go through all tilemaps and layers,
        // but I'll add support for limiting the task to
        // maps, layers and areas within that. 
        this.sys.animatedTiles.updateAnimatedTiles();
        // Ok. don't hammer tiles on each update-loop. the change is done.
        changed = true;
    }

}
