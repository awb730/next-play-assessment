import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import styles from './NewTask.module.css'
import { useEffect } from 'react'

export default function TaskCard({ task, onDel, teamMembers }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const assignees = (task.assigneeIds ?? [])
    .map(id => teamMembers.find(m => m.id === id))
    .filter(Boolean)
  

  return (
    <div className={styles.card} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{task.title}</h2>
        <button className={styles.deleteBtn} onPointerDown={(e) => e.stopPropagation()} onClick={() => onDel(task.id)}>x</button>
      </div>

      {task.description && <p className={styles.cardDescription}>{task.description}</p>}

      <div className={styles.cardFooter}>
        {task.priority && (
          <span className={`${styles.priorityTag} ${styles['priority_' + task.priority]}`}>
            {task.priority}
          </span>
        )}
        {assignees.length > 0 && (
          <div className={styles.avatarStack}>
            {assignees.map(member => (
              <span
                key={member.id}
                className={styles.cardAvatar}
                style={{ background: member.color }}
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}