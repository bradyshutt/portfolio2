
import { useLayout } from './LayoutContext';
import styles from './Navbar.module.css';
import { AiOutlineSmile, AiOutlineMenu } from "react-icons/ai";


export default function Navbar() {

    const { toggleSidebar } = useLayout();

    const onMenuClick = () => {
        toggleSidebar();
    };

    return (
        <div className={styles.navbar}>
            <div
                onClick={onMenuClick}
                className={styles.iconContainer}
            >
                <AiOutlineMenu size={30} />
            </div>

            <div className={styles.iconContainer}>
                <AiOutlineSmile size={30} />
            </div>
        </div>
    );

}