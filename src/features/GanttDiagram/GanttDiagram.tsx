import { useEffect, useMemo, useState } from "react";
import { Locale } from "@svar-ui/react-core";
import {
  Box,
  Button,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Gantt, IApi, Willow } from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import "@mantine/dates/styles.css";
import styles from "./classes/GanttDiagram.module.css";
import { ru } from "../../entities/JournalCultures/Localization";
import { Field } from "../Map/model/types";
import { columns, scales } from "../../entities/JournalCultures/SettingsGantt";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import {
  CreateTaskPayload,
  GanttTask,
  UpdateTaskPayload,
} from "../../entities/JournalCultures/model/types";

// ========= Данные-заглушки =========
const initialTasks: GanttTask[] = [
  { id: 47, text: "Зона 1", type: "summary" },
  {
    id: 22,
    text: "Task A",
    start: new Date(2024, 7, 12),
    end: new Date(2024, 12, 1),
    parent: 47,
    type: "task",
  },
  {
    id: 24,
    text: "Task B",
    start: new Date(2024, 12, 1),
    end: new Date(2025, 12, 1),
    parent: 47,
    type: "task",
  },
];

const nextId = (list: GanttTask[]) =>
  list.length ? Math.max(...list.map((t) => t.id)) + 1 : 1;

export default function GanttDiagram({
  data,
  isLoading,
  onCreateTask,
  onUpdateTask,
  defaultParentId = 47,
}: {
  data: Field | undefined;
  isLoading: boolean;
  onCreateTask?: (payload: CreateTaskPayload) => Promise<{ id: number } | void>;
  onUpdateTask?: (payload: UpdateTaskPayload) => Promise<void>;
  defaultParentId?: number;
}) {
  const [api, setApi] = useState<IApi | null>(null);
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);

  // выбранная задача (по клику в гантте)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedTask = useMemo(
    () =>
      selectedId != null
        ? tasks.find((t) => t.id === selectedId) ?? null
        : null,
    [selectedId, tasks]
  );

  // ======== Create Modal ========
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [cName, setCName] = useState("");
  const [cStart, setCStart] = useState<Date | null>(null);
  const [cEnd, setCEnd] = useState<Date | null>(null);
  const [cError, setCError] = useState<string | null>(null);

  // ======== Edit Modal ========
  const [editOpen, setEditOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [eName, setEName] = useState("");
  const [eStart, setEStart] = useState<Date | null>(null);
  const [eEnd, setEEnd] = useState<Date | null>(null);
  const [eError, setEError] = useState<string | null>(null);

  // подписка на выбор задачи в гантте
  useEffect(() => {
    if (!api) return;

    const anyApi = api as any;

    // универсальный геттер на случай мультиселекта/строгих типов
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

  // открыть модалку Create
  const openCreate = () => {
    setCName("");
    setCStart(null);
    setCEnd(null);
    setCError(null);
    setCreateOpen(true);
  };

  // открыть модалку Edit (только если есть selectedTask)
  const openEdit = () => {
    if (!selectedTask) return;
    setEName(selectedTask.text ?? "");
    setEStart(selectedTask.start ?? null);
    setEEnd(selectedTask.end ?? null);
    setEError(null);
    setEditOpen(true);
  };

  // ======== Создание ========
  const handleCreateSubmit = async () => {
    if (!cName.trim()) return setCError("Укажите название задачи");
    if (!cStart || !cEnd) return setCError("Выберите даты начала и окончания");
    if (cStart > cEnd)
      return setCError("Дата начала не может быть позже даты окончания");

    setCreating(true);
    setCError(null);

    const tempId = nextId(tasks);
    const optimistic: GanttTask = {
      id: tempId,
      text: cName.trim(),
      start: cStart,
      end: cEnd,
      type: "task",
      parent: defaultParentId,
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
        serverId = tempId; // заглушка
      }

      if (serverId && serverId !== tempId) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: serverId! } : t))
        );
      }

      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      setCError("Не удалось создать задачу. Повторите попытку.");
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    } finally {
      setCreating(false);
    }
  };

  // ======== Редактирование (только Название и Даты) ========
  const handleEditSubmit = async () => {
    if (!selectedTask) return;
    if (!eName.trim()) return setEError("Укажите название задачи");
    if (!eStart || !eEnd) return setEError("Выберите даты начала и окончания");
    if (eStart > eEnd)
      return setEError("Дата начала не может быть позже даты окончания");

    setUpdating(true);
    setEError(null);

    // локальный оптимистичный апдейт
    const patch: UpdateTaskPayload = {
      id: selectedTask.id,
      text: eName.trim(),
      start: eStart,
      end: eEnd,
    };

    const prev = tasks;
    setTasks((p) =>
      p.map((t) =>
        t.id === patch.id
          ? { ...t, text: patch.text!, start: patch.start!, end: patch.end! }
          : t
      )
    );

    try {
      if (onUpdateTask) {
        await onUpdateTask(patch);
      } else {
        // заглушка
        // await new Promise((r) => setTimeout(r, 150));
      }
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      setEError("Не удалось сохранить изменения. Попробуйте снова.");
      setTasks(prev); // откат
    } finally {
      setUpdating(false);
    }
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
              <Button size="xs" variant="filled" onClick={openCreate}>
                <IconPlus />
                Добавить запись
              </Button>
              <Button
                size="xs"
                variant="light"
                onClick={openEdit}
                disabled={!selectedTask}
                title={
                  selectedTask
                    ? "Редактировать выбранную задачу"
                    : "Выберите задачу в диаграмме"
                }
              >
                <IconEdit />
                Редактировать
              </Button>
            </div>
          </Flex>

          <div className={styles.ganttShell}>
            <Gantt
              columns={columns}
              init={(a: IApi) => setApi(a)}
              tasks={tasks}
              scales={scales}
              // оставляем readonly — редактирование делаем через наши модалки
              readonly
            />
          </div>
        </Willow>
      </Locale>

      {/* ======== Модалка: Создать ======== */}
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Создание задачи"
        centered
        size="lg"
      >
        <Group grow gap="md" mb="md">
          <TextInput
            label="Название"
            placeholder="Например, Полив"
            value={cName}
            onChange={(e) => setCName(e.currentTarget.value)}
            required
          />
        </Group>
        <Group grow gap="md" mb="sm">
          <DatePickerInput
            label="Дата начала"
            value={cStart}
            onChange={setCStart}
            required
            clearable
          />
          <DatePickerInput
            label="Дата окончания"
            value={cEnd}
            onChange={setCEnd}
            required
            clearable
          />
        </Group>
        {cError && (
          <Text c="red" fz="sm" mb="sm">
            {cError}
          </Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setCreateOpen(false)}>
            Отмена
          </Button>
          <Button loading={creating} onClick={handleCreateSubmit}>
            Создать
          </Button>
        </Group>
      </Modal>

      {/* ======== Модалка: Редактировать (только Название и Даты) ======== */}
      <Modal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title="Редактирование задачи"
        centered
        size="lg"
      >
        <Group grow gap="md" mb="md">
          <TextInput
            label="Название"
            placeholder="Введите название"
            value={eName}
            onChange={(e) => setEName(e.currentTarget.value)}
            required
          />
        </Group>
        <Group grow gap="md" mb="sm">
          <DatePickerInput
            label="Дата начала"
            value={eStart}
            onChange={setEStart}
            required
            clearable
          />
          <DatePickerInput
            label="Дата окончания"
            value={eEnd}
            onChange={setEEnd}
            required
            clearable
          />
        </Group>
        {eError && (
          <Text c="red" fz="sm" mb="sm">
            {eError}
          </Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setEditOpen(false)}>
            Отмена
          </Button>
          <Button
            loading={updating}
            onClick={handleEditSubmit}
            disabled={!selectedTask}
          >
            Сохранить
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
