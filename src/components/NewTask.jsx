import { useState } from 'react'
import styles from "./NewTask.module.css"

export default function NewTask({ status, onAdd, teamMembers }) {
  const [isAdding, setIsAdding] = useState(false)
  const [currTitle, setCurrTitle] = useState("")
  const [currDescr, setCurrDescr] = useState("")
  const [priority, setPriority] = useState(null)
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  function toggleAssignee(id) {
    setSelectedAssignees(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  async function handleAdd(t, d, p) {
    if (!t?.trim()) return

    setIsSubmitting(true)
    await onAdd({ 
      title: t.trim(), 
      description: d?.trim() || null, 
      priority: p || null, 
      status 
    },
    selectedAssignees
  )
    setIsSubmitting(false)
    setCurrTitle("")
    setCurrDescr("")
    setPriority(null)
    setSelectedAssignees([])
    setIsAdding(false)
  }

  function handleCancel() {
    setIsAdding(false)
    setCurrTitle("")
    setCurrDescr("")
    setPriority(null)
    setSelectedAssignees([])
  }

  if (isAdding) {
    return (
      <div className={styles.newCard}>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={currTitle} onChange={(e) => setCurrTitle(e.target.value)} />

        <label htmlFor="description">Description:</label>
        <input id="description" type="text" value={currDescr} onChange={(e) => setCurrDescr(e.target.value)} />

        <label htmlFor="priority">Priority:</label>
        <select id="priority" onChange={(e) => setPriority(e.target.value)}>
          <option value="">None</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <label>Assignees:</label>
        <div className={styles.assigneeList}>
          {teamMembers.map(member => (
            <button
              type="button"
              key={member.id}
              className={`${styles.assigneeChip} ${selectedAssignees.includes(member.id) ? styles.assigneeChipSelected : ''}`}
              onClick={() => toggleAssignee(member.id)}
            >
              <span className={styles.chipAvatar} style={{ background: member.color }}>
                {member.name.charAt(0).toUpperCase()}
              </span>
              {member.name}
            </button>
          ))}
        </div>

        <div className={styles.formControls}>
          <button className={styles.controls} onClick={() => handleAdd(currTitle, currDescr, priority)}>
            {isSubmitting ? "Adding..." : "Add"}
          </button>
          <button className={styles.controls} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return <button className={styles.newBtn} onClick={() => setIsAdding(true)}>New +</button>
}