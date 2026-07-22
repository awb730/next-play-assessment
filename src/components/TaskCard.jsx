import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import styles from './NewTask.module.css'

export default function TaskCard({ task, onDel }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div className={styles.card} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{task.title}</h2>
        <button
          className={styles.deleteBtn}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDel(task.id)}
        >
          x
        </button>
      </div>

      {task.description && (
        <p className={styles.cardDescription}>{task.description}</p>
      )}

      {task.priority && (
        <span className={`${styles.priorityTag} ${styles['priority_' + task.priority]}`}>
          {task.priority}
        </span>
      )}
    </div>
  )
}