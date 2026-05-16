export const plantOptions = [
  { id: "padi", label: "Padi", emoji: "🌾" },
  { id: "jagung", label: "Jagung", emoji: "🌽" },
  { id: "cabai", label: "Cabai", emoji: "🌶️" },
  { id: "tomat", label: "Tomat", emoji: "🍅" },
  { id: "bawang", label: "Bawang", emoji: "🧄" },
  { id: "singkong", label: "Singkong", emoji: "🌱" },
  { id: "kedelai", label: "Kedelai", emoji: "🫘" },
  { id: "sayuran-hijau", label: "Sayuran Hijau", emoji: "🥬" },
] as const;

export type PlantId = (typeof plantOptions)[number]["id"];

export const consultationSymptoms = [
  "Daun menguning",
  "Bercak hitam",
  "Tanaman layu",
  "Ada hama",
  "Busuk/berlendir",
  "Masalah lainnya",
] as const;

export const consultationMockResults: Record<
  PlantId,
  {
    label: string;
    possibleCauses: string[];
    recommendations: string[];
    preventionTips: string[];
  }
> = {
  padi: {
    label: "Padi",
    possibleCauses: [
      "Kekurangan nitrogen pada fase vegetatif",
      "Serangan wereng batang cokelat",
      "Genangan air terlalu lama di akar",
    ],
    recommendations: [
      "Semprot pupuk urea 2% dan lakukan pagi hari",
      "Kurangi genangan air, lalu buat aluran drainase",
      "Cek batang bawah, jika ada wereng semprot insektisida",
    ],
    preventionTips: [
      "Rutin cek kondisi daun setiap 3 hari",
      "Jaga jarak tanam agar sirkulasi udara baik",
      "Gunakan varietas padi tahan wereng",
    ],
  },
  jagung: {
    label: "Jagung",
    possibleCauses: [
      "Defisiensi unsur hara terutama nitrogen",
      "Serangan ulat grayak pada pucuk",
      "Drainase lahan kurang baik setelah hujan",
    ],
    recommendations: [
      "Tambahkan pupuk susulan dengan dosis ringan",
      "Cek pucuk dan daun muda untuk serangan ulat",
      "Pastikan lahan tidak tergenang lebih dari satu hari",
    ],
    preventionTips: [
      "Lakukan monitoring daun muda seminggu dua kali",
      "Jaga kebersihan gulma di sekitar tanaman",
      "Gunakan benih unggul tahan penyakit",
    ],
  },
  cabai: {
    label: "Cabai",
    possibleCauses: [
      "Serangan kutu atau thrips di daun muda",
      "Jamur akibat kelembapan terlalu tinggi",
      "Tanaman stres karena perubahan suhu",
    ],
    recommendations: [
      "Pisahkan tanaman yang terserang berat",
      "Semprot fungisida ringan pada pagi hari bila perlu",
      "Kurangi kelembapan dengan memperbaiki sirkulasi udara",
    ],
    preventionTips: [
      "Gunakan mulsa agar kelembapan tanah stabil",
      "Pangkas daun bawah yang terlalu rimbun",
      "Jadwalkan pengecekan hama sejak fase vegetatif",
    ],
  },
  tomat: {
    label: "Tomat",
    possibleCauses: [
      "Busuk daun akibat kelembapan tinggi",
      "Kekurangan kalsium pada buah muda",
      "Serangan hama penghisap",
    ],
    recommendations: [
      "Buang bagian daun yang sudah membusuk",
      "Tambahkan nutrisi pendukung kalsium secara bertahap",
      "Jaga kelembapan dan hindari penyiraman ke daun",
    ],
    preventionTips: [
      "Pakai ajir agar sirkulasi tanaman lebih baik",
      "Siram langsung ke pangkal tanaman",
      "Lakukan rotasi tanaman pada musim berikutnya",
    ],
  },
  bawang: {
    label: "Bawang",
    possibleCauses: [
      "Akar terlalu lembap dan mudah membusuk",
      "Serangan ulat bawang atau thrips",
      "Kebutuhan hara tidak terpenuhi merata",
    ],
    recommendations: [
      "Kurangi penyiraman dan cek drainase bedengan",
      "Bersihkan daun yang rusak berat",
      "Berikan pupuk susulan ringan sesuai fase",
    ],
    preventionTips: [
      "Gunakan bedengan tinggi saat musim hujan",
      "Cek daun bagian bawah secara rutin",
      "Jaga kebersihan gulma di sekitar lahan",
    ],
  },
  singkong: {
    label: "Singkong",
    possibleCauses: [
      "Kondisi lahan terlalu padat untuk pembentukan umbi",
      "Serangan tungau atau kutu putih",
      "Bibit kurang sehat saat penanaman",
    ],
    recommendations: [
      "Gemburkan area sekitar pangkal tanaman",
      "Pilih stek sehat untuk tanam berikutnya",
      "Lakukan pengendalian hama secara bertahap",
    ],
    preventionTips: [
      "Gunakan stek dari tanaman induk sehat",
      "Jaga jarak tanam agar umbi berkembang baik",
      "Cek daun muda untuk deteksi dini hama",
    ],
  },
  kedelai: {
    label: "Kedelai",
    possibleCauses: [
      "Defisiensi fosfor pada fase awal",
      "Serangan ulat daun",
      "Kelembapan tanah tidak stabil",
    ],
    recommendations: [
      "Perbaiki nutrisi dasar dan cek kondisi daun",
      "Lakukan pengendalian ulat jika populasi meningkat",
      "Atur pola penyiraman supaya tanah tetap lembap",
    ],
    preventionTips: [
      "Gunakan inokulan rhizobium saat tanam",
      "Bersihkan gulma secara berkala",
      "Pantau daun muda dan bunga saat masa pembentukan polong",
    ],
  },
  "sayuran-hijau": {
    label: "Sayuran Hijau",
    possibleCauses: [
      "Kelembapan berlebih memicu jamur daun",
      "Kebutuhan nutrisi daun belum terpenuhi",
      "Serangan hama daun pada malam hari",
    ],
    recommendations: [
      "Kurangi kepadatan tanam agar sirkulasi membaik",
      "Tambah pupuk daun ringan bila diperlukan",
      "Lakukan inspeksi daun pagi hari untuk cari hama",
    ],
    preventionTips: [
      "Panen bertahap sesuai umur tanam",
      "Jaga kelembapan tetapi hindari genangan",
      "Pisahkan bedengan sehat dan terserang",
    ],
  },
};

export const guideContent: Record<
  PlantId,
  {
    title: string;
    season: string;
    suitableFor: string;
    regions: string[];
    stages: Array<{ title: string; badge: string; items: string[] }>;
  }
> = {
  padi: {
    title: "Padi",
    season: "Musim tanam: 90 - 120 hari",
    suitableFor: "Cocok untuk: Kemarau & Hujan",
    regions: ["Jawa", "Sumatera", "Kalimantan"],
    stages: [
      {
        title: "Persiapan Lahan",
        badge: "7-14 hari sebelum tanam",
        items: [
          "Bajak lahan sedalam 20 cm untuk sirkulasi udara.",
          "Genangi air selama 2-3 hari untuk melunakkan tanah.",
          "Bersihkan gulma dan sisa tanaman sebelumnya.",
        ],
      },
      {
        title: "Cara Tanam",
        badge: "Hari 1",
        items: [
          "Gunakan bibit yang sudah berumur 18-21 hari.",
          "Tanam 2-3 bibit per titik tanam.",
          "Gunakan pola Jajar Legowo untuk hasil lebih maksimal.",
        ],
      },
      {
        title: "Pupuk & Perawatan",
        badge: "Hari 7-60",
        items: [
          "Pemupukan dasar dengan Urea dan NPK di hari ke-7.",
          "Pemupukan susulan dengan pupuk cair di hari ke-30.",
          "Jaga ketinggian air sekitar 2-5 cm dari permukaan.",
        ],
      },
      {
        title: "Pengendalian Hama",
        badge: "Pantau rutin",
        items: [
          "Waspada hama wereng coklat dan tikus sawah.",
          "Lakukan penyemprotan jika diperlukan.",
          "Gunakan pestisida hayati untuk menjaga ekosistem lahan.",
        ],
      },
      {
        title: "Panen",
        badge: "Hari 90-120",
        items: [
          "Panen saat 90% butir padi sudah berwarna kuning.",
          "Keringkan segera setelah dirontokkan.",
          "Pastikan kadar air sekitar 14% untuk penyimpanan lebih lama.",
        ],
      },
    ],
  },
  jagung: {
    title: "Jagung",
    season: "Musim tanam: 90 - 110 hari",
    suitableFor: "Cocok untuk: Kemarau",
    regions: ["Jawa", "NTB", "Sulawesi"],
    stages: [
      { title: "Persiapan Lahan", badge: "1 minggu sebelum tanam", items: ["Gemburkan tanah dan buat bedengan.", "Campurkan kompos matang ke area tanam.", "Pastikan lahan mendapat cahaya penuh."] },
      { title: "Penanaman", badge: "Hari 1", items: ["Tanam benih 2-3 cm dalamnya.", "Jaga jarak tanam agar tongkol berkembang baik.", "Siram secukupnya setelah tanam."] },
      { title: "Pemupukan", badge: "Hari 10-45", items: ["Berikan pupuk dasar dan pupuk susulan.", "Pantau warna daun untuk cek kebutuhan hara.", "Bersihkan gulma di sekitar batang."] },
      { title: "Pengendalian Hama", badge: "Pantau mingguan", items: ["Periksa pucuk dari ulat grayak.", "Gunakan perangkap bila perlu.", "Buang daun yang rusak berat."] },
      { title: "Panen", badge: "Hari 90+", items: ["Panen saat klobot mulai mengering.", "Simpan di tempat kering dan berventilasi.", "Pisahkan tongkol yang rusak."] },
    ],
  },
  cabai: {
    title: "Cabai",
    season: "Musim tanam: 75 - 100 hari",
    suitableFor: "Cocok untuk: Kemarau & Peralihan",
    regions: ["Jawa", "Sumatera", "Bali"],
    stages: [
      { title: "Persiapan Bedengan", badge: "1 minggu sebelum tanam", items: ["Gunakan mulsa untuk menjaga kelembapan.", "Campur pupuk kandang matang.", "Pastikan drainase baik."] },
      { title: "Penanaman", badge: "Hari 1", items: ["Pindahkan bibit saat berdaun 4-5 helai.", "Tanam pada sore hari.", "Pasang ajir sejak awal."] },
      { title: "Perawatan", badge: "Hari 7-60", items: ["Siram secukupnya tiap pagi.", "Pangkas tunas liar seperlunya.", "Berikan pupuk susulan berkala."] },
      { title: "Pengendalian Hama", badge: "Pantau rutin", items: ["Cek kutu dan thrips di daun muda.", "Buang daun terinfeksi berat.", "Semprot seperlunya di pagi hari."] },
      { title: "Panen", badge: "Hari 75+", items: ["Petik buah sesuai tingkat kematangan.", "Panen pagi hari untuk kualitas lebih baik.", "Sortir hasil sebelum disimpan."] },
    ],
  },
  tomat: {
    title: "Tomat",
    season: "Musim tanam: 80 - 100 hari",
    suitableFor: "Cocok untuk: Kemarau & Peralihan",
    regions: ["Jawa", "Bali", "Nusa Tenggara"],
    stages: [
      { title: "Persiapan Lahan", badge: "1 minggu sebelum tanam", items: ["Siapkan bedengan gembur dan kaya organik.", "Gunakan mulsa untuk stabilitas suhu.", "Pastikan drainase baik."] },
      { title: "Penanaman", badge: "Hari 1", items: ["Pindah tanam bibit sehat.", "Gunakan ajir penyangga.", "Siram secukupnya setelah tanam."] },
      { title: "Perawatan", badge: "Hari 7-50", items: ["Pangkas tunas samping seperlunya.", "Berikan pupuk susulan sesuai fase.", "Jaga kelembapan tanah tetap stabil."] },
      { title: "Pengendalian Penyakit", badge: "Pantau mingguan", items: ["Periksa daun dari gejala busuk atau bercak.", "Hindari penyiraman ke daun.", "Buang bagian terinfeksi."] },
      { title: "Panen", badge: "Hari 80+", items: ["Panen saat warna buah mulai merata.", "Simpan di tempat sejuk.", "Sortir buah retak atau rusak."] },
    ],
  },
  bawang: {
    title: "Bawang",
    season: "Musim tanam: 60 - 80 hari",
    suitableFor: "Cocok untuk: Kemarau",
    regions: ["Jawa", "NTB", "Sulawesi"],
    stages: [
      { title: "Persiapan Bedengan", badge: "5-7 hari sebelum tanam", items: ["Buat bedengan tinggi.", "Pastikan tanah gembur.", "Tambahkan pupuk kandang matang."] },
      { title: "Penanaman", badge: "Hari 1", items: ["Tanam umbi sehat.", "Atur jarak tanam rapat namun rapi.", "Siram ringan setelah tanam."] },
      { title: "Perawatan", badge: "Hari 7-40", items: ["Lakukan penyiraman teratur.", "Jaga kebersihan gulma.", "Berikan pupuk susulan ringan."] },
      { title: "Pengendalian Hama", badge: "Pantau rutin", items: ["Waspadai thrips dan ulat bawang.", "Buang daun rusak berat.", "Jaga sirkulasi udara."] },
      { title: "Panen", badge: "Hari 60+", items: ["Panen saat daun rebah.", "Jemur hasil setelah panen.", "Simpan di tempat kering."] },
    ],
  },
  singkong: {
    title: "Singkong",
    season: "Musim tanam: 8 - 12 bulan",
    suitableFor: "Cocok untuk: Kemarau & Hujan",
    regions: ["Jawa", "Lampung", "Kalimantan"],
    stages: [
      { title: "Persiapan Lahan", badge: "2 minggu sebelum tanam", items: ["Gemburkan tanah sedalam mungkin.", "Buat guludan jika perlu.", "Pilih lahan dengan sinar matahari penuh."] },
      { title: "Penanaman", badge: "Hari 1", items: ["Gunakan stek sehat.", "Tanam miring agar akar cepat tumbuh.", "Jaga jarak tanam untuk pembesaran umbi."] },
      { title: "Perawatan", badge: "Bulan 1-6", items: ["Bersihkan gulma secara berkala.", "Tambahkan pupuk bila pertumbuhan lambat.", "Cek serangan hama daun."] },
      { title: "Pemantauan Umbi", badge: "Bulan 6+", items: ["Cek kondisi batang dan daun.", "Pastikan lahan tidak terlalu padat.", "Lakukan pembumbunan jika perlu."] },
      { title: "Panen", badge: "Bulan 8-12", items: ["Panen saat umur optimal tercapai.", "Cabut hati-hati agar umbi tidak patah.", "Sortir umbi sebelum distribusi."] },
    ],
  },
  kedelai: {
    title: "Kedelai",
    season: "Musim tanam: 75 - 95 hari",
    suitableFor: "Cocok untuk: Kemarau",
    regions: ["Jawa", "NTB", "Sulawesi"],
    stages: [
      { title: "Persiapan Lahan", badge: "1 minggu sebelum tanam", items: ["Gemburkan tanah dan ratakan bedengan.", "Gunakan kompos matang.", "Pastikan lahan tidak tergenang."] },
      { title: "Penanaman", badge: "Hari 1", items: ["Tanam benih 2-3 biji per lubang.", "Gunakan jarak tanam seragam.", "Siram tipis setelah tanam."] },
      { title: "Perawatan", badge: "Hari 7-40", items: ["Bersihkan gulma di awal pertumbuhan.", "Tambahkan nutrisi bila daun pucat.", "Pantau pembentukan bunga dan polong."] },
      { title: "Pengendalian Hama", badge: "Pantau rutin", items: ["Cek ulat daun dan kepik polong.", "Lakukan pengendalian seperlunya.", "Jaga kebersihan lahan."] },
      { title: "Panen", badge: "Hari 75+", items: ["Panen saat daun mulai gugur dan polong mengering.", "Keringkan polong sebelum simpan.", "Pisahkan hasil cacat."] },
    ],
  },
  "sayuran-hijau": {
    title: "Sayuran Hijau",
    season: "Musim tanam: 25 - 45 hari",
    suitableFor: "Cocok untuk: Sepanjang tahun",
    regions: ["Jawa", "Sumatera", "Kalimantan"],
    stages: [
      { title: "Persiapan Bedengan", badge: "3-5 hari sebelum tanam", items: ["Siapkan bedengan gembur.", "Campurkan kompos matang.", "Pastikan penyinaran cukup."] },
      { title: "Penyemaian/Tanam", badge: "Hari 1", items: ["Sebar benih merata atau pindah bibit muda.", "Tutup tipis dengan media.", "Siram halus agar benih tidak hanyut."] },
      { title: "Perawatan", badge: "Hari 3-20", items: ["Siram rutin pagi dan sore seperlunya.", "Tipiskan tanaman bila terlalu rapat.", "Jaga kelembapan tetap stabil."] },
      { title: "Pengendalian Hama", badge: "Pantau harian", items: ["Cek daun dari lubang atau bercak.", "Buang daun rusak berat.", "Lindungi dari ulat dan siput."] },
      { title: "Panen", badge: "Hari 25+", items: ["Panen saat daun cukup besar.", "Lakukan pagi hari untuk hasil segar.", "Simpan di tempat sejuk."] },
    ],
  },
};
