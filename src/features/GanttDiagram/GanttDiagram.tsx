import { useState } from "react";
import { Locale } from "@svar-ui/react-core";
import { Box, Flex, Text } from "@mantine/core";
import { Editor, Gantt, IApi, Toolbar, Willow } from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import styles from "./classes/GanttDiagram.module.css";
import { ru } from "../../entities/JournalCultures/Localization";

export default function GanttDiagram() {
  const [api, setApi] = useState<IApi | null>(null);

  const tasks = [
    {
      id: 20,
      text: "New Task",
      start: new Date(2024, 5, 11),
      end: new Date(2024, 6, 12),
      duration: 1,
      progress: 2,
      type: "task",
      lazy: false,
    },
    {
      id: 47,
      text: "[1] Master project",
      start: new Date(2024, 5, 12),
      end: new Date(2024, 7, 12),
      duration: 8,
      progress: 0,
      parent: 0,
      type: "summary",
    },
    {
      id: 22,
      text: "Task",
      start: new Date(2024, 7, 11),
      end: new Date(2024, 8, 12),
      duration: 8,
      progress: 0,
      parent: 47,
      type: "task",
    },
    {
      id: 21,
      text: "TEST!",
      start: new Date(2024, 7, 10),
      end: new Date(2024, 8, 12),
      duration: 3,
      progress: 0,
      type: "task",
      lazy: false,
    },
    {
      id: 214,
      text: "TEST2",
      start: new Date(2024, 8, 15),
      end: new Date(2024, 9, 16),
      duration: 3,
      progress: 0,
      type: "task",
      lazy: false,
    },
  ];

  const scales = [{ unit: "month", step: 1, format: "MMM yyyy" }];

  const links = [{ id: 1, source: 20, target: 21, type: "e2e" }];

  const items = [
    { id: "add-task", comp: "button", icon: "wxi-plus", type: "primary" },
    { id: "edit-task", comp: "button", icon: "wxi-edit", type: "primary" },
  ];

  return (
    <Box w={"83%"}>
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
              Журнал роста культур
            </Text>

            <div className={styles.toolbarRight}>
              <Toolbar api={api ?? undefined} items={items} />
            </div>
          </Flex>

          <div className={styles.ganttShell}>
            <Gantt
              init={(a: IApi) => setApi(a)}
              tasks={tasks}
              links={links}
              scales={scales}
              readonly
            />
            {api && <Editor api={api} />}
          </div>
        </Willow>
      </Locale>
    </Box>
  );
}
