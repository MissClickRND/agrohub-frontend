import {
  Accordion,
  Divider,
  Grid,
  Group,
  Loader,
  NumberFormatter,
  Stack,
  Text,
} from "@mantine/core";
import { useCalculate } from "../model/lib/hooks/useCalculate";
import { FC, useEffect } from "react";

interface IProps {
  area: number;
  title: string;
  cultureId: number;
}

export const CalculatedField: FC<IProps> = ({ area, title, cultureId }) => {
  const { data, mutate, isLoading, isError, error } = useCalculate({
    area: area / 10000,
    cultureId,
  });

  useEffect(() => {
    mutate();
  }, [area, cultureId]);
  return (
    <Accordion.Item value={title}>
      <Accordion.Control>
        <Group justify="space-between">
          <Group>
            <Text fz={"h4"} fw={"bold"}>
              {isError ? error : title}
            </Text>
            {!isError && !isLoading && data && (
              <Text c="neutral.3" fz={"h6"}>
                {data!.crop}
              </Text>
            )}
          </Group>
          {data && (
            <Text c={"green"}>
              <NumberFormatter
                color="green"
                thousandSeparator
                prefix="+ "
                suffix=" RUB"
                value={data.profit_rub}
              />
            </Text>
          )}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          "не удалось загрузить"
        ) : (
          data && (
            <Grid>
              <Grid.Col span={5}>
                <Stack>
                  <Group justify="space-between">
                    <Text>азот:</Text>
                    <Text c="red">
                      <NumberFormatter
                        prefix="- "
                        thousandSeparator
                        suffix=" RUB"
                        value={data!.costs.nitrogen_rub}
                      />
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>удобрение:</Text>
                    <Text c="red">
                      <NumberFormatter
                        thousandSeparator
                        prefix="- "
                        suffix=" RUB"
                        value={data!.costs.fertilizers_rub}
                      />
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>фосфор:</Text>
                    <Text c="red">
                      <NumberFormatter
                        prefix="- "
                        suffix=" RUB"
                        thousandSeparator
                        value={data!.costs.phosphorus_rub}
                      />
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>калий:</Text>
                    <Text c="red">
                      <NumberFormatter
                        prefix="- "
                        thousandSeparator
                        suffix=" RUB"
                        value={data!.costs.potassium_rub}
                      />
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>семена:</Text>
                    <Text c="red">
                      <NumberFormatter
                        prefix="- "
                        thousandSeparator
                        suffix=" RUB"
                        value={data!.costs.seeds_rub}
                      />
                    </Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={2} />
              <Grid.Col span={5}>
                <Stack>
                  <Group justify="space-between">
                    <Text>за 1 Га:</Text>
                    <Text c="green">
                      <NumberFormatter
                        prefix="+ "
                        thousandSeparator
                        suffix=" RUB"
                        value={data!.profit_per_ha_rub}
                      />
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Площадь:</Text>
                    <Text c="green">
                      <NumberFormatter
                        suffix=" Га"
                        thousandSeparator
                        value={data.area_ha.toFixed(2)}
                      />
                    </Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={12}>
                <Stack>
                  <Divider />
                  <Group justify="space-between">
                    <Text>Итог:</Text>{" "}
                    <Text c="red">
                      <NumberFormatter
                        prefix="- "
                        thousandSeparator
                        value={data.costs.total_rub}
                      />
                    </Text>{" "}
                    <Text c={"green"}>
                      <NumberFormatter
                        prefix="+ "
                        thousandSeparator
                        value={data.revenue_rub}
                      />
                    </Text>
                    <Text c={"green"}>
                      <NumberFormatter
                        suffix=" RUB"
                        prefix="= "
                        thousandSeparator
                        value={data.profit_rub}
                      />
                    </Text>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          )
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
};
