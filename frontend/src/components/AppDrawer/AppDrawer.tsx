
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarGroupContent,
//     SidebarGroupLabel,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
// } from '@/components/ui/sidebar';

import { useDisclosure } from '@mantine/hooks';
import { AiOutlineSmile, AiTwotoneHome } from 'react-icons/ai';
import styles from './AppDrawer.module.scss';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { useLayout } from '../LayoutContext';


export function AppDrawer() {

    const { closeSidebar } = useLayout()
    const navigate = useNavigate();
    const location = useLocation();

    // TODO: Type this
    // Menu items
    const navItems = [
        {
            title: "Home",
            url: "/",
            icon: AiTwotoneHome,
        },
        {
            title: "ConvoBot",
            url: "/convo-bot",
            icon: AiOutlineSmile,
        },
    ]

    function onClickRoute(item) {
        console.log('item', item);
        closeSidebar();
        setTimeout(() => {
            navigate(item.url);
        }, 100); 
    }

    return (

        <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
                <h1>workingonit</h1>
            </div>
            <div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.url;

                    return (
                        <div
                            key={item.title}
                            className={[
                                isActive ? styles.isActive : '',
                                styles.navLink
                            ].join(' ')}
                            onClick={() => onClickRoute(item)}
                        >
                            <div className={styles.navIconContainer}>
                                <item.icon />
                            </div>
                            {item.title}
                        </div>
                )})}
            </div>
        </div>

    )
}