function Tasks(props) {
  return (
    <ul className="space-y-4 bg-slate-200 p-6 shadow rounded-md">
      {props.tasks.map((task) => (
        <li key={task.id} className="flex gap-2">
          <button onClick={() => props.onTaskClick(task.id)} className={`text-left rounded-md bg-slate-400 p-2 text-white w-full ${task.isCompleted && 'line-through'}`}>{task.title}</button>
          <button className="rounded-md bg-slate-400 p-2 text-white">></button>
        </li>
      ))}
    </ul>
  );
}

export default Tasks;
