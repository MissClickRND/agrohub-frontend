//TODO: links to config routes file
import {
    IconCalculator, IconCalculatorOff,
    IconCarrot, IconChartBar,
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
        link: '/calc',
        icon: <IconCalculatorOff/>,
    },
    {
        label: 'Чат',
        link: '/chat-ai',
        icon: <IconMessageChatbot/>,
    },


];

export default navbarLinks;
