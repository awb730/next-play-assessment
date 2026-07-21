import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient';
import './App.css'
import NewTask from './components/NewTask'

export default function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function loadItems() {
      const {data} = await supabase.from("tasks").select("*");
      setTasks(data)
    }
    loadItems();
  }, []) 

  async function addItems(newItem) {
    const { data, error } = await supabase.from("tasks").insert(newItem).select()
    if (!error) setTasks(prev => [...prev, ...data])
  }

  async function removeItem(id) {
    const { error } = await supabase.from("tasks").delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div>
      <div className="board">
        <section id="todo-col">
          <h1>To Do</h1>
          <NewTask items={tasks} status={"todo"} onAdd={addItems} onDel={removeItem} />
        </section>

        <section id="progress-col">
          <h1>In Progress</h1>
          <NewTask items={tasks} status={"in_progress"} onAdd={addItems} onDel={removeItem} />
        </section>

        <section id="review-col">
          <h1>In Review</h1>
          <NewTask items={tasks} status={"in_review"} onAdd={addItems} onDel={removeItem} />
        </section>

        <section id="done-col">
          <h1>Done</h1>
          <NewTask items={tasks} status={"done"} onAdd={addItems} onDel={removeItem} />
        </section>
      </div>
    </div>
  )
}