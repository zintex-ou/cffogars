export const LANGS = ["es", "ca", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";
export const isLang = (x: string): x is Lang => (LANGS as readonly string[]).includes(x);

type Tri = [string, string, string]; // es, ca, en
const IDX: Record<Lang, number> = { es: 0, ca: 1, en: 2 };

const D = {
  home: ["Inicio", "Inici", "Home"],
  history: ["Historia", "Història", "History"],
  team: ["Equipo", "Equip", "Team"],
  fixtures: ["Calendario", "Calendari", "Fixtures"],
  results: ["Resultados", "Resultats", "Results"],
  league: ["Liga", "Lliga", "League"],
  guestbook: ["Libro de visitas", "Llibre de visites", "Guestbook"],
  guestbookNav: ["Visitas", "Visites", "Guestbook"],
  videos: ["Vídeos", "Vídeos", "Videos"],
  videosKicker: ["Partidos grabados", "Partits gravats", "Match recordings"],
  watch: ["Ver el vídeo", "Veure el vídeo", "Watch video"],
  noVideos: ["Todavía no hay vídeos.", "Encara no hi ha vídeos.", "No videos yet."],
  latestVideo: ["Último vídeo", "Últim vídeo", "Latest video"],
  season: ["Temporada", "Temporada", "Season"],
  heroKicker: ["Liga Veteranos", "Lliga Veterans", "Veterans League"],
  group: ["Grupo", "Grup", "Group"],
  lastMatch: ["Último partido", "Últim partit", "Last match"],
  nextMatch: ["Próximo partido", "Proper partit", "Next match"],
  noNext: ["Pendiente de calendario", "Pendent de calendari", "To be scheduled"],
  md: ["Jornada", "Jornada", "Matchday"],
  final: ["Final", "Final", "Full time"],
  scorers: ["Goleadores", "Golejadors", "Scorers"],
  map: ["Ver en el mapa", "Veure al mapa", "View on map"],
  table: ["Clasificación", "Classificació", "League table"],
  pos: ["Pos", "Pos", "Pos"],
  teamCol: ["Equipo", "Equip", "Team"],
  P: ["PJ", "PJ", "P"], W: ["G", "G", "W"], Dr: ["E", "E", "D"], L: ["P", "P", "L"],
  GF: ["GF", "GF", "GF"], GA: ["GC", "GC", "GA"], GD: ["DG", "DG", "GD"], Pts: ["Pts", "Pts", "Pts"],
  form: ["Últimos 5", "Últims 5", "Last 5"],
  fW: ["V", "V", "W"], fD: ["E", "E", "D"], fL: ["D", "D", "L"],
  topScorers: ["Goleadores", "Golejadors", "Top scorers"],
  goals: ["goles", "gols", "goals"],
  fullTable: ["Clasificación completa", "Classificació completa", "Full table"],
  offTitle: ["Datos oficiales de la liga", "Dades oficials de la lliga", "Official league data"],
  offText: [
    "Calendario, actas, sanciones y estadísticas de todos los equipos en la web oficial de la competición.",
    "Calendari, actes, sancions i estadístiques de tots els equips al web oficial de la competició.",
    "Fixtures, match sheets, suspensions and statistics for every team on the competition's official site.",
  ],
  visit: ["Ir a la web de la liga", "Anar al web de la lliga", "Go to the league site"],
  mainSponsors: ["Patrocinadores principales", "Patrocinadors principals", "Main sponsors"],
  partners: ["Colaboradores", "Col·laboradors", "Partners"],
  sponsorPlaceholder: ["Tu empresa aquí", "La teva empresa aquí", "Your business here"],
  promo: ["Ascenso", "Ascens", "Promotion"],
  releg: ["Descenso", "Descens", "Relegation"],
  all: ["Todos", "Tots", "All"],
  homeG: ["Casa", "Casa", "Home"],
  away: ["Fuera", "Fora", "Away"],
  report: ["Acta del partido", "Acta del partit", "Match sheet"],
  first: ["Primera vuelta", "Primera volta", "First half"],
  second: ["Segunda vuelta", "Segona volta", "Second half"],
  squad: ["Plantilla", "Plantilla", "Squad"],
  staff: ["Cuerpo técnico y delegados", "Cos tècnic i delegats", "Staff & delegates"],
  stats: ["Estadísticas", "Estadístiques", "Statistics"],
  player: ["Jugador", "Jugador", "Player"],
  position: ["Posición", "Posició", "Position"],
  apps: ["PJ", "PJ", "Apps"],
  g: ["Goles", "Gols", "Goals"],
  a: ["Asist.", "Assist.", "Assists"],
  yc: ["TA", "TA", "YC"],
  rc: ["TR", "TR", "RC"],
  suspended: ["Sancionado", "Sancionat", "Suspended"],
  storyKicker: ["El club", "El club", "The club"],
  historyTitle: ["Nuestra historia", "La nostra història", "Our story"],
  timeline: ["Cronología", "Cronologia", "Timeline"],
  palmares: ["Palmarés", "Palmarès", "Honours"],
  followUs: ["Síguenos", "Segueix-nos", "Follow us"],
  contact: ["Contacto", "Contacte", "Contact"],
  officialFooter: ["Datos oficiales de la liga", "Dades oficials de la lliga", "Official league data"],
  win: ["Victoria", "Victòria", "Win"], draw: ["Empate", "Empat", "Draw"], loss: ["Derrota", "Derrota", "Loss"],
  wins: ["Victorias", "Victòries", "Wins"], draws: ["Empates", "Empats", "Draws"], losses: ["Derrotas", "Derrotes", "Losses"],
  postponed: ["Aplazado", "Ajornat", "Postponed"],
  tbd: ["Hora por confirmar", "Hora per confirmar", "Time TBC"],
  noData: ["No se han podido cargar los datos de la liga. Vuelve a intentarlo en unos minutos.", "No s'han pogut carregar les dades de la lliga. Torna-ho a provar d'aquí a uns minuts.", "League data could not be loaded. Please try again in a few minutes."],
  updated: ["Actualizado", "Actualitzat", "Updated"],
  founded: ["Fundación", "Fundació", "Founded"],
  ground: ["Campo", "Camp", "Ground"],
  colors: ["Colores", "Colors", "Colours"],
  record: ["Balance", "Balanç", "Record"],
  points: ["puntos", "punts", "points"],
  contactTitle: ["Contacto", "Contacte", "Contact"],
  contactKicker: ["Patrocinio, colaboración, prensa", "Patrocini, col·laboració, premsa", "Sponsorship, partnership, press"],
  contactIntro: ["¿Quieres patrocinar al equipo o colaborar con el club? Escríbenos y te respondemos.", "Vols patrocinar l'equip o col·laborar amb el club? Escriu-nos i et responem.", "Want to sponsor the team or work with the club? Write to us and we'll get back to you."],
  contactEmail: ["Correo electrónico", "Correu electrònic", "Email"],
  contactSend: ["Enviar", "Enviar", "Send"],
  contactThanks: ["¡Gracias! Hemos recibido tu mensaje.", "Gràcies! Hem rebut el teu missatge.", "Thanks! We've received your message."],
  sponsorCta: ["Patrocina al equipo", "Patrocina l'equip", "Sponsor the team"],
  staffRoles: ["", "", ""],
  seasonsTitle: ["Temporadas", "Temporades", "Seasons"],
  seasonCol: ["Temporada", "Temporada", "Season"],
  posCol: ["Pos.", "Pos.", "Pos."],
  total: ["Total", "Total", "Total"],
  current: ["en curso", "en curs", "ongoing"],
  // guestbook
  gbTitle: ["Libro de visitas", "Llibre de visites", "Guestbook"],
  gbKicker: ["Deja tu mensaje", "Deixa el teu missatge", "Leave a message"],
  gbIntro: ["Aficionados, rivales, antiguos jugadores: dejad vuestro saludo.", "Aficionats, rivals, antics jugadors: deixeu la vostra salutació.", "Fans, rivals, former players: leave us a note."],
  gbName: ["Nombre", "Nom", "Name"],
  gbMessage: ["Mensaje", "Missatge", "Message"],
  gbCaptcha: ["Comprobación antispam", "Comprovació antispam", "Anti-spam check"],
  gbCaptchaHelp: ["¿Cuánto es", "Quant és", "What is"],
  gbSend: ["Publicar", "Publicar", "Post"],
  gbSending: ["Enviando…", "Enviant…", "Sending…"],
  gbThanks: ["¡Gracias! Tu mensaje ya está publicado.", "Gràcies! El teu missatge ja és publicat.", "Thanks! Your message is now published."],
  gbEmpty: ["Todavía no hay mensajes. ¡Sé el primero!", "Encara no hi ha missatges. Sigues el primer!", "No messages yet. Be the first!"],
  gbErrCaptcha: ["Respuesta incorrecta. Inténtalo de nuevo.", "Resposta incorrecta. Torna-ho a provar.", "Wrong answer. Please try again."],
  gbErrRate: ["Demasiados mensajes seguidos. Espera un momento.", "Massa missatges seguits. Espera un moment.", "Too many messages in a row. Please wait a moment."],
  gbErrInvalid: ["Revisa el nombre y el mensaje.", "Revisa el nom i el missatge.", "Please check the name and the message."],
  gbErrGeneric: ["No se ha podido publicar. Inténtalo más tarde.", "No s'ha pogut publicar. Torna-ho a provar més tard.", "Could not publish. Please try later."],
  gbLogin: ["Entrar", "Entrar", "Log in"],
  gbRegister: ["Crear cuenta", "Crear compte", "Create account"],
  gbLogout: ["Salir", "Sortir", "Log out"],
  gbNick: ["Apodo", "Sobrenom", "Nickname"],
  gbPass: ["Contraseña", "Contrasenya", "Password"],
  gbAccountHint: ["Jugadores: cread una cuenta para que se vea quién escribe. Los invitados pueden escribir sin registrarse.", "Jugadors: creeu un compte perquè es vegi qui escriu. Els convidats poden escriure sense registrar-se.", "Players: create an account so everyone can see who's writing. Guests can post without registering."],
  gbSignedAs: ["Escribes como", "Escrius com a", "Posting as"],
  gbGuest: ["Invitado", "Convidat", "Guest"],
  gbErrNick: ["Apodo: 2–24 letras o cifras.", "Sobrenom: 2–24 lletres o xifres.", "Nickname: 2–24 letters or digits."],
  gbErrPass: ["Contraseña: mínimo 6 caracteres.", "Contrasenya: mínim 6 caràcters.", "Password: at least 6 characters."],
  gbErrTaken: ["Este apodo ya existe.", "Aquest sobrenom ja existeix.", "That nickname is taken."],
  gbErrLogin: ["Apodo o contraseña incorrectos.", "Sobrenom o contrasenya incorrectes.", "Wrong nickname or password."],
  gbNewCaptcha: ["Otra pregunta", "Una altra pregunta", "Another question"],
} satisfies Record<string, Tri>;

export type Dict = { [K in keyof typeof D]: string };

export function t(lang: Lang): Dict {
  const i = IDX[lang];
  const out = {} as Dict;
  for (const k in D) out[k as keyof Dict] = D[k as keyof typeof D][i];
  return out;
}

const POS: Record<string, Tri> = {
  POR: ["Portero", "Porter", "Goalkeeper"],
  DEF: ["Defensa", "Defensa", "Defender"],
  MIG: ["Centrocampista", "Migcampista", "Midfielder"],
  DAV: ["Delantero", "Davanter", "Forward"],
};
const ROLES: Record<string, Tri> = { delegat: ["Delegado", "Delegat", "Delegate"], entrenador: ["Entrenador", "Entrenador", "Head coach"], president: ["Presidente", "President", "President"], director: ["Director deportivo", "Director esportiu", "Sporting director"], segon: ["Segundo entrenador", "Segon entrenador", "Assistant coach"], fisio: ["Fisioterapeuta", "Fisioterapeuta", "Physio"] };
export const roleLabel = (lang: Lang, r: string) => ROLES[r.toLowerCase()]?.[IDX[lang]] ?? r;
export const POS_ORDER = ["POR", "DEF", "MIG", "DAV"];
export const posLabel = (lang: Lang, p: string) => POS[p]?.[IDX[lang]] ?? p;

const DAYS: Tri[] = [
  ["Domingo", "Diumenge", "Sunday"], ["Lunes", "Dilluns", "Monday"], ["Martes", "Dimarts", "Tuesday"], ["Miércoles", "Dimecres", "Wednesday"],
  ["Jueves", "Dijous", "Thursday"], ["Viernes", "Divendres", "Friday"], ["Sábado", "Dissabte", "Saturday"],
];
const MONTHS: Tri[] = [
  ["enero", "gener", "January"], ["febrero", "febrer", "February"], ["marzo", "març", "March"], ["abril", "abril", "April"], ["mayo", "maig", "May"], ["junio", "juny", "June"],
  ["julio", "juliol", "July"], ["agosto", "agost", "August"], ["septiembre", "setembre", "September"], ["octubre", "octubre", "October"], ["noviembre", "novembre", "November"], ["diciembre", "desembre", "December"],
];

/** "2026-10-31" → { day: "Dissabte", short: "31/10/2026", dayMonth: "31/10", long: "31 d'octubre de 2026" } */
export function fmtDate(lang: Lang, iso: string | null | undefined) {
  if (!iso) return { day: "", short: "", dayMonth: "", long: "" };
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const i = IDX[lang];
  const mon = MONTHS[m - 1][i];
  const dd = String(d).padStart(2, "0"), mm = String(m).padStart(2, "0");
  const long = lang === "en" ? `${d} ${mon} ${y}` : lang === "ca" ? `${d} ${/^[aeiou]/i.test(mon) ? "d'" : "de "}${mon} de ${y}` : `${d} de ${mon} de ${y}`;
  return { day: DAYS[dt.getUTCDay()][i], short: `${dd}/${mm}/${y}`, dayMonth: `${dd}/${mm}`, long };
}

export const ordinal = (lang: Lang, n: number) =>
  lang === "en" ? `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}` : lang === "ca" ? `${n}${n === 1 ? "r" : n === 2 ? "n" : n === 3 ? "r" : n === 4 ? "t" : "è"}` : `${n}º`;
