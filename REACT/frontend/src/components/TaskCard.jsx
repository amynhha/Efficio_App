function TaskCard({task}) {

    return (
    <div className="task-card">
        <div className="task-title"> 
            <h3>{task.title}</h3>
        </div>
        <div className="task-description"> 
            <p>{task.description}</p>
            <p>{task.deadline}</p>
        </div>
    </div>
    );
}

export default TaskCard;