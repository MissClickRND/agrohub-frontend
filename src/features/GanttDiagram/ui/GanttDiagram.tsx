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
const nextId = (list: GanttTask[]) =>
  list.length ? Math.max(...list.map((t) => t.id)) + 1 : 1;

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

  const cultureList = useMemo(() => cultures, [cultures]);
  const { newLog } = useSetNewLog();
  const { updateLog } = useUpdateLog();
  const { cultureLogs } = useGetCultureLogs(data?.id);
  const [api, setApi] = useState<IApi | null>(null);
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setTasks(cultureLogs);
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
    return culture ? String(culture.id) : "";
  };

  // Создание
  const handleCreateSubmit = async (values: {
    text: string;
    start: Date;
    end: Date;
    idParents: string;
  }) => {
    setCreating(true);

    const tempId = nextId(tasks);
    const optimistic: GanttTask = {
      id: tempId,
      text: values.text.trim(),
      start: values.start,
      end: values.end,
      type: "task",
      // @ts-ignore
      parent: values.idParents,
    };
    //suda
    setTasks((prev) => [...prev, optimistic]);

    try {
      let serverId: number | undefined;
      if (onCreateTask) {
        // Если передан пропс, используем его (для обратной совместимости)
        const res = await onCreateTask({
          text: optimistic.text,
          start: optimistic.start!,
          end: optimistic.end!,
          parent: optimistic.parent,
        });
        if (res && typeof res.id === "number") serverId = res.id;
      } else {
        const result = await newLog({
          text: optimistic.text,
          // @ts-ignore
          start: `${optimistic.start}T13:57:48.049Z`,
          // @ts-ignore
          end: `${optimistic.end}T13:57:48.049Z`,
          parent: String(optimistic.parent),
        });
      }

      // выделить созданную задачу и проскроллить к ней
      (api as any)?.exec?.("select-task", {
        id: serverId ?? tempId,
        show: true,
      });

      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      // откат оптимистичного добавления
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      throw err; // чтобы модалка показала нотификацию/ошибку, если захочешь
    } finally {
      setCreating(false);
    }
  };

  // Редактирование
  const handleEditSubmit = async (values: {
    text: string; // ID культуры как строка
    start: Date;
    end: Date;
  }) => {
    if (!selectedTask) return;
    setUpdating(true);

    const selectedCulture = cultures.find((c) => String(c.id) === values.text);
    const cultureName = selectedCulture ? selectedCulture.name : values.text;

    const updatedTask: GanttTask = {
      ...selectedTask,
      text: getCultureIdByName(cultureName),
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
          body: updatedTask,
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
    deleteLog(selectedId);
    close();
  };

  return (
    <Box w={"83%"} pos="relative">
      <LoadingOverlay visible={isLoading}>
        <Loader />
      </LoadingOverlay>

      <Locale words={ru}>
        <Willow>
          <Flex
            className={styles.header}
            px={14}
            align="center"
            justify="space-between"
            w="100%"
          >
            <Text fw={500} fz={18} miw="50%">
              Журнал роста культур: {data?.name}
            </Text>

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
              <ActionIcon color="red" onClick={open}>
                <IconTrash />
              </ActionIcon>
            </div>
          </Flex>

          <div className={styles.ganttShell}>
            <Gantt
              columns={columns}
              init={(a: IApi) => setApi(a)}
              tasks={tasks}
              scales={scales}
              // редактирование — только через наши модалки
              readonly
            />
          </div>
        </Willow>
      </Locale>

      {/* Модалки вынесены в отдельные компоненты */}
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
          text: selectedTask ? getCultureIdByName(selectedTask.text) : "", // Преобразуем название в ID
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
