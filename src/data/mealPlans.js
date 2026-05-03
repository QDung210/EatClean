// ─────────────────────────────────────────────────────────────
// MEAL PLAN DATA
// planKey: gym_work | gym_sat | pickle_work | pickle_sun
// ─────────────────────────────────────────────────────────────

// Day-of-week → planKey mapping (0=Sun … 6=Sat)
export const DAY_MAP = {
  0: 'pickle_sun',
  1: 'gym_work',
  2: 'gym_work',
  3: 'pickle_work',
  4: 'gym_work',
  5: 'gym_work',
  6: 'gym_sat',
}

export const WEEK_CONFIG = [
  // ordered by getDay() value (0=Sun … 6=Sat)
  { dow: 0, label: 'CN', type: 'pickle', icon: '🏓' },
  { dow: 1, label: 'T2', type: 'gym',    icon: '🏋️' },
  { dow: 2, label: 'T3', type: 'gym',    icon: '🏋️' },
  { dow: 3, label: 'T4', type: 'pickle', icon: '🏓' },
  { dow: 4, label: 'T5', type: 'gym',    icon: '🏋️' },
  { dow: 5, label: 'T6', type: 'gym',    icon: '🏋️' },
  { dow: 6, label: 'T7', type: 'gym',    icon: '🏋️' },
]

// Supplement keys used in DB + their display info
export const SUPPS = [
  { key: 'creatine_done', icon: '⚗️', name: 'Creatine 5g',  color: 'purple' },
  { key: 'omega3_done',   icon: '🐟', name: 'Omega-3 × 2',  color: 'amber'  },
  { key: 'whey_done',     icon: '🥤', name: 'Whey Protein',  color: 'teal'   },
  { key: 'magie_done',    icon: '🧲', name: 'Magie 300mg',   color: 'purple' },
  { key: 'zinc_done',     icon: '⚡', name: 'Kẽm (Zinc)',    color: 'blue'   },
]

// ── HELPER ───────────────────────────────────────────────────
const meal = (time, timeCls, icon, dotCls, cardCls, name, cal, prot, carb, fat, foods, supps = [], isActivity = false, burn = null) =>
  ({ time, timeCls, icon, dotCls, cardCls, name, cal, prot, carb, fat, foods, supps, isActivity, burn })

// ── PLANS ─────────────────────────────────────────────────────
export const PLANS = {

  // ── GYM WORKDAY (T2/T3/T5/T6) ───────────────────────────────
  gym_work: {
    type: 'gym',
    defaultCal: 2300,
    defaultCarb: 255,
    banner: {
      type: 'gym',
      title: 'Ngày Gym — Đi làm + Gym 19h',
      desc: 'Đi làm 9h–18h, gym lúc 19h. Ăn pre-workout nhẹ trước khi rời công ty, nạp protein sau tập.',
    },
    suppTimings: {
      creatine_done: '7:30 sáng — cùng bữa sáng',
      omega3_done:   '7:30 sáng — sau bữa ăn',
      whey_done:     '20:45 tối — ngay sau gym',
      magie_done:    '22:00 tối — trước ngủ',
      zinc_done:     '22:00 tối — trước ngủ',
    },
    meals: [
      meal('7:30 sáng','','🌅','','c-amber','Bữa sáng',540,32,68,16,[
        ['🌾','Yến mạch 60g + nước sôi — 217 kcal'],
        ['🥚','2 trứng nguyên quả + 2 lòng trắng — 215 kcal'],
        ['🍌','1 quả chuối — 107 kcal'],
        ['💧','500ml nước'],
      ],[{n:'⚗️ Creatine 5g',c:'purple'},{n:'🐟 Omega-3 × 2',c:'amber'}]),

      meal('12:00 trưa — Ăn tại nơi làm','','🍗','','c-green','Bữa trưa',490,46,45,9,[
        ['🍗','Cơm gà ức nướng — ưu tiên ức, bỏ da'],
        ['🥗','Thêm rau/salad nếu có'],
        ['💡','Gợi ý: phở gà, cơm tấm sườn nạc — tránh đồ chiên'],
        ['💧','Nước lọc, tránh nước ngọt'],
      ]),

      meal('15:30 chiều','','🫐','','c-teal','Snack chiều',280,12,22,14,[
        ['🫙','Greek yogurt không đường 150g'],
        ['🍎','1 quả táo'],
        ['🌰','Hạnh nhân 20g'],
      ]),

      meal('18:15 — Trước khi đi gym','','⚡','','c-amber','Pre-Workout — Carb nhanh',220,5,46,2,[
        ['🍞','2 lát bánh mì đen — 160 kcal'],
        ['🍌','1 quả chuối nhỏ — 60 kcal'],
        ['💧','400ml nước trước gym'],
      ]),

      meal('19:00 – 20:30','green','🏋️','green-dot','c-act-green','Gym — Tập luyện',0,0,0,0,[
        ['💧','Uống nước đều đặn — 500ml–1L'],
        ['🧂','Mồ hôi nhiều → nước điện giải'],
      ],[],true,'300–450'),

      meal('20:45 tối — Ngay sau tắm','','🐟','','c-blue','Post-Workout + Bữa tối',680,67,62,18,[
        ['🥤','Whey protein 1 scoop pha nước — uống ngay'],
        ['🐟','Cá hồi / cá thu 130g áp chảo'],
        ['🍝','Pasta nguyên cám 75g (khô)'],
        ['🥬','Rau xào dầu ô liu'],
      ],[{n:'🥤 Whey 1 scoop',c:'teal'}]),

      meal('22:00 tối','purple','🌙','purple-dot','c-act-purple','Trước ngủ — Recovery',0,0,0,0,[
        ['😴','Tắt màn hình 30 phút trước ngủ'],
        ['💧','1 ly nước nhỏ (200ml)'],
      ],[{n:'🧲 Magie 300mg',c:'purple'},{n:'⚡ Kẽm',c:'blue'}],true),
    ],
    tips: [
      ['💪','<b style="color:var(--green2)">Pre-workout 18:15:</b> Carb nhanh (chuối + bánh mì). Không ăn quá no, cách tập ≥45 phút.'],
      ['🥤','<b style="color:var(--teal2)">Post-workout:</b> Nạp whey ngay sau tắm (~30 phút sau tập) để tối ưu MPS.'],
      ['🍝','<b style="color:var(--amber)">Pasta thay cơm:</b> Luộc 8–10 phút. GI thấp, giữ đường huyết ổn định.'],
      ['😴','<b style="color:var(--purple)">Ngủ 7–8 tiếng:</b> 70% phục hồi cơ xảy ra ban đêm. Magie + Kẽm giúp ngủ sâu.'],
    ],
  },

  // ── GYM SATURDAY (T7) ────────────────────────────────────────
  gym_sat: {
    type: 'gym',
    defaultCal: 2300,
    defaultCarb: 255,
    banner: {
      type: 'gym',
      title: 'Thứ 7 — Gym buổi tối (Nghỉ làm)',
      desc: 'Hôm nay không đi làm, gym lúc 19h. Sáng thoải mái hơn. Tranh thủ meal-prep cho cả tuần.',
    },
    suppTimings: {
      creatine_done: '8:30 sáng — cùng bữa sáng',
      omega3_done:   '8:30 sáng — sau bữa ăn',
      whey_done:     '20:45 tối — ngay sau gym',
      magie_done:    '22:30 tối — trước ngủ',
      zinc_done:     '22:30 tối — trước ngủ',
    },
    meals: [
      meal('8:30 sáng','','🌅','','c-amber','Bữa sáng (ngủ muộn hơn)',580,36,72,18,[
        ['🌾','Yến mạch 70g + bơ đậu phộng 1 muỗng'],
        ['🥚','3 trứng nguyên quả'],
        ['🍌','1 quả chuối'],
        ['💧','500ml nước'],
      ],[{n:'⚗️ Creatine 5g',c:'purple'},{n:'🐟 Omega-3 × 2',c:'amber'}]),

      meal('13:00 trưa','','🍗','','c-green','Bữa trưa',500,48,46,10,[
        ['🍗','Ức gà 150g luộc/áp chảo'],
        ['🍠','Khoai lang 200g (vi sóng 5–6 phút)'],
        ['🥦','Bông cải / rau cải xào dầu ô liu'],
      ]),

      meal('16:00 chiều','','🫐','','c-teal','Snack chiều',270,11,22,14,[
        ['🫙','Greek yogurt 150g'],
        ['🫐','Việt quất / dâu tây 80g'],
        ['🌰','Hạnh nhân 20g'],
      ]),

      meal('18:15 — Chuẩn bị gym','','⚡','','c-amber','Pre-Workout',220,5,46,2,[
        ['🍞','2 lát bánh mì đen'],
        ['🍌','1 quả chuối'],
        ['💧','400ml nước trước gym'],
      ]),

      meal('19:00 – 20:30','green','🏋️','green-dot','c-act-green','Gym — Tập luyện',0,0,0,0,[
        ['💧','500ml–1L trong khi tập'],
      ],[],true,'300–450'),

      meal('20:45 tối — Sau tắm','','🐟','','c-blue','Post-Workout + Bữa tối',680,67,62,18,[
        ['🥤','Whey 1 scoop — uống ngay'],
        ['🐟','Cá hồi 130g áp chảo'],
        ['🍝','Pasta nguyên cám 75g (khô)'],
        ['🥬','Rau xào'],
      ],[{n:'🥤 Whey 1 scoop',c:'teal'}]),

      meal('22:30 tối','purple','🌙','purple-dot','c-act-purple','Trước ngủ',0,0,0,0,[
        ['😴','Tắt màn hình 30 phút trước ngủ'],
      ],[{n:'🧲 Magie 300mg',c:'purple'},{n:'⚡ Kẽm',c:'blue'}],true),
    ],
    tips: [
      ['🥗','<b style="color:var(--green2)">Meal prep Thứ 7:</b> Luộc sẵn ức gà + khoai lang cho cả tuần. Tiết kiệm thời gian tối đa.'],
      ['💪','<b style="color:var(--teal2)">Post-workout:</b> Dù về muộn vẫn cần ăn đủ — bỏ qua bữa tối sẽ mất cơ.'],
      ['😴','<b style="color:var(--purple)">Thứ 7 đừng thức khuya:</b> Tập xong muộn càng cần ngủ đủ để recovery.'],
    ],
  },

  // ── PICKLEBALL WEEKDAY (T4) ──────────────────────────────────
  pickle_work: {
    type: 'pickleball',
    defaultCal: 2200,
    defaultCarb: 245,
    banner: {
      type: 'pickleball',
      title: 'Thứ 4 — Đi làm + Pickleball tối',
      desc: 'Đi làm 9h–18h, pickleball sau giờ làm. Carb trước khi ra sân, whey ngay sau khi chơi xong.',
    },
    suppTimings: {
      creatine_done: '7:30 sáng — cùng bữa sáng',
      omega3_done:   '7:30 sáng — sau bữa ăn',
      whey_done:     '20:45 tối — ngay sau pickleball',
      magie_done:    '22:00 tối — trước ngủ',
      zinc_done:     '22:00 tối — trước ngủ',
    },
    meals: [
      meal('7:30 sáng','','🌅','','c-amber','Bữa sáng',540,32,68,16,[
        ['🌾','Yến mạch 60g + nước sôi'],
        ['🥚','2 trứng + 2 lòng trắng'],
        ['🍌','1 chuối'],
        ['💧','500ml nước'],
      ],[{n:'⚗️ Creatine 5g',c:'purple'},{n:'🐟 Omega-3 × 2',c:'amber'}]),

      meal('12:00 trưa — Tại nơi làm','','🍗','','c-green','Bữa trưa',490,46,45,9,[
        ['🍗','Cơm gà ức / phở gà — tránh đồ chiên'],
        ['💡','Gợi ý: cơm tấm sườn nạc, gỏi cuốn tôm'],
        ['💧','Nước lọc'],
      ]),

      meal('15:30 chiều','','🫐','','c-teal','Snack chiều',250,9,26,12,[
        ['🫙','Greek yogurt 150g'],
        ['🍎','1 quả táo'],
        ['🌰','Hạnh nhân 15g'],
      ]),

      meal('18:15 — Trước khi ra sân','','⚡','','c-amber','Pre-Pickleball — Carb nhanh',220,5,46,2,[
        ['🍞','2 lát bánh mì đen'],
        ['🍌','1 quả chuối nhỏ'],
        ['💧','400–500ml nước trước sân'],
      ]),

      meal('19:00 – 20:30','green','🏓','green-dot','c-act-teal','Pickleball — Cardio & Fun',0,0,0,0,[
        ['💧','Uống đều trong khi chơi — 500ml–1L'],
        ['🧂','Mồ hôi nhiều → điện giải'],
      ],[],true,'350–500'),

      meal('20:45 tối — Sau tắm','','🐟','','c-blue','Post-Workout + Bữa tối',640,63,58,17,[
        ['🥤','Whey 1 scoop — uống ngay sau tắm'],
        ['🐟','Cá ngừ / trứng chiên 130g'],
        ['🍝','Pasta nguyên cám 75g (khô)'],
        ['🥬','Rau xào tỏi'],
      ],[{n:'🥤 Whey 1 scoop',c:'teal'}]),

      meal('22:00 tối','purple','🌙','purple-dot','c-act-purple','Trước ngủ',0,0,0,0,[
        ['😴','Tắt màn hình 30 phút'],
      ],[{n:'🧲 Magie 300mg',c:'purple'},{n:'⚡ Kẽm',c:'blue'}],true),
    ],
    tips: [
      ['🏓','<b style="color:var(--teal2)">Pickleball tiêu hao nhiều:</b> Đảm bảo ăn đủ carb buổi chiều để có sức chơi.'],
      ['💧','<b style="color:var(--blue)">Hydration:</b> Mất nhiều nước qua mồ hôi. Uống 500ml trong + 500ml sau khi chơi.'],
      ['💪','<b style="color:var(--teal2)">Pickleball = cardio tốt:</b> Kết hợp với gym → đốt mỡ hiệu quả hơn.'],
    ],
  },

  // ── PICKLEBALL SUNDAY (CN) ───────────────────────────────────
  pickle_sun: {
    type: 'pickleball',
    defaultCal: 2200,
    defaultCarb: 245,
    banner: {
      type: 'pickleball',
      title: 'Chủ nhật — Pickleball buổi sáng',
      desc: 'Nghỉ làm, pickleball sáng. Ăn sáng → nghỉ 1.5h → ra sân. Whey ngay sau khi tắm.',
    },
    suppTimings: {
      creatine_done: '7:30 sáng — cùng bữa sáng',
      omega3_done:   '7:30 sáng — sau bữa ăn',
      whey_done:     '12:15 trưa — ngay sau pickleball',
      magie_done:    '21:30 tối — trước ngủ',
      zinc_done:     '21:30 tối — trước ngủ',
    },
    meals: [
      meal('7:30 sáng','','🌅','','c-amber','Bữa sáng',540,32,68,16,[
        ['🌾','Yến mạch 60g + nước sôi'],
        ['🥚','2 trứng + 2 lòng trắng'],
        ['🍌','1 chuối'],
        ['💧','500ml nước'],
      ],[{n:'⚗️ Creatine 5g',c:'purple'},{n:'🐟 Omega-3 × 2',c:'amber'}]),

      meal('9:30 — Trước pickleball 30 phút','','⚡','','c-green','Pre-Pickleball Snack',220,5,46,2,[
        ['🍞','2 lát bánh mì đen — 160 kcal'],
        ['🍎','1 quả táo — 60 kcal'],
        ['💧','500ml nước trước khi ra sân'],
      ]),

      meal('10:00 – 11:30','green','🏓','green-dot','c-act-teal','Pickleball — Cardio & Fun',0,0,0,0,[
        ['💧','Uống nước đều — 500ml–1L'],
        ['🧂','Mồ hôi nhiều → nước điện giải'],
      ],[],true,'450–600'),

      meal('12:30 trưa — Sau khi tắm','','🍗','','c-teal','Bữa trưa + Post-Workout',610,74,52,11,[
        ['🥤','Whey 1 scoop — uống ngay sau tắm'],
        ['🍗','Ức gà 130g luộc/áp chảo'],
        ['🍠','Khoai lang 180g (vi sóng 5–6 phút)'],
        ['🥦','Rau xanh xào dầu ô liu'],
      ],[{n:'🥤 Whey 1 scoop',c:'teal'}]),

      meal('15:30 chiều','','🫐','','c-purple','Snack chiều',310,14,25,17,[
        ['🫙','Greek yogurt 150g'],
        ['🫐','Việt quất / dâu tây 80g'],
        ['🌰','Hạnh nhân 25g'],
      ]),

      meal('19:00 tối','','🐟','','c-blue','Bữa tối',560,42,58,16,[
        ['🐟','Cá hồi / cá thu 130g áp chảo'],
        ['🍝','Pasta nguyên cám 75g (khô)'],
        ['🥬','Rau cải xào hành tỏi + dầu ô liu'],
      ]),

      meal('21:30 tối','purple','🌙','purple-dot','c-act-purple','Trước ngủ',0,0,0,0,[
        ['😴','Tắt màn hình 30 phút'],
        ['💧','1 ly nước nhỏ (200ml)'],
      ],[{n:'🧲 Magie 300mg',c:'purple'},{n:'⚡ Kẽm',c:'blue'}],true),
    ],
    tips: [
      ['🏓','<b style="color:var(--teal2)">Chủ nhật:</b> Ăn sáng xong nghỉ ~1.5h rồi ra sân. Tránh chạy ngay sau ăn no.'],
      ['💧','<b style="color:var(--blue)">Hydration sáng:</b> Sau ngủ thường thiếu nước. Uống đủ trước khi chơi.'],
      ['🍠','<b style="color:var(--amber)">Khoai lang thay cơm:</b> Vi sóng 5–6 phút, không cần nồi cơm. GI thấp hơn cơm trắng.'],
      ['😴','<b style="color:var(--purple)">Ngủ trưa 20–30 phút:</b> Sau pickleball buổi sáng, ngủ ngắn tăng phục hồi hiệu quả.'],
    ],
  },
}

/** Get the plan key for a given date, respecting any override */
export function getPlanKey(date, override = null) {
  if (override) return override
  return DAY_MAP[date.getDay()]
}

/** Get the plan object for a given planKey */
export function getPlan(planKey) {
  return PLANS[planKey] ?? PLANS['gym_work']
}

// Food swap data for the Utilities tab
export const PROTEIN_SWAPS = [
  { icon: '🍗', name: 'Ức gà 130g',     cal: 210, prot: 40, carb: 0,  fat: 5  },
  { icon: '🐟', name: 'Cá hồi 130g',    cal: 240, prot: 33, carb: 0,  fat: 13 },
  { icon: '🥩', name: 'Thịt bò nạc 120g',cal:220, prot: 36, carb: 0,  fat: 9  },
  { icon: '🦐', name: 'Tôm 150g',        cal: 140, prot: 30, carb: 2,  fat: 1  },
  { icon: '🥚', name: 'Trứng × 4 quả',  cal: 312, prot: 24, carb: 2,  fat: 22 },
  { icon: '🐟', name: 'Cá thu 130g',     cal: 220, prot: 34, carb: 0,  fat: 9  },
  { icon: '🧈', name: 'Đậu hũ cứng 250g',cal:190, prot: 20, carb: 6,  fat: 10 },
]

export const CARB_SWAPS = [
  { icon: '🍠', name: 'Khoai lang 180g', cal: 154, prot: 3,  carb: 36, fat: 0  },
  { icon: '🍝', name: 'Pasta nguyên cám 75g', cal:265, prot:10, carb:52,fat:2  },
  { icon: '🌾', name: 'Yến mạch 60g',    cal: 217, prot: 7,  carb: 39, fat: 4  },
  { icon: '🍞', name: 'Bánh mì đen 3 lát',cal:240, prot: 9,  carb: 45, fat: 3  },
  { icon: '🌽', name: 'Ngô hạt 170g',    cal: 196, prot: 7,  carb: 44, fat: 2  },
]

export const SHOPPING_LIST = [
  { cat: '🥩 Protein', items: ['Ức gà: ~1kg','Cá hồi / cá thu: 400g','Trứng gà: 28–35 quả','Whey protein: kiểm tra còn bao nhiêu'] },
  { cat: '🌾 Carbs',   items: ['Yến mạch cán: 500g','Bánh mì đen nguyên cám: 1–2 ổ','Khoai lang: 1.5kg','Pasta nguyên cám: 500g'] },
  { cat: '🥦 Rau & Trái cây', items: ['Chuối: 14 quả','Táo: 7 quả','Bông cải xanh: 300g','Rau cải: 500g','Việt quất / dâu: 300g'] },
  { cat: '🥛 Sữa & Chất béo', items: ['Greek yogurt không đường: 7 hộp 150g','Bơ đậu phộng không đường: 1 hũ','Hạnh nhân: 200g','Dầu ô liu: 1 chai nhỏ'] },
  { cat: '💊 Supplements', items: ['Creatine: kiểm tra','Whey protein: kiểm tra','Omega-3: kiểm tra','Magie: kiểm tra','Kẽm (Zinc): kiểm tra'] },
]
