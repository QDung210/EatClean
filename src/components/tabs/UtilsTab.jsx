import { useState } from 'react'
import { useDayOverride } from '../../hooks/useDayOverride'
import { PROTEIN_SWAPS, CARB_SWAPS, SHOPPING_LIST } from '../../data/mealPlans'
import { DAY_MAP } from '../../data/mealPlans'

function SwapTable({ title, icon, items }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="swap-subtitle">{icon} {title}</div>
      <div className="swap-grid">
        {items.map((f, i) => (
          <div key={i} className="swap-card">
            <div className="sc-icon">{f.icon}</div>
            <div className="sc-name">{f.name}</div>
            <div className="sc-pills">
              <span className="pill pill-prot">{f.prot}g P</span>
              <span className="pill pill-cal">{f.cal} kcal</span>
              {f.carb > 0 && <span className="pill pill-carb">{f.carb}g C</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UtilsTab({ selectedDate }) {
  const defaultPlanKey = DAY_MAP[selectedDate.getDay()]
  const { override, setOverridePlan } = useDayOverride(selectedDate)
  const [showShopping, setShowShopping] = useState(false)

  const effectivePlan = override ?? defaultPlanKey
  const isGym = effectivePlan.startsWith('gym')

  return (
    <div className="tab-content">
      {/* Day Override */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon amber">🔄</div>
          <div>
            <div className="section-title">Đổi loại ngày</div>
            <div className="section-subtitle">
              Mặc định: <b>{defaultPlanKey}</b>
              {override && <> → Override: <b style={{ color: 'var(--teal2)' }}>{override}</b></>}
            </div>
          </div>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 14 }}>
            Hôm nay lịch thay đổi? Chọn loại ngày phù hợp:
          </p>
          <div className="override-btns">
            <button
              className={`override-btn gym ${effectivePlan.startsWith('gym') && !override?.includes('sat') ? 'active' : ''}`}
              onClick={() => setOverridePlan('gym_work')}
            >🏋️ Gym (ngày thường)</button>
            <button
              className={`override-btn gym ${override === 'gym_sat' ? 'active' : ''}`}
              onClick={() => setOverridePlan('gym_sat')}
            >🏋️ Gym (nghỉ làm)</button>
            <button
              className={`override-btn pickle ${override === 'pickle_work' ? 'active' : ''}`}
              onClick={() => setOverridePlan('pickle_work')}
            >🏓 Pickleball (ngày làm)</button>
            <button
              className={`override-btn pickle ${override === 'pickle_sun' ? 'active' : ''}`}
              onClick={() => setOverridePlan('pickle_sun')}
            >🏓 Pickleball (nghỉ)</button>
            {override && (
              <button className="override-btn reset" onClick={() => setOverridePlan(null)}>
                ↺ Đặt lại mặc định
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Food Swap */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon teal">🔄</div>
          <div>
            <div className="section-title">Đổi nguồn thực phẩm</div>
            <div className="section-subtitle">Macro tương đương mỗi serving</div>
          </div>
        </div>
        <div className="card">
          <SwapTable title="Protein (1 serving ~30–40g P)" icon="🥩" items={PROTEIN_SWAPS} />
          <SwapTable title="Carbs (1 serving ~35–50g C)" icon="🌾" items={CARB_SWAPS} />
        </div>
      </section>

      {/* Shopping List */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon amber">🛒</div>
          <div>
            <div className="section-title">Danh sách mua sắm</div>
            <div className="section-subtitle">Cho 1 tuần (7 ngày)</div>
          </div>
        </div>
        <div className="card">
          {!showShopping ? (
            <button className="btn-primary" onClick={() => setShowShopping(true)}>
              🛒 Tạo danh sách
            </button>
          ) : (
            <>
              <button
                className="btn-ghost"
                style={{ marginBottom: 16 }}
                onClick={() => setShowShopping(false)}
              >↑ Ẩn</button>
              {SHOPPING_LIST.map((cat, i) => (
                <div key={i} className="shopping-cat">
                  <div className="shopping-cat-label">{cat.cat}</div>
                  <ul className="shopping-items">
                    {cat.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
