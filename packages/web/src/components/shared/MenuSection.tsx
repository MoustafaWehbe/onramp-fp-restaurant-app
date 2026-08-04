interface Menu {
    id: string;
    name: string;
}

interface MenusSectionProps {
    menus: Menu[];
    title?: string;
    description?: string;
}

const MenusSection = ({
    menus,
    title = "Explore Menus",
    description = "Discover the menus and selections available at this restaurant.",
}: MenusSectionProps) => {
    return (
        <section className="space-y-6">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-bold text">
                    {title}
                </h2>

                <p className="mt-2 text-muted-foreground">
                    {description}
                </p>
            </div>

            {menus.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            className="rounded-full border px-8 py-4 text-base font-semibold transition hover:bg-muted"
                        >
                            {menu.name}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border p-6 text-center">
                    <p className="text-muted-foreground">
                        Menus are not available yet.
                    </p>
                </div>
            )}
        </section>
    );
};

export default MenusSection;