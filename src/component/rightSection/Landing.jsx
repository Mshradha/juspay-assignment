import React, { useState } from "react";
import DragnDrop from "../leftSection/DragnDrop";
import Play from "./Play";
import playImage from "../../assets/play.png";
import resetImage from "../../assets/reset.png";

const Landing = () => {
  const [sprites, setSprites] = useState([
    {
      id: 1,
      initialPos: {
        x: 0.74 * 1400,
        y: 0.4 * 600,
      },
      angle: 0,
    },
  ]);

  const [allActions, setAllActions] = useState({});

  const addSprite = () => {
    const newSprite = {
      id: sprites.length + 1,
      initialPos: {
        x: (0.7 + sprites.length / 100) * 1440,
        y: 0.5 * 600,
      },
      angle: 0,
    };
    setSprites([...sprites, newSprite]);
  };

  const handlePlay = async () => {
    console.log(allActions);

    const executeAction = (action, sprite) => {
      let newPos = { ...sprite.initialPos };
      let newAngle = sprite.angle;

      if (action === "Move 50 steps") {
        newPos.x += 50;
      } else if (action === "Turn 90 degrees") {
        newAngle += 90;
      }

      return { ...sprite, initialPos: newPos, angle: newAngle };
    };

    const swapActions = (sprite1, sprite2) => {
      const tempActions1 = allActions[sprite1.id];
      const tempActions2 = allActions[sprite2.id];

      setAllActions((prev) => ({
        ...prev,
        [sprite1.id]: tempActions2,
        [sprite2.id]: tempActions1,
      }));
    };

    for (let i = 0; i < Object.keys(allActions).length; i++) {
      for (let j = 0; j < sprites.length; j++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setSprites((prevSprites) => {
              let newSprites = prevSprites.map((sprite) => {
                if (allActions[sprite.id]?.[i]) {
                  return executeAction(allActions[sprite.id][i], sprite);
                }
                return sprite;
              });

              for (let k = 0; k < newSprites.length; k++) {
                for (let l = k + 1; l < newSprites.length; l++) {
                  if (detectCollision(newSprites[k], newSprites[l])) {
                    swapActions(newSprites[k], newSprites[l]);
                  }
                }
              }

              return newSprites;
            });
            resolve();
          }, 500);
        });
      }
    }
  };

  const detectCollision = (sprite1, sprite2) => {
    const rect1 = {
      x: sprite1.initialPos.x,
      y: sprite1.initialPos.y,
      width: 100,
      height: 100,
    };
    const rect2 = {
      x: sprite2.initialPos.x,
      y: sprite2.initialPos.y,
      width: 100,
      height: 100,
    };

    return !(
      rect1.x > rect2.x + rect2.width ||
      rect1.x + rect1.width < rect2.x ||
      rect1.y > rect2.y + rect2.height ||
      rect1.y + rect1.height < rect2.y
    );
  };

  const onResetImage = () => {
    console.log("resetImage");
  };

  return (
    <div
      style={{ display: "flex", width: "100vw", gap: "2vw", flexWrap: "wrap" }}
    >
      <DragnDrop numSprites={sprites.length} setAllActions={setAllActions} />
      <div style={{ width: "48vw", height: "600px", border: "1px solid blue" }}>
        <Play sprites={sprites} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            style={{
              marginTop: "15px",
              padding: "10px",

              marginLeft: "10px",
              borderRadius: "20px",
              backgroundColor: "lightblue",
            }}
            disabled={sprites.length === 3}
            onClick={addSprite}
          >
            Add new Sprite
          </button>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              style={{
                marginTop: "15px",
                padding: "10px",
                marginRight: "10px",
              }}
              onClick={handlePlay}
            >
              <img src={playImage} width={30} height={35} />
            </button>
            <button
              style={{
                marginTop: "15px",
                padding: "10px",
                marginRight: "10px",
              }}
              onClick={onResetImage}
            >
              <img src={resetImage} width={30} height={35} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
