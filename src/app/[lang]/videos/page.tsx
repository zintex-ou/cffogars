import { notFound } from "next/navigation";
import { isLang, t as dict, fmtDate } from "@/lib/i18n";
import { seasonOf } from "@/content/videos";
import { getVideos } from "@/lib/veo";

export default async function Videos({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const list = await getVideos();
  const seasons = [...new Set(list.map((v) => v.season ?? seasonOf(v.date)))];
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.videosKicker}</div><h1 className="h-page">{t.videos}</h1></div>
      </div></section>
      <section className="wrap section">
        {list.length === 0 && <p style={{ color: "var(--muted)" }}>{t.noVideos}</p>}
        {seasons.map((sn) => (
          <div key={sn} style={{ marginBottom: 40 }}>
            <h2 className="h-sec rule" style={{ marginBottom: 18 }}>{t.season} {sn}</h2>
            <div className="vgrid">
              {list.filter((v) => (v.season ?? seasonOf(v.date)) === sn).map((v) => (
                <a key={v.url} className="vcard" href={v.url} target="_blank" rel="noopener">
                  <div className="th" style={v.thumb ? { backgroundImage: `url(${v.thumb})` } : undefined}><span className="btn-play"><span className="tri" /></span></div>
                  <div className="info"><b>{v.title}</b><span>{fmtDate(lang, v.date).long} · {t.watch} →</span></div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
