import {
  Box,
  Flex,
  FloatingIndicator,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCalculator } from "@tabler/icons-react";
import { FieldPreview } from "../../../features/calculator/ui/FieldPreview";
import { CalculatedFields } from "../../../features/calculator/ui/CalculatedFields";
import { useState } from "react";
import { AreaSelection } from "../../../features/calculator/ui/AreaSelection";
import { useCalculator } from "../../../features/calculator/model/lib/hooks/useCalculator";

const cardsInfo = [
  {
    title: "Учитываемые затраты",
    list: [
      "Семенной материал",
      "Минеральные удобрения",
      "Горюче-смазочные материалы",
      "Прочие производственные расходы",
    ],
  },
  {
    title: "Источники данных",
    list: [
      "Средние рыночные цены 2025г.",
      "Данные Минсельхоза РФ",
      "Статистика агробирж",
      "Региональные показатели",
    ],
  },
  {
    title: "Результаты расчета",
    list: [
      "Общие затраты и выручка",
      "Прибыль в абсолютном выражении",
      "Рентабельность производства",
      "Показатели на 1 гектар",
    ],
  },
];

export const CalculatorPage = () => {
  const theme = useMantineTheme();
  const { resetSelected } = useCalculator();
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };
  return (
    <Box p={"1rem"} w={"100%"} h={"100%"}>
      <Stack gap={"2rem"}>
        <Box>
          <Text fz="h2" fw="bold">
            Экономический калькулятор
          </Text>
          <Text>
            Рассчитывайте экономическую эффективность выращивания различных
            культур. Планируйте затраты, прогнозируйте доходы и принимайте
            обоснованные решения
          </Text>
        </Box>
        <Paper
          p={"1.5rem 2rem"}
          withBorder
          styles={{ root: { borderRadius: ".5rem" } }}
        >
          <Stack>
            <Flex gap={".5rem"} align={"center"}>
              <IconCalculator color={theme.colors.primary[5]} />
              <Text fz={"h4"} fw={"bold"}>
                Экономический калькулятор
              </Text>
            </Flex>
            <Grid gutter={"1rem"}>
              <Grid.Col span={{ bale: 12, md: 6 }}>
                <Tabs
                  value={value}
                  onChange={(value) => {
                    resetSelected();
                    setValue(value);
                  }}
                >
                  <Tabs.List
                    ref={setRootRef}
                    styles={{
                      list: {
                        position: "relative",
                        marginBottom: "1rem",
                      },
                    }}
                  >
                    <Tabs.Tab
                      styles={{
                        tab: {
                          fontWeight: 500,
                          transition: "color 100ms ease",
                          color: "var(--mantine-color-gray-7)",
                        },
                      }}
                      value="1"
                      ref={setControlRef("1")}
                    >
                      <Text>По полю</Text>
                    </Tabs.Tab>
                    <Tabs.Tab
                      styles={{
                        tab: {
                          fontWeight: 500,
                          transition: "color 100ms ease",
                          color: "var(--mantine-color-gray-7)",
                        },
                      }}
                      value="2"
                      ref={setControlRef("2")}
                    >
                      <Text>По площади</Text>
                    </Tabs.Tab>

                    <FloatingIndicator
                      target={value ? controlsRefs[value] : null}
                      parent={rootRef}
                      styles={{
                        root: {
                          backgroundColor: "transparent",
                          borderRadius: "0",
                          border: "1px solid lightgray",
                          boxShadow: "var(--mantine-shadow-sm)",
                        },
                      }}
                    />
                  </Tabs.List>

                  <Tabs.Panel value="1">
                    <FieldPreview />
                  </Tabs.Panel>
                  <Tabs.Panel value="2">
                    <AreaSelection />
                  </Tabs.Panel>
                </Tabs>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <CalculatedFields />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>{" "}
        <Flex direction={{ base: "column", md: "row" }} w={"100%"} gap={"xl"}>
          {cardsInfo.map((card) => (
            <Paper
              withBorder
              w={"100%"}
              key={card.title + "-card"}
              styles={{
                root: { borderRadius: ".5rem", padding: "1.5rem 2rem" },
              }}
            >
              <Text fz={"h4"} mb={"1rem"} fw={"bold"}>
                {card.title}
              </Text>
              <List>
                {card.list.map((item) => (
                  <ListItem mb={".5rem"} key={"text-" + item}>
                    {" "}
                    {item}
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </Flex>
      </Stack>
    </Box>
  );
};
