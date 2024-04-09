import {DragAndDropChangeIdArg, TodoUIType} from "../redux/todolistsSlice";
import {TaskType} from "../api/tasks-api";

// export function dragAndDropChangeId (todolists: TodoUIType[], args: ReorderTodoList) {
//   // ! НА СЕРВЕРЕ ОБРАБОТКА КАК ГАВНО, поэтому танцы с бубном
//   // Определяем UI index тудулиста, НА который перетаскиваем
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

export function DragAndDropChangeTodoId (todolists:Array<TodoUIType>,arg:DragAndDropChangeIdArg){
  const startDrag = todolists.findIndex((tl, index) => tl.id === arg.dragID && index >= 0)
  const endDrop = todolists.findIndex((tl, index) => tl.id === arg.todoList.id && index >= 0)

  if (endDrop > 0 && endDrop <= startDrag) {
    return todolists[endDrop - 1].id;
  }else if(endDrop>startDrag){
    return arg.todoList.id
  }
  else {
    return null;
  }
}

// export function dragAndDropChangeIdTasks (tasks: TaskType[], args: ReorderTasks, taskId?: string) {
//   // ! НА СЕРВЕРЕ ОБРАБОТКА КАК ГАВНО, поэтому танцы с бубном
//   // Определяем UI index тудулиста, НА который перетаскиваем
//   const startId = tasks.findIndex((t, index) => t.id === args.startDragId && index >= 0)
//   const endId = tasks.findIndex((t, index) => t.id === args.endShiftId && index >= 0)
//   // Отнимаем 1 из UI index и определяем его id, если таковой есть, то збс. Если нет, то null
//
//   if (endId > 0 && endId <= startId) {
//     return tasks[endId - 1].id;
//   } else if (endId > startId) {
//     return args.endShiftId;
//   } else {
//     return null;
//   }
// }

// Общая
// export function dragAndDropIdChanger<T extends { id: string }, R extends { startDragId: string, endShiftId: string | null }>(array: T[], args: R, taskId?: string) {
//   // ! ОБРАБОТКА НА СЕРВЕРЕ КАК ГАВНО, поэтому танцы с бубном
//   // Определяем UI index элемента, НА который перетаскиваем
//   const startId = array.findIndex((item, index) => item.id === args.startDragId && index >= 0)
//   const endId = array.findIndex((item, index) => item.id === args.endShiftId && index >= 0)
//   // Отнимаем 1 из UI index и определяем его id, если таковой есть, то збс. Если нет, то null
//
//   if (endId > 0 && endId <= startId) {
//     return array[endId - 1].id;
//   } else if (endId > startId) {
//     return args.endShiftId;
//   } else {
//     return null;
//   }
// }