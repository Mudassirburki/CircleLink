import { COLORS } from '../utils/theme';

export const storyData = [
    {
        id: 1,
        name: 'Mudassir',
        image: require('../assets/Mb.jpeg'),
    },
    {
        id: 2,
        name: 'Burki',
        image: require('../assets/avatar1.jpg'),
    },
    {
        id: 3,
        name: 'John Doe',
        image: require('../assets/avatar2.jpg'),
    },
    {
        id: 4,
        name: 'Jane Doe',
        image: require('../assets/avatar3.jpg'),
    },
]

export const postData = [
    {
        id: 1,
        user: {
            id: 1,
            name: "Mudassir",
            username: "burki",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop",
            verified: true,
        },
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?w=600&auto=format&fit=crop",
        caption: "Beautiful day at the beach! ☀️",
        likes: 1245,
        comments: 89,
        shares: 45,
        timeAgo: "2h ago",
        liked: false,
        saved: false,
        active: true,
    },
    {
        id: 2,
        user: {
            id: 2,
            name: "Sarah Smith",
            username: "sarahsmith",
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=600&auto=format&fit=crop",
            verified: false,
        },
        image: "https://images.unsplash.com/photo-1519681393784-d1ba02dd7694?w=600&auto=format&fit=crop",
        caption: "Coffee time ☕️ #morningvibes",
        likes: 890,
        comments: 123,
        shares: 23,
        timeAgo: "5h ago",
        liked: true,
        saved: false,
        active: false
    },
    {
        id: 3,
        user: {
            id: 3,
            name: "Mike Johnson",
            username: "mikej",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop",
            verified: true,
        },
        image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=600&auto=format&fit=crop",
        caption: "Exploring the city! 🏙️",
        likes: 2345,
        comments: 234,
        shares: 123,
        timeAgo: "1d ago",
        liked: false,
        saved: true,
    },
    {
        id: 4,
        user: {
            id: 4,
            name: "Emily Davis",
            username: "emilydavis",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop",
            verified: false,
        },
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
        caption: "Weekend getaway! 🌲",
        likes: 1567,
        comments: 189,
        shares: 78,
        timeAgo: "2d ago",
        liked: true,
        saved: true,
    },
];

export const USER_STATS = [
    {
        id: 1,
        label: "Posts",
        value: "100",
    },
    {
        id: 2,
        label: "Followers",
        value: "100",
    },
    {
        id: 3,
        label: "Following",
        value: "100",
    },
];

export const notificationData = [
    {
        id: 1,
        user: {
            id: 1,
            name: "Mudassir",
            username: "burki",
            avatar: require('../assets/Mb.jpeg'),
        },
        message: "liked your post",
        timeAgo: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        user: {
            id: 2,
            name: "Sarah Smith",
            username: "sarahsmith",
            avatar: require('../assets/avatar1.jpg'),
        },
        message: "liked your post",
        timeAgo: "2 hours ago",
        read: false,
    },
    {
        id: 3,
        user: {
            id: 3,
            name: "Mike Johnson",
            username: "mikej",
            avatar: require('../assets/avatar2.jpg'),
        },
        message: "liked your post",
        timeAgo: "2 hours ago",
        read: false,
    },
    {
        id: 4,
        user: {
            id: 4,
            name: "Emily Davis",
            username: "emilydavis",
            avatar: require('../assets/avatar3.jpg'),
        },
        message: "liked your post",
        timeAgo: "2 hours ago",
        read: false,
    },
]

export const exploreData = [
    {
        id: 1,
        image: require('../assets/Mb.jpeg'),
    },
    {
        id: 2,
        image: require('../assets/avatar1.jpg'),
    },
    {
        id: 3,
        image: require('../assets/avatar2.jpg'),
    },
    {
        id: 4,
        image: require('../assets/avatar3.jpg'),
    },

]

export const settingsData = [
    {
        id: '1',
        title: 'Edit Profile',
        subtitle: 'Update your profile information',
        icon: 'person-outline',
        type: 'chevron',
        route: 'EditProfile'
    },
    {
        id: '2',
        title: 'Push Notifications',
        subtitle: 'Control your notifications',
        icon: 'notifications-outline',
        type: 'toggle'
    },
    {
        id: '3',
        title: 'Dark Mode',
        subtitle: 'Toggle dark appearance',
        icon: 'moon-outline',
        type: 'toggle'
    },
    {
        id: '4',
        title: 'Help Center',
        subtitle: 'Get help and support',
        icon: 'help-circle-outline',
        type: 'chevron',
        route: 'HelpCenter'
    },
    {
        id: '5',
        title: 'Logout',
        subtitle: 'Sign out of your account',
        icon: 'log-out-outline',
        type: 'chevron',
        color: "red",
    }
]
