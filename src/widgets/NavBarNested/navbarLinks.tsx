import {
  IconCalculatorOff,
  IconCircuitGround,
  IconMessageChatbot,
  IconPlant,
  IconPolygon,
  IconTimeline,
} from "@tabler/icons-react";

const navbarLinks = [
  {
    label: "Главная",
    link: "/",
    icon: <IconTimeline />,
  },
  {
    label: "Поля",
    link: "/fields",
    icon: <IconPolygon />,
  },
  {
    label: "Журнал культур",
    link: "/journals",
    icon: <IconPlant />,
  },
  {
    label: "Калькулятор",
    link: "/calc",
    icon: <IconCalculatorOff />,
  },
  {
    label: "Состав почв",
    link: "/ground",
    icon: <IconCircuitGround />,
  },
  {
    label: "Чат",
    link: "/chat-ai",
    icon: <IconMessageChatbot />,
  },
];

export default navbarLinks;
