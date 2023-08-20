import Phaser from "phaser";

export default class AnimatedTiles extends Phaser.Plugins.ScenePlugin {
    init(map: Phaser.Tilemaps.Tilemap);
    pause(layerIndex: number, mapIndex: number);
    resume(layerIndex: number, mapIndex: number);
    updateAnimatedTiles();
    removeMap(map: Phaser.Tilemaps.Tilemap);

    setRate(rate: number, gid: number, map: number );
    resetRates(mapIndex: number);
  
    static register(manager: Phaser.Plugins.PluginManager);
}
  