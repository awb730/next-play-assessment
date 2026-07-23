import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import NewTask from './NewTask'
import styles from './Column.module.css'

export default function Column({ id, title, status, tasks, onAdd, onDel, teamMembers }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const columnTasks = tasks.filter(t => t.status === status)

  return (
    <section
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.over : ''}`}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <div className={styles.list}>
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} onDel={onDel} teamMembers={teamMembers} />
        ))}
      </div>

      <NewTask status={status} onAdd={onAdd} teamMembers={teamMembers} />
    </section>
  )
}