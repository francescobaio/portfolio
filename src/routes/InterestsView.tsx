import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Lightbox from '../components/Lightbox';
import type { LightboxItem } from '../components/Lightbox';
import { interestsMain, travelPlaces } from '../data/profile';
import { toFileName } from '../lib/format';

const photos: LightboxItem[] = travelPlaces.flatMap((t) =>
    (t.photos ?? []).map((src) => ({
        src,
        thumb: src.replace(/\.webp$/, '-thumb.webp'),
        file: `IMG_${t.year}_${t.city.toLowerCase().replace(/\s+/g, '')}.jpg`,
        caption: `${t.city}, ${t.country} — ${t.year}`,
    }))
);

export default function InterestsView() {
    const [photoIndex, setPhotoIndex] = useState<number | null>(null);

    return (
        <div className="min-w-0">
            <PageHeader path={['interests']} command="ls" title="Interests" subtitle="What I love to do when I'm not training models." />

            {/* Main interests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {interestsMain.map((it, idx) => (
                    <section
                        key={it.title}
                        className="term-card rounded-xl p-3.5 sm:p-4 flex flex-col"
                        style={{ animationDelay: `${idx * 60}ms` }}
                    >
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="text-emerald-700 dark:text-emerald-400">$</span> cat {toFileName(it.title)}
                        </div>
                        <h2 className="mt-1 font-semibold text-lg">{it.title}</h2>
                        <ul className="mt-2 text-[13px] text-neutral-700 dark:text-neutral-300 space-y-1.5 flex-1">
                            {it.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0">▸</span>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                        {!!it.links.length && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {it.links.map((l) => (
                                    <a
                                        key={l.href}
                                        href={l.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm px-3 py-1.5 rounded-lg border border-emerald-400/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                                    >
                                        → {l.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {/* Travel */}
            <section className="mt-10">
                <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
                    <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="text-emerald-700 dark:text-emerald-400">$</span> ls ~/Pictures/travel/
                        </div>
                        <h2 className="mt-1 font-semibold text-lg">Travel</h2>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {travelPlaces.length} trips · <span className="sm:hidden">tap</span><span className="hidden sm:inline">click</span> to enlarge
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {photos.map((ph, i) => (
                        <button
                            key={ph.file}
                            type="button"
                            onClick={() => setPhotoIndex(i)}
                            className="group text-left term-card rounded-xl p-1.5 sm:p-2 min-w-0"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                                <img
                                    src={ph.thumb}
                                    alt={ph.caption}
                                    className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className="mt-1.5 sm:mt-2 px-1 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                                <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400 truncate">{ph.file}</span>
                                <span className="text-neutral-600 dark:text-neutral-400 truncate sm:shrink-0">{ph.caption.split(' — ')[0]}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <Lightbox items={photos} index={photoIndex} onChange={setPhotoIndex} />
        </div>
    );
}
