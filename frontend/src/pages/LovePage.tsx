import { ChangeEvent, useEffect, useState } from 'react';
import { Heart, LogOut, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearLoveAccess } from '../auth/loveAuth';

const MEMORY_IMAGE_CANDIDATES = [
  ['/love/photo-1.jpg', '/love/photo-1.jpeg', '/love/photo-1.png', '/love/photo-1.webp'],
  ['/love/photo-2.jpg', '/love/photo-2.jpeg', '/love/photo-2.png', '/love/photo-2.webp'],
];

const PHOTO_STORAGE_KEYS = ['love_photo_1', 'love_photo_2'];

const MEMORY_PARAGRAPHS = [
  `Esingdami, bir yaqinim bo'lib qolsa, bir narsa aytaman, degan edim. Bu haqida hech kim bilmasdi, ya'ni bu saytim haqida. Men buni yaratishimdagi maqsad hamma narsani o'zim uchun eslab qolish bo'lgan.`,
  `2020-yil 10-aprel o'rtalarida do'stlarim bilan garov o'ynadim, u garov bir qizni orash edi. Bordim, 6-sinf qizga salom berib tanishdim va u men bilan ozgina aylanib gaplashishini so'radi, maktabning orqasidagi maydonda. Keyin o'sha paytda u voleybol o'ynashga qiziqishini aytdi, men ham o'ynashni xohladim. O'zi, o'sha vaqtdagi maqsadim garovda yutib o'rtoqlarimdan 10 ming so'm olish edi. Bilaman, kulgili va achinarli, lekin men shuni qildim.`,
  `U qizni oradim, 7 kuncha o'tib, 17-kuni to'liq yutdim, ya'ni u qiz sevib qoldi. Ertasi kuni o'rtoqlarimdan o'sha pulni - 10 ming so'mni - oldim va ovqatlandik, kompyuter xonaga tushdik. U bilan gaplashish davom etdi. 6-sinf boladagi qizni yaxshi ko'rib qolish degan narsa yo'q edi, lekin orada ozgina o'tmasdan men uning kulishiga, ko'zlariga, xarakteriga oshiq bo'ldim. U shunchalik ko'p gapirardi, men faqat eshitardim. Ba'zida mening gapirishim qachon kelar ekan, deb kutardim, lekin bu yoqimli edi.`,
  `Keyin hayotimda birinchi sevgim paydo bo'ldi. U boshqa bolalarga qo'pol, mensimasdan muomala qilardi, ham u mening sinfdoshim edi. O'sha garov sababi ham u qiz qo'pol edi, bolalarni mensimasdi, sinfda kimdir gapirsa ham faqat baqirib gapirardi, harakati juda qo'pol bo'lgani uchun orash qiyin edi. Uning otasi har kuni kelib olib ketardi, otasi 787 Prado moshina haydardi, boy edi, va boy qizi bo'lganiga ham kibri bor edi, kichkina bo'lishiga qaramasdan.`,
  `Bilmadim, u meni nimamga uchdi - yaxshi ko'rib qoldi. Oradan oz vaqt o'tib men ham uni sevib qoldim. 6-sinf bola 6-sinf qizni o'zi xohlagandek qilib tarbiyalashni boshladi: kibrini yo'qotdim, hamma bilan muloyim gaplashadigan qildim, sal tor va kalta kiyinishni boshlaganda 8-sinfda uzun kiyinishni o'rgatdim. Xullas, qaysi xarakteri o'zimga yoqmasa, hammasini tuzatdim.`,
  `7-sinfdan boshlab bitta partada faqat birga o'tirdik. Keyin u 7-sinfda ingliz tiliga borishni boshladi, International School'ga. Men ham u bilan bordim, lekin o'qish uchun emas, faqat u bilan birga bo'lish uchun. U elementary darajasidan o'tib ketdi, men o'tolmadim, va men uni boshqa o'qishga o'tishga ko'ndirdim - Us School'ga, yana birga o'qidik. Keyin kunlik vaqtimizning 50 foizini faqat birga o'tirardik.`,
  `Keyin 9-sinfda adam ishdan bo'shadilar, akamning o'zi ochgan korxonasi yopilib ketdi, ular ish topolmay qolishdi, faqat og'ir qora ishlar bor edi, shunga men ishlashim kerak bo'lib qoldi. Men jo'xori sotishda ishladim, oyiga 2 mln 800 ming so'm olardim, uyga ro'zg'or qilardim, adamga, onamga berardim. U esa mening ishdan kelishimni kutib uxlamasdi. Keyin video-qo'ng'iroqda meni ko'rib uxlamasa, ertasi kuni maktabda men bilan birga o'tirmasdi.`,
  `Oradan 1 yil o'tdi, akam yana o'zini korxonasini ochdi, otam ishda lavozimi oshib bosh shifokor bo'lib ishga kirdi. Uydagilar "meni ishlama, o'qi" deyishdi. Keyin men ishdan bo'shadim va yana u bilan kunning yarmini birga o'tirdim. Bunda ham o'qishdan maqsadim faqat u edi.`,
  `10-sinfda, dekabr oyida sinflar orasida iskal bo'ldi, men bitta bolani urdim, keyin militsiyaga tushdim, lekin hech narsa bo'lmagandek ROVDdan akam olib chiqib ketdi. Dekabrning oxirida o'sha bolalar Drujbada ikkitasi meni tutib oldi va meni kaskat bilan urib yiqitib ketishdi. O'rtog'im sigaret olgani ketgandi, men o'zim sigaret kelishini kutib o'tirgandim. Keyin men kasalxonaga tushdim va u har kuni maktabdan kelib oldimga kelardi, sok olib kelib ichirib qo'yardi.`,
  `Menga turish mumkin emas edi, faqat yelkamdan oyog'imgacha oq prostina bilan o'rab qo'yishgandi. U kelib yonimda uxlab qolardi, keyin men turg'izib: "Tur, bor, uyingga bor", derdim. U shunday derdi: "Hammasi yaxshi bo'ladi, yaxshi bo'lib ketasan". Bir oyda oyoqqa turdim, uydagilarga boshqa urishmasligimga va'da berdim.`,
  `Keyin u bilan aylanishga bordim, u menga shunaqa dedi: "Qara, sen akalaringga ishonib kalyanxonama-kalyanxona yurding, kuchingga ishonding, qo'lingdan hech narsa kelmadi. O'qi desam o'qimading, kimlaringgadir ishonib yurding - 'akalarim' deding, hech narsa qilib bermadi senga". Shundan keyin men o'qishni boshladim, hayotim iziga tushdi, o'z maqsadimni, yo'limni chizdim, kelajakda kim bo'lib chiqishimni belgilab harakat qildim. Uning ismi Shoxsanam edi.`,
  `11-sinfda u xususiy kollejga o'tdi, men u bilan ko'rishishim kamaydi. Uning muomalasi ham ancha o'zgardi, har kuni arzimagan narsalarni deb urishardik. 11-sinfni bitirganimdan keyin u ham kollejni bitirdi va iyun oyida o'qishga kirdi. Bizda yana oilaviy holat yomonlashdi.`,
  `U "Men o'qib, grant bilan chet el universitetlariga kirdim, siz kirolmaysiz, men IELTS'dan 6 oldim, siz ololmayapsiz", dedi. Bu gap qattiq tegdi. Orada u juda ko'p pul haqida tema ochib, boy bolalar haqida ko'p og'iz ochishni boshladi. Keyin unga o'zi ajralish uchun bahona kerak bo'lib yurganini sezdim, keyin ajraldik. Shundan keyin, o'zimga uylanmagunimcha, qizlarni hurmat qilmayman, romantika ham, "sevmayman ham", dedim o'zimga.`,
];

export default function LovePage() {
  const navigate = useNavigate();
  const [showPhotos, setShowPhotos] = useState(true);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [candidateIndex, setCandidateIndex] = useState([0, 0]);
  const [missingPublicPhotos, setMissingPublicPhotos] = useState([false, false]);
  const [storedPhotos, setStoredPhotos] = useState<(string | null)[]>(() =>
    PHOTO_STORAGE_KEYS.map((key) => localStorage.getItem(key))
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPhotos(false), 60000);
    return () => window.clearTimeout(timer);
  }, [photoVersion]);

  const handleLogout = () => {
    clearLoveAccess();
    navigate('/');
  };

  const handleImageError = (index: number) => {
    if (storedPhotos[index]) {
      localStorage.removeItem(PHOTO_STORAGE_KEYS[index]);
      setStoredPhotos((current) => {
        const next = [...current];
        next[index] = null;
        return next;
      });
      return;
    }

    if (candidateIndex[index] < MEMORY_IMAGE_CANDIDATES[index].length - 1) {
      setCandidateIndex((current) => {
        const next = [...current];
        next[index] += 1;
        return next;
      });
      return;
    }

    setMissingPublicPhotos((current) => {
      const next = [...current];
      next[index] = true;
      return next;
    });
  };

  const handlePhotoUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photo = typeof reader.result === 'string' ? reader.result : null;
      if (!photo) return;

      localStorage.setItem(PHOTO_STORAGE_KEYS[index], photo);
      setStoredPhotos((current) => {
        const next = [...current];
        next[index] = photo;
        return next;
      });
      setShowPhotos(true);
      setPhotoVersion((current) => current + 1);
    };
    reader.readAsDataURL(file);
  };

  const getPhotoSource = (index: number) => {
    if (storedPhotos[index]) return storedPhotos[index];
    if (missingPublicPhotos[index]) return null;
    return MEMORY_IMAGE_CANDIDATES[index][candidateIndex[index]];
  };

  return (
    <main className="love-screen love-page">
      <div className="hearts" aria-hidden>
        <span className="heart" style={{ left: '8%', top: '86%', ['--x' as any]: '32px', animationDelay: '0s' }} />
        <span className="heart heart-soft" style={{ left: '22%', top: '82%', ['--x' as any]: '70px', animationDelay: '0.35s' }} />
        <span className="heart" style={{ left: '41%', top: '88%', ['--x' as any]: '46px', animationDelay: '0.9s' }} />
        <span className="heart heart-soft" style={{ left: '63%', top: '84%', ['--x' as any]: '88px', animationDelay: '1.25s' }} />
        <span className="heart" style={{ left: '82%', top: '87%', ['--x' as any]: '54px', animationDelay: '1.7s' }} />
      </div>

      <article className="love-story-shell" aria-label="Love page">
        <header className="love-story-header">
          <div className="love-icon-row" aria-hidden>
            <Sparkles size={22} />
            <Heart size={46} />
            <Sparkles size={22} />
          </div>
          <p className="love-kicker">2020-yil 10-aprel</p>
          <h1>Shoxsanam</h1>
          <p>Bu sahifa men eslab qolishni xohlagan narsalar uchun.</p>
        </header>

        {showPhotos && (
          <section className="memory-gallery" aria-label="Xotira rasmlari">
            {[0, 1].map((index) => {
              const photoSource = getPhotoSource(index);

              if (photoSource) {
                return (
                  <figure className="memory-photo-card" key={index}>
                    <img
                      src={photoSource}
                      alt={`Xotira rasmi ${index + 1}`}
                      onError={() => handleImageError(index)}
                    />
                    <figcaption>{index + 1}-rasm</figcaption>
                  </figure>
                );
              }

              return (
                <label className="memory-photo-upload" key={index}>
                  <Heart size={28} />
                  <span>{index + 1}-rasmni tanlash</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handlePhotoUpload(index, event)}
                  />
                </label>
              );
            })}
          </section>
        )}

        <section className="memory-text" aria-label="Xotira matni">
          {MEMORY_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <button type="button" className="ghost-button story-back-button" onClick={handleLogout}>
          <LogOut size={17} />
          Back to login
        </button>
      </article>
    </main>
  );
}
