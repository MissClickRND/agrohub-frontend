export type TaskType = "task" | "summary";
export type GanttTask = {
  id: number;
  text: string;
  type: TaskType;
  start?: Date;
  end?: Date;
  parent?: number;
};

export type CreateTaskPayload = {
  text: string;
  start: Date;
  end: Date;
  parent?: number;
};
export type UpdateTaskPayload = {
  id: number;
  text?: string;
  start?: Date;
  end?: Date;
  parent?: number;
};

export type Culture = {
  id: number;
  name: string;
};
