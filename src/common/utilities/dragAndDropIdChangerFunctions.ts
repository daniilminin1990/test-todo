// Общая
import { TasksWithEntityStatusType } from "../../redux/tasksSlice";

export function dndUniversalIdChanger<T extends { id: string }, R extends { startDragId: string; endShiftId: string | null }>(array: T[], args: R) {
  const startId = array.findIndex((item, index) => item.id === args.startDragId && index >= 0);
  const endId = array.findIndex((item, index) => item.id === args.endShiftId && index >= 0);

  if (endId > 0 && endId <= startId) {
    return array[endId - 1].id;
  } else if (endId > startId) {
    return args.endShiftId;
  } else {
    return null;
  }
}
export function dndIdChangerForTaskAcrossTodos(args: { tasks: TasksWithEntityStatusType[]; endShiftId: string }) {
  const endIndex = args.tasks.findIndex((item, index) => item.id === args.endShiftId && index >= 0);
  if (endIndex === 0) {
    return null;
    // } else if (endIndex === tasks.length - 1) {
  } else if (endIndex === args.tasks.length) {
    return args.tasks[endIndex].id;
  } else {
    return args.tasks[endIndex - 1].id;
  }
}

//   // ! НА СЕРВЕРЕ ОБРАБОТКА КАК ГАВНО, поэтому танцы с бубном
//   // Определяем UI index тудулиста, НА который перетаскиваем
//   // Отнимаем 1 из UI index и определяем его id, если таковой есть, то збс. Если нет, то null

// export function dragAndDropChangeId (todolists: TodoUIType[], args: ReorderTodoListArgs) {
//   const startId = todolists.findIndex((tl, index) => tl.id === args.startDragId && index >= 0)
//   const endId = todolists.findIndex((tl, index) => tl.id === args.endShiftId && index >= 0)
//   // Отнимаем 1 из UI index и определяем его id, если таковой есть, то збс. Если нет, то null
//
//   if (endId > 0 && endId <= startId) {
//     return todolists[endId - 1].id;
//   } else if (endId > startId) {
//     return args.endShiftId;
//   } else {
//     return null;
//   }
// }

// export function dragAndDropChangeIdTasks (tasks: TaskType[], args: ReorderTasks, taskId?: string) {

//   const startId = tasks.findIndex((t, index) => t.id === args.startDragId && index >= 0)
//   const endId = tasks.findIndex((t, index) => t.id === args.endShiftId && index >= 0)
//
//   if (endId > 0 && endId <= startId) {
//     return tasks[endId - 1].id;
//   } else if (endId > startId) {
//     return args.endShiftId;
//   } else {
//     return null;
//   }
// }
