import React, { useEffect, useState } from "react";
import CatSprite from "../Catsprint";

const Play = ({ sprites }) => {
  return (
    <>
      {sprites.map((sprite) => (
        <DraggableSprite
          key={sprite.id}
          id={sprite.id}
          initialPos={sprite.initialPos}
          angle={sprite.angle}
        />
      ))}
    </>
  );
};

const DraggableSprite = ({ initialPos, id, angle }) => {
  const [pos, setPos] = useState(initialPos);
  const [rel, setRel] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setPos(initialPos);
  }, [initialPos]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;

      let newX = e.pageX - rel.x;
      let newY = e.pageY - rel.y;

      let maxX = 1400 - 100;
      let maxY = 600 - 100;

      if (newX < 550) newX = 700;
      if (newY < 0) newY = 0;
      if (newX > maxX) newX = maxX;
      if (newY > maxY) newY = maxY;

      setPos({
        x: newX,
        y: newY,
      });
      initialPos.x = newX;
      initialPos.y = newY;
      console.log(initialPos.x, "initial");

      e.stopPropagation();
      e.preventDefault();
    };

    const onMouseUp = (e) => {
      setDragging(false);
      e.stopPropagation();
      e.preventDefault();
    };

    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, rel]);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    const pos = e.target.getBoundingClientRect();
    setDragging(true);
    setRel({
      x: e.pageX - pos.left,
      y: e.pageY - pos.top,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <CatSprite pos={pos} onMouseDown={onMouseDown} id={id} angle={angle} />
  );
};

export default Play;
