"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Play, Shuffle, Check, X } from "lucide-react"

export default function TenATask() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [activeTask, setActiveTask] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("10atask-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("10atask-tasks", JSON.stringify(tasks))
  }, [tasks])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setActiveTask(null)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        createdAt: new Date().toISOString(),
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null)
      setIsRunning(false)
      setTimeLeft(0)
    }
  }

  const selectTask = (task) => {
    setActiveTask(task)
    setTimeLeft(600) // 10 minutes in seconds
    setIsRunning(false)
  }

  const chooseRandomTask = () => {
    if (tasks.length > 0) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
      selectTask(randomTask)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const completeTask = () => {
    if (activeTask) {
      deleteTask(activeTask.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">10atask</h1>
          <p className="text-gray-600">Just 10 minutes. That's all it takes.</p>
        </div>

        {/* Active Task Timer */}
        {activeTask && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-4">{activeTask.text}</h2>
              <div className="text-6xl font-light text-blue-600 mb-6">{formatTime(timeLeft)}</div>
              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button onClick={startTimer} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start 10 Minutes
                  </Button>
                ) : (
                  <div className="text-sm text-gray-600 font-medium">Timer running...</div>
                )}
                <Button onClick={completeTask} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Task */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Actions */}
        {tasks.length > 0 && (
          <div className="flex justify-center mb-6">
            <Button onClick={chooseRandomTask} variant="outline" className="bg-white hover:bg-gray-50">
              <Shuffle className="w-4 h-4 mr-2" />
              Choose for me
            </Button>
          </div>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No tasks yet.</p>
            <p className="text-sm">Add one above to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTask && activeTask.id === task.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => selectTask(task)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-gray-900">{task.text}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTask(task.id)
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Focus on one task. Work for 10 minutes. Make progress.</p>
        </div>
      </div>
    </div>
  )
}
