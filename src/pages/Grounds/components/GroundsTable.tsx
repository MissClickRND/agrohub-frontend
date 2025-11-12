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

// хелперы
const getRecommendationBadges = (m: any) => {
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

const getTrendIcon = (current: number, previous?: number) => {
  if (previous === undefined) return null;
  if (current > previous)
    return <IconArrowUp size={14} color="green" style={{ marginLeft: 4 }} />;
  if (current < previous)
    return <IconArrowDown size={14} color="red" style={{ marginLeft: 4 }} />;
  return <IconMinus size={14} color="gray" style={{ marginLeft: 4 }} />;
};

// Компонент
export default function GroundsTable({
  fieldId,
}: {
  fieldId: number | undefined;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const columns = useMemo(
    () => [
      {
        accessorFn: (row: any) => row.geoJSON,
        id: "miniField",
        header: "Миниатюра",
        Cell: ({ cell }: any) => {
          const geoJSON = cell.getValue();
          if (!geoJSON) return null;

          const coords = geoJSON.features[0].geometry.coordinates[0];
          const lats = coords.map((c: number[]) => c[1]);
          const lngs = coords.map((c: number[]) => c[0]);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);

          const width = 180;
          const height = 120;
          const padding = 8;

          const scaleX = (width - 2 * padding) / (maxLng - minLng || 1);
          const scaleY = (height - 2 * padding) / (maxLat - minLat || 1);
          const scale = Math.min(scaleX, scaleY);

          const tx = (lng: number) => padding + (lng - minLng) * scale;
          const ty = (lat: number) => height - padding - (lat - minLat) * scale;

          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg
                width={width}
                height={height}
                style={{ border: "1px solid #e0e0e0", borderRadius: 4 }}
              >
                <polygon
                  points={coords
                    .map((c: number[]) => `${tx(c[0])},${ty(c[1])}`)
                    .join(" ")}
                  fill="rgba(0, 200, 0, 0.1)"
                  stroke="green"
                  strokeWidth={2}
                />
                {coords.map((c: number[], idx: number) => (
                  <circle
                    key={idx}
                    cx={tx(c[0])}
                    cy={ty(c[1])}
                    r={3}
                    fill="red"
                  />
                ))}
              </svg>
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Зона",
        Cell: ({ cell }: any) => (
          <Text fw={600} ta="center">
            {cell.getValue()}
          </Text>
        ),
      },
      {
        accessorFn: (row: any) => row.measurements[0].date,
        id: "lastMeasurement",
        header: "Замер",
        Cell: ({ cell }: any) => {
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
        accessorFn: (row: any) => row.measurements[0],
        id: "NPK",
        header: "N/P/K",
        Cell: ({ cell, row }: any) => {
          const m = cell.getValue();
          const prev = row.original.measurements[1];
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                textAlign: "center",
              }}
            >
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
        accessorFn: (row: any) => row.measurements[0].temperature,
        id: "temperature",
        header: "C°",
        Cell: ({ cell, row }: any) => {
          const current = cell.getValue();
          const previous = row.original.measurements[1]?.temperature;
          return (
            <span>
              {current}° {getTrendIcon(current, previous)}
            </span>
          );
        },
      },
      {
        accessorFn: (row: any) => row.measurements[0].humidity,
        id: "humidity",
        header: "Влажность",
        Cell: ({ cell, row }: any) => {
          const current = cell.getValue();
          const previous = row.original.measurements[1]?.humidity;
          return (
            <span>
              {current}% {getTrendIcon(current, previous)}
            </span>
          );
        },
      },
      {
        accessorFn: (row: any) => row.measurements[0].ph,
        id: "ph",
        header: "pH",
        Cell: ({ cell, row }: any) => {
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
        accessorFn: (row: any) => row.measurements[0].rainfall,
        id: "rainfall",
        header: "Осадки",
        Cell: ({ cell, row }: any) => {
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
        accessorFn: (row: any) => row.measurements[0],
        id: "recommendation",
        header: "Реком.",
        Cell: ({ cell }: any) => getRecommendationBadges(cell.getValue()),
      },
    ],
    []
  );

  return (
    <MantineReactTable
      columns={columns}
      data={fieldsData}
      // центрирование шапки и ячеек, компактная шапка
      mantineTableHeadCellProps={{
        style: {
          padding: "5px",
          height: 32,
          textAlign: "center",
          whiteSpace: "nowrap",
          justifyContent: "center",
        },
      }}
      mantineTableBodyCellProps={{
        style: {
          padding: "5px 0 5px 0",
          textAlign: "center",
          verticalAlign: "middle",
        },
      }}
      // без пагинации и нижнего/верхнего тулбара
      enablePagination={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      // высота до низа экрана
      mantineTableContainerProps={{
        style: {
          height: "calc(100vh - 140px)", // при необходимости подстройте отступ под ваш layout
          overflow: "auto",
        },
      }}
      mantinePaperProps={{
        withBorder: false,
        style: { height: "100%" },
      }}
      mantineTableProps={{
        highlightOnHover: true,
        striped: "even",
        withColumnBorders: false,
        withRowBorders: false,
      }}
      // раскрывающиеся панели оставляем
      enableExpanding
      renderDetailPanel={({ row }) => (
        <div style={{ padding: 12 }}>
          <Text fw={600} mb={8} ta="center">
            Все измерения
          </Text>
          <table className={classes.MiniTable} style={{ width: "100%" }}>
            <thead>
              <tr>
                {[
                  "Дата",
                  "N",
                  "P",
                  "K",
                  "Температура",
                  "Влажность",
                  "pH",
                  "Осадки",
                  "Рекомендация",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      borderBottom: "1px solid #ccc",
                      padding: 6,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.original.measurements.map((m: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ padding: 6, textAlign: "center" }}>
                    {dayjs(m.date).format("DD.MM.YYYY")}
                  </td>
                  <td style={{ padding: 6, textAlign: "center" }}>{m.N}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{m.P}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{m.K}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>
                    {m.temperature}
                  </td>
                  <td style={{ padding: 6, textAlign: "center" }}>
                    {m.humidity}
                  </td>
                  <td style={{ padding: 6, textAlign: "center" }}>{m.ph}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>
                    {m.rainfall}
                  </td>
                  <td style={{ padding: 6 }}>{getRecommendationBadges(m)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      state={{ expanded }}
      onExpandedChange={setExpanded}
    />
  );
}
