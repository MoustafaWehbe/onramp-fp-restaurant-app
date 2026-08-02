import { MOCK_SITE_STATS } from "@/data/mockRestaurants";
// TODO(api): replace MOCK_SITE_STATS with statsApi.getSummary() once the
// /stats/summary endpoint ships. Keep the SiteStat[] shape the same so no
// other change is needed here.

export function StatsBar() {
  const stats = MOCK_SITE_STATS;

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center sm:text-left">
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-primary">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
