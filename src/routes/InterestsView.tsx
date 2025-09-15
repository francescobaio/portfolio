import { interestsMain, travelPlaces } from '../data/profile';

export default function InterestsView() {
    return (
        <div className="min-w-0">
            {/* Header */}
            <div className="mb-4 md:mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Interests</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">What I love to do.</p>
                </div>
                <a href="#/" className="text-sm underline text-emerald-700 dark:text-emerald-400">
                    ← Back home
                </a>
            </div>

            {/* Main interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interestsMain.map((it, idx) => (
                    <section key={idx} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                        <h2 className="font-semibold">{it.title}</h2>
                        <ul className="mt-2 list-disc pl-5 text-[13px] text-neutral-700 dark:text-neutral-300 space-y-1.5">
                            {it.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                            ))}
                        </ul>
                        {!!it.links?.length && (
                            <div className="mt-3 flex gap-2">
                                {it.links.map((l, i) => (
                                    <a
                                        key={i}
                                        href={l.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm underline text-emerald-700 dark:text-emerald-400"
                                    >
                                        {l.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {/* Travel */}
            <section className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Travel</h2>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {travelPlaces.length} trips
                    </span>
                </div>

                {/* Travel list */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {travelPlaces.map((t) => {
                        const photo = t.photos?.[0];
                        return (
                            <div key={t.id} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">
                                        {t.city}, {t.country}
                                    </div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{t.year}</div>
                                </div>

                                {photo && (
                                    <div className="mt-2 relative rounded-md overflow-hidden aspect-[16/9]">
                                        <img
                                            src={photo}
                                            alt={`${t.city}, ${t.country} — ${t.year}`}
                                            className="absolute inset-0 w-full h-full object-cover object-center"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
