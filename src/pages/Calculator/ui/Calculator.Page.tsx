import {
  Box,
  Flex,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCalculator } from "@tabler/icons-react";
import { FieldPreview } from "../../../features/calculator/ui/FieldPreview";

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
  return (
    <Box p={"2rem 3rem"} w={"100%"} h={"100%"}>
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
              <Grid.Col span={6}>
                <FieldPreview />
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack>
                    <Text fz={"h3"} fw={"bold"}>Расчётов пока нет, но это временно</Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>{" "}
        <Flex w={"100%"} gap={"xl"}>
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
