// pages/Grounds/components/GroundsTable.tsx
import { useEffect, useMemo, useState } from "react";
import { Badge, Group, Text } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
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
import { useGetGroundData } from "../../../features/grounds/model/lib/hooks/useGetGroundData";

type BackendPoint = { type: "Point"; coordinates: [number, number] };
type BackendGround = {
  id: number;
  N: number;
  P: number;
  K: number;
  Temperature: number;
  Humidity: number;
  pH: number;
  Rainfall: number;
  location?: BackendPoint;
  createdAt: string;
};
type BackendZone = { id: number; name: string; grounds: BackendGround[] };
type BackendField = {
  field_id: number;
  field_name: string;
  zones: BackendZone[];
};

type ZoneRow = {
  zoneId: number;
  zoneName: string;
  latest?: {
    date: string;
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
  previous?: {
    N?: number;
    P?: number;
    K?: number;
    temperature?: number;
    humidity?: number;
    ph?: number;
    rainfall?: number;
  };
  allMeasurements: Array<{
    date: string;
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
    coords?: { lat: number; lng: number };
  }>;
};

const getTrendIcon = (current?: number, previous?: number) => {
  if (current === undefined || previous === undefined) return null;
  if (current > previous)
    return <IconArrowUp size={14} color="green" style={{ marginLeft: 4 }} />;
  if (current < previous)
    return <IconArrowDown size={14} color="red" style={{ marginLeft: 4 }} />;
  return <IconMinus size={14} color="gray" style={{ marginLeft: 4 }} />;
};

const getRecommendationBadges = (m?: ZoneRow["latest"]) => {
  if (!m) return <Text ta="center">Нет</Text>;
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

const normalizeToRows = (data?: BackendField | null): ZoneRow[] => {
  if (!data?.zones?.length) return [];
  return data.zones.map<ZoneRow>((z) => {
    const sorted = [...(z.grounds || [])].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
    const latest = sorted[0];
    const prev = sorted[1];
    const toRowMeas = (g: BackendGround) => ({
      date: g.createdAt,
      N: g.N,
      P: g.P,
      K: g.K,
      temperature: g.Temperature,
      humidity: g.Humidity,
      ph: g.pH,
      rainfall: g.Rainfall,
      coords:
        g.location?.type === "Point"
          ? { lat: g.location.coordinates[1], lng: g.location.coordinates[0] }
          : undefined,
    });
    return {
      zoneId: z.id,
      zoneName: z.name,
      latest: latest
        ? {
            date: latest.createdAt,
            N: latest.N,
            P: latest.P,
            K: latest.K,
            temperature: latest.Temperature,
            humidity: latest.Humidity,
            ph: latest.pH,
            rainfall: latest.Rainfall,
          }
        : undefined,
      previous: prev
        ? {
            N: prev.N,
            P: prev.P,
            K: prev.K,
            temperature: prev.Temperature,
            humidity: prev.Humidity,
            ph: prev.pH,
            rainfall: prev.Rainfall,
          }
        : undefined,
      allMeasurements: sorted.map(toRowMeas),
    };
  });
};

export default function GroundsTable({
  fieldId,
}: {
  fieldId: number | undefined;
}) {
  const { groundData, isLoading } = useGetGroundData(fieldId);
  const [rows, setRows] = useState<ZoneRow[]>([]);

  useEffect(() => {
    if (!fieldId) {
      setRows([]);
      return;
    }
    setRows(normalizeToRows(groundData as BackendField | null));
  }, [fieldId, groundData]);

  const columns = useMemo<MRT_ColumnDef<ZoneRow>[]>(
    () => [
      {
        accessorKey: "zoneName",
        header: "Название",
        Cell: ({ cell }) => (
          <Text fw={600} ta="center">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        id: "lastMeasurement",
        header: "Дата замера",
        accessorFn: (row) => row.latest?.date,
        Cell: ({ cell }) => {
          const val = cell.getValue<string | undefined>();
          if (!val) return <Badge color="gray">Нет данных</Badge>;
          const lastDate = dayjs(val);
          const isOld = dayjs().diff(lastDate, "day") > 30;
          return (
            <Badge color={isOld ? "red" : "green"}>
              {lastDate.format("DD.MM.YYYY")}
            </Badge>
          );
        },
      },
      {
        id: "NPK",
        header: "N/P/K",
        accessorFn: (row) => row.latest,
        Cell: ({ row }) => {
          const m = row.original.latest,
            prev = row.original.previous;
          if (!m) return <Text ta="center">—</Text>;
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              <span>
                {" "}
                N: {m.N} мг/кг {getTrendIcon(m.N, prev?.N)}{" "}
              </span>
              <span>
                {" "}
                P: {m.P} мг/кг {getTrendIcon(m.P, prev?.P)}{" "}
              </span>
              <span>
                {" "}
                K: {m.K} мг/кг {getTrendIcon(m.K, prev?.K)}{" "}
              </span>
            </div>
          );
        },
      },
      {
        id: "temperature",
        header: "C°",
        accessorFn: (row) => row.latest?.temperature,
        Cell: ({ row }) => {
          const cur = row.original.latest?.temperature,
            prev = row.original.previous?.temperature;
          return cur !== undefined ? (
            <span>
              {cur}° {getTrendIcon(cur, prev)}
            </span>
          ) : (
            <Text ta="center">—</Text>
          );
        },
      },
      {
        id: "humidity",
        header: "Влажность",
        accessorFn: (row) => row.latest?.humidity,
        Cell: ({ row }) => {
          const cur = row.original.latest?.humidity,
            prev = row.original.previous?.humidity;
          return cur !== undefined ? (
            <span>
              {cur}% {getTrendIcon(cur, prev)}
            </span>
          ) : (
            <Text ta="center">—</Text>
          );
        },
      },
      {
        id: "ph",
        header: "pH",
        accessorFn: (row) => row.latest?.ph,
        Cell: ({ row }) => {
          const cur = row.original.latest?.ph,
            prev = row.original.previous?.ph;
          return cur !== undefined ? (
            <span>
              {cur} {getTrendIcon(cur, prev)}
            </span>
          ) : (
            <Text ta="center">—</Text>
          );
        },
      },
      {
        id: "rainfall",
        header: "Осадки",
        accessorFn: (row) => row.latest?.rainfall,
        Cell: ({ row }) => {
          const cur = row.original.latest?.rainfall,
            prev = row.original.previous?.rainfall;
          return cur !== undefined ? (
            <span>
              {cur} мм {getTrendIcon(cur, prev)}
            </span>
          ) : (
            <Text ta="center">—</Text>
          );
        },
      },
      {
        id: "recommendation",
        header: "Реком.",
        accessorFn: (row) => row.latest,
        Cell: ({ row }) => getRecommendationBadges(row.original.latest),
      },
    ],
    []
  );

  return (
    <MantineReactTable
      columns={columns}
      data={rows}
      state={{ showProgressBars: isLoading }}
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
      enablePagination={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      mantineTableContainerProps={{
        style: { height: "calc(100vh - 140px)", overflow: "auto" },
      }}
      mantinePaperProps={{ withBorder: false, style: { height: "100%" } }}
      mantineTableProps={{
        highlightOnHover: true,
        striped: "even",
        withColumnBorders: false,
        withRowBorders: false,
      }}
      enableExpanding
      renderDetailPanel={({ row }) => {
        const all = row.original.allMeasurements ?? [];
        return (
          <div style={{ padding: 12, width: "100%" }}>
            <Text fw={600} mb={8} ta="center">
              Все измерения зоны «{row.original.zoneName}»
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
                    "Координаты",
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
                {all.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{ padding: 8, textAlign: "center" }}
                    >
                      Нет данных по измерениям
                    </td>
                  </tr>
                ) : (
                  all.map((m, idx) => (
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
                      <td style={{ padding: 6, textAlign: "center" }}>
                        {m.ph}
                      </td>
                      <td style={{ padding: 6, textAlign: "center" }}>
                        {m.rainfall}
                      </td>
                      <td style={{ padding: 6, textAlign: "center" }}>
                        {m.coords
                          ? `${m.coords.lat.toFixed(6)}, ${m.coords.lng.toFixed(
                              6
                            )}`
                          : "—"}
                      </td>
                      <td style={{ padding: 6 }}>
                        {getRecommendationBadges(m)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      }}
    />
  );
}
