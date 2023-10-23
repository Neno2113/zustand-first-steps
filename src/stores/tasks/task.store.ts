import { StateCreator, create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { devtools, persist } from 'zustand/middleware';
import { Task, TaskStatus } from "../../interfaces";
import { immer } from 'zustand/middleware/immer';



interface TaskState {
    draggingTaskId?: string;
    tasks: Record<string, Task>,

    totalTasks: () => number;

    getTaskByStatus: ( status: TaskStatus ) => Task[];
    addTask: ( title: string, status: TaskStatus) => void;

    setDraggingTaskId: ( taskId: string ) => void;
    removeDraggingTaskId: () => void;
    changeTaskStatus: ( taskId: string, status: TaskStatus ) => void;
    onTaskDrop: ( status: TaskStatus) => void;


}



const storeApi: StateCreator<TaskState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({

    draggingTaskId: undefined,
    tasks: {
        'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open'},
        'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress'},
        'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'in-progress'},
        'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'done'},
    },

    totalTasks: () => {
        return  Object.values(get().tasks).length;
    },

    getTaskByStatus: (status: TaskStatus ) => {
        const tasks = get().tasks;
        return Object.values( tasks ).filter( task => task.status === status);
    }, 

    addTask: (title: string, status: TaskStatus ) => {
        const newTask = { id: uuidv4(), title, status};


        set( state => {
            state.tasks[newTask.id] = newTask
        });

        //? Requiere npm install immer
        // set( produce( (state: TaskState) => {
        //     state.tasks[newTask.id] = newTask;
        // }))

        //? Forma nativa Zustand
        // set( state => ({
        //     tasks: {
        //         ...state.tasks,
        //         [newTask.id]: newTask
        //     }
        // }))
    },

    setDraggingTaskId: ( taskId: string ) => {
        set({ draggingTaskId: taskId })
    },

    removeDraggingTaskId: () => set({ draggingTaskId: undefined}),

    changeTaskStatus: (taskid: string, status: TaskStatus) => {
        const task = {  ...get().tasks[taskid] };
        task.status = status;

        set( state  => {
            state.tasks[taskid] = {
                ...task
            };
        }); 

        //? forma nativa zustand
        // set( (state) => ({
        //     tasks: {
        //         ...state.tasks,
        //         [taskid]: task,
        //     }
        // }))
    },

    onTaskDrop: ( status: TaskStatus ) => {
        const taskId = get().draggingTaskId;
        if( !taskId ) return;

        get().changeTaskStatus(taskId, status);
        get().removeDraggingTaskId();
    }


})



export const useTaskStore = create<TaskState>()( 
    devtools(
        persist(
            immer(
                storeApi
            ), {
                name: 'task-store'
            }
        )
    )
);


