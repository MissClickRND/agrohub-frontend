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
  Select,
} from "@mantine/core";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart as RePieChart,
  BarChart,
  Bar,
} from "recharts";

import {
  IconPlant,
  IconMap,
  IconTrendingUp,
  IconCircuitGround,
  IconShape,
} from "@tabler/icons-react";

import { useMediaQuery } from "@mantine/hooks";
import { useGetDashboard } from "../../../features/dashboard/model/lib/hooks/useGetDashboard";
import { useGetFields } from "../../../features/Map/model/lib/hooks/useGetFields";
import { useGetNpkDashboard } from "../../../features/dashboard/model/lib/hooks/useGetNpkDashboard";

import { useState, useMemo } from "react";
import { colors } from "../../../features/dashboard/model/lib/types";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Text fw={600}>{label}</Text>
        <Text size="sm">Значение: {payload[0].value}</Text>
      </Paper>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon }: any) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Flex justify="space-between">
      <Group>
        <div>
          <Text size="sm" c="dimmed">
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

const Dashboards = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [fieldId, setFieldId] = useState<number | null>(null);

  const { dashboard } = useGetDashboard();
  const { fields } = useGetFields();
  const { dashboardNPK } = useGetNpkDashboard(fieldId);

  const npkData = useMemo(() => {
    if (!dashboardNPK) return [];
    return dashboardNPK.map((item: any) => ({
      zone: item.zone,
      N: item.N,
      P: item.P,
      K: item.K,
    }));
  }, [dashboardNPK]);

  const gaData = useMemo(() => {
    if (!fields) return [];

    return fields.map((field: any) => {
      const row: any = { field: field.name };

      field.zones?.forEach((zone: any) => {
        // area приходит в м² → переводим в ГА и округляем
        row[zone.name] = Math.round(zone.area / 10000);
      });

      return row;
    });
  }, [fields]);

  const zoneKeys = useMemo(() => {
    const keysSet = new Set<string>();
    gaData.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        if (key !== "field") {
          keysSet.add(key);
        }
      });
    });
    return Array.from(keysSet);
  }, [gaData]);

  const fieldOptions = fields?.map((f: any) => ({
    value: String(f.id),
    label: f.name,
  }));

  return (
    <Stack>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <StatCard
          title="Всего отслеживаемых полей"
          value={dashboard.countFields}
          icon={<IconMap size={32} />}
        />
        <StatCard
          title="Всего отслеживаемых зон"
          value={dashboard.countZones}
          icon={<IconPlant size={32} />}
        />
        <StatCard
          title="Средний показатель зон в одном поле"
          value={dashboard.averageZone}
          icon={<IconTrendingUp size={32} />}
        />
      </SimpleGrid>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 12 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{ minHeight: "400px" }}
          >
            <Group mb="md" gap={4} align="center">
              <IconPlant size={24} style={{ color: "var(--main-color)" }} />
              <Text size="lg" fw={500}>
                Распределение культур
              </Text>
            </Group>

            <Flex
              align="center"
              justify="center"
              direction={isMobile ? "column" : "row"}
              gap="xl"
            >
              {!dashboard.cultures || dashboard.cultures.length === 0 ? (
                <Text c="dimmed">Нет данных по культурам</Text>
              ) : (
                <ResponsiveContainer width="50%" height={250}>
                  <RePieChart>
                    <Tooltip />
                    <Pie
                      data={dashboard.cultures}
                      dataKey="value"
                      nameKey="name"
                      label
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </Flex>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{ height: 400 }}
          >
            <Group mb="md" gap={4} align="center">
              <IconCircuitGround
                size={24}
                style={{ color: "var(--main-color)" }}
              />
              <Text size="lg" fw={500}>
                Химический состав почвы (мг/кг)
              </Text>
            </Group>

            <Select
              placeholder="Выберите поле"
              data={fieldOptions}
              value={fieldId ? String(fieldId) : null}
              onChange={(v) => setFieldId(v ? Number(v) : null)}
              mb="md"
            />

            {npkData.length === 0 ? (
              <Text c="dimmed">Нет данных по NPK</Text>
            ) : (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={npkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="N" name="Азот (N)" fill="#3b82f6" />
                  <Bar dataKey="P" name="Фосфор (P)" fill="#10b981" />
                  <Bar dataKey="K" name="Калий (K)" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{ height: 400 }}
          >
            <Group mb="md" gap={4} align="center">
              <IconShape size={24} style={{ color: "var(--main-color)" }} />
              <Text size="lg" fw={500}>
                Распределение площади полей (га)
              </Text>
            </Group>

            {gaData.length === 0 ? (
              <Text c="dimmed">Нет данных по зонам</Text>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={gaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="field" />
                  <YAxis />
                  <Tooltip />

                  {zoneKeys.map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="zones"
                      name={key}
                      fill={colors[i] || "#DSDSD"}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Dashboards;
