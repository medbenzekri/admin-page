import React, { useState } from "react";
import {Tree} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import './App.css';
function App() {
  const [paragraph, setParagraph] = useState('');
  const [cards, setCards] = useState([]);

  const handleParagraphChange = (event) => {
    setParagraph(event.target.value);
  };

  const handleCardInputChange = (event) => {
    const cardText = event.target.value;
    if (cardText.trim() !== "") {
      setCards([...cards, cardText]);
      event.target.value = "";
    }
  };

  const handleDrop = (sourceIndex, destIndex, droppedItem) => {
    const updatedCards = [...cards];
    updatedCards.splice(sourceIndex, 1);
    updatedCards.splice(destIndex, 0, droppedItem);
    setCards(updatedCards);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>تحميل الملفات</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="paragraph-field">فقرة:</label>
          <textarea
            id="paragraph-field"
            value={paragraph}
            onChange={handleParagraphChange}
          />
          <label htmlFor="card-input">إضافة بطاقة:</label>
          <input
            type="text"
            id="card-input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleCardInputChange(event);
              }
            }}
          />
          <Tree
            data={cards}
            renderItem={(item, index) => (
              <div key={index} className="card">
                {item}
              </div>
            )}
            onDrop={handleDrop}
          />
          <div className="drop-area">
            <p>اسحب وأسقط الملفات هنا</p>
            <input type="file" multiple />
          </div>
          <button className="upload-btn" type="submit">
            تحميل
          </button>
        </form>
      </div>
    </DndProvider>
  );
}

export default App;
