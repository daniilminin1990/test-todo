// Общая
import { TaskType } from "../../api/tasks-api";

export function dragAndDropIdChangerKIT(
  tasks: TaskType[],
  args: {
    todoListId: string;
    startDragId: string;
    endShiftId: string;
    newTodoListId: string;
  }
) {
  const startId = tasks.findIndex(
    (item, index) => item.id === args.startDragId && index >= 0
  );
  const endId = tasks.findIndex(
    (item, index) => item.id === args.endShiftId && index >= 0
  );
  console.log("Changer startUIIndex", startId);
  console.log("Changer endUIIndex", endId);
  console.log("Changer endId", args.endShiftId);

  if (endId > 0 && endId <= startId) {
    return tasks[endId - 1].id;
  } else if (endId > startId) {
    return args.endShiftId;
  } else {
    return null;
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
