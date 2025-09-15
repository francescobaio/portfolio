import type { SocialLinks } from '../types';

const BASE = (import.meta as any).env?.BASE_URL ?? '/';

export const avatarUrl = `${BASE}avatar.jpg`;
export const cvUrl = `${BASE}cv/Francesco_Baiocchi_CV.pdf`;

export const social: SocialLinks = {
    github: 'https://github.com/francescobaio',
    linkedin: 'https://www.linkedin.com/in/francesco-baiocchi-1aa2a2276/',
    email: 'mailto:francesco.baiocchi16@gmail.com',
};

export const interestsMain = [
    {
        title: 'Cycling',
        bullets: [
            'Road cycling; long climbs and mountain views.',
            'Recent: 2,000 km this year; building consistent Zone 2.',
            'Goal: improve FTP and complete a Gran Fondo.',
        ],
        links: [{ label: 'Strava', href: 'https://www.strava.com/athletes/44438686' }],
    },
    {
        title: 'Chess',
        bullets: [
            'Daily tactics; rapid & blitz for pattern recognition.',
            'Openings I like: Greek attack (white), East Indian ideas (black).',
            'Dream: reach a FIDE title in this lifetime.',
        ],
        links: [{ label: 'Chess.com', href: 'https://www.chess.com/member/frappa2001' }],
    },
    {
        title: 'Travel & Photography',
        bullets: [
            'I love traveling and capturing moments on my iPhone.',
            'Mostly city strolls, landscapes and everyday scenes.',
            'Beginner: aiming to learn more about composition and light over the next few years.',
        ],
        links: [],
    }
];

export type TravelPlace = {
    id: string; city: string; country: string; year: number;
    photos?: string[];
};

export const travelPlaces: TravelPlace[] = [
    { id: 'santorini-2025', city: 'Santorini', country: 'Greece', year: 2025, photos: ['/travel/santorini.jpg'] },
    { id: 'london-2025', city: 'London', country: 'United Kingdom', year: 2025, photos: ['/travel/london.jpg'] },
    { id: 'cambridge-2025', city: 'Cambridge', country: 'United Kingdom', year: 2025, photos: ['/travel/cambridge.jpg'] },
    { id: 'newyork-2023', city: 'New York', country: 'United States', year: 2023, photos: ['/travel/newyork.jpg'] },
    { id: 'porto-2023', city: 'Porto', country: 'Portugal', year: 2023, photos: ['/travel/porto.jpg'] },
];

