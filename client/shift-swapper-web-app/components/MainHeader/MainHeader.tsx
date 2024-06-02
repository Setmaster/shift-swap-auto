import { getCurrentUser } from "@/lib/actions/authActions";
import TopSection from './TopSection';
import TabsSection from './TabsSection';
import classes from './MainHeader.module.css';

// Define the interface for links
interface LinkItem {
    link: string;
    label: string;
    links?: LinkItem[];
}

// Define the links array
const links: LinkItem[] = [
    { link: '/contraptions', label: 'Contraptions' },
    { link: '/contraptions/share', label: 'Share' },
    { link: '/community', label: 'Community' },
    {
        link: '/about',
        label: 'About',
        links: [
            { link: '/faq', label: 'FAQ' },
            { link: '/contact', label: 'Contact' },
        ],
    },
];

export default async function MainHeader() {
    const user = await getCurrentUser();

    return (
        <div className={classes.header}>
            <TopSection user={user} links={links} />
            <TabsSection links={links} />
        </div>
    );
}
