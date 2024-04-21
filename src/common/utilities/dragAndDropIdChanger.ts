// Общая
import { TasksWithEntityStatusType } from "../../redux/tasksSlice";

export function dragAndDropIdChanger<
  T extends { id: string },
  R extends {
    startDragId: string;
    endShiftId: string | null;
    startOrder?: number;
  }
>(array: T[], args: R) {
  const startIndex = array.findIndex(
    (item, index) => item.id === args.startDragId && index >= 0
  );
  const endIndex = array.findIndex(
    (item, index) => item.id === args.endShiftId && index >= 0
  );
  console.log("startIndex", startIndex);
  console.log("endIndex", endIndex);

  if (endIndex > 0 && endIndex <= startIndex) {
    return array[endIndex - 1].id;
  } else if (endIndex > startIndex) {
    return args.endShiftId;
  } else {
    return null;
  }
}
export function dragAndDropIdChangerByOrder(
  tasks: TasksWithEntityStatusType[],
  args: {
    todoListId: string;
    startDragId: string;
    startOrder: number;
    endShiftId: string;
  }
) {
  // А нужен ли мне тут запрос на сервер??? -- нет, его нужно делать в dragSTART!

  const startIndex = tasks.findIndex(
    (item, index) => item.id === args.startDragId && index >= 0
  );
  const endIndex = tasks.findIndex(
    (item, index) => item.id === args.endShiftId && index >= 0
  );
  console.log("startIndex", startIndex);
  console.log("endIndex", endIndex);

  if (endIndex === 0) {
    return null;
  } else if (endIndex === tasks.length - 1) {
    return args.endShiftId;
  } else {
    return tasks[endIndex - 1].id;
  }
  // if (endIndex > 0 && endIndex === tasks.length - 2) {
  //   console.log({ firstIf: tasks[endIndex - 1], length: tasks.length });
  //   return tasks[endIndex - 1].id;
  // } else if (endIndex === tasks.length - 1) {
  //   console.log({ secondIf: tasks[endIndex - 1], length: tasks.length });
  //   return args.endShiftId;
  // } else {
  //   return null;
  // }
}

export function dndOrderFinder(
  tasks: TasksWithEntityStatusType[],
  args: {
    todoListId: string;
    startDragId: string;
    startOrder: number;
    endShiftId: string;
  }
) {
  const startIndex = tasks.findIndex(
    (item, index) => item.id === args.startDragId && index >= 0
  );
  const endIndex = tasks.findIndex(
    (item, index) => item.id === args.endShiftId && index >= 0
  );
  console.log("startIndex", startIndex);
  console.log("endIndex", endIndex);

  if (endIndex === 0) {
    return null;
  } else if (endIndex === tasks.length - 1) {
    return args.endShiftId;
  } else {
    return tasks[endIndex - 1].id;
  }
  // if (endIndex > 0 && endIndex === tasks.length - 2) {
  //   console.log({ firstIf: tasks[endIndex - 1], length: tasks.length });
  //   return tasks[endIndex - 1].id;
  // } else if (endIndex === tasks.length - 1) {
  //   console.log({ secondIf: tasks[endIndex - 1], length: tasks.length });
  //   return args.endShiftId;
  // } else {
  //   return null;
  // }
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
