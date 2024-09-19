import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import deleteImage from "../../assets/delete.png";

const DragnDrop = ({ numSprites, setAllActions }) => {
  return (
    <div style={{ width: "48vw", border: "1px solid green", display: "flex" }}>
      <DndProvider backend={HTML5Backend}>
        <div style={{ width: "40%", border: "2px solid yellow" }}>
          <h1 class="text-lg text-center">Actions</h1>
          <DraggableButton name="Move 50 steps" />
          <DraggableButton name="Turn 90 degrees" />
          <DraggableButton name="Repeat" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Array.from({ length: numSprites }).map((_, index) => (
            <DroppableArea
              key={index}
              spriteId={index + 1}
              setAllActions={setAllActions}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default DragnDrop;

const DraggableButton = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BUTTON",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "18px",
        margin: "10px",
        backgroundColor: "lightblue",
        cursor: "move",
        borderRadius: "20px",
      }}
    >
      {name}
    </button>
  );
};

const DroppableArea = ({ spriteId, setAllActions }) => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BUTTON",
    drop: (item) => {
      setDroppedItems((prevItems) => [...prevItems, item.name]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const removeItem = (index) => {
    const dropped = droppedItems.filter((_, i) => i !== index);
    setDroppedItems(dropped);
  };

  useEffect(() => {
    setAllActions((prev) => ({
      ...prev,
      [spriteId]: droppedItems,
    }));
  }, [droppedItems]);

  return (
    <div
      ref={drop}
      style={{
        width: "250px",
        padding: "10px",
        margin: "10px",
        border: "2px solid black",
        position: "relative",
      }}
    >
      <h3>Sprite {spriteId}</h3>
      {droppedItems.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "10px",
            backgroundColor: "ButtonHighlight",
            marginTop: "10px",
            color: "black",
            display: "flex",
          }}
        >
          <p>{item}</p>
          <button
            style={{
              padding: "2%",
              marginLeft: "10%",
            }}
            onClick={() => removeItem(index)}
          >
            <img height={15} width={15} src={deleteImage} alt="delete" />
          </button>
        </div>
      ))}
      {isOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )}
    </div>
  );
};
