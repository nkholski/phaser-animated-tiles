/* I have had four ideas on how to animate tiles. Currently I use a method that probably fit most developers.
For very large tilemaps with high number of animated tiles, an approach inspired by whats was going on here
might be better. We'll se. I just stuff it away here until possibly forever.*/











//  First postUpdate went through all tiles in the tilemap and updated them. Might not be a bad idea if you have high
//  number of animated tiles anyway, so it could return as an alternative to trade with memory usage.
postUpdateOLD: function (time, delta) {
    if (!this.active) {
        return;
    }
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

// Never finished. Was planned to update only culledTiles, however then I need to check all culled tiles for every update loop.
getAnimatedTilesUNFINISHED: function (tileData) {
    // Buildning the array with tiles that should be animated
    let animatedTiles = [];
    Object.keys(tileData).forEach(
        (index) => {
            console.log(gid);
            index = parseInt(index);
            if (tileData[index].hasOwnProperty("animation")) {
                let tile = {
                    index,
                    frames: [],
                    currentFrame: 0
                };
                tileData[index].animation.forEach((frame) => { frame.tileid++; tile.frames.push(frame) });
                tile.next = tile.frames[0].duration;
                animatedTiles.push(tile);
                this.tileRate[index] = 1;
            }
        }
    );
    // Add animIndex to all tiles which is the original index set by Tiled
    // animIndex is constant while the rendered index is in flux 
    animatedTiles.forEach(
        (animatedTile) => {
            this.map.layers[0].data.forEach(
                (tileCol) => {
                    tileCol.forEach(
                        (tile) => {
                            if (tile.index === animatedTile.index) {
                                tile.animIndex = animatedTile.index;
                            }
                        }
                    );
                }
            )
        }
    );
    return animatedTiles;
},

// First version. Works well but I prefer the new way to store all tiles to aniamte in arrays.
getAnimatedTilesOLD: function (tileData) {
    // Buildning the array with tiles that should be animated
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
                this.tileRate[key] = 1;
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



// Started and abondoned. I figured to check which tiles is within current view, update all tiles when animation updates and
// only new tiles when visible. Figured that culledtiles will be as performant as well and already supports multiple cameras.
/***
let width = 20;        debugger;

let height = 15;
let rect1 = {
  x: 5,
  y: 2,
};
let rect2 = {
  x: 0,
  y: 0,
};
if(rect2.x>rect1.x){
  // Update tiles in rectangle to the right
  for(let x=rect1.x+width; x<rect2.x+width; x++){
    for(let y=rect2.y; y<rect2.y+height; y++){
      console.log(x,y);
    }
  }
}
else if(rect2.x<rect1.x){
  // Update tiles in rectangle to the left
  for(let x=rect2.x; x<rect1.x; x++){
    for(let y=rect2.y; y<rect2.y+height; y++){
      console.log(x,y);
    }
  }
}
// This updates tiles below or above previously updated screen,
// except whats already been taken care off by left/right check
/*if(rect2.y>rect1.y){
  // Update tiles in rectangle below
  for(let x=rect2.x; x<rect1.x+width; x++){
    for(let y=rect1.y+height; y<rect2.y+height; y++){
      console.log("below",x,y);
    }
  }
}
else if(rect2.y<rect1.y){
  // Update tiles in rectangle above
  for(let x=rect2.x; x<rect1.x+width; x++){
    for(let y=rect2.y; y<rect1.y; y++){
      console.log("above",x,y);
    }
  }
}*/
