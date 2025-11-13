import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import {
  IconCalculatorOff,
  IconCircuitGround,
  IconMessageChatbot,
  IconPlant,
  IconPolygon,
  IconSearch,
  IconTimeline,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";

function AgrohubSpotlight() {
  const navigate = useNavigate();

  const actions: SpotlightActionData[] = [
    {
      id: "main",
      label: "Главная",
      description: "Перейти на главную страницу",
      onClick: () => navigate("/"),
      leftSection: <IconTimeline size={24} stroke={1.5} />,
    },
    {
      id: "fields",
      label: "Поля",
      description: "Просмотр и управление полями",
      onClick: () => navigate("/fields"),
      leftSection: <IconPolygon size={24} stroke={1.5} />,
    },
    {
      id: "journals",
      label: "Журнал культур",
      description: "Работа с журналом культур",
      onClick: () => navigate("/journals"),
      leftSection: <IconPlant size={24} stroke={1.5} />,
    },
    {
      id: "calc",
      label: "Калькулятор",
      description: "Открыть калькулятор",
      onClick: () => navigate("/calc"),
      leftSection: <IconCalculatorOff size={24} stroke={1.5} />,
    },
    {
      id: "ground",
      label: "Состав почв",
      description: "Анализ состава почв",
      onClick: () => navigate("/ground"),
      leftSection: <IconCircuitGround size={24} stroke={1.5} />,
    },
    {
      id: "chat-ai",
      label: "Чат",
      description: "Чат с искусственным интеллектом",
      onClick: () => navigate("/chat-ai"),
      leftSection: <IconMessageChatbot size={24} stroke={1.5} />,
    },
  ];

  return (
    <Spotlight
      bd={20}
      radius={8}
      actions={actions}
      nothingFound="Ничего не найдено..."
      highlightQuery
      searchProps={{
        leftSection: <IconSearch size={20} stroke={1.5} />,
        placeholder: "Поиск...",
      }}
    />
  );
}

export default AgrohubSpotlight;
