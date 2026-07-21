import { useState, useEffect } from 'react'

export default function NewTask({ items, status, onAdd, onDel }) {
  const [isAdding, setIsAdding] = useState(false);
  const [currTitle, setCurrTitle] = useState("");

  function handleAdd(t) {
    onAdd({
      title: t,
      status: status,
    });
    setCurrTitle("");
    setIsAdding(false);
  }

  if (isAdding) {
    return (
      <div>
        <label for="title">Title:</label>
        <input id="title" type="text" placeholder="Title" value={e => setCurrTitle(e.target.value)}></input>
        <button onClick={handleAdd(currTitle)}>Add</button>
        <button onClick={() => setIsAdding(false)}>Cancel</button>
      </div>
    )
  } else {
    return (
      <div>
        {items.length !== 0 ? 
        items : 
        <button onClick={() => setIsAdding(true)}>
          New +
        </button>
        }
        

      </div>
    )
  }
  
}
