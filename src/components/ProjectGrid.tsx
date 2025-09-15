import type { Project } from '../types';
import ProjectCard from './ProjectCard';

type Props = {
    items: Project[];
    selectedId?: string | null;
    onOpen?: (id: string) => void;
    cols?: string;
};

export default function ProjectGrid({ items, selectedId, onOpen, cols = 'grid-cols-1' }: Props) {
    return (
        <div className={`grid ${cols} gap-3`}>
            {items.map((p) => (
                <ProjectCard key={p.id} p={p} active={selectedId === p.id} onOpen={onOpen} />
            ))}
        </div>
    );
}
