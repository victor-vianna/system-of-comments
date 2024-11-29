"use client";

import React, { useState } from "react";
import Tasks from "./Tasks";
import AddTask from "./AddTask";

function TestPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Estudar programação",
      description:
        "Estudar programação para se tornar um desenvolvedor full stack.",
      isCompleted: "false",
    },
    {
      id: 2,
      title: "Estudar inglês",
      description: "Estudar inglês para se tornar fluente.",
      isCompleted: "false",
    },
  ]);

  function onTaskClick(taskId) {
    const newTasks = tasks.map((task) => {
      if (taskId == task.id) {
        return {...task, isCompleted: !task.isCompleted}
      } else {
        return task
      }
    })
    setTasks(newTasks);
  }

  return (
    <div className="flex h-full w-full justify-center bg-blue-300 p-6">
      <div className="w-[500px]">
        <h1 className="p-6 text-center text-3xl font-bold text-slate-100">
          GERENCIADOR DE TAREFAS
        </h1>
        <AddTask />
        <Tasks tasks={tasks} onTaskClick={onTaskClick} />
      </div>
    </div>
  );
}

export default TestPage;
