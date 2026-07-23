import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient';
import { ensureSession } from './lib/auth'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import './App.css'
import styles from "./components/Column.module.css"
import NewTask from './components/NewTask'
import Column from './components/Column'
import TeamMembers from "./components/TeamMembers"

export default function App() {
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function startSession() {
      const session = await ensureSession();
    }

    async function loadItems() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, task_assignees(member_id)");
      if (error) {
        console.error('Failed to load tasks:', error);
        setTasks([]);
        return;
      } else {
        const withAssignees = (data ?? []).map(t => ({
          ...t,
          assigneeIds: t.task_assignees.map(a => a.member_id)
        }))
        setTasks(withAssignees);
      }
      setIsLoading(false)
    }

    async function loadMembers() {
      const { data, error } = await supabase.from("team_members").select("*")
      if (error) {
        console.error("Failed to load team members:", error)
        setTeamMembers([])
      } else {
        setTeamMembers(data ?? [])
      }
    }

    startSession();
    loadItems();
    loadMembers();
  }, [])

  async function addItems(newItem, assigneeIds = []) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("tasks")
      .insert({ ...newItem, user_id: user.id })
      .select();
    if (error) {
      console.error('Failed to add task:', error);
      return;
    }

    const createdTask = data[0]

    if(assigneeIds.length > 0) {
      const rows = assigneeIds.map(memberId => ({
        task_id: createdTask.id,
        member_id: memberId
      }))

      const { error: assignError } = await supabase
        .from("task_assignees")
        .insert(rows)
      if (assignError) {
        console.error('Failed to assign members:', assignError)
      }
    }

    setTasks(prev => [...prev, { ...createdTask, assigneeIds: assigneeIds }]);
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

  async function addTeamMember(member) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("team_members")
        .insert({ ...member, user_id: user.id })
        .select()

    if (error) {
      console.error("Failed to add team member:", error);
      return;
    }

    setTeamMembers(prev => [...prev, ...data])
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
      <>
        <TeamMembers members={teamMembers} onAdd={addTeamMember} />
        <div className="board">
            {["To Do", "In Progress", "In Review", "Done"].map(title => (
              <section key={title} className={styles.column}>
                <header  className={styles.header}>
                  <h1 className={styles.title}>{title}</h1>
                </header>
                <div className={styles.list}>
                  <p>Loading...</p>
                </div>
              </section>
            ))}
            
          
        </div>
      </>
    )
  }
  
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <TeamMembers members={teamMembers} onAdd={addTeamMember} />
      <div className="board">
        <Column id="todo" title="To Do" status="todo" tasks={tasks} onAdd={addItems} onDel={removeItem} teamMembers={teamMembers} />
        <Column id="in_progress" title="In Progress" status="in_progress" tasks={tasks} onAdd={addItems} onDel={removeItem} teamMembers={teamMembers} />
        <Column id="in_review" title="In Review" status="in_review" tasks={tasks} onAdd={addItems} onDel={removeItem} teamMembers={teamMembers} />
        <Column id="done" title="Done" status="done" tasks={tasks} onAdd={addItems} onDel={removeItem} teamMembers={teamMembers} />
      </div>
    </DndContext>
  )
}