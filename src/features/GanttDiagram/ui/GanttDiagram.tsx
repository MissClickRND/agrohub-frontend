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

const generateUniqueId = (existingTasks: GanttTask[]) => {
  const maxId = existingTasks.length
    ? Math.max(...existingTasks.map((t) => t.id))
    : 0;
  return maxId + 1;
};

const normalizeTasks = (tasks: GanttTask[]): GanttTask[] => {
  const seenIds = new Set();
  const normalizedTasks: GanttTask[] = [];
  let nextId = generateUniqueId(tasks);

  tasks.forEach((task) => {
    let taskId = task.id;

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

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  const openCreate = () => setCreateOpen(true);
  const openEdit = () => {
    if (!selectedTask) return;
    setEditOpen(true);
  };

  const getCultureIdByName = (cultureName: string): string => {
    const culture = cultures.find((c) => c.name === cultureName);
    return culture ? String(culture.id) : cultureName;
  };

  const handleCreateSubmit = async (values: {
    text: string;
    start: Date;
    end: Date;
    idParents: string;
  }) => {
    setCreating(true);

    const tempId = generateUniqueId(tasks);

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

        if (result && result.id) {
          serverId = result.id;
        }
      }

      if (api) {
        (api as any)?.exec?.("select-task", {
          id: serverId ?? tempId,
          show: true,
        });
      }

      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const handleEditSubmit = async (values: {
    text: string;
    start: Date;
    end: Date;
  }) => {
    if (!selectedTask) return;
    setUpdating(true);

    const formatDateToISO = (date: Date | string): string => {
      if (date instanceof Date) {
        return date.toISOString();
      }

      const dateStr = String(date);
      if (dateStr.includes("T") || dateStr.includes("Z")) {
        return dateStr;
      }

      return `${dateStr}T13:35:24.656Z`;
    };

    const selectedCulture = cultures.find((c) => String(c.id) === values.text);
    const cultureName = selectedCulture ? selectedCulture.name : values.text;
    const cultureId = values.text;

    const startISO = formatDateToISO(values.start);
    const endISO = formatDateToISO(values.end);

    const updatedTask: GanttTask = {
      ...selectedTask,
      text: cultureName,
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
        await updateLog({
          body: {
            id: selectedTask.id,
            text: String(cultureList.find((el) => el.name == cultureName)?.id),
            start: startISO,
            end: endISO,
            type: selectedTask.type,
            parent: selectedTask.parent,
            cultureId: cultureId,
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

  const calculateSummaryDates = (tasks: GanttTask[]): GanttTask[] => {
    const summaryTasks = tasks.filter((task) => task.type === "summary");

    return tasks.map((task) => {
      if (task.type === "summary") {
        const childTasks = tasks.filter(
          (t) => t.parent === task.id && t.type === "task"
        );

        if (childTasks.length > 0) {
          const minStart = new Date(
            Math.min(
              ...childTasks
                .filter((t) => t.start)
                .map((t) => new Date(t.start!).getTime())
            )
          );

          const maxEnd = new Date(
            Math.max(
              ...childTasks
                .filter((t) => t.end)
                .map((t) => new Date(t.end!).getTime())
            )
          );

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

  useEffect(() => {
    let normalizedTasks = normalizeTasks(cultureLogs);
    normalizedTasks = calculateSummaryDates(normalizedTasks);
    setTasks(normalizedTasks);
  }, [data?.id, cultureLogs]);

  useEffect(() => {
    if (tasks.length > 0) {
      const updatedTasks = calculateSummaryDates(tasks);
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    }
  }, [tasks]);

  return (
    <Box w={{ base: "100%", sm: "calc(100% - 280px)" }} pos="relative">
      <Locale words={ru}>
        <Willow>
          <Flex
            align="center"
            justify="space-between"
            p={16}
            direction={{ base: "column", sm: "row" }}
            gap={{ base: "md", sm: "none" }}
          >
            <Box>
              <Text fw={500} fz={18} ta={{ base: "center", sm: "left" }}>
                Журнал поля: {data?.name}
              </Text>
              <Text
                fw={400}
                c="var(--subtitle)"
                fz={12}
                ta={{ base: "center", sm: "left" }}
              >
                Здесь вы видите записи по посадкам культур
              </Text>
            </Box>

            <Flex
              gap={8}
              justify={{ base: "center", sm: "end" }}
              wrap="wrap"
              w={{ base: "100%", sm: "auto" }}
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
                leftSection={<IconEdit size={16} />}
              >
                Редактировать
              </Button>
              <ActionIcon
                disabled={!selectedTask}
                color="red"
                onClick={open}
                size="30px"
              >
                <IconTrash />
              </ActionIcon>
            </Flex>
          </Flex>

          <Box
            className={styles.ganttShell}
            h={{ base: 400, sm: "calc(100vh - 150px)" }}
          >
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
          </Box>
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
