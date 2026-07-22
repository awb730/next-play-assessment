import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient';
import { ensureSession } from './lib/auth'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import './App.css'
import styles from "./components/Column.module.css"
import NewTask from './components/NewTask'
import Column from './components/Column'


export default function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function startSession() {
      const session = await ensureSession();
    }


    async function loadItems() {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) {
        console.error('Failed to load tasks:', error);
        setTasks([]);
        return;
      } else {
        setTasks(data ?? []);
      }
      setIsLoading(false)
    }

    startSession()
    loadItems();
  }, [])

  async function addItems(newItem) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("tasks")
      .insert({ ...newItem, user_id: user.id })
      .select();
    if (error) {
      console.error('Failed to add task:', error);
      return;
    }

    if (data && !error) setTasks(prev => [...prev, ...data]);
  }

  async function removeItem(id) {
    const { error } = await supabase.from("tasks").delete().eq('id', id);
    if (error) {
      console.error('Failed to delete task:', error);
      return;
    }

    setTasks(prev => prev.filter(item => item.id !== id));
  }
  
  async function updateStatus(id, newStatus) {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? data[0] : t))
    } else {
      console.error('Failed to update status:', error)
    }
  }


  function handleDragEnd(event) {
      const { active, over } = event
      if (!over) return
      const taskId = active.id
      const newStatus = over.id 
      const task = tasks.find(t => t.id === taskId)
      if (task && task.status !== newStatus) {
        updateStatus(taskId, newStatus)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, 
    })
  )

  if (isLoading) {
    return (
      <div className="board">
        
          {["To Do", "In Progress", "In Review", "Done"].map(title => (
            <section className={styles.column}>
              <header key={title} className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
              </header>
              <div className={styles.list}>
                <p>Loading...</p>
              </div>
            </section>
          ))}
          
        
      </div>
    )
  }
  
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="board">
        <Column id="todo" title="To Do" status="todo" tasks={tasks} onAdd={addItems} onDel={removeItem} />
        <Column id="in_progress" title="In Progress" status="in_progress" tasks={tasks} onAdd={addItems} onDel={removeItem} />
        <Column id="in_review" title="In Review" status="in_review" tasks={tasks} onAdd={addItems} onDel={removeItem} />
        <Column id="done" title="Done" status="done" tasks={tasks} onAdd={addItems} onDel={removeItem} />
      </div>
    </DndContext>
  )
}