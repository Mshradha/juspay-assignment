import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import deleteImage from "../../assets/delete.png";

const DragnDrop = ({ numSprites, setAllActions }) => {
  return (
    <div
      style={{
        minWidth: "45vw",
        display: "flex",
        height: "600px",
        gap: "2vw",
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            width: "30%",
            backgroundColor: "white",
            textAlign: "center",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
          }}
        >
          <h1 style={{ textAlign: "center", fontWeight: "bold" }}>Actions</h1>
          <DraggableButton name="Move 50 steps" />
          <DraggableButton name="Turn 90 degrees" />
          <DraggableButton name="Repeat" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "2%",
            alignItems: "center",
            height: "600px",
            width: "75%",
            backgroundColor: "white",
            overflow: "scroll",
            boxShadow:
              "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
          }}
        >
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
        backgroundColor: "#e6ffe6",
        border: "1px solid #2db92d",
        cursor: "move",
        borderRadius: "20px",
        textAlign: "center",
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
        position: "relative",
        borderRadius: "15px",
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 3px 0px",
        backgroundColor: "white",
      }}
    >
      <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
        Sprite {spriteId}
      </h3>
      {droppedItems.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "10px",
            backgroundColor: "#e6ffe6",
            border: "1px solid #2db92d",
            marginTop: "10px",
            color: "black",
            display: "flex",
            borderRadius: "15px",
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
            backgroundColor: "#2db92d",
          }}
        />
      )}
    </div>
  );
};
