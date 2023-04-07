import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Tree,
  MultiBackend,
  getDescendants,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { AddDialog } from "./AddDialog";
import './App.css';
import styles from "./App.module.css";



const getLastId = (treeData) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }

    return 0;
  });

  if (reversedArray.length > 0) {
    return reversedArray[0].id;
  }

  return 0;
};


function App() {
  const [paragraph, setParagraph] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleDrop = (newTreeData) => setTreeData(newTreeData);
  

  const handleParagraphChange = (event) => {
    setParagraph(event.target.value);
  };

  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id)
    ];
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id));

    setTreeData(newTree);
  };

  const handleCopy = (id) => {
    const lastId = getLastId(treeData);
    const targetNode = treeData.find((n) => n.id === id);
    const descendants = getDescendants(treeData, id);
    const partialTree = descendants.map((node) => ({
      ...node,
      id: node.id + lastId,
      parent: node.parent + lastId
    }));

    setTreeData([
      ...treeData,
      {
        ...targetNode,
        id: targetNode.id + lastId
      },
      ...partialTree
    ]);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmit = (newNode) => {
    const lastId = getLastId(treeData) + 1;

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId
      }
    ]);

    setOpen(false);
  };

  function handelformsubmit(e) {
    e.preventDefault();
    console.log(treeData);
  }

  


  return (
    
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <div className="App">

        <h1>تعديل الهيكل</h1>
        <form onSubmit={handelformsubmit}>
          <label htmlFor="paragraph-field">فقرة:</label>
          <textarea
            id="paragraph-field"
            value={paragraph}
            onChange={handleParagraphChange}
          />
          <div className={styles.app}>
          <div>
            <Button onClick={handleOpenDialog} startIcon={<AddIcon />}>
              اضف عنصر جديد
            </Button>
            {open && (
              <AddDialog
                tree={treeData}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
              />
            )}
          </div>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node, options) => (
              <CustomNode
                node={node}
                {...options}
                onDelete={handleDelete}
                onCopy={handleCopy}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget
            }}
          />
        </div>
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
