import React, { useState } from "react";
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import './App.css';

const PvRender = (monitorProps) => { return <div>{monitorProps.item.text}</div> }; 
// const CustomLi= (id) => { return <li key={id}></li> };  
function App() {
  const [paragraph, setParagraph] = useState('');
  let [cards, setCards] = useState([]); 
  let cardId = 5;

  const handleParagraphChange = (event) => {
    setParagraph(event.target.value);
  };

  const handleCardInputChange = (event) => {

    const cardText = event.target.value.trim();
    if (cardText !== "") {
      cardId++;
      console.log(cardId);    
      const newCard = 
      { id: cardId,
        parent: 0,
        droppable: true,
        text: cardText 
       };
       
      cards = [...cards, newCard];
      setCards(cards);
      event.target.value = "";
    }
  };

  // const handleDrop = (sourceIndex, destIndex, droppedItem) => {
  //   const updatedCards = [...cards];
  //   updatedCards.splice(sourceIndex, 1);
  //   updatedCards.splice(destIndex, 0, droppedItem);
  //   setCards(updatedCards);
  // };
  

  const handleDrop = (newTreeData) => setCards(newTreeData);

  return (
    
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCardInputChange(event);
              }
            }}
          />
          <Tree
            tree={cards}
            rootId={0}
            onDrop={handleDrop}
            render={(node, { depth, isOpen, onToggle }) => (
               <div key={node.id} style={{ marginLeft: depth * 10 }}>
                {node.droppable && (
                  <span key={node.id} onClick={onToggle}>{isOpen ? "-" : "+"}</span>
                )}

                {node.text}
              </div>
             )}
            dragPreviewRender={PvRender}

          />
          <div className="drop-area">
            <p>اسحب وأسقط الملفات هنا</p>
            <input type="file" multiple />
          </div>
          <button className="upload-btn" type="submit">
            رفع
          </button>
        </form>
      </div>
    </DndProvider>
  );
}

export default App;
