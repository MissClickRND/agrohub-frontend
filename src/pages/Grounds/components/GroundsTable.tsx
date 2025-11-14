import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import dayjs from "dayjs";
import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
  IconTrash,
} from "@tabler/icons-react";
import classes from "../classes/GroundTable.module.css";
import { useGetGroundData } from "../../../features/grounds/model/lib/hooks/useGetGroundData";
import ModalAcceptAction from "../../../widgets/ModalAcceptAction/ModalAcceptAction";
import { useDisclosure } from "@mantine/hooks";
import { useDeleteGroundData } from "../../../features/grounds/model/lib/hooks/useDeleteGroundData";
import {
  useGetCultureLogs,
  type CultureLog,
} from "../../../features/GanttDiagram/model/lib/hooks/useGetCultureLogs";
import { useRecommendation } from "../../../features/recommendation/model/lib/hooks/useRecommendation";
import type { IRecommendationRequest } from "../../../features/recommendation/model/type";

// ---------- Типы твоей модели ----------
export type GeoPolygon =
  | { type: "Polygon"; coordinates: number[][][] } // [[[lng,lat], ...]]
  | { type: "MultiPolygon"; coordinates: number[][][][] }; //

export type Zone = {
  id?: number;
  name: string;
  color: string;
  geometry: GeoPolygon;
  soil?: string;
  area?: number;
};

export type Field = {
  id?: number;
  name: string;
  color: string;
  geometry: GeoPolygon;
  zones?: Zone[];
  soil?: string;
  area?: number;
};

// ---------- Типы ответа groundData ----------
type BackendPoint = { type: "Point"; coordinates: [number, number] }; // [lng, lat]
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

// ---------- Тип строки таблицы ----------
type ZoneRow = {
  zoneId: number;
  zoneName: string;
  color?: string;
  geometry?: GeoPolygon;
  // превью нуждается только в координатах точек
  measurePoints: Array<{ lng: number; lat: number }>;
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
    id: number;
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

type XY = { x: number; y: number };
type LngLat = { lng: number; lat: number };

// ---------- утилиты для мини-карты ----------
const extractRings = (
  geometry?: GeoPolygon
): Array<Array<[number, number]>> => {
  if (!geometry) return [];
  // @ts-ignore
  if (geometry.type === "Polygon") return geometry.coordinates || [];
  if (geometry.type === "MultiPolygon") {
    // @ts-ignore
    return (geometry.coordinates || []).flat();
  }
  return [];
};

const getBounds = (rings: Array<Array<[number, number]>>) => {
  if (!rings.length) return { minLng: 0, maxLng: 1, minLat: 0, maxLat: 1 };
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;
  rings.forEach((ring) => {
    ring.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
  });
  if (
    !isFinite(minLng) ||
    !isFinite(maxLng) ||
    !isFinite(minLat) ||
    !isFinite(maxLat)
  ) {
    return { minLng: 0, maxLng: 1, minLat: 0, maxLat: 1 };
  }

  if (minLng === maxLng) maxLng = minLng + 1e-6;
  if (minLat === maxLat) maxLat = minLat + 1e-6;
  return { minLng, maxLng, minLat, maxLat };
};

const project = (
  lng: number,
  lat: number,
  bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number },
  width: number,
  height: number,
  padding: number
): XY => {
  const scaleX = (width - 2 * padding) / (bounds.maxLng - bounds.minLng);
  const scaleY = (height - 2 * padding) / (bounds.maxLat - bounds.minLat);
  const scale = Math.min(scaleX, scaleY);
  const x = padding + (lng - bounds.minLng) * scale;
  const y = height - padding - (lat - bounds.minLat) * scale;
  return { x, y };
};

const MiniZonePreview = ({
  geometry,
  points,
  stroke = "#2f7e2f",
  fill = "rgba(46, 204, 113, 0.15)",
  width = 180,
  height = 120,
  padding = 8,
}: {
  geometry?: GeoPolygon;
  points: LngLat[];
  stroke?: string;
  fill?: string;
  width?: number;
  height?: number;
  padding?: number;
}) => {
  const rings = extractRings(geometry);
  const bounds = getBounds(rings);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg
        width={width}
        height={height}
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          background: "#fff",
        }}
      >
        {rings.map((ring, idx) => {
          const pts = ring.map(([lng, lat]) =>
            project(lng, lat, bounds, width, height, padding)
          );
          const d = pts.map((p) => `${p.x},${p.y}`).join(" ");
          return (
            <polygon
              key={`ring-${idx}`}
              points={d}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
            />
          );
        })}

        {points.map((p, idx) => {
          const { x, y } = project(
            p.lng,
            p.lat,
            bounds,
            width,
            height,
            padding
          );
          return (
            <circle key={`pt-${idx}`} cx={x} cy={y} r={3.5} fill="#e74c3c" />
          );
        })}
      </svg>
    </div>
  );
};

const getTrendIcon = (current?: number, previous?: number) => {
  if (current === undefined || previous === undefined) return null;
  if (current > previous)
    return <IconArrowUp size={14} color="green" style={{ marginLeft: 4 }} />;
  if (current < previous)
    return <IconArrowDown size={14} color="red" style={{ marginLeft: 4 }} />;
  return <IconMinus size={14} color="gray" style={{ marginLeft: 4 }} />;
};

const cropNameDict: Record<string, string> = {
  wheat: "Пшеница",
  barley: "Ячмень",
  corn: "Кукуруза",
  oat: "Овес",
  pea: "Горох",
  sunflower: "Подсолнечник",
  soybean: "Соя",
  potato: "Картофель",
  rapeseed: "Рапс",
  sugarbeet: "Сахарная свекла",
};

const normalizeCropKey = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, "");

const translateCropName = (name: string) => {
  const key = normalizeCropKey(name);
  return cropNameDict[key] ?? name;
};

const extractTopCrops = (resp: any): string[] => {
  if (!resp) return [];

  // на случай axios: resp.data
  const obj = resp.data ?? resp;

  if (Array.isArray(obj)) {
    // ответ вида ["Wheat", "Barley", ...]
    return obj as string[];
  }

  if (Array.isArray(obj.top_crops)) {
    // ответ вида { top_crops: [...] }
    return obj.top_crops as string[];
  }

  return [];
};

const normalizeRows = (
  selectedField?: Field,
  gd?: BackendField | null
): ZoneRow[] => {
  if (!selectedField?.zones?.length) return [];

  // карта замеров по zoneId
  const byZone = new Map<number, BackendGround[]>();
  if (gd?.zones?.length) {
    gd.zones.forEach((z) => {
      if (z?.id != null) byZone.set(z.id, z.grounds || []);
    });
  }

  return selectedField.zones.map<ZoneRow>((z) => {
    const zoneId = z.id ?? -1;
    const grounds = [...(byZone.get(zoneId) || [])].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
    const latest = grounds[0];
    const prev = grounds[1];

    const allMeasurements = grounds.map((g) => ({
      id: g.id,
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
    }));

    const measurePoints = grounds
      .map((g) =>
        g.location?.type === "Point"
          ? { lng: g.location.coordinates[0], lat: g.location.coordinates[1] }
          : null
      )
      .filter(Boolean) as LngLat[];

    return {
      zoneId,
      zoneName: z.name,
      color: z.color,
      geometry: z.geometry,
      measurePoints,
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
      allMeasurements,
    };
  });
};

export default function GroundsTable({
  fieldId,
  fields,
}: {
  fields: Field[];
  fieldId: number | undefined;
}) {
  const { deleteGroundData } = useDeleteGroundData();
  const { groundData, isLoading } = useGetGroundData(fieldId);

  const { cultureLogs } = useGetCultureLogs(fieldId);

  const { recommendAsync } = useRecommendation();

  const [rows, setRows] = useState<ZoneRow[]>([]);

  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  // модалка рекомендаций
  const [recModalOpened, { open: openRecModal, close: closeRecModal }] =
    useDisclosure(false);
  const [selectedZone, setSelectedZone] = useState<ZoneRow | null>(null);
  const [currentRecommendations, setCurrentRecommendations] = useState<
    string[] | null
  >(null);
  const [recError, setRecError] = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  const selectedField = useMemo(
    () => fields?.find((f) => f.id === fieldId),
    [fields, fieldId]
  );

  // нормализуем строки при изменении данных
  useEffect(() => {
    setRows(normalizeRows(selectedField, groundData as BackendField | null));
  }, [selectedField, groundData]);

  // считаем последнюю культуру и её длительность в месяцах
  const lastCropInfo = useMemo(() => {
    if (!cultureLogs || cultureLogs.length === 0) return null;

    const tasks = (cultureLogs as CultureLog[]).filter(
      (log) => log.type === "task" && log.start && log.end
    );
    if (!tasks.length) return null;

    const lastTask = tasks.reduce((acc, cur) =>
      dayjs(cur.end as string).isAfter(dayjs(acc.end as string)) ? cur : acc
    );

    const start = dayjs(lastTask.start as string);
    const end = dayjs(lastTask.end as string);

    const days = Math.max(0, end.diff(start, "day"));
    const months = Math.max(1, Math.round(days / 30));

    return {
      lastCropName: lastTask.text,
      lastCropDurationMonths: months,
    };
  }, [cultureLogs]);

  const handleDelete = async () => {
    if (toDeleteId == null) return;
    await deleteGroundData(toDeleteId);
    setToDeleteId(null);
    closeDeleteModal();
  };

  const handleOpenRecommendation = useCallback(
    async (row: ZoneRow) => {
      setSelectedZone(row);
      setCurrentRecommendations(null);
      setRecError(null);
      setRecLoading(false);
      openRecModal();

      if (!row.latest) {
        setRecError("Нет последних данных по почве для этой зоны.");
        return;
      }

      if (!lastCropInfo) {
        setRecError("Нет данных по последним культурам для этого поля.");
        return;
      }

      const m = row.latest;
      const body: IRecommendationRequest = {
        duration_months: 0, // по ТЗ всегда 0
        N: m.N,
        P: m.P,
        K: m.K,
        temperature: m.temperature,
        humidity: m.humidity,
        ph: m.ph,
        rainfall: m.rainfall,
        last_crop_duration: lastCropInfo.lastCropDurationMonths,
        last_crop: lastCropInfo.lastCropName,
      };

      try {
        setRecLoading(true);
        const resp = await recommendAsync(body);
        const crops = extractTopCrops(resp);
        setCurrentRecommendations(crops);
      } catch (e: any) {
        setRecError(e?.message || "Ошибка получения рекомендаций.");
      } finally {
        setRecLoading(false);
      }
    },
    [lastCropInfo, recommendAsync, openRecModal]
  );

  const columns = useMemo<MRT_ColumnDef<ZoneRow>[]>(
    () => [
      {
        id: "mini",
        header: "Миниатюра",
        accessorFn: (row) => row.geometry,
        Cell: ({ row }) => (
          <MiniZonePreview
            geometry={row.original.geometry}
            points={row.original.measurePoints}
            stroke={row.original.color || "#2f7e2f"}
            fill={
              (row.original.color && `${row.original.color}26`) ||
              "rgba(46, 204, 113, 0.15)"
            }
          />
        ),
      },
      {
        accessorKey: "zoneName",
        header: "Зона",
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
                N: {m.N} {getTrendIcon(m.N, prev?.N)}
              </span>
              <span>
                P: {m.P} {getTrendIcon(m.P, prev?.P)}
              </span>
              <span>
                K: {m.K} {getTrendIcon(m.K, prev?.K)}
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
        header: "Рекомендации",
        Cell: ({ row }) => (
          <Button
            variant="light"
            size="xs"
            onClick={() => handleOpenRecommendation(row.original)}
          >
            Посмотреть
          </Button>
        ),
      },
    ],
    [handleOpenRecommendation]
  );

  return (
    <>
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
              <MiniZonePreview
                geometry={row.original.geometry}
                points={row.original.measurePoints}
                stroke={row.original.color || "#2f7e2f"}
                fill={
                  (row.original.color && `${row.original.color}26`) ||
                  "rgba(46, 204, 113, 0.1)"
                }
                width={320}
                height={200}
                padding={10}
              />
              <table
                className={classes.MiniTable}
                style={{ width: "100%", marginTop: 12 }}
              >
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
                      "",
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
                        <td style={{ padding: 6, textAlign: "center" }}>
                          {m.N}
                        </td>
                        <td style={{ padding: 6, textAlign: "center" }}>
                          {m.P}
                        </td>
                        <td style={{ padding: 6, textAlign: "center" }}>
                          {m.K}
                        </td>
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
                            ? `${m.coords.lat.toFixed(
                                6
                              )}, ${m.coords.lng.toFixed(6)}`
                            : "—"}
                        </td>
                        <td style={{ padding: 6 }}>
                          <Flex justify="center">
                            <ActionIcon
                              color="red"
                              onClick={() => {
                                setToDeleteId(m.id);
                                openDeleteModal();
                              }}
                            >
                              <IconTrash />
                            </ActionIcon>
                          </Flex>
                          <ModalAcceptAction
                            text="Вы точно хотите удалить данные о почве?"
                            close={() => {
                              setToDeleteId(null);
                              closeDeleteModal();
                            }}
                            opened={deleteModalOpened}
                            onPass={handleDelete}
                          />
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

      {/* Модалка с рекомендациями */}
      <Modal
        opened={recModalOpened}
        onClose={() => {
          closeRecModal();
          setSelectedZone(null);
          setCurrentRecommendations(null);
          setRecError(null);
          setRecLoading(false);
        }}
        title="Рекомендации по культуре"
        centered
      >
        {!selectedZone ? (
          <Text>Зона не выбрана.</Text>
        ) : (
          <>
            <Text fw={600} mb="xs">
              Зона: {selectedZone.zoneName}
            </Text>

            {lastCropInfo && (
              <Text size="sm" c="dimmed" mb="sm">
                Последняя культура: {lastCropInfo.lastCropName} (
                {lastCropInfo.lastCropDurationMonths} мес.)
              </Text>
            )}

            {recError && (
              <Text c="red" mb="sm">
                {recError}
              </Text>
            )}

            {!recError && recLoading && (
              <Flex justify="center" my="md">
                <Loader />
              </Flex>
            )}

            {!recError &&
              !recLoading &&
              currentRecommendations &&
              (currentRecommendations.length ? (
                <Group gap={8} justify="flex-start" mt="sm">
                  {currentRecommendations.map((crop) => (
                    <Badge key={crop} variant="light">
                      {translateCropName(crop)}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text mt="sm">
                  По данным не удалось сформировать рекомендации.
                </Text>
              ))}
          </>
        )}
      </Modal>
    </>
  );
}
