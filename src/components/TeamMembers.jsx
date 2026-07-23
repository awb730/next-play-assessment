import { useState } from "react";
import styles from "./TeamMembers.module.css"

const COLORS = ['#7A7874', '#A8A69F', '#D97C7C', '#8FA88F', '#8FA0C4']


export default function TeamMember({ members, onAdd }) {
    const [isAdding, setIsAdding] = useState(false)
    const [name, setName] = useState("")
    const [color, setColor] = useState(COLORS[0])
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleAdd() {
        if (!name?.trim()) return
        setIsSubmitting(true)
        await onAdd({ name: name.trim(), color })
        setIsSubmitting(false)
        setName("")
        setColor(COLORS[0])
        setIsAdding(false)
    }

    function handleCancel() {
        setIsAdding(false)
        setName("")
        setColor(COLORS[0])
    }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h1 className={styles.title}>Team</h1>
        <span className={styles.count}>Members: {String(members.length).padStart(2, '0')}</span>
      </header>

      <div className={styles.list}>
        {members.map(member => (
          <div key={member.id} className={styles.member}>
            <span
              className={styles.avatar}
              style={{ background: member.color }}
            >
              {member.name.charAt(0).toUpperCase()}
            </span>
            <span className={styles.memberName}>{member.name}</span>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className={styles.form}>
          <label htmlFor="member-name">Name:</label>
          <input
            id="member-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Color:</label>
          <div className={styles.swatches}>
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`${styles.swatch} ${color === c ? styles.swatchSelected : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className={styles.formControls}>
            <button className={styles.controls} onClick={handleAdd}>
              {isSubmitting ? "Adding..." : "Add"}
            </button>
            <button className={styles.controls} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className={styles.newBtn} onClick={() => setIsAdding(true)}>
          Add member +
        </button>
      )}
    </section>
  )
}