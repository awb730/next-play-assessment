import { useState } from 'react'
import styles from "./NewTask.module.css"

export default function NewTask({ status, onAdd }) {
  const [isAdding, setIsAdding] = useState(false)
  const [currTitle, setCurrTitle] = useState("")
  const [currDescr, setCurrDescr] = useState("")
  const [priority, setPriority] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  async function handleAdd(t, d, p) {
    if (!t?.trim()) return

    setIsSubmitting(true)
    await onAdd({ 
      title: t.trim(), 
      description: d?.trim() || null, 
      priority: p || null, 
      status 
    })
    setIsSubmitting(false)
    setCurrTitle("")
    setCurrDescr("")
    setPriority(null)
    setIsAdding(false)
  }

  function handleCancel() {
    setIsAdding(false)
    setCurrTitle("")
    setCurrDescr("")
    setPriority(null)
  }

  if (isAdding) {
    return (
      <div className={styles.newCard}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={currTitle}
          onChange={(e) => setCurrTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          id="description"
          type="text"
          value={currDescr}
          onChange={(e) => setCurrDescr(e.target.value)}
        />

        <label htmlFor="priority">Priority: </label>
        <select name="priority" id="priority" onChange={(e) => setPriority(e.target.value)}>
          <option value={null}>None</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button className={styles.controls} onClick={() => handleAdd(currTitle, currDescr, priority)}>{isSubmitting ? "Adding..." : "Add"}</button>
        <button className={styles.controls} onClick={handleCancel}>Cancel</button>
      </div>
    )
  }

  return <button className={styles.newBtn} onClick={() => setIsAdding(true)}>New +</button>
}