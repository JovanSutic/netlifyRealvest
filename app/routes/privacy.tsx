import { json, LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { getParamValue, isMobile } from "../utils/params";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translate = new Translator("homepage");
  return [
    { title: translate.getTranslation(lang, "homeMetaTitle") },
    {
      name: "description",
      content: translate.getTranslation(lang, "homeMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

const Privacy = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "sr";

  return (
    <div className="w-full px-2 md:px-4 lg:px-6 my-8">
      <div>
        {lang === "sr" ? (
          <div className="w-full lg:w-[900px] lg:mx-auto">
            <div className="tab-content translations-content-item en visible">
              <h1 className="text-center font-bold text-2xl md:text-3xl">
                Politika privatnosti
              </h1>
              <p className="text-center font-regular text-lg md:text-xl">
                Poslednje ažuriranje: 25. septembar 2024.
              </p>
              <section className="mt-4">
                <h2 className="font-bold text-lg md:text-xl">Uvod</h2>
                <p className="font-regular text-md md:text-lg mt-2">
                  Ova Politika privatnosti opisuje naše politike i procedure o
                  prikupljanju, korišćenju i otkrivanju vaših informacija kada
                  koristite uslugu i govori vam o vašim pravima na privatnost i
                  kako vas zakon štiti.
                </p>
              </section>
              <section className="mt-4">
                <h2 className="font-bold text-lg md:text-xl">
                  Korišćenje vaših ličnih podataka
                </h2>
                <p className="font-regular text-md md:text-lg mt-2">
                  Koristimo vaše lične podatke da bismo pružili i poboljšali
                  uslugu. Korišćenjem usluge, slažete se sa prikupljanjem i
                  korišćenjem informacija u skladu sa ovom Politikom
                  privatnosti. Ova Politika privatnosti je kreirana uz pomoć
                  {" "}
                  <a
                    href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Besplatnog generatora politike privatnosti
                  </a>
                  .
                </p>
              </section>

              <h2 className="text-lg md:text-xl font-bold mt-4">
                Tumačenje i definicije
              </h2>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Tumačenje
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Reči čije je prvo slovo veliko imaju značenja definisana pod
                sledećim uslovima. Sledeće definicije će imati isto značenje bez
                obzira na to da li se pojavljuju u jednini ili u množini.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Definicije
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                U svrhu ove Politike privatnosti:
              </p>

              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Račun</strong> znači jedinstveni račun kreiran za
                    vas kako biste pristupili našoj usluzi ili delovima naše
                    usluge.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Affiliate</strong> znači entitet koji kontroliše,
                    kojim se kontroliše ili je pod zajedničkom kontrolom sa
                    stranom, gde "kontrola" znači vlasništvo od 50% ili više
                    akcija, vlasničkog interesa ili drugih hartija od vrednosti
                    koje imaju pravo glasa na izborima direktora ili drugog
                    upravljačkog organa.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Kompanija</strong> (nazivana i kao "Kompanija",
                    "Mi", "Nas" ili "Naša" u ovom Ugovoru) se odnosi na
                    Realvest, Rezveltova 44, 11000, Beograd.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Kolčići</strong> su male datoteke koje se smeštaju
                    na vaš računar, mobilni uređaj ili neki drugi uređaj od
                    strane veb sajta, koje sadrže detalje o vašoj istoriji
                    pretraživanja na tom veb sajtu među mnogim drugim
                    upotrebama.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Država</strong> se odnosi na: Srbija
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Uređaj</strong> znači bilo koji uređaj koji može
                    pristupiti usluzi, kao što su računar, mobilni telefon ili
                    digitalni tablet.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Lični podaci</strong> su sve informacije koje se
                    odnose na identifikovanu ili identifikabilnu osobu.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Usluga</strong> se odnosi na Veb sajt.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Provajder usluga</strong> znači bilo koja fizička
                    ili pravna osoba koja obrađuje podatke u ime Kompanije.
                    Odnosi se na treće strane ili pojedince zaposlene od strane
                    Kompanije kako bi olakšali Uslugu, pružili Uslugu u ime
                    Kompanije, izvršavali usluge povezane sa Uslugom ili
                    pomagali Kompaniji u analizi načina na koji se Usluga
                    koristi.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Podaci o korišćenju</strong> se odnose na podatke
                    prikupljene automatski, bilo generisane korišćenjem Usluge
                    ili iz same infrastrukture Usluge (na primer, trajanje
                    posete stranici).
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Veb sajt</strong> se odnosi na Realvest, dostupan na{" "}
                    <a
                      href="www.yourealvest.com"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      www.yourealvest.com
                    </a>
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Vi</strong> označava osobu koja pristupa ili koristi
                    Uslugu, ili kompaniju ili drugu pravnu osobu u ime koje
                    takva osoba pristupa ili koristi Uslugu, po potrebi.
                  </p>
                </li>
              </ul>

              <h2 className="text-lg md:text-xl font-bold mt-4">
                Prikupljanje i korišćenje vaših ličnih podataka
              </h2>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Tipovi prikupljenih podataka
              </h3>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                Lični podaci
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Dok koristite našu uslugu, možemo vas zamoliti da nam pružite
                određene lično prepoznatljive informacije koje se mogu koristiti
                za kontaktiranje ili identifikaciju vas. Lično prepoznatljive
                informacije mogu uključivati, ali nisu ograničene na:
              </p>
              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Adresa e-pošte
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Podaci o korišćenju
                  </p>
                </li>
              </ul>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                Podaci o korišćenju
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Podaci o korišćenju se automatski prikupljaju prilikom
                korišćenja usluge.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Podaci o korišćenju mogu uključivati informacije kao što su
                Internet protokol adresa vašeg uređaja (npr. IP adresa), tip
                pretraživača, verzija pretraživača, stranice naše usluge koje
                posetite, vreme i datum vaše posete, vreme provedeno na tim
                stranicama, jedinstveni identifikatori uređaja i drugi
                dijagnostički podaci.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Kada pristupate usluzi putem mobilnog uređaja, možemo automatski
                prikupljati određene informacije, uključujući, ali ne
                ograničavajući se na, tip mobilnog uređaja koji koristite,
                jedinstveni ID vašeg mobilnog uređaja, IP adresu vašeg mobilnog
                uređaja, vaš mobilni operativni sistem, tip mobilnog internet
                pretraživača koji koristite, jedinstvene identifikatore uređaja
                i druge dijagnostičke podatke.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Takođe možemo prikupljati informacije koje vaš pretraživač šalje
                svaki put kada posetite našu uslugu ili kada pristupite usluzi
                putem mobilnog uređaja.
              </p>

              <h4 className="text-lg md:text-xl font-semibold mt-2">
                Tehnologije praćenja i kolačići
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Koristimo kolačiće i slične tehnologije praćenja da bismo
                pratili aktivnost na našoj usluzi i čuvali određene informacije.
                Tehnologije praćenja koje koristimo su signali, oznake i skripte
                za prikupljanje i praćenje informacija i za poboljšanje i
                analizu naše usluge. Tehnologije koje koristimo mogu
                uključivati:
              </p>
              <ul>
                <li>
                  <strong>Kolačići ili kolačići pretraživača.</strong> Kolačić
                  je mala datoteka koja se smešta na vaš uređaj. Možete uputiti
                  vaš pretraživač da odbije sve kolačiće ili da vas obavesti
                  kada se kolačić šalje. Međutim, ako ne prihvatite kolačiće,
                  možda nećete moći da koristite neke delove naše usluge. Osim
                  ako niste prilagodili podešavanja pretraživača tako da odbije
                  kolačiće, naša usluga može koristiti kolačiće.
                </li>
                <li>
                  <strong>Web signali.</strong> Određeni delovi naše usluge i
                  naši e-mailovi mogu sadržati male elektronske datoteke poznate
                  kao web signali (takođe se nazivaju i jasni gifovi, piksel
                  oznake i jednopikselni gifovi) koji omogućavaju kompaniji, na
                  primer, da broji korisnike koji su posetili te stranice ili
                  otvorili e-mail i za druge povezane statistike veb sajta (na
                  primer, beleženje popularnosti određenog dela i proveru
                  integriteta sistema i servera).
                </li>
              </ul>
              <p className="font-regular text-md md:text-lg mt-4">
                Kolačići mogu biti „postojani“ ili „sesijski“ kolačići.
                Postojani kolačići ostaju na vašem računaru ili mobilnom uređaju
                kada ste van mreže, dok se sesijski kolačići brišu čim zatvorite
                veb pretraživač. Saznajte više o kolačićima na{" "}
                <a
                  href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking"
                  target="_blank"
                  rel="noreferrer"
                >
                  sajtu Free Privacy Policy
                </a>{" "}
                članku.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Koristimo i sesijske i postojane kolačiće u svrhe navedene u
                nastavku:
              </p>

              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Neophodni / Osnovni kolačići</strong>
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Tip: Sesijski kolačići
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Upravljani od strane: Nas
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Svrha: Ovi kolačići su neophodni za pružanje usluga
                    dostupnih putem Veb sajta i omogućavaju vam da koristite
                    neke od njegovih funkcija. Pomažu u autentifikaciji
                    korisnika i sprečavaju prevarantsku upotrebu korisničkih
                    naloga. Bez ovih kolačića, usluge koje ste tražili ne mogu
                    biti pružene, a mi koristimo ove kolačiće samo za pružanje
                    tih usluga.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>
                      Politika kolačića / Kolačići za prihvatanje obaveštenja
                    </strong>
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Tip: Postojani kolačići
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Upravljani od strane: Nas
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Svrha: Ovi kolačići identifikuju da li su korisnici
                    prihvatili korišćenje kolačića na Veb sajtu.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Kolačići funkcionalnosti</strong>
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Tip: Postojani kolačići
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Upravljani od strane: Nas
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Svrha: Ovi kolačići nam omogućavaju da zapamtimo izbore koje
                    napravite kada koristite Veb sajt, kao što su podaci za
                    prijavu ili jezik koji ste odabrali. Svrha ovih kolačića je
                    da vam pružimo ličnije iskustvo i da izbegnemo ponovni unos
                    vaših preferencija svaki put kada koristite Veb sajt.
                  </p>
                </li>
              </ul>

              <p className="font-regular text-md md:text-lg mt-4">
                Za više informacija o kolačićima koje koristimo i vašim izborima
                u vezi sa kolačićima, molimo vas da posetite našu Politiku
                kolačića ili odeljak o kolačićima u našoj Politici privatnosti.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Korišćenje vaših ličnih podataka
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Kompanija može koristiti lične podatke u sledeće svrhe:
              </p>
              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Za pružanje i održavanje naše usluge</strong>,
                    uključujući praćenje korišćenja naše usluge.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Za upravljanje vašim nalogom:</strong> za
                    upravljanje vašom registracijom kao korisnika usluge. Lični
                    podaci koje pružate mogu vam omogućiti pristup različitim
                    funkcionalnostima usluge koje su dostupne kao registrovanom
                    korisniku.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Za izvršenje ugovora:</strong> razvoj, usklađenost i
                    preuzimanje kupovnog ugovora za proizvode, stavke ili usluge
                    koje ste kupili ili bilo koji drugi ugovor sa nama putem
                    usluge.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Da bismo vas kontaktirali:</strong> Da vas
                    kontaktiramo putem e-pošte, telefonskih poziva, SMS poruka
                    ili drugih ekvivalentnih formi elektronske komunikacije, kao
                    što su obaveštenja mobilne aplikacije o ažuriranjima ili
                    informativne komunikacije u vezi sa funkcionalnostima,
                    proizvodima ili ugovorenim uslugama, uključujući sigurnosna
                    ažuriranja, kada je to potrebno ili razumno za njihovu
                    implementaciju.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Da vam pružimo</strong> vesti, posebne ponude i
                    opšte informacije o drugim dobrima, uslugama i događajima
                    koje nudimo, a koji su slični onima koje ste već kupili ili
                    pitali, osim ako niste odabrali da ne primate takve
                    informacije.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Za upravljanje vašim zahtevima:</strong> Da bismo
                    obradili i upravljali vašim zahtevima prema nama.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Za poslovne transfere:</strong> Možemo koristiti
                    vaše informacije za procenu ili sprovođenje spajanja,
                    razdvajanja, restrukturiranja, reorganizacije, likvidacije
                    ili druge prodaje ili prenosa dela ili svih naših sredstava,
                    bilo kao deo poslovanja ili kao deo stečaja, likvidacije ili
                    sličnog postupka, u kojem su lični podaci koje imamo o našim
                    korisnicima usluga deo prenetih sredstava.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Za druge svrhe:</strong> Možemo koristiti vaše
                    informacije za druge svrhe, kao što su analiza podataka,
                    identifikacija trendova korišćenja, utvrđivanje efikasnosti
                    naših promotivnih kampanja i evaluacija i poboljšanje naše
                    usluge, proizvoda, usluga, marketinga i vašeg iskustva.
                  </p>
                </li>
              </ul>

              <p className="font-regular text-md md:text-lg mt-4">
                Možemo deliti vaše lične informacije u sledećim situacijama:
              </p>
              <ul>
                <li>
                  <strong>Sa pružateljima usluga:</strong> Možemo deliti vaše
                  lične informacije sa pružateljima usluga kako bismo pratili i
                  analizirali korišćenje naše usluge, kao i da bismo vas
                  kontaktirali.
                </li>
                <li>
                  <strong>Za poslovne transfere:</strong> Možemo deliti ili
                  prenositi vaše lične informacije u vezi sa, ili tokom
                  pregovora o, bilo kojem spajanju, prodaji imovine kompanije,
                  finansiranju ili akviziciji celokupnog ili dela našeg
                  poslovanja drugoj kompaniji.
                </li>
                <li>
                  <strong>Sa povezanima:</strong> Možemo deliti vaše informacije
                  sa našim povezanim kompanijama, u kojem slučaju ćemo od tih
                  kompanija zahtevati da poštuju ovu Politiku privatnosti.
                  Povezane kompanije uključuju našu matičnu kompaniju i bilo
                  koje druge filijale, partnere u zajedničkom ulaganju ili druge
                  kompanije koje kontrolisemo ili koje su pod zajedničkom
                  kontrolom sa nama.
                </li>
                <li>
                  <strong>Sa poslovnim partnerima:</strong> Možemo deliti vaše
                  informacije sa našim poslovnim partnerima kako bismo vam
                  ponudili određene proizvode, usluge ili promocije.
                </li>
                <li>
                  <strong>Sa drugim korisnicima:</strong> kada delite lične
                  informacije ili na drugi način komunicirate u javnim oblastima
                  sa drugim korisnicima, takve informacije mogu videti svi
                  korisnici i mogu biti javno distribuirane.
                </li>
                <li>
                  <strong>Sa vašim pristankom:</strong> Možemo otkriti vaše
                  lične informacije u bilo koju drugu svrhu uz vaš pristanak.
                </li>
              </ul>

              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Zadržavanje vaših ličnih podataka
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Kompanija će zadržati vaše lične podatke samo onoliko dugo
                koliko je potrebno za svrhe navedene u ovoj Politici
                privatnosti. Zadržaćemo i koristiti vaše lične podatke u meri
                koja je potrebna da bismo ispunili naše pravne obaveze (na
                primer, ako smo obavezani da zadržimo vaše podatke u skladu sa
                važećim zakonima), rešavali sporove i sprovodili naše pravne
                ugovore i politike.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Kompanija će takođe zadržati podatke o korišćenju za interne
                analize. Podaci o korišćenju se obično zadržavaju kraće vreme,
                osim kada se ti podaci koriste za jačanje bezbednosti ili
                poboljšanje funkcionalnosti naše usluge, ili kada smo zakonski
                obavezani da zadržimo te podatke duže vreme.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Prenos vaših ličnih podataka
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Vaše informacije, uključujući lične podatke, obrađuju se u
                operativnim kancelarijama kompanije i na bilo kojim drugim
                mestima gde se strane uključene u obradu nalaze. To znači da se
                ove informacije mogu preneti na — i čuvati na — računarima koji
                se nalaze izvan vaše države, pokrajine, zemlje ili druge vladine
                jurisdikcije gde zakoni o zaštiti podataka mogu biti drugačiji
                od onih u vašoj jurisdikciji.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Vaš pristanak na ovu Politiku privatnosti, nakon što dostavite
                takve informacije, predstavlja vašu saglasnost za taj prenos.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Kompanija će preduzeti sve razumne korake kako bi osigurala da
                se vaši podaci tretiraju sigurno i u skladu s ovom Politikom
                privatnosti, i nijedan prenos vaših ličnih podataka neće se
                obaviti ka organizaciji ili zemlji osim ako su postavljene
                adekvatne kontrole, uključujući bezbednost vaših podataka i
                drugih ličnih informacija.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Brisanje vaših ličnih podataka
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Imate pravo da obrišete ili zatražite da vam pomognemo u
                brisanju ličnih podataka koje smo prikupili o vama.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Naša usluga vam može omogućiti da izbrišete određene informacije
                o sebi iz same usluge.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Možete ažurirati, izmeniti ili obrisati svoje informacije u bilo
                kom trenutku prijavljivanjem na svoj nalog, ako ga imate, i
                posetom sekciji podešavanja naloga koja vam omogućava da
                upravljate svojim ličnim informacijama. Takođe možete
                kontaktirati nas da zatražite pristup, ispravite ili obrišete
                bilo koje lične informacije koje ste nam dostavili.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Imajte na umu, međutim, da možda moramo zadržati određene
                informacije kada imamo pravnu obavezu ili zakonitu osnovu da to
                učinimo.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Otkrivanje vaših ličnih podataka
              </h3>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                Poslovne transakcije
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Ako je kompanija uključena u spajanje, akviziciju ili prodaju
                imovine, vaši lični podaci mogu biti preneseni. Obavestićemo vas
                pre nego što vaši lični podaci budu preneseni i postanu predmet
                druge Politike privatnosti.
              </p>

              <h4 className="text-lg md:text-xl font-semibold mt-2">
                Organi za sprovođenje zakona
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Pod određenim okolnostima, kompanija može biti obavezana da
                otkrije vaše lične podatke ako to zahteva zakon ili kao odgovor
                na validne zahteve javnih vlasti (npr. sud ili vladina
                agencija).
              </p>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                Druge pravne obaveze
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Kompanija može otkriti vaše lične podatke u dobroj veri,
                smatrajući da je takva akcija neophodna da bi se:
              </p>
              <ul>
                <li>Poštovalo pravnu obavezu</li>
                <li>Štiti i brani prava ili imovinu kompanije</li>
                <li>
                  Sprečilo ili istražilo moguće nepravilnosti u vezi sa uslugom
                </li>
                <li>Štiti ličnu bezbednost korisnika usluge ili javnosti</li>
                <li>Štiti od pravne odgovornosti</li>
              </ul>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Bezbednost vaših ličnih podataka
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Bezbednost vaših ličnih podataka je važna za nas, ali imajte na
                umu da nijedna metoda prenosa preko interneta ili metoda
                elektronskog skladištenja nije 100% sigurna. Iako se trudimo da
                koristimo komercijalno prihvatljive metode za zaštitu vaših
                ličnih podataka, ne možemo garantovati njihovu apsolutnu
                bezbednost.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Privatnost dece
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                Naša usluga ne obraća se nikome mlađem od 13 godina. Ne
                prikupljamo svesno lične podatke od bilo koga ko je mlađi od 13
                godina. Ako ste roditelj ili staratelj i znate da je vaše dete
                dostavilo naše lične podatke, molimo vas da nas kontaktirate.
                Ako saznamo da smo prikupili lične podatke od nekoga ko je mlađi
                od 13 godina bez provere roditeljskog pristanka, preduzećemo
                korake da uklonimo te informacije sa naših servera.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Ako se oslanjamo na pristanak kao pravnu osnovu za obradu vaših
                informacija i vaša zemlja zahteva saglasnost roditelja, možemo
                zahtevati saglasnost vašeg roditelja pre nego što prikupimo i
                koristimo te informacije.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Linkovi ka drugim veb sajtovima
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                Naša usluga može sadržati linkove ka drugim veb sajtovima koji
                se ne upravljaju od strane nas. Ako kliknete na link treće
                strane, bićete preusmereni na sajt te treće strane. Snažno
                preporučujemo da pregledate Politiku privatnosti svakog sajta
                koji posetite.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Nemamo kontrolu nad i ne preuzimamo odgovornost za sadržaj,
                politike privatnosti ili prakse bilo kojih veb sajtova ili
                usluga trećih strana.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Izmene ove Politike privatnosti
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                Možemo povremeno ažurirati našu Politiku privatnosti.
                Obavestićemo vas o svim izmenama objavljivanjem nove Politike
                privatnosti na ovoj stranici.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Obavestićemo vas putem emaila i/ili istaknute obaveštenje na
                našoj usluzi, pre nego što promene postanu efikasne i
                ažuriraćemo datum &quot;Poslednje ažuriranje&quot; na vrhu ove
                Politike privatnosti.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Preporučuje se da periodično pregledate ovu Politiku privatnosti
                zbog bilo kakvih izmena. Izmene ove Politike privatnosti su
                efikasne kada su objavljene na ovoj stranici.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Kontaktirajte nas
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                Ako imate bilo kakvih pitanja u vezi sa ovom Politikom
                privatnosti, možete nas kontaktirati:
              </p>
              <ul>
                <li className="text-md md:text-lg mt-2">
                  Putem emaila: office@yourealvest.com
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-[900px] lg:mx-auto">
            <div
              className="tab-content translations-content-item en visible"
              id="en"
            >
              <h1 className="text-center font-bold text-2xl md:text-3xl">
                Privacy Policy
              </h1>
              <p className="text-center font-regular text-lg md:text-xl">
                Last updated: September 25, 2024
              </p>
              <section className="mt-4">
                <h2 className="font-bold text-lg md:text-xl">Introduction</h2>
                <p className="font-regular text-md md:text-lg mt-2">
                  This Privacy Policy describes Our policies and procedures on
                  the collection, use, and disclosure of Your information when
                  You use the Service and tells You about Your privacy rights
                  and how the law protects You.
                </p>
              </section>
              <section className="mt-4">
                <h2 className="font-bold text-lg md:text-xl">
                  Use of Your Personal Data
                </h2>
                <p className="font-regular text-md md:text-lg mt-2">
                  We use Your Personal data to provide and improve the Service.
                  By using the Service, You agree to the collection and use of
                  information in accordance with this Privacy Policy. This
                  Privacy Policy has been created with the help of the{" "}
                  <a
                    href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Free Privacy Policy Generator
                  </a>
                  .
                </p>
              </section>

              <h2 className="text-lg md:text-xl font-bold mt-4">
                Interpretation and Definitions
              </h2>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Interpretation
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Definitions
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                For the purposes of this Privacy Policy:
              </p>
              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Account</strong> means a unique account created for
                    You to access our Service or parts of our Service.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Affiliate</strong> means an entity that controls, is
                    controlled by or is under common control with a party, where
                    &quot;control&quot; means ownership of 50% or more of the
                    shares, equity interest or other securities entitled to vote
                    for election of directors or other managing authority.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Company</strong> (referred to as either &quot;the
                    Company&quot;, &quot;We&quot;, &quot;Us&quot; or
                    &quot;Our&quot; in this Agreement) refers to Realvest,
                    Rezveltova 44, 11000, Belgrade.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Cookies</strong> are small files that are placed on
                    Your computer, mobile device or any other device by a
                    website, containing the details of Your browsing history on
                    that website among its many uses.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Country</strong> refers to: Serbia
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Device</strong> means any device that can access the
                    Service such as a computer, a cellphone or a digital tablet.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Personal Data</strong> is any information that
                    relates to an identified or identifiable individual.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Service</strong> refers to the Website.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Service Provider</strong> means any natural or legal
                    person who processes the data on behalf of the Company. It
                    refers to third-party companies or individuals employed by
                    the Company to facilitate the Service, to provide the
                    Service on behalf of the Company, to perform services
                    related to the Service or to assist the Company in analyzing
                    how the Service is used.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Usage Data</strong> refers to data collected
                    automatically, either generated by the use of the Service or
                    from the Service infrastructure itself (for example, the
                    duration of a page visit).
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Website</strong> refers to Realvest, accessible from{" "}
                    <a
                      href="www.yourealvest.com"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      www.yourealvest.com
                    </a>
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>You</strong> means the individual accessing or using
                    the Service, or the company, or other legal entity on behalf
                    of which such individual is accessing or using the Service,
                    as applicable.
                  </p>
                </li>
              </ul>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Collecting and Using Your Personal Data
              </h2>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Types of Data Collected
              </h3>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                {" "}
                Personal Data
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                While using Our Service, We may ask You to provide Us with
                certain personally identifiable information that can be used to
                contact or identify You. Personally identifiable information may
                include, but is not limited to:
              </p>
              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Email address
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Usage Data
                  </p>
                </li>
              </ul>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                {" "}
                Usage Data
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Usage Data is collected automatically when using the Service.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Usage Data may include information such as Your Device's
                Internet Protocol address (e.g. IP address), browser type,
                browser version, the pages of our Service that You visit, the
                time and date of Your visit, the time spent on those pages,
                unique device identifiers and other diagnostic data.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                When You access the Service by or through a mobile device, We
                may collect certain information automatically, including, but
                not limited to, the type of mobile device You use, Your mobile
                device unique ID, the IP address of Your mobile device, Your
                mobile operating system, the type of mobile Internet browser You
                use, unique device identifiers and other diagnostic data.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                We may also collect information that Your browser sends whenever
                You visit our Service or when You access the Service by or
                through a mobile device.
              </p>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                {" "}
                Tracking Technologies and Cookies
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                We use Cookies and similar tracking technologies to track the
                activity on Our Service and store certain information. Tracking
                technologies used are beacons, tags, and scripts to collect and
                track information and to improve and analyze Our Service. The
                technologies We use may include:
              </p>
              <ul>
                <li>
                  <strong>Cookies or Browser Cookies.</strong> A cookie is a
                  small file placed on Your Device. You can instruct Your
                  browser to refuse all Cookies or to indicate when a Cookie is
                  being sent. However, if You do not accept Cookies, You may not
                  be able to use some parts of our Service. Unless you have
                  adjusted Your browser setting so that it will refuse Cookies,
                  our Service may use Cookies.
                </li>
                <li>
                  <strong>Web Beacons.</strong> Certain sections of our Service
                  and our emails may contain small electronic files known as web
                  beacons (also referred to as clear gifs, pixel tags, and
                  single-pixel gifs) that permit the Company, for example, to
                  count users who have visited those pages or opened an email
                  and for other related website statistics (for example,
                  recording the popularity of a certain section and verifying
                  system and server integrity).
                </li>
              </ul>
              <p className="font-regular text-md md:text-lg mt-4">
                Cookies can be &quot;Persistent&quot; or &quot;Session&quot;
                Cookies. Persistent Cookies remain on Your personal computer or
                mobile device when You go offline, while Session Cookies are
                deleted as soon as You close Your web browser. Learn more about
                cookies on the{" "}
                <a
                  href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking"
                  target="_blank"
                  rel="noreferrer"
                >
                  Free Privacy Policy website
                </a>{" "}
                article.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                We use both Session and Persistent Cookies for the purposes set
                out below:
              </p>
              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Necessary / Essential Cookies</strong>
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Type: Session Cookies
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Administered by: Us
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Purpose: These Cookies are essential to provide You with
                    services available through the Website and to enable You to
                    use some of its features. They help to authenticate users
                    and prevent fraudulent use of user accounts. Without these
                    Cookies, the services that You have asked for cannot be
                    provided, and We only use these Cookies to provide You with
                    those services.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Cookies Policy / Notice Acceptance Cookies</strong>
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Type: Persistent Cookies
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Administered by: Us
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Purpose: These Cookies identify if users have accepted the
                    use of cookies on the Website.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>Functionality Cookies</strong>
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Type: Persistent Cookies
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Administered by: Us
                  </p>
                  <p className="font-regular text-md md:text-lg mt-4">
                    Purpose: These Cookies allow us to remember choices You make
                    when You use the Website, such as remembering your login
                    details or language preference. The purpose of these Cookies
                    is to provide You with a more personal experience and to
                    avoid You having to re-enter your preferences every time You
                    use the Website.
                  </p>
                </li>
              </ul>
              <p className="font-regular text-md md:text-lg mt-4">
                For more information about the cookies we use and your choices
                regarding cookies, please visit our Cookies Policy or the
                Cookies section of our Privacy Policy.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Use of Your Personal Data
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                The Company may use Personal Data for the following purposes:
              </p>
              <ul>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>To provide and maintain our Service</strong>,
                    including to monitor the usage of our Service.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>To manage Your Account:</strong> to manage Your
                    registration as a user of the Service. The Personal Data You
                    provide can give You access to different functionalities of
                    the Service that are available to You as a registered user.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>For the performance of a contract:</strong> the
                    development, compliance and undertaking of the purchase
                    contract for the products, items or services You have
                    purchased or of any other contract with Us through the
                    Service.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>To contact You:</strong> To contact You by email,
                    telephone calls, SMS, or other equivalent forms of
                    electronic communication, such as a mobile application's
                    push notifications regarding updates or informative
                    communications related to the functionalities, products or
                    contracted services, including the security updates, when
                    necessary or reasonable for their implementation.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>To provide You</strong> with news, special offers
                    and general information about other goods, services and
                    events which we offer that are similar to those that you
                    have already purchased or enquired about unless You have
                    opted not to receive such information.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>To manage Your requests:</strong> To attend and
                    manage Your requests to Us.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>For business transfers:</strong> We may use Your
                    information to evaluate or conduct a merger, divestiture,
                    restructuring, reorganization, dissolution, or other sale or
                    transfer of some or all of Our assets, whether as a going
                    concern or as part of bankruptcy, liquidation, or similar
                    proceeding, in which Personal Data held by Us about our
                    Service users is among the assets transferred.
                  </p>
                </li>
                <li>
                  <p className="font-regular text-md md:text-lg mt-4">
                    <strong>For other purposes</strong>: We may use Your
                    information for other purposes, such as data analysis,
                    identifying usage trends, determining the effectiveness of
                    our promotional campaigns and to evaluate and improve our
                    Service, products, services, marketing and your experience.
                  </p>
                </li>
              </ul>
              <p className="font-regular text-md md:text-lg mt-4">
                We may share Your personal information in the following
                situations:
              </p>
              <ul>
                <li>
                  <strong>With Service Providers:</strong> We may share Your
                  personal information with Service Providers to monitor and
                  analyze the use of our Service, to contact You.
                </li>
                <li>
                  <strong>For business transfers:</strong> We may share or
                  transfer Your personal information in connection with, or
                  during negotiations of, any merger, sale of Company assets,
                  financing, or acquisition of all or a portion of Our business
                  to another company.
                </li>
                <li>
                  <strong>With Affiliates:</strong> We may share Your
                  information with Our affiliates, in which case we will require
                  those affiliates to honor this Privacy Policy. Affiliates
                  include Our parent company and any other subsidiaries, joint
                  venture partners or other companies that We control or that
                  are under common control with Us.
                </li>
                <li>
                  <strong>With business partners:</strong> We may share Your
                  information with Our business partners to offer You certain
                  products, services or promotions.
                </li>
                <li>
                  <strong>With other users:</strong> when You share personal
                  information or otherwise interact in the public areas with
                  other users, such information may be viewed by all users and
                  may be publicly distributed outside.
                </li>
                <li>
                  <strong>With Your consent</strong>: We may disclose Your
                  personal information for any other purpose with Your consent.
                </li>
              </ul>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Retention of Your Personal Data
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                The Company will retain Your Personal Data only for as long as
                is necessary for the purposes set out in this Privacy Policy. We
                will retain and use Your Personal Data to the extent necessary
                to comply with our legal obligations (for example, if we are
                required to retain your data to comply with applicable laws),
                resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                The Company will also retain Usage Data for internal analysis
                purposes. Usage Data is generally retained for a shorter period
                of time, except when this data is used to strengthen the
                security or to improve the functionality of Our Service, or We
                are legally obligated to retain this data for longer time
                periods.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Transfer of Your Personal Data
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                Your information, including Personal Data, is processed at the
                Company's operating offices and in any other places where the
                parties involved in the processing are located. It means that
                this information may be transferred to — and maintained on —
                computers located outside of Your state, province, country or
                other governmental jurisdiction where the data protection laws
                may differ than those from Your jurisdiction.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Your consent to this Privacy Policy followed by Your submission
                of such information represents Your agreement to that transfer.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                The Company will take all steps reasonably necessary to ensure
                that Your data is treated securely and in accordance with this
                Privacy Policy and no transfer of Your Personal Data will take
                place to an organization or a country unless there are adequate
                controls in place including the security of Your data and other
                personal information.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Delete Your Personal Data
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                You have the right to delete or request that We assist in
                deleting the Personal Data that We have collected about You.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Our Service may give You the ability to delete certain
                information about You from within the Service.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                You may update, amend, or delete Your information at any time by
                signing in to Your Account, if you have one, and visiting the
                account settings section that allows you to manage Your personal
                information. You may also contact Us to request access to,
                correct, or delete any personal information that You have
                provided to Us.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                Please note, however, that We may need to retain certain
                information when we have a legal obligation or lawful basis to
                do so.
              </p>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Disclosure of Your Personal Data
              </h3>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                {" "}
                Business Transactions
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                If the Company is involved in a merger, acquisition or asset
                sale, Your Personal Data may be transferred. We will provide
                notice before Your Personal Data is transferred and becomes
                subject to a different Privacy Policy.
              </p>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                {" "}
                Law enforcement
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                Under certain circumstances, the Company may be required to
                disclose Your Personal Data if required to do so by law or in
                response to valid requests by public authorities (e.g. a court
                or a government agency).
              </p>
              <h4 className="text-lg md:text-xl font-semibold mt-2">
                {" "}
                Other legal requirements
              </h4>
              <p className="font-regular text-md md:text-lg mt-4">
                The Company may disclose Your Personal Data in the good faith
                belief that such action is necessary to:
              </p>
              <ul>
                <li>Comply with a legal obligation</li>
                <li>
                  Protect and defend the rights or property of the Company
                </li>
                <li>
                  Prevent or investigate possible wrongdoing in connection with
                  the Service
                </li>
                <li>
                  Protect the personal safety of Users of the Service or the
                  public
                </li>
                <li>Protect against legal liability</li>
              </ul>
              <h3 className="text-lg md:text-xl font-semibold mt-2">
                Security of Your Personal Data
              </h3>
              <p className="font-regular text-md md:text-lg mt-4">
                The security of Your Personal Data is important to Us, but
                remember that no method of transmission over the Internet, or
                method of electronic storage is 100% secure. While We strive to
                use commercially acceptable means to protect Your Personal Data,
                We cannot guarantee its absolute security.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Children's Privacy
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                Our Service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                anyone under the age of 13. If You are a parent or guardian and
                You are aware that Your child has provided Us with Personal
                Data, please contact Us. If We become aware that We have
                collected Personal Data from anyone under the age of 13 without
                verification of parental consent, We take steps to remove that
                information from Our servers.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                If We need to rely on consent as a legal basis for processing
                Your information and Your country requires consent from a
                parent, We may require Your parent's consent before We collect
                and use that information.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Links to Other Websites
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                Our Service may contain links to other websites that are not
                operated by Us. If You click on a third party link, You will be
                directed to that third party's site. We strongly advise You to
                review the Privacy Policy of every site You visit.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                We have no control over and assume no responsibility for the
                content, privacy policies or practices of any third party sites
                or services.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">
                Changes to this Privacy Policy
              </h2>
              <p className="font-regular text-md md:text-lg mt-4">
                We may update Our Privacy Policy from time to time. We will
                notify You of any changes by posting the new Privacy Policy on
                this page.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                We will let You know via email and/or a prominent notice on Our
                Service, prior to the change becoming effective and update the
                &quot;Last updated&quot; date at the top of this Privacy Policy.
              </p>
              <p className="font-regular text-md md:text-lg mt-4">
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
              <h2 className="text-lg md:text-xl font-bold mt-4">Contact Us</h2>
              <p className="font-regular text-md md:text-lg mt-4">
                If you have any questions about this Privacy Policy, You can
                contact us:
              </p>
              <ul>
                <li className="text-md md:text-lg mt-2">
                  By email: office@yourealvest.com
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;
