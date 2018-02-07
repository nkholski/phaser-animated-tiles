var config = {
    type: Phaser.WEBGL,
    width: 160,
    height: 160,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var map, tileset, layer1, layer2;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.tilemapTiledJSON('map', './map.json');
    this.load.image('tiles', './tiles.png');
    this.load.plugin('AnimatedTiles', '../dist/AnimatedTiles.js');
}

function create ()
{
    this.sys.install('AnimatedTiles');
    map = this.make.tilemap({ key: 'map' });
    tileset = map.addTilesetImage('tiles', 'tiles');
    layer1 = map.createDynamicLayer('ground', tileset, 0, 0);
    layer2 = map.createDynamicLayer('aboveGround', tileset, 0, 0);
    this.sys.animatedTiles.init(map);
    window.startGui(this.sys.animatedTiles);
}

function update ()
{    
}
