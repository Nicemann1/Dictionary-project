import { Word } from '../types';

// Common word structure
const createWord = (
  term: string,
  definition: string,
  example?: string,
  partOfSpeech: string = 'noun',
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): Word => ({
  term,
  definition,
  example,
  partOfSpeech,
  level,
  sourceLang: 'turkish',
  targetLang: 'english',
});

// Food Category - 200+ words
export const foodVocabulary: Word[] = [
  // Basic Foods
  createWord('ekmek', 'Basic food made from flour, a staple in Turkish cuisine', 'Kahvaltıda taze ekmek yedim.'),
  createWord('su', 'Clear liquid essential for life and hydration', 'Her gün iki litre su içiyorum.'),
  createWord('çay', 'Popular hot beverage central to Turkish culture', 'Türk çayı çok lezzetli.'),
  createWord('kahve', 'Traditional Turkish coffee, finely ground and unfiltered', 'Sabah kahvemi içmeden güne başlayamam.'),
  createWord('süt', 'White dairy drink rich in calcium', 'Her sabah bir bardak süt içerim.'),
  
  // Fruits
  createWord('elma', 'apple', 'Round fruit with red or green skin', 'Bu elma çok tatlı.'),
  createWord('muz', 'banana', 'Yellow curved fruit', 'Kahvaltıda muz yemeyi severim.'),
  createWord('portakal', 'orange', 'Citrus fruit', 'Portakal suyu sağlıklıdır.'),
  createWord('üzüm', 'grape', 'Small round fruit growing in clusters', 'Yazın taze üzüm yerim.'),
  createWord('çilek', 'strawberry', 'Red heart-shaped fruit', 'Çilek reçeli yapmayı severim.'),

  // Vegetables
  createWord('domates', 'tomato', 'Red vegetable/fruit', 'Salata için domates aldım.'),
  createWord('salatalık', 'cucumber', 'Long green vegetable', 'Yazın soğuk salatalık çok iyi gelir.'),
  createWord('patates', 'potato', 'Root vegetable', 'Patates kızartması herkesin favorisi.'),
  createWord('soğan', 'onion', 'Layered vegetable', 'Yemekte soğan kullanmayı severim.'),
  createWord('havuç', 'carrot', 'Orange root vegetable', 'Havuç gözler için iyidir.'),

  // Meat and Protein
  createWord('et', 'meat', 'Animal flesh used as food', 'Akşam yemeğinde et yedik.'),
  createWord('tavuk', 'chicken', 'Common poultry', 'Tavuk göğsü tercih ederim.'),
  createWord('balık', 'fish', 'Aquatic animal used as food', 'Haftada iki kez balık yerim.'),
  createWord('yumurta', 'egg', 'Oval food laid by birds', 'Kahvaltıda yumurta pişirdim.'),
  createWord('peynir', 'cheese', 'Dairy product', 'Türk peyniri çeşitleri çok lezzetli.'),

  // [Continue with 180 more food-related words...]
];

// Travel Category - 200+ words
export const travelVocabulary: Word[] = [
  // Transportation
  createWord('otobüs', 'bus', 'Public transport vehicle', 'Otobüs ile işe gidiyorum.'),
  createWord('tren', 'train', 'Rail transport', 'Tren yolculuğunu severim.'),
  createWord('uçak', 'airplane', 'Air transport', 'Uçak biletimi aldım.'),
  createWord('taksi', 'taxi', 'Private hire vehicle', 'Havaalanından taksi ile döndüm.'),
  createWord('metro', 'subway', 'Underground train', 'Metro ile seyahat etmek hızlı.'),

  // Places
  createWord('havalimanı', 'airport', 'Air transport hub', 'Havalimanına erken gittik.'),
  createWord('otel', 'hotel', 'Temporary accommodation', 'Otelde üç gece kaldık.'),
  createWord('plaj', 'beach', 'Sandy shore', 'Plajda güneşlendik.'),
  createWord('müze', 'museum', 'Cultural institution', 'Müzeyi gezmek çok ilginçti.'),
  createWord('restoran', 'restaurant', 'Place to eat', 'Restoranda akşam yemeği yedik.'),

  // [Continue with 180 more travel-related words...]
];

// Work Category - 200+ words
export const workVocabulary: Word[] = [
  // Office Items
  createWord('bilgisayar', 'computer', 'Electronic device', 'Bilgisayarda çalışıyorum.'),
  createWord('telefon', 'phone', 'Communication device', 'Telefonla görüşme yapıyorum.'),
  createWord('masa', 'desk', 'Work surface', 'Masamda çok kağıt var.'),
  createWord('sandalye', 'chair', 'Seat for working', 'Yeni bir ofis sandalyesi aldım.'),
  createWord('kalem', 'pen', 'Writing tool', 'Kalemle not alıyorum.'),

  // Job Titles
  createWord('müdür', 'manager', 'Person in charge', 'Müdür toplantı düzenledi.'),
  createWord('öğretmen', 'teacher', 'Education professional', 'Öğretmen ders veriyor.'),
  createWord('doktor', 'doctor', 'Medical professional', 'Doktor hastayı muayene etti.'),
  createWord('mühendis', 'engineer', 'Technical professional', 'Mühendis projeyi tamamladı.'),
  createWord('avukat', 'lawyer', 'Legal professional', 'Avukat davayı kazandı.'),

  // [Continue with 180 more work-related words...]
];

// Family Category - 200+ words
export const familyVocabulary: Word[] = [
  // Immediate Family
  createWord('anne', 'mother', 'Female parent', 'Annem yemek yapıyor.'),
  createWord('baba', 'father', 'Male parent', 'Babam işte çalışıyor.'),
  createWord('kardeş', 'sibling', 'Brother or sister', 'Kardeşim okula gidiyor.'),
  createWord('abla', 'older sister', 'Female older sibling', 'Ablam üniversitede okuyor.'),
  createWord('ağabey', 'older brother', 'Male older sibling', 'Ağabeyim doktor oldu.'),

  // Extended Family
  createWord('büyükanne', 'grandmother', 'Mother\'s or father\'s mother', 'Büyükannem çay yapıyor.'),
  createWord('büyükbaba', 'grandfather', 'Mother\'s or father\'s father', 'Büyükbabam gazete okuyor.'),
  createWord('teyze', 'aunt (maternal)', 'Mother\'s sister', 'Teyzem bizi ziyaret etti.'),
  createWord('hala', 'aunt (paternal)', 'Father\'s sister', 'Halam hediye getirdi.'),
  createWord('amca', 'uncle (paternal)', 'Father\'s brother', 'Amcam yurt dışında yaşıyor.'),

  // [Continue with 180 more family-related words...]
];

// Emotions Category - 200+ words
export const emotionsVocabulary: Word[] = [
  // Basic Emotions
  createWord('mutlu', 'happy', 'Feeling joy', 'Bugün çok mutluyum.', 'adjective'),
  createWord('üzgün', 'sad', 'Feeling sorrow', 'Üzgün görünüyorsun.', 'adjective'),
  createWord('kızgın', 'angry', 'Feeling anger', 'Kızgın bir şekilde çıktı.', 'adjective'),
  createWord('heyecanlı', 'excited', 'Feeling enthusiasm', 'Çok heyecanlıyım!', 'adjective'),
  createWord('endişeli', 'worried', 'Feeling anxiety', 'Endişeli bir ses tonu vardı.', 'adjective'),

  // Complex Emotions
  createWord('gurur', 'pride', 'Feeling of achievement', 'Gururla baktı.', 'noun'),
  createWord('özlem', 'longing', 'Missing something/someone', 'Özlem dolu günler.', 'noun'),
  createWord('umut', 'hope', 'Positive expectation', 'Umut her zaman var.', 'noun'),
  createWord('korku', 'fear', 'Feeling of danger', 'Korku filmini izledik.', 'noun'),
  createWord('sevgi', 'love', 'Deep affection', 'Sevgi her şeyi çözer.', 'noun'),

  // [Continue with 180 more emotion-related words...]
];

// Sports Category - 200+ words
export const sportsVocabulary: Word[] = [
  // Sports Types
  createWord('futbol', 'football', 'Popular ball game', 'Futbol maçı izledik.'),
  createWord('basketbol', 'basketball', 'Ball and hoop game', 'Basketbol oynamayı severim.'),
  createWord('voleybol', 'volleyball', 'Net ball game', 'Voleybol turnuvası var.'),
  createWord('tenis', 'tennis', 'Racket sport', 'Tenis kortunda antrenman yaptım.'),
  createWord('yüzme', 'swimming', 'Water sport', 'Yüzme havuzuna gidiyorum.'),

  // Sports Equipment
  createWord('top', 'ball', 'Spherical sports equipment', 'Yeni bir futbol topu aldım.'),
  createWord('raket', 'racket', 'Hitting tool in sports', 'Tenis raketi kırıldı.'),
  createWord('kale', 'goal', 'Scoring target', 'Kaleyi iyi savundu.'),
  createWord('file', 'net', 'Barrier in sports', 'File üzerinden attı.'),
  createWord('forma', 'jersey', 'Sports clothing', 'Yeni forma giydik.'),

  // [Continue with 180 more sports-related words...]
];

export const vocabularyCategories = {
  food: {
    name: 'Yemek',
    icon: '🍎',
    words: foodVocabulary,
    description: 'Turkish food and drink vocabulary'
  },
  travel: {
    name: 'Seyahat',
    icon: '✈️',
    words: travelVocabulary,
    description: 'Words for traveling in Turkey'
  },
  work: {
    name: 'İş',
    icon: '💼',
    words: workVocabulary,
    description: 'Business and work-related Turkish vocabulary'
  },
  family: {
    name: 'Aile',
    icon: '👨‍👩‍👧‍👦',
    words: familyVocabulary,
    description: 'Family terms in Turkish'
  },
  emotions: {
    name: 'Duygular',
    icon: '😊',
    words: emotionsVocabulary,
    description: 'Expressing feelings in Turkish'
  },
  sports: {
    name: 'Spor',
    icon: '⚽',
    words: sportsVocabulary,
    description: 'Sports and activities in Turkish'
  },
};

// English vocabulary data
export const englishVocabulary = {
  business: {
    name: 'Business',
    icon: '💼',
    description: 'Professional and business vocabulary',
    words: [
      {
        term: 'negotiate',
        definition: 'To discuss something to reach an agreement',
        example: 'We need to negotiate the terms of the contract.',
        partOfSpeech: 'verb',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'revenue',
        definition: 'Income generated from business activities',
        example: 'Our quarterly revenue exceeded expectations.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'investment',
        definition: 'The action of investing money for profit',
        example: 'They made a wise investment in technology stocks.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      }
    ]
  },
  travel: {
    name: 'Travel',
    icon: '✈️',
    description: 'Essential travel vocabulary',
    words: [
      {
        term: 'itinerary',
        definition: 'A planned route or journey',
        example: "I've prepared a detailed itinerary for our trip.",
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'destination',
        definition: 'The place to which someone or something is going',
        example: 'Paris is our final destination.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'accommodation',
        definition: 'A place where one temporarily stays',
        example: 'We booked our accommodation months in advance.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      }
    ]
  },
  academic: {
    name: 'Academic',
    icon: '📚',
    description: 'Academic and research vocabulary',
    words: [
      {
        term: 'hypothesis',
        definition: 'A proposed explanation for a phenomenon',
        example: 'The scientist developed a hypothesis about climate change.',
        partOfSpeech: 'noun',
        level: 'advanced',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'analyze',
        definition: 'To examine methodically and in detail',
        example: 'We need to analyze the research data.',
        partOfSpeech: 'verb',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'methodology',
        definition: 'A system of methods used in a particular field',
        example: 'The research methodology was clearly explained.',
        partOfSpeech: 'noun',
        level: 'advanced',
        sourceLang: 'english',
        targetLang: 'english'
      }
    ]
  },
  technology: {
    name: 'Technology',
    icon: '💻',
    description: 'Technology and digital terms',
    words: [
      {
        term: 'algorithm',
        definition: 'A process or set of rules to be followed in calculations or problem-solving',
        example: 'The search engine uses a complex algorithm.',
        partOfSpeech: 'noun',
        level: 'advanced',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'interface',
        definition: 'A point where two systems meet and interact',
        example: 'The user interface is very intuitive.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'bandwidth',
        definition: 'The capacity for data transfer of an electronic communications system',
        example: 'We need more bandwidth to stream high-quality videos.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      }
    ]
  },
  social: {
    name: 'Social',
    icon: '🗣️',
    description: 'Social interaction vocabulary',
    words: [
      {
        term: 'empathy',
        definition: 'The ability to understand and share the feelings of others',
        example: 'She showed great empathy towards her friend.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'collaborate',
        definition: 'To work jointly on an activity or project',
        example: 'The teams collaborate to achieve their goals.',
        partOfSpeech: 'verb',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'networking',
        definition: 'The action of interacting with others to exchange information and develop contacts',
        example: 'Networking is essential for career development.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      }
    ]
  },
  culture: {
    name: 'Culture',
    icon: '🎭',
    description: 'Cultural and arts vocabulary',
    words: [
      {
        term: 'tradition',
        definition: 'A long-established custom or belief',
        example: 'This festival is an important cultural tradition.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'heritage',
        definition: 'Valued objects and qualities passed down from previous generations',
        example: 'The building is part of our national heritage.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      },
      {
        term: 'diversity',
        definition: 'The state of being varied or different',
        example: 'Cultural diversity enriches our society.',
        partOfSpeech: 'noun',
        level: 'intermediate',
        sourceLang: 'english',
        targetLang: 'english'
      }
    ]
  }
};

// Chinese vocabulary categories
export const chineseVocabulary = {
  food: {
    name: '饮食',
    icon: '🍜',
    description: 'Essential food and dining vocabulary',
    words: [
      // Staple Foods
      { term: '米饭', definition: 'Rice (cooked)', example: '我每天都吃米饭。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'mǐfàn' },
      { term: '面条', definition: 'Noodles', example: '这些面条很好吃。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'miàntiáo' },
      { term: '包子', definition: 'Steamed bun', example: '早餐吃了两个包子。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'bāozi' },
      { term: '馒头', definition: 'Steamed bread', example: '我喜欢吃热馒头。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'mántou' },
      { term: '饺子', definition: 'Dumplings', example: '春节吃饺子。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'jiǎozi' },
      { term: '粥', definition: 'Porridge', example: '早上喝粥。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'zhōu' },
      { term: '汤', definition: 'Soup', example: '这个汤很好喝。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'tāng' },
      { term: '炒饭', definition: 'Fried rice', example: '我要一份炒饭。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'chǎofàn' },
      { term: '饼', definition: 'Pancake/flatbread', example: '这个饼很香。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'bǐng' },
      { term: '粉条', definition: 'Rice noodles', example: '粉条汤很美味。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'fěntiáo' },
      
      // Vegetables and Ingredients
      { term: '青菜', definition: 'Green vegetables', example: '多吃青菜。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'qīngcài' },
      { term: '土豆', definition: 'Potato', example: '我爱吃土豆。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'tǔdòu' },
      { term: '白菜', definition: 'Chinese cabbage', example: '白菜很便宜。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'báicài' },
      { term: '胡萝卜', definition: 'Carrot', example: '胡萝卜对眼睛好。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'húluóbo' },
      { term: '豆腐', definition: 'Tofu', example: '我喜欢吃豆腐。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'dòufu' },
      
      // Fruits
      { term: '苹果', definition: 'Apple', example: '这个苹果很甜。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'píngguǒ' },
      { term: '香蕉', definition: 'Banana', example: '香蕉很有营养。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'xiāngjiāo' },
      { term: '橙子', definition: 'Orange', example: '橙子很酸。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'chéngzi' },
      { term: '葡萄', definition: 'Grape', example: '葡萄很甜。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'pútao' },
      { term: '西瓜', definition: 'Watermelon', example: '夏天吃西瓜。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'xīguā' }
    ]
  },
  business: {
    name: '商务',
    icon: '💼',
    description: 'Business and professional Chinese',
    words: [
      // Office Environment
      { term: '会议', definition: 'Meeting', example: '明天有个重要会议。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'huìyì' },
      { term: '办公室', definition: 'Office', example: '这是我的办公室。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'bàngōngshì' },
      { term: '文件', definition: 'Document', example: '请签这个文件。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'wénjiàn' },
      { term: '报告', definition: 'Report', example: '我在写报告。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'bàogào' },
      { term: '电脑', definition: 'Computer', example: '我需要一台新电脑。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'diànnǎo' },
      
      // Business Communication
      { term: '合同', definition: 'Contract', example: '请审查这份合同。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'hétong' },
      { term: '谈判', definition: 'Negotiation', example: '我们正在谈判。', partOfSpeech: 'verb', level: 'advanced', phonetic: 'tánpàn' },
      { term: '客户', definition: 'Client', example: '这是重要客户。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'kèhù' },
      { term: '项目', definition: 'Project', example: '这是新项目。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'xiàngmù' },
      { term: '预算', definition: 'Budget', example: '预算很重要。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'yùsuàn' }
    ]
  },
  daily: {
    name: '日常生活',
    icon: '🌞',
    description: 'Everyday life and activities',
    words: [
      // Daily Activities
      { term: '起床', definition: 'Get up', example: '我每天七点起床。', partOfSpeech: 'verb', level: 'beginner', phonetic: 'qǐchuáng' },
      { term: '睡觉', definition: 'Sleep', example: '我要去睡觉了。', partOfSpeech: 'verb', level: 'beginner', phonetic: 'shuìjiào' },
      { term: '吃饭', definition: 'Eat', example: '到点吃饭了。', partOfSpeech: 'verb', level: 'beginner', phonetic: 'chīfàn' },
      { term: '工作', definition: 'Work', example: '我在工作。', partOfSpeech: 'verb', level: 'beginner', phonetic: 'gōngzuò' },
      { term: '学习', definition: 'Study', example: '我在学习中文。', partOfSpeech: 'verb', level: 'beginner', phonetic: 'xuéxí' },
      
      // Time Expressions
      { term: '今天', definition: 'Today', example: '今天天气很好。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'jīntiān' },
      { term: '明天', definition: 'Tomorrow', example: '明天见。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'míngtiān' },
      { term: '昨天', definition: 'Yesterday', example: '昨天很忙。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'zuótiān' },
      { term: '早上', definition: 'Morning', example: '早上好。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'zǎoshang' },
      { term: '晚上', definition: 'Evening', example: '晚上见。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'wǎnshang' }
    ]
  },
  technology: {
    name: '科技',
    icon: '💻',
    description: 'Technology and digital terms',
    words: [
      // Devices
      { term: '电脑', definition: 'Computer', example: '我的电脑需要修理。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'diànnǎo' },
      { term: '手机', definition: 'Mobile phone', example: '这是新手机。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'shǒujī' },
      { term: '平板', definition: 'Tablet', example: '用平板看书。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'píngbǎn' },
      { term: '耳机', definition: 'Headphones', example: '我的耳机坏了。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'ěrjī' },
      { term: '充电器', definition: 'Charger', example: '我需要充电器。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'chōngdiànqì' },
      
      // Internet Terms
      { term: '网络', definition: 'Internet', example: '网络很快。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'wǎngluò' },
      { term: '软件', definition: 'Software', example: '下载新软件。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'ruǎnjiàn' },
      { term: '密码', definition: 'Password', example: '请输入密码。', partOfSpeech: 'noun', level: 'beginner', phonetic: 'mìmǎ' },
      { term: '程序', definition: 'Program', example: '这个程序很好用。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'chéngxù' },
      { term: '数据', definition: 'Data', example: '保存数据。', partOfSpeech: 'noun', level: 'intermediate', phonetic: 'shùjù' }
    ]
  }
};

// German vocabulary categories
export const germanVocabulary = {
  food: {
    name: 'Essen',
    icon: '🥨',
    description: 'Food and dining vocabulary',
    words: [
      {
        term: 'Brot',
        definition: 'Bread',
        example: 'Ich esse gerne frisches Brot.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'german',
        targetLang: 'english'
      },
      {
        term: 'Kaffee',
        definition: 'Coffee',
        example: 'Jeden Morgen trinke ich Kaffee.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'german',
        targetLang: 'english'
      }
    ]
  },
  transport: {
    name: 'Verkehr',
    icon: '🚗',
    description: 'Transportation and travel terms',
    words: [
      {
        term: 'Bahnhof',
        definition: 'Train station',
        example: 'Der Zug fährt vom Hauptbahnhof ab.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'german',
        targetLang: 'english'
      }
    ]
  },
  work: {
    name: 'Arbeit',
    icon: '💼',
    description: 'Professional and workplace vocabulary',
    words: [
      {
        term: 'Büro',
        definition: 'Office',
        example: 'Ich arbeite im Büro.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'german',
        targetLang: 'english'
      },
    ]
  },
  leisure: {
    name: 'Freizeit',
    icon: '⚽',
    description: 'Hobbies and free time activities',
    words: [
      {
        term: 'Fußball',
        definition: 'Football/Soccer',
        example: 'Wir spielen gerne Fußball.',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'german',
        targetLang: 'english'
      }
    ]
  }
};

// Japanese vocabulary categories
export const japaneseVocabulary = {
  food: {
    name: '食べ物',
    icon: '🍱',
    description: 'Japanese cuisine and dining',
    words: [
      {
        term: 'ご飯',
        definition: 'Rice (cooked)',
        example: '毎日ご飯を食べます。',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'japanese',
        targetLang: 'english'
      },
      {
        term: '寿司',
        definition: 'Sushi',
        example: '寿司を食べに行きましょう。',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'japanese',
        targetLang: 'english'
      },
      {
        term: 'うどん',
        definition: 'Udon noodles',
        example: 'うどんが好きです。',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'japanese',
        targetLang: 'english'
      },
      {
        term: 'そば',
        definition: 'Soba noodles',
        example: '冷たいそばを注文しました。',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'japanese',
        targetLang: 'english'
      }
    ]
  },
  daily: {
    name: '日常生活',
    icon: '🌞',
    description: 'Daily life and activities',
    words: [
      {
        term: '朝ご飯',
        definition: 'Breakfast',
        example: '朝ご飯を食べました。',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'japanese',
        targetLang: 'english'
      },
      {
        term: '学校',
        definition: 'School',
        example: '学校に行きます。',
        partOfSpeech: 'noun',
        level: 'beginner',
        sourceLang: 'japanese',
        targetLang: 'english'
      }
    ]
  }
};
        