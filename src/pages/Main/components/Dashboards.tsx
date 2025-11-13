import {
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Flex,
  useMantineTheme,
  em,
} from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart } from "@mantine/charts";
import {
  IconPlant,
  IconMap,
  IconChartBar,
  IconTrendingUp,
  IconPlaystationCircle,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

const mockData = {
  summary: {
    totalFields: 24,
    totalZones: 156,
    averageZonesPerField: 6.5,
  },
  chemistry: [
    { type: "Фосфор PH", value: 120 },
    { type: "Калий K", value: 12 },
    { type: "Азот N", value: 85 },
    { type: "Кальций Ca", value: 45 },
    { type: "Магний Mg", value: 28 },
  ],
  crops: [
    { name: "Кукуруза", value: 40, color: "red" },
    { name: "Пшеница", value: 15, color: "yellow" },
    { name: "Соя", value: 12, color: "green" },
    { name: "Ячмень", value: 8, color: "brown" },
    { name: "Другое", value: 5, color: "violet" },
  ],
};

const StatCard = ({ title, value, icon }: any) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Flex justify="space-between">
      <Group>
        <div>
          <Text size="sm" color="dimmed">
            {title}
          </Text>
          <Text fz={24} fw={700}>
            {value}
          </Text>
        </div>
      </Group>
      <ThemeIcon h="100%" w={57.5} radius="md" variant="light">
        {icon}
      </ThemeIcon>
    </Flex>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Text>{label}</Text>
        <Text size="sm" style={{ color: "var(--main-color)" }}>
          Значение: {payload[0].value} мг/кг
        </Text>
      </Paper>
    );
  }
  return null;
};

const Dashboards = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  return (
    <Stack>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <StatCard
          title="Всего отслеживаемых полей"
          value={mockData.summary.totalFields}
          icon={<IconMap size={32} />}
        />
        <StatCard
          title="Всего отслеживаемых зон"
          value={mockData.summary.totalZones}
          icon={<IconPlant size={32} />}
        />
        <StatCard
          title="Средний показатель зон в одном поле"
          value={mockData.summary.averageZonesPerField}
          icon={<IconTrendingUp size={32} />}
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{ height: "400px" }}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap="md">
              <Group gap={4} align="center">
                <IconChartBar
                  size={24}
                  style={{ color: "var(--main-color)" }}
                />
                <Text size="lg" fw={500}>
                  Химический состав почвы
                </Text>
              </Group>
              <Flex gap={4} align="center">
                <IconPlaystationCircle size={18} />
                <Text fz={16} fw={500}>
                  Значение (мг/кг)
                </Text>
              </Flex>
            </Flex>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={mockData.chemistry}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  height={80}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Значение (мг/кг)"
                  stroke="var(--main-color)"
                  strokeWidth={3}
                  dot={{ fill: "var(--main-color)", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "var(--main-color)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{ minHeight: "400px", overflow: "visible" }}
          >
            <Group mb="md" gap={4} align="center">
              <IconPlant size={24} style={{ color: "var(--main-color)" }} />
              <Text size="lg" fw={500}>
                Распределение культур
              </Text>
            </Group>

            <Flex
              align="center"
              direction={isMobile ? "column" : "row"}
              justify="center"
              gap="xl"
              style={{
                height: isMobile ? "auto" : "320px",
                minHeight: isMobile ? "500px" : "320px",
              }}
            >
              <Flex
                justify="center"
                style={{
                  flex: isMobile ? "0 0 auto" : 1,
                  height: isMobile ? "200px" : "auto",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <PieChart
                  labelsPosition="outside"
                  labelsType="percent"
                  withLabels
                  data={mockData.crops}
                  withTooltip
                  tooltipDataSource="segment"
                />
              </Flex>

              {/* Список */}
              <Stack
                gap="md"
                style={{
                  flex: isMobile ? "0 0 auto" : 2,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <Text size="sm" fw={600}>
                  Распределение по убыванию:
                </Text>
                {[...mockData.crops]
                  .sort((a, b) => b.value - a.value)
                  .map((crop, index) => (
                    <div key={index}>
                      <Group justify="space-between" mb={4} wrap="nowrap">
                        <Group gap="xs" style={{ minWidth: 0 }}>
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              backgroundColor: crop.color,
                              opacity: 0.8 - index * 0.12,
                              borderRadius: "2px",
                              flexShrink: 0,
                            }}
                          />
                          <Text
                            size="sm"
                            fw={500}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {crop.name}
                          </Text>
                        </Group>
                        <Text size="sm" fw={600} style={{ flexShrink: 0 }}>
                          {(
                            (crop.value /
                              mockData.crops.reduce(
                                (sum, item) => sum + item.value,
                                0
                              )) *
                            100
                          ).toFixed(0)}
                          %
                        </Text>
                      </Group>
                      <div
                        style={{
                          height: 6,
                          backgroundColor: "#f1f3f5",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(
                              (crop.value /
                                mockData.crops.reduce(
                                  (sum, item) => sum + item.value,
                                  0
                                )) *
                              100
                            ).toFixed(0)}%`,
                            backgroundColor: crop.color,
                            opacity: 0.8 - index * 0.12,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </Stack>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Dashboards;
