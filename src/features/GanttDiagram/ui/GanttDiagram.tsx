import { useEffect, useMemo, useState } from "react";
import { Locale } from "@svar-ui/react-core";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Loader,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { Gantt, IApi, Willow } from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import "@mantine/dates/styles.css";
import styles from "./classes/GanttDiagram.module.css";
import { ru } from "../model/Localization";
import { Field } from "../../Map/model/types";
import { columns, scales } from "../model/SettingsGantt";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  CreateTaskPayload,
  GanttTask,
  UpdateTaskPayload,
} from "../model/types";
import EditCultureModal from "./components/EditCultureModal";
import CreateCultureModal from "./components/CreateCultureModal";
import { useGetCultureLogs } from "../model/lib/hooks/useGetCultureLogs";
import { useSetNewLog } from "../model/lib/hooks/useSetNewLog";
import { useGetCulture } from "../model/lib/hooks/useGetCultures";
import { useUpdateLog } from "../model/lib/hooks/useUpdateLog";
import { useDisclosure } from "@mantine/hooks";
import ModalAcceptAction from "../../../widgets/ModalAcceptAction/ModalAcceptAction";
import { useDeleteLog } from "../model/lib/hooks/useDeleteLog";

// Функция для генерации уникальных ID
const generateUniqueId = (existingTasks: GanttTask[]) => {
  const maxId = existingTasks.length
    ? Math.max(...existingTasks.map((t) => t.id))
    : 0;
  return maxId + 1;
};

// Функция для нормализации данных - исправление дублирующихся ID
const normalizeTasks = (tasks: GanttTask[]): GanttTask[] => {
  const seenIds = new Set();
  const normalizedTasks: GanttTask[] = [];
  let nextId = generateUniqueId(tasks);

  tasks.forEach((task) => {
    let taskId = task.id;

    // Если ID уже встречался, генерируем новый уникальный ID
    if (seenIds.has(taskId)) {
      taskId = nextId++;
      console.warn(
        `Обнаружен дублирующийся ID ${task.id}. Заменен на ${taskId}`
      );
    }

    seenIds.add(taskId);
    normalizedTasks.push({
      ...task,
      id: taskId,
    });
  });

  return normalizedTasks;
};

export default function GanttDiagram({
  data,
  isLoading,
  onCreateTask,
  onUpdateTask,
}: {
  data: Field | undefined;
  isLoading: boolean;
  onCreateTask?: (payload: CreateTaskPayload) => Promise<{ id: number } | void>;
  onUpdateTask?: (payload: UpdateTaskPayload) => Promise<void>;
}) {
  const { cultures } = useGetCulture();
  const cultureList = useMemo(() => cultures || [], [cultures]);
  const { newLog, isLoading: LoadingFir } = useSetNewLog();
  const { updateLog, isLoading: LoadingSec } = useUpdateLog();
  const { cultureLogs, isLoading: LoadingTh } = useGetCultureLogs(data?.id);
  const [api, setApi] = useState<IApi | null>(null);
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    // Нормализуем задачи при загрузке, исправляя дублирующиеся ID
    const normalizedTasks = normalizeTasks(cultureLogs);
    setTasks(normalizedTasks);
  }, [data?.id, cultureLogs]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedTask = useMemo(
    () =>
      selectedId != null
        ? tasks.find((t) => t.id === selectedId) ?? null
        : null,
    [selectedId, tasks]
  );

  const { deleteLog } = useDeleteLog();

  // модалки
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // статусы запросов
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // подписка на выбор задачи в гантте
  useEffect(() => {
    if (!api) return;
    const anyApi = api as any;

    const getSelectedFromState = () => {
      try {
        const st = anyApi.getState?.()?.selected;
        if (Array.isArray(st) && st.length) return Number(st.at(-1));
        if (st?.tasks && Array.isArray(st.tasks) && st.tasks.length) {
          return Number(st.tasks.at(-1));
        }
      } catch {}
      return null;
    };

    const off = anyApi.on?.("select-task", (ev: any) => {
      const raw = Array.isArray(ev) ? ev.at(-1)?.id : ev?.id;
      const id = raw != null ? Number(raw) : getSelectedFromState();
      setSelectedId(Number.isFinite(id as number) ? (id as number) : null);
    });

    return () => off?.();
  }, [api]);

  // открыть модалки
  const openCreate = () => setCreateOpen(true);
  const openEdit = () => {
    if (!selectedTask) return;
    setEditOpen(true);
  };

  const getCultureIdByName = (cultureName: string): string => {
    const culture = cultures.find((c) => c.name === cultureName);
    return culture ? String(culture.id) : cultureName;
  };

  // Создание
  const handleCreateSubmit = async (values: {
    text: string;
    start: Date;
    end: Date;
    idParents: string;
  }) => {
    setCreating(true);

    const tempId = generateUniqueId(tasks);

    // Преобразуем Date объекты в строки в правильном формате
    const startDate =
      values.start instanceof Date ? values.start : new Date(values.start);
    const endDate =
      values.end instanceof Date ? values.end : new Date(values.end);

    const optimistic: GanttTask = {
      id: tempId,
      text: values.text.trim(),
      start: startDate,
      end: endDate,
      type: "task",
      parent: Number(values.idParents),
    };

    setTasks((prev) => [...prev, optimistic]);

    try {
      let serverId: number | undefined;
      if (onCreateTask) {
        const res = await onCreateTask({
          text: optimistic.text,
          start: optimistic.start!,
          end: optimistic.end!,
          parent: optimistic.parent,
        });
        if (res && typeof res.id === "number") serverId = res.id;
      } else {
        // Правильное преобразование в ISO строку
        const startISO =
          optimistic.start instanceof Date
            ? optimistic.start.toISOString()
            : new Date(optimistic.start).toISOString();

        const endISO =
          optimistic.end instanceof Date
            ? optimistic.end.toISOString()
            : new Date(optimistic.end).toISOString();

        const result = await newLog({
          text: optimistic.text,
          start: startISO,
          end: endISO,
          parent: String(optimistic.parent),
        });

        // Если сервер возвращает ID, используем его
        if (result && result.id) {
          serverId = result.id;
        }
      }

      // выделить созданную задачу и проскроллить к ней
      if (api) {
        (api as any)?.exec?.("select-task", {
          id: serverId ?? tempId,
          show: true,
        });
      }

      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      // откат оптимистичного добавления
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      throw err;
    } finally {
      setCreating(false);
    }
  };

  // Редактирование
  const handleEditSubmit = async (values: {
    text: string;
    start: Date;
    end: Date;
  }) => {
    if (!selectedTask) return;
    setUpdating(true);

    // Функция для форматирования даты в ISO строку
    const formatDateToISO = (date: Date | string): string => {
      if (date instanceof Date) {
        return date.toISOString();
      }

      // Если это строка, проверяем наличие Z или T
      const dateStr = String(date);
      if (dateStr.includes("T") || dateStr.includes("Z")) {
        return dateStr;
      }

      // Если нет Z или T, добавляем временную метку
      return `${dateStr}T13:35:24.656Z`;
    };

    // values.text содержит ID культуры (например "1"), находим название для отображения
    const selectedCulture = cultures.find((c) => String(c.id) === values.text);
    const cultureName = selectedCulture ? selectedCulture.name : values.text;
    const cultureId = values.text; // Используем переданный ID напрямую

    // Форматируем даты в ISO строки
    const startISO = formatDateToISO(values.start);
    const endISO = formatDateToISO(values.end);

    const updatedTask: GanttTask = {
      ...selectedTask,
      text: cultureName, // Для отображения в Gantt сохраняем название
      start: values.start,
      end: values.end,
    };

    const snapshot = tasks;

    setTasks((p) => p.map((t) => (t.id === selectedTask.id ? updatedTask : t)));

    try {
      if (onUpdateTask) {
        await onUpdateTask({
          id: selectedTask.id,
          text: cultureName,
          start: values.start,
          end: values.end,
        });
      } else {
        // Отправляем данные с cultureId (ID культуры), а не названием
        await updateLog({
          body: {
            // Основные поля для Gantt
            id: selectedTask.id,
            text: String(cultureList.find((el) => el.name == cultureName)?.id), // Название для отображения
            start: startISO,
            end: endISO,
            type: selectedTask.type,
            parent: selectedTask.parent,

            // Дополнительные поля, которые ожидает сервер
            cultureId: cultureId, // Используем ID культуры, а не название
            createdAt: startISO,
            endAt: endISO,
          },
          id: selectedTask.id,
        });
      }

      setEditOpen(false);
    } catch (err) {
      console.error(err);
      setTasks(snapshot);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = () => {
    if (selectedId) {
      deleteLog(selectedId);
      setTasks((prev) => prev.filter((task) => task.id !== selectedId));
      setSelectedId(null);
    }
    close();
  };

  // Функция для вычисления дат summary на основе дочерних задач
  const calculateSummaryDates = (tasks: GanttTask[]): GanttTask[] => {
    const summaryTasks = tasks.filter((task) => task.type === "summary");

    return tasks.map((task) => {
      if (task.type === "summary") {
        // Находим все дочерние задачи
        const childTasks = tasks.filter(
          (t) => t.parent === task.id && t.type === "task"
        );

        if (childTasks.length > 0) {
          // Находим самую раннюю дату начала
          const minStart = new Date(
            Math.min(
              ...childTasks
                .filter((t) => t.start)
                .map((t) => new Date(t.start!).getTime())
            )
          );

          // Находим самую позднюю дату окончания
          const maxEnd = new Date(
            Math.max(
              ...childTasks
                .filter((t) => t.end)
                .map((t) => new Date(t.end!).getTime())
            )
          );

          // Возвращаем summary с вычисленными датами
          return {
            ...task,
            start: minStart,
            end: maxEnd,
          };
        }
      }
      return task;
    });
  };

  // Функция для нормализации данных - исправление дублирующихся ID и вычисление дат summary
  const normalizeTasks = (tasks: GanttTask[]): GanttTask[] => {
    const seenIds = new Set();
    const normalizedTasks: GanttTask[] = [];
    let nextId = generateUniqueId(tasks);

    tasks.forEach((task) => {
      let taskId = task.id;

      // Если ID уже встречался, генерируем новый уникальный ID
      if (seenIds.has(taskId)) {
        taskId = nextId++;
        console.warn(
          `Обнаружен дублирующийся ID ${task.id}. Заменен на ${taskId}`
        );
      }

      seenIds.add(taskId);

      // Копируем задачу с новым ID если нужно
      const normalizedTask =
        taskId !== task.id ? { ...task, id: taskId } : task;

      normalizedTasks.push(normalizedTask);
    });

    // Вычисляем даты для summary задач
    return calculateSummaryDates(normalizedTasks);
  };

  useEffect(() => {
    // Нормализуем задачи при загрузке, исправляя дублирующиеся ID
    let normalizedTasks = normalizeTasks(cultureLogs);

    // Дополнительно убеждаемся, что все summary имеют правильные даты
    normalizedTasks = calculateSummaryDates(normalizedTasks);

    setTasks(normalizedTasks);
  }, [data?.id, cultureLogs]);

  // Также обновляем summary при изменении задач
  useEffect(() => {
    if (tasks.length > 0) {
      const updatedTasks = calculateSummaryDates(tasks);
      // Обновляем только если даты изменились
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    }
  }, [tasks]);

  return (
    <Box style={{ width: "calc(100% - 280px)" }} pos="relative">
      <Locale words={ru}>
        <Willow>
          <Flex mah={78.5} align="center" justify="space-between" p={16}>
            <Box>
              <Text fw={500} fz={18}>
                Журнал поля: {data?.name}
              </Text>
              <Text
                fw={400}
                c="var(--subtitle)"
                fz={12}
                style={{ textWrap: "nowrap" }}
              >
                Здесь вы видите записи по посадкам культур
              </Text>
            </Box>

            <div
              className={styles.toolbarRight}
              style={{
                display: "flex",
                justifyContent: "end",
                gap: 8,
                padding: 14,
              }}
            >
              <Button
                size="xs"
                variant="filled"
                onClick={openCreate}
                leftSection={<IconPlus size={16} />}
              >
                Добавить запись
              </Button>
              <Button
                size="xs"
                variant="filled"
                onClick={openEdit}
                disabled={!selectedTask}
                title={
                  selectedTask
                    ? "Редактировать выбранную задачу"
                    : "Выберите задачу в диаграмме"
                }
                leftSection={<IconEdit size={16} />}
              >
                Редактировать
              </Button>
              <ActionIcon disabled={!selectedTask} color="red" onClick={open}>
                <IconTrash />
              </ActionIcon>
            </div>
          </Flex>

          <div className={styles.ganttShell}>
            {LoadingFir || LoadingSec || LoadingTh ? (
              <LoadingOverlay visible={LoadingFir || LoadingSec || LoadingTh}>
                <Loader />
              </LoadingOverlay>
            ) : (
              <Gantt
                columns={columns}
                init={(a: IApi) => setApi(a)}
                tasks={tasks}
                scales={scales}
                readonly
              />
            )}
          </div>
        </Willow>
      </Locale>

      <CreateCultureModal
        opened={createOpen}
        submitting={creating}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        idField={data?.id}
      />

      <EditCultureModal
        key={selectedTask?.id ?? "no-selection"}
        opened={editOpen}
        submitting={updating}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        initial={{
          text: selectedTask ? getCultureIdByName(selectedTask.text) : "",
          start: selectedTask?.start ?? null,
          end: selectedTask?.end ?? null,
        }}
        cultures={cultureList}
      />

      <ModalAcceptAction
        text={`Вы уверены что хотите удалить запись?`}
        subtitle="Это действие нельзя будет отменить"
        opened={opened}
        onPass={handleDeleteTask}
        close={close}
      />
    </Box>
  );
}
