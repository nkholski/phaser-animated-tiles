export default class AnimatedTiles extends Phaser.Plugins.ScenePlugin {
    init(map: Phaser.Tilemaps.Tilemap);
    pause(layerIndex: number = null, mapIndex: number = null);
    resume(layerIndex: number = null, mapIndex: number = null);
    updateAnimatedTiles();
    removeMap(map: Phaser.Tilemaps.Tilemap);

    setRate(rate: number, gid: number = null, map: number = null);
    resetRates(mapIndex: number = null);
  
    static register(manager: Phaser.Plugins.PluginManager);
  }
  