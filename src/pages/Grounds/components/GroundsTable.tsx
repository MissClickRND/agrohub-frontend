import { useMemo, useState } from "react";
import { Badge, Group, Text } from "@mantine/core";
import { MantineReactTable } from "mantine-react-table";
import dayjs from "dayjs";
import {
  IconArrowDown,
  IconArrowUp,
  IconCircle,
  IconDroplet,
  IconLeaf,
  IconLeaf2,
  IconMinus,
  IconWaterpolo,
} from "@tabler/icons-react";
import classes from "../classes/GroundTable.module.css";

// Пример данных
const fieldsData = [
  {
    id: 1,
    name: "Поле 1",
    geoJSON: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [30.1, 50.1],
                [30.4, 50.1],
                [30.4, 50.3],
                [30.1, 50.3],
                [30.1, 50.1],
              ],
            ],
          },
        },
      ],
    },
    measurements: [
      {
        date: "2025-11-08",
        N: 18,
        P: 12,
        K: 25,
        temperature: 22,
        humidity: 20,
        ph: 5.8,
        rainfall: 3,
      },
      {
        date: "2025-10-01",
        N: 20,
        P: 15,
        K: 20,
        temperature: 21,
        humidity: 18,
        ph: 6.2,
        rainfall: 5,
      },
      {
        date: "2025-09-01",
        N: 21,
        P: 14,
        K: 18,
        temperature: 20,
        humidity: 19,
        ph: 6.0,
        rainfall: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Поле 2",
    geoJSON: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [30.5, 50.2],
                [30.7, 50.2],
                [30.7, 50.4],
                [30.5, 50.4],
                [30.5, 50.2],
              ],
            ],
          },
        },
      ],
    },
    measurements: [
      {
        date: "2025-11-09",
        N: 25,
        P: 10,
        K: 15,
        temperature: 23,
        humidity: 22,
        ph: 7.0,
        rainfall: 2,
      },
      {
        date: "2025-10-05",
        N: 22,
        P: 12,
        K: 18,
        temperature: 21,
        humidity: 20,
        ph: 6.8,
        rainfall: 4,
      },
    ],
  },
  {
    id: 3,
    name: "Поле 3",
    geoJSON: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [30.2, 50.5],
                [30.5, 50.5],
                [30.5, 50.7],
                [30.2, 50.7],
                [30.2, 50.5],
              ],
            ],
          },
        },
      ],
    },
    measurements: [
      {
        date: "2025-08-01",
        N: 15,
        P: 18,
        K: 10,
        temperature: 20,
        humidity: 25,
        ph: 5.5,
        rainfall: 0,
      },
      {
        date: "2025-07-01",
        N: 16,
        P: 17,
        K: 12,
        temperature: 19,
        humidity: 23,
        ph: 5.7,
        rainfall: 1,
      },
      {
        date: "2025-06-01",
        N: 14,
        P: 16,
        K: 11,
        temperature: 18,
        humidity: 22,
        ph: 5.6,
        rainfall: 2,
      },
    ],
  },
];

const getRecommendationBadges = (m) => {
  const badges = [];
  if (m.ph < 6.0)
    badges.push(
      <Badge key="liming" color="gray" leftSection={<IconCircle size={14} />}>
        Известкование
      </Badge>
    );
  if (m.N < 20)
    badges.push(
      <Badge
        key="nitrogen"
        color="blue"
        leftSection={<IconDroplet size={14} />}
      >
        Удобрение N
      </Badge>
    );
  if (m.P < 15)
    badges.push(
      <Badge
        key="phosphorus"
        color="violet"
        leftSection={<IconLeaf2 size={14} />}
      >
        Удобрение P
      </Badge>
    );
  if (m.K < 20)
    badges.push(
      <Badge
        key="potassium"
        color="orange"
        leftSection={<IconLeaf size={14} />}
      >
        Удобрение K
      </Badge>
    );
  if (m.humidity < 15 || m.rainfall < 5)
    badges.push(
      <Badge
        key="watering"
        color="cyan"
        leftSection={<IconWaterpolo size={14} />}
      >
        Полив
      </Badge>
    );
  return badges.length ? (
    <Group gap={4} justify="center">
      {badges}
    </Group>
  ) : (
    <Text ta="center">Нет</Text>
  );
};

const getTrendIcon = (current, previous) => {
  if (previous === undefined) return null;
  if (current > previous)
    return <IconArrowUp size={14} color="green" style={{ marginLeft: 4 }} />;
  if (current < previous)
    return <IconArrowDown size={14} color="red" style={{ marginLeft: 4 }} />;
  return <IconMinus size={14} color="gray" style={{ marginLeft: 4 }} />;
};

export default function GroundsTable() {
  const [expanded, setExpanded] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.geoJSON,
        id: "miniField",
        header: "Миниатюра поля",
        Cell: ({ cell }) => {
          const geoJSON = cell.getValue();
          if (!geoJSON) return null;

          const coords = geoJSON.features[0].geometry.coordinates[0];
          const lats = coords.map((c) => c[1]);
          const lngs = coords.map((c) => c[0]);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);

          const width = 200; // увеличили ширину
          const height = 150; // увеличили высоту
          const padding = 10; // отступы для красоты

          const scaleX = (width - 2 * padding) / (maxLng - minLng || 1);
          const scaleY = (height - 2 * padding) / (maxLat - minLat || 1);
          const scale = Math.min(scaleX, scaleY);

          const transformX = (lng) => padding + (lng - minLng) * scale;
          const transformY = (lat) => height - padding - (lat - minLat) * scale;

          return (
            <svg
              width={width}
              height={height}
              style={{ border: "1px solid #ccc", borderRadius: 4 }}
            >
              <polygon
                points={coords
                  .map((c) => `${transformX(c[0])},${transformY(c[1])}`)
                  .join(" ")}
                fill="rgba(0, 200, 0, 0.1)"
                stroke="green"
                strokeWidth={2}
              />
              {coords.map((c, idx) => (
                <circle
                  key={idx}
                  cx={transformX(c[0])}
                  cy={transformY(c[1])}
                  r={3} // чуть больше точки
                  fill="red"
                />
              ))}
            </svg>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Поле",
        Cell: ({ cell }) => <Text weight={500}>{cell.getValue()}</Text>,
      },
      {
        accessorFn: (row) => row.measurements[0].date,
        id: "lastMeasurement",
        header: "Последнее измерение",
        Cell: ({ cell }) => {
          const lastDate = dayjs(cell.getValue());
          const daysAgo = dayjs().diff(lastDate, "day");
          const isOld = daysAgo > 30;
          return (
            <Badge color={isOld ? "red" : "green"}>
              {lastDate.format("DD.MM.YYYY")}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => row.measurements[0],
        id: "NPK",
        header: "N / P / K (мг/кг)",
        Cell: ({ cell, row }) => {
          const m = cell.getValue(); // текущее измерение
          const prev = row.original.measurements[1]; // предыдущее измерение
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span>
                N: {m.N} мг/кг {getTrendIcon(m.N, prev?.N)}
              </span>
              <span>
                P: {m.P} мг/кг {getTrendIcon(m.P, prev?.P)}
              </span>
              <span>
                K: {m.K} мг/кг {getTrendIcon(m.K, prev?.K)}
              </span>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.measurements[0].temperature,
        id: "temperature",
        header: "Температура (°C)",
        Cell: ({ cell, row }) => {
          const current = cell.getValue();
          const previous = row.original.measurements[1]?.temperature;
          return (
            <span>
              {current} °C {getTrendIcon(current, previous)}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.measurements[0].humidity,
        id: "humidity",
        header: "Влажность (%)",
        Cell: ({ cell, row }) => {
          const current = cell.getValue();
          const previous = row.original.measurements[1]?.humidity;
          return (
            <span>
              {current} % {getTrendIcon(current, previous)}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.measurements[0].ph,
        id: "ph",
        header: "pH",
        Cell: ({ cell, row }) => {
          const current = cell.getValue();
          const previous = row.original.measurements[1]?.ph;
          return (
            <span>
              {current} {getTrendIcon(current, previous)}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.measurements[0].rainfall,
        id: "rainfall",
        header: "Осадки (мм)",
        Cell: ({ cell, row }) => {
          const current = cell.getValue();
          const previous = row.original.measurements[1]?.rainfall;
          return (
            <span>
              {current} мм {getTrendIcon(current, previous)}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.measurements[0],
        id: "recommendation",
        header: "Рекомендации",
        Cell: ({ cell }) => getRecommendationBadges(cell.getValue()),
      },
    ],
    []
  );

  return (
    <MantineReactTable
      columns={columns}
      mantinePaperProps={{
        withBorder: false,
      }}
      data={fieldsData}
      enableExpanding
      renderDetailPanel={({ row }) => (
        <div style={{ padding: "16px" }}>
          <Text w={500} mb={8}>
            Все измерения
          </Text>
          <table className={classes.MiniTable}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  Дата
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  N
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  P
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  K
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  Темп.
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  Влажность
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  pH
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  Осадки
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                  Рекомендации
                </th>
              </tr>
            </thead>
            <tbody>
              {row.original.measurements.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>
                      {dayjs(m.date).format("DD.MM.YYYY")}
                    </p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>{m.N}</p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>{m.P}</p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>{m.K}</p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>
                      {m.temperature}
                    </p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>
                      {m.humidity}
                    </p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>{m.ph}</p>
                  </td>
                  <td style={{ padding: 8 }}>
                    <p style={{ textAlign: "center", margin: 0 }}>
                      {m.rainfall}
                    </p>
                  </td>
                  <td style={{ padding: 8 }}>{getRecommendationBadges(m)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      mantineTableProps={{
        highlightOnHover: true,
      }}
      state={{ expanded }}
      onExpandedChange={setExpanded}
    />
  );
}
