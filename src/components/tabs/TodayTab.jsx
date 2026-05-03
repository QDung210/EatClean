import { useMealTracking } from '../../hooks/useMealTracking'
import { useDayOverride } from '../../hooks/useDayOverride'
import { getPlanKey, getPlan } from '../../data/mealPlans'
import { calcTargets } from '../../utils/macroCalc'
import { toFullDisplay, isToday, isFuture } from '../../utils/dateUtils'
import Timeline from '../today/Timeline'
import MacroBars from '../today/MacroBars'
import SupplementTracker from '../today/SupplementTracker'
import WaterTracker from '../today/WaterTracker'

export default function TodayTab({ selectedDate, profile }) {
  const { override } = useDayOverride(selectedDate)
  const planKey = getPlanKey(selectedDate, override)
  const plan    = getPlan(planKey)
  const targets = calcTargets(profile, planKey)

  const { tracking, loading, toggleMeal, toggleSupp, setWater } = useMealTracking(selectedDate)

  const future   = isFuture(selectedDate)
  const todayDay = isToday(selectedDate)

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="tab-content">
      {/* Preview banner for non-today days */}
      {!todayDay && (
        <div className={`preview-banner ${future ? 'future' : 'past'}`}>
          {future ? '👁️ Xem trước:' : '📅 Nhìn lại:'} {toFullDisplay(selectedDate)}
        </div>
      )}

      {/* Activity Banner */}
      <div className={`activity-card ${plan.type}`}>
        <div className="activity-icon">
          {plan.type === 'gym' ? '🏋️' : '🏓'}
        </div>
        <div>
          <div className={`activity-title ${plan.type}`}>{plan.banner.title}</div>
          <div className="activity-desc">
            {plan.banner.desc}{' '}
            <strong style={{ color: plan.type === 'gym' ? 'var(--green2)' : 'var(--teal2)' }}>
              ~{targets.cal.toLocaleString('vi-VN')} kcal
            </strong>
          </div>
        </div>
      </div>

      {/* Macro stat cards */}
      <div className="summary-grid">
        <div className="stat-card cal">
          <div className="stat-unit">MỤC TIÊU</div>
          <div className="stat-val cal">{targets.cal.toLocaleString('vi-VN')}</div>
          <div className="stat-name">Calories</div>
        </div>
        <div className="stat-card prot">
          <div className="stat-unit">PROTEIN</div>
          <div className="stat-val prot">{targets.prot}g</div>
          <div className="stat-name">2.2g/kg</div>
        </div>
        <div className="stat-card carb">
          <div className="stat-unit">CARBS</div>
          <div className="stat-val carb">{targets.carb}g</div>
          <div className="stat-name">Tinh bột</div>
        </div>
        <div className="stat-card fat">
          <div className="stat-unit">CHẤT BÉO</div>
          <div className="stat-val fat">{targets.fat}g</div>
          <div className="stat-name">0.85g/kg</div>
        </div>
      </div>

      {/* Macro progress bars */}
      <MacroBars tracking={tracking} meals={plan.meals} targets={targets} />

      {/* Timeline */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-head">
          <div className="section-icon teal">🍽️</div>
          <div>
            <div className="section-title">Lịch ăn uống trong ngày</div>
            <div className="section-subtitle">Bấm vào mỗi bữa để đánh dấu hoàn thành</div>
          </div>
        </div>
        <Timeline meals={plan.meals} tracking={tracking} onToggleMeal={toggleMeal} />
      </section>

      {/* Supplements */}
      <SupplementTracker
        tracking={tracking}
        suppTimings={plan.suppTimings}
        onToggleSupp={toggleSupp}
      />

      {/* Water */}
      <WaterTracker cups={tracking.water_cups} onSetWater={setWater} />

      {/* Tips */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-head">
          <div className="section-icon green">💡</div>
          <div>
            <div className="section-title">Tips hôm nay</div>
            <div className="section-subtitle">
              {plan.type === 'gym' ? 'Tối ưu cho ngày Gym' : 'Tối ưu cho ngày Pickleball'}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="tips-list">
            {plan.tips.map(([, txt], i) => (
              <div className="tip-row" key={i}>
                <div className="tip-dot" />
                <span dangerouslySetInnerHTML={{ __html: txt }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
