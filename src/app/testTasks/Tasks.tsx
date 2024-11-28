function Tasks(props) {
  console.log(props);
  return (
    <ul className="space-y-4">
      {props.tasks.map((task) => (
        <li key={task.id} className="rounded-md bg-slate-400 p-2 text-white">
          {task.title}
        </li>
      ))}
    </ul>
  );
}

export default Tasks;
