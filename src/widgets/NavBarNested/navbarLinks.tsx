//TODO: links to config routes file
import {
    IconCalculator, IconCalculatorOff,
    IconCarrot, IconChartBar, IconCircuitGround,
    IconDashboard,
    IconHome,
    IconMessageChatbot,
    IconPlant,
    IconPolygon,
    IconRectangle, IconTimeline
} from "@tabler/icons-react";

const navbarLinks = [
    {
        label: 'Главная',
        link: '/main',
        icon: <IconTimeline />,
    },
    {
        label: 'Поля',
        link: '/fields',
        icon: <IconPolygon/>,
    },
    {
        label: 'Журнал культур',
        link: '/journals',
        icon: <IconPlant/>,
    },
    {
        label: 'Калькулятор',
        link: '/calculator',
        icon: <IconCalculatorOff/>,
    },
    {
        label: 'Состав почв',
        link: '/ground',
        icon: <IconCircuitGround/>,
    },
    {
        label: 'Чат',
        link: '/chat-ai',
        icon: <IconMessageChatbot/>,
    },


];

export default navbarLinks;
