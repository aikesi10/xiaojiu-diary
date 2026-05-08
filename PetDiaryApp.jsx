import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Home, ListChecks, Image as ImageIcon, BarChart3, User, Plus, X, Bone, Footprints, Scale, Syringe, Heart, ChevronRight, Bell, Edit3, Cake, MapPin, Sparkles } from 'lucide-react';

export default function PetDiaryApp() {
  // 加载 Google 字体
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+SC:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  // 家庭成员
  const familyMembers = [
    { id: 'mom', name: '妈妈', emoji: '👩', color: '#E8825A', bg: '#FCE8DC' },
    { id: 'dad', name: '爸爸', emoji: '👨', color: '#5C8A82', bg: '#DDEBE7' },
    { id: 'me', name: '我', emoji: '🧑', color: '#C09530', bg: '#FAEED2' },
    { id: 'sister', name: '姐姐', emoji: '👧', color: '#B85878', bg: '#F5DCE3' },
  ];

  const [currentUser, setCurrentUser] = useState('me');
  const me = familyMembers.find(m => m.id === currentUser);

  // 狗狗信息
  const [dog, setDog] = useState({
    name: '小九',
    breed: '柯基',
    birthday: '2023-08-15',
    gender: '公',
    emoji: '🐕',
  });

  // 记录数据(预填一些示例)
  const today = new Date();
  const ymd = (d) => d.toISOString().slice(0, 10);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const dayBefore = new Date(today); dayBefore.setDate(today.getDate() - 2);
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const twoWeekAgo = new Date(today); twoWeekAgo.setDate(today.getDate() - 14);

  const [records, setRecords] = useState([
    { id: '1', type: 'feed', date: ymd(today), time: '08:00', who: 'mom', data: { food: '皇家狗粮', amount: 120 } },
    { id: '2', type: 'walk', date: ymd(today), time: '07:30', who: 'dad', data: { duration: 25, location: '楼下小公园' } },
    { id: '3', type: 'weight', date: ymd(today), time: '09:00', who: 'me', data: { value: 12.4 } },
    { id: '4', type: 'feed', date: ymd(yesterday), time: '19:00', who: 'sister', data: { food: '皇家狗粮', amount: 130 } },
    { id: '5', type: 'walk', date: ymd(yesterday), time: '18:00', who: 'mom', data: { duration: 40, location: '河边步道' } },
    { id: '6', type: 'health', date: ymd(yesterday), time: '20:00', who: 'mom', data: { issue: '今天有点没精神', notes: '观察一晚' } },
    { id: '7', type: 'weight', date: ymd(weekAgo), time: '10:00', who: 'me', data: { value: 12.1 } },
    { id: '8', type: 'weight', date: ymd(twoWeekAgo), time: '10:00', who: 'me', data: { value: 11.8 } },
    { id: '9', type: 'vaccine', date: ymd(dayBefore), time: '15:00', who: 'dad', data: { type: '体外驱虫', notes: '福来恩' } },
    { id: '10', type: 'photo', date: ymd(today), time: '11:00', who: 'sister', data: { caption: '今天好像笑了!', emoji: '😄' } },
    { id: '11', type: 'photo', date: ymd(yesterday), time: '16:00', who: 'me', data: { caption: '抓到了它最丑的一面', emoji: '😴' } },
    { id: '12', type: 'photo', date: ymd(weekAgo), time: '12:00', who: 'mom', data: { caption: '春游!', emoji: '🌸' } },
  ]);

  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(null);

  // 排序后的记录(最新在前)
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const ka = a.date + a.time;
      const kb = b.date + b.time;
      return kb.localeCompare(ka);
    });
  }, [records]);

  const todayStr = ymd(today);
  const todayRecords = sortedRecords.filter(r => r.date === todayStr);

  // 添加记录
  const addRecord = (record) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newRecord = {
      id: String(Date.now()),
      date: ymd(now),
      time,
      who: currentUser,
      ...record,
    };
    setRecords([newRecord, ...records]);
    setShowAddModal(false);
    setAddType(null);
  };

  // 计算狗狗年龄
  const dogAge = useMemo(() => {
    const birth = new Date(dog.birthday);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    const years = Math.floor(months / 12);
    const restMonths = months % 12;
    if (years === 0) return `${months}个月`;
    return `${years}岁${restMonths > 0 ? restMonths + '个月' : ''}`;
  }, [dog.birthday]);

  // 最新体重
  const latestWeight = useMemo(() => {
    const ws = records.filter(r => r.type === 'weight').sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    return ws[0]?.data?.value || null;
  }, [records]);

  // 体重历史(图表用)
  const weightHistory = useMemo(() => {
    return records
      .filter(r => r.type === 'weight')
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(r => ({ date: r.date.slice(5), weight: r.data.value }));
  }, [records]);

  // 今日统计
  const todayStats = useMemo(() => {
    const feeds = todayRecords.filter(r => r.type === 'feed').length;
    const walks = todayRecords.filter(r => r.type === 'walk');
    const walkMinutes = walks.reduce((sum, w) => sum + (w.data.duration || 0), 0);
    return { feeds, walkMinutes, walks: walks.length };
  }, [todayRecords]);

  // 下次驱虫提醒(假定每月一次)
  const nextDeworm = useMemo(() => {
    const dewormRecords = records.filter(r => r.type === 'vaccine' && r.data.type?.includes('驱虫')).sort((a, b) => b.date.localeCompare(a.date));
    if (dewormRecords.length === 0) return null;
    const last = new Date(dewormRecords[0].date);
    const next = new Date(last); next.setDate(next.getDate() + 30);
    const days = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
    return days;
  }, [records]);

  // 类型配置
  const typeConfig = {
    feed: { label: '喂食', emoji: '🍖', icon: Bone, color: '#C09530', bg: '#FAEED2' },
    walk: { label: '遛狗', emoji: '🚶', icon: Footprints, color: '#5C8A82', bg: '#DDEBE7' },
    weight: { label: '体重', emoji: '⚖️', icon: Scale, color: '#7B6BA8', bg: '#E8E4F2' },
    vaccine: { label: '疫苗驱虫', emoji: '💉', icon: Syringe, color: '#B85878', bg: '#F5DCE3' },
    health: { label: '健康', emoji: '❤️', icon: Heart, color: '#E8825A', bg: '#FCE8DC' },
    photo: { label: '相册', emoji: '📸', icon: ImageIcon, color: '#3D6B8E', bg: '#DCE6F0' },
  };

  // 描述记录的文字
  const describeRecord = (r) => {
    const t = typeConfig[r.type];
    if (r.type === 'feed') return `${r.data.food} · ${r.data.amount}g`;
    if (r.type === 'walk') return `${r.data.location || '散步'} · ${r.data.duration}分钟`;
    if (r.type === 'weight') return `称重 · ${r.data.value}kg`;
    if (r.type === 'vaccine') return `${r.data.type}${r.data.notes ? ' · ' + r.data.notes : ''}`;
    if (r.type === 'health') return r.data.issue;
    if (r.type === 'photo') return r.data.caption;
    return t.label;
  };

  const photos = sortedRecords.filter(r => r.type === 'photo');

  return (
    <div style={{
      fontFamily: "'Noto Sans SC', -apple-system, sans-serif",
      background: '#FAF4EB',
      minHeight: '100vh',
      padding: '20px 0',
    }}>
      <style>{`
        .display-font { font-family: 'ZCOOL KuaiLe', 'Noto Sans SC', sans-serif; letter-spacing: 0.02em; }
        .scroll-area { overflow-y: auto; }
        .scroll-area::-webkit-scrollbar { width: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .slide-up { animation: slideUp 0.25s ease-out; }
        @keyframes pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .pop { animation: pop 0.2s ease-out; }
        .tap-area { transition: transform 0.1s; }
        .tap-area:active { transform: scale(0.96); }
      `}</style>

      <div style={{
        maxWidth: 400,
        margin: '0 auto',
        background: '#FFFCF7',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(80, 50, 20, 0.08), 0 1px 3px rgba(80, 50, 20, 0.04)',
        position: 'relative',
        height: 780,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #F0E6D6',
      }}>
        {/* 顶栏:用户切换 */}
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid #F0E6D6',
          background: '#FFFCF7',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="display-font" style={{ fontSize: 22, color: '#3D2B1F', fontWeight: 'normal' }}>
              小九专属
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#C09530', fontSize: 13 }}>
              <Sparkles size={14} />
              <span>记录第 {records.length} 条</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#A89478', marginRight: 4 }}>当前:</span>
            {familyMembers.map(m => (
              <button
                key={m.id}
                onClick={() => setCurrentUser(m.id)}
                className="tap-area"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 14,
                  border: 'none',
                  background: currentUser === m.id ? m.color : 'transparent',
                  color: currentUser === m.id ? '#FFF' : '#8B7355',
                  fontSize: 12,
                  fontWeight: currentUser === m.id ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}>
                <span>{m.emoji}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="scroll-area" style={{ flex: 1, padding: '0 0 80px' }}>
          {activeTab === 'home' && (
            <div className="fade-in" style={{ padding: '16px 20px' }}>
              {/* 狗狗卡片 */}
              <div style={{
                background: 'linear-gradient(135deg, #FFE8C9 0%, #FAEED2 100%)',
                borderRadius: 20,
                padding: '18px 20px',
                marginBottom: 16,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15 }}>🐾</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, position: 'relative' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 34,
                    boxShadow: '0 2px 8px rgba(192, 149, 48, 0.2)',
                  }}>{dog.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div className="display-font" style={{ fontSize: 22, color: '#3D2B1F', marginBottom: 2 }}>
                      {dog.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#7A5E3C', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>{dog.breed}</span>
                      <span style={{ color: '#C7B080' }}>·</span>
                      <span><Cake size={11} style={{ display: 'inline', marginRight: 2, verticalAlign: -1 }} />{dogAge}</span>
                      <span style={{ color: '#C7B080' }}>·</span>
                      <span>{dog.gender}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <StatBox label="今日喂食" value={todayStats.feeds} unit="次" />
                  <StatBox label="遛狗时长" value={todayStats.walkMinutes} unit="分钟" />
                  <StatBox label="最新体重" value={latestWeight || '—'} unit="kg" />
                </div>
              </div>

              {/* 提醒 */}
              {nextDeworm !== null && nextDeworm <= 7 && (
                <div style={{
                  background: '#F5DCE3',
                  borderRadius: 14,
                  padding: '12px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <Bell size={18} color="#B85878" />
                  <div style={{ flex: 1, fontSize: 13, color: '#7A2D44' }}>
                    距下次驱虫还有 <strong>{nextDeworm}</strong> 天
                  </div>
                </div>
              )}

              {/* 快捷记录 */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, color: '#8B7355', marginBottom: 10, fontWeight: 500 }}>
                  快捷记录
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {Object.entries(typeConfig).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => { setAddType(key); setShowAddModal(true); }}
                      className="tap-area"
                      style={{
                        background: t.bg,
                        border: 'none',
                        borderRadius: 14,
                        padding: '14px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}>
                      <div style={{ fontSize: 26, marginBottom: 4 }}>{t.emoji}</div>
                      <div style={{ fontSize: 12, color: t.color, fontWeight: 500 }}>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 今日记录 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: '#8B7355', fontWeight: 500 }}>今日动态</div>
                  <button onClick={() => setActiveTab('records')} style={{ background: 'none', border: 'none', fontSize: 12, color: '#C09530', cursor: 'pointer', fontFamily: 'inherit' }}>
                    全部 ›
                  </button>
                </div>
                {todayRecords.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#A89478', fontSize: 13 }}>
                    今天还没有记录,点上面的按钮加一条吧 🐾
                  </div>
                ) : (
                  todayRecords.map(r => <RecordItem key={r.id} record={r} />)
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <RecordsView records={sortedRecords} />
          )}

          {activeTab === 'photos' && (
            <PhotosView photos={photos} />
          )}

          {activeTab === 'data' && (
            <DataView records={records} weightHistory={weightHistory} dog={dog} />
          )}

          {activeTab === 'profile' && (
            <ProfileView dog={dog} setDog={setDog} familyMembers={familyMembers} records={records} />
          )}
        </div>

        {/* 底部导航 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#FFFCF7',
          borderTop: '1px solid #F0E6D6',
          display: 'flex',
          padding: '8px 0 12px',
        }}>
          {[
            { id: 'home', icon: Home, label: '首页' },
            { id: 'records', icon: ListChecks, label: '记录' },
            { id: 'photos', icon: ImageIcon, label: '相册' },
            { id: 'data', icon: BarChart3, label: '数据' },
            { id: 'profile', icon: User, label: '我的' },
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex: 1, background: 'none', border: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  padding: '4px', cursor: 'pointer',
                  color: active ? '#E8825A' : '#A89478',
                  fontFamily: 'inherit',
                }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 10, fontWeight: active ? 500 : 400 }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 添加记录弹窗 */}
        {showAddModal && (
          <AddRecordModal
            type={addType}
            typeConfig={typeConfig}
            onClose={() => { setShowAddModal(false); setAddType(null); }}
            onSubmit={addRecord}
            currentMember={me}
          />
        )}
      </div>

      {/* 提示语 */}
      <div style={{
        maxWidth: 400, margin: '12px auto 0', padding: '0 20px',
        textAlign: 'center', fontSize: 11, color: '#A89478', lineHeight: 1.6,
      }}>
        💡 这是预览版,刷新页面数据会重置。确认设计后我会帮你接上云数据库,4 人共享。
      </div>
    </div>
  );

  // === 子组件 ===
  function StatBox({ label, value, unit }) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        padding: '10px 8px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: '#8B6F4A', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#3D2B1F' }}>
          {value}
          <span style={{ fontSize: 10, fontWeight: 400, color: '#8B6F4A', marginLeft: 2 }}>{unit}</span>
        </div>
      </div>
    );
  }

  function RecordItem({ record }) {
    const t = typeConfig[record.type];
    const m = familyMembers.find(x => x.id === record.who);
    return (
      <div className="fade-in" style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid #F5EBD7',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: t.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{t.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: '#3D2B1F', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {describeRecord(record)}
          </div>
          <div style={{ fontSize: 11, color: '#A89478', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{record.time}</span>
            <span style={{
              background: m.bg, color: m.color, padding: '1px 7px', borderRadius: 8, fontSize: 10, fontWeight: 500,
            }}>{m.emoji} {m.name}记的</span>
          </div>
        </div>
      </div>
    );
  }

  function RecordsView({ records }) {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);
    // 按日期分组
    const grouped = useMemo(() => {
      const g = {};
      filtered.forEach(r => {
        if (!g[r.date]) g[r.date] = [];
        g[r.date].push(r);
      });
      return g;
    }, [filtered]);
    const formatDate = (d) => {
      if (d === todayStr) return '今天';
      const date = new Date(d);
      const yest = new Date(today); yest.setDate(today.getDate() - 1);
      if (d === ymd(yest)) return '昨天';
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    };

    return (
      <div className="fade-in" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>全部</FilterChip>
          {Object.entries(typeConfig).map(([k, t]) => (
            <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)} color={t.color} bg={t.bg}>
              {t.emoji} {t.label}
            </FilterChip>
          ))}
        </div>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#A89478', fontSize: 13 }}>
            还没有这类记录
          </div>
        ) : (
          Object.entries(grouped).map(([date, recs]) => (
            <div key={date} style={{ marginBottom: 16 }}>
              <div className="display-font" style={{ fontSize: 14, color: '#8B7355', marginBottom: 4, paddingBottom: 4 }}>
                {formatDate(date)}
              </div>
              {recs.map(r => <RecordItem key={r.id} record={r} />)}
            </div>
          ))
        )}
      </div>
    );
  }

  function FilterChip({ children, active, onClick, color = '#E8825A', bg = '#FCE8DC' }) {
    return (
      <button
        onClick={onClick}
        className="tap-area"
        style={{
          padding: '5px 12px', borderRadius: 14,
          border: 'none',
          background: active ? color : bg,
          color: active ? '#FFF' : color,
          fontSize: 12, fontWeight: 500,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}>
        {children}
      </button>
    );
  }

  function PhotosView({ photos }) {
    return (
      <div className="fade-in" style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 14, fontSize: 13, color: '#8B7355' }}>
          共 <strong style={{ color: '#3D2B1F' }}>{photos.length}</strong> 张瞬间
        </div>
        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#A89478', fontSize: 13 }}>
            还没有照片<br /><span style={{ fontSize: 11 }}>(正式版会支持上传真实照片)</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {photos.map(p => {
              const m = familyMembers.find(x => x.id === p.who);
              return (
                <div key={p.id} style={{
                  background: '#FAEED2',
                  borderRadius: 14,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    aspectRatio: '1',
                    background: `linear-gradient(135deg, ${m.bg} 0%, #FFFCF7 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 60,
                  }}>
                    {p.data.emoji || '🐕'}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 12, color: '#3D2B1F', marginBottom: 4, lineHeight: 1.4 }}>
                      {p.data.caption}
                    </div>
                    <div style={{ fontSize: 10, color: m.color }}>
                      {m.emoji} {m.name} · {p.date.slice(5)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function DataView({ records, weightHistory, dog }) {
    // 7天遛狗时长统计
    const weeklyWalk = useMemo(() => {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const ds = ymd(d);
        const walks = records.filter(r => r.type === 'walk' && r.date === ds);
        const minutes = walks.reduce((s, w) => s + (w.data.duration || 0), 0);
        data.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, minutes });
      }
      return data;
    }, [records]);

    const totalRecords = {
      feed: records.filter(r => r.type === 'feed').length,
      walk: records.filter(r => r.type === 'walk').length,
      photo: records.filter(r => r.type === 'photo').length,
      vaccine: records.filter(r => r.type === 'vaccine').length,
    };

    // 谁记得最多
    const byUser = familyMembers.map(m => ({
      ...m,
      count: records.filter(r => r.who === m.id).length,
    })).sort((a, b) => b.count - a.count);

    return (
      <div className="fade-in" style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 18 }}>
          <div className="display-font" style={{ fontSize: 16, color: '#3D2B1F', marginBottom: 10 }}>
            体重曲线
          </div>
          <div style={{ background: '#FFFCF7', borderRadius: 14, padding: '14px 8px 8px', border: '1px solid #F0E6D6', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B7355' }} />
                <YAxis tick={{ fontSize: 10, fill: '#8B7355' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#FFFCF7', border: '1px solid #E8825A', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="#E8825A" strokeWidth={2.5} dot={{ fill: '#E8825A', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div className="display-font" style={{ fontSize: 16, color: '#3D2B1F', marginBottom: 10 }}>
            一周遛狗
          </div>
          <div style={{ background: '#FFFCF7', borderRadius: 14, padding: 14, border: '1px solid #F0E6D6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, gap: 6 }}>
              {weeklyWalk.map((d, i) => {
                const max = Math.max(...weeklyWalk.map(x => x.minutes), 30);
                const h = (d.minutes / max) * 80;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 10, color: '#8B7355' }}>{d.minutes}</div>
                    <div style={{
                      width: '100%',
                      height: h,
                      background: d.minutes > 0 ? 'linear-gradient(to top, #5C8A82, #7BA098)' : '#F0E6D6',
                      borderRadius: '6px 6px 2px 2px',
                      minHeight: 2,
                    }} />
                    <div style={{ fontSize: 9, color: '#A89478' }}>{d.date}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div className="display-font" style={{ fontSize: 16, color: '#3D2B1F', marginBottom: 10 }}>
            谁最关心 {dog.name}
          </div>
          <div style={{ background: '#FFFCF7', borderRadius: 14, padding: 14, border: '1px solid #F0E6D6' }}>
            {byUser.map((u, i) => {
              const max = Math.max(...byUser.map(x => x.count), 1);
              const w = (u.count / max) * 100;
              return (
                <div key={u.id} style={{ marginBottom: i < byUser.length - 1 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{u.emoji} {u.name}</span>
                    <span style={{ color: u.color, fontWeight: 500 }}>{u.count} 条</span>
                  </div>
                  <div style={{ background: '#F5EBD7', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${w}%`, height: '100%', background: u.color, borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <SummaryCard emoji="🍖" label="累计喂食" value={totalRecords.feed} bg="#FAEED2" color="#C09530" />
          <SummaryCard emoji="🚶" label="累计遛狗" value={totalRecords.walk} bg="#DDEBE7" color="#5C8A82" />
          <SummaryCard emoji="📸" label="照片瞬间" value={totalRecords.photo} bg="#DCE6F0" color="#3D6B8E" />
          <SummaryCard emoji="💉" label="疫苗驱虫" value={totalRecords.vaccine} bg="#F5DCE3" color="#B85878" />
        </div>
      </div>
    );
  }

  function SummaryCard({ emoji, label, value, bg, color }) {
    return (
      <div style={{ background: bg, borderRadius: 14, padding: 14 }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
        <div style={{ fontSize: 11, color, opacity: 0.8 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 600, color, marginTop: 2 }}>{value}</div>
      </div>
    );
  }

  function ProfileView({ dog, setDog, familyMembers, records }) {
    const [editing, setEditing] = useState(false);
    const [tempDog, setTempDog] = useState(dog);

    const save = () => { setDog(tempDog); setEditing(false); };

    return (
      <div className="fade-in" style={{ padding: '16px 20px' }}>
        <div className="display-font" style={{ fontSize: 16, color: '#3D2B1F', marginBottom: 10 }}>
          狗狗资料
        </div>
        <div style={{ background: '#FFFCF7', borderRadius: 14, padding: 16, border: '1px solid #F0E6D6', marginBottom: 18 }}>
          {editing ? (
            <div>
              <FormField label="名字"><input value={tempDog.name} onChange={e => setTempDog({ ...tempDog, name: e.target.value })} style={inputStyle} /></FormField>
              <FormField label="品种"><input value={tempDog.breed} onChange={e => setTempDog({ ...tempDog, breed: e.target.value })} style={inputStyle} /></FormField>
              <FormField label="生日"><input type="date" value={tempDog.birthday} onChange={e => setTempDog({ ...tempDog, birthday: e.target.value })} style={inputStyle} /></FormField>
              <FormField label="性别">
                <div style={{ display: 'flex', gap: 8 }}>
                  {['公', '母'].map(g => (
                    <button key={g} onClick={() => setTempDog({ ...tempDog, gender: g })}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                        background: tempDog.gender === g ? '#E8825A' : '#FCE8DC',
                        color: tempDog.gender === g ? '#FFF' : '#7A2D44',
                        cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                      }}>{g}</button>
                  ))}
                </div>
              </FormField>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button onClick={() => { setTempDog(dog); setEditing(false); }} style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #F0E6D6',
                  background: '#FFFCF7', color: '#8B7355', cursor: 'pointer', fontFamily: 'inherit',
                }}>取消</button>
                <button onClick={save} style={{
                  flex: 2, padding: '10px', borderRadius: 10, border: 'none',
                  background: '#E8825A', color: '#FFF', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                }}>保存</button>
              </div>
            </div>
          ) : (
            <>
              <ProfileRow label="名字" value={dog.name} />
              <ProfileRow label="品种" value={dog.breed} />
              <ProfileRow label="生日" value={dog.birthday} />
              <ProfileRow label="性别" value={dog.gender} />
              <button onClick={() => { setTempDog(dog); setEditing(true); }} style={{
                width: '100%', marginTop: 10, padding: '8px', borderRadius: 8, border: '1px solid #F0E6D6',
                background: '#FAEED2', color: '#C09530', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13,
              }}>
                <Edit3 size={14} /> 编辑资料
              </button>
            </>
          )}
        </div>

        <div className="display-font" style={{ fontSize: 16, color: '#3D2B1F', marginBottom: 10 }}>
          家庭成员
        </div>
        <div style={{ background: '#FFFCF7', borderRadius: 14, padding: 4, border: '1px solid #F0E6D6', marginBottom: 18 }}>
          {familyMembers.map((m, i) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: i < familyMembers.length - 1 ? '1px solid #F5EBD7' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: m.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{m.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: '#3D2B1F' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#A89478' }}>记录了 {records.filter(r => r.who === m.id).length} 条</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FAEED2', borderRadius: 14, padding: 14, fontSize: 12, color: '#7A5E3C', lineHeight: 1.7 }}>
          <strong style={{ color: '#3D2B1F' }}>下一步:</strong><br />
          ① 接 Supabase 云数据库,4人共享数据<br />
          ② 部署到 Vercel,得到一个网址<br />
          ③ 把网址加到家人的微信里(或做成微信小程序)
        </div>
      </div>
    );
  }

  function ProfileRow({ label, value }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F5EBD7', fontSize: 13 }}>
        <span style={{ color: '#8B7355' }}>{label}</span>
        <span style={{ color: '#3D2B1F', fontWeight: 500 }}>{value}</span>
      </div>
    );
  }

  function FormField({ label, children }) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#8B7355', marginBottom: 4 }}>{label}</div>
        {children}
      </div>
    );
  }

  function AddRecordModal({ type, typeConfig, onClose, onSubmit, currentMember }) {
    const [selectedType, setSelectedType] = useState(type);
    const t = selectedType ? typeConfig[selectedType] : null;
    const [data, setData] = useState({});

    const handleSubmit = () => {
      onSubmit({ type: selectedType, data });
    };

    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(60, 40, 20, 0.4)',
        display: 'flex', alignItems: 'flex-end',
        zIndex: 100,
      }} onClick={onClose}>
        <div className="slide-up" onClick={e => e.stopPropagation()} style={{
          width: '100%',
          background: '#FFFCF7',
          borderRadius: '24px 24px 0 0',
          padding: '20px 24px 24px',
          maxHeight: '80%',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="display-font" style={{ fontSize: 18, color: '#3D2B1F' }}>
              {t ? `添加${t.label}记录` : '添加记录'}
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={20} color="#8B7355" />
            </button>
          </div>

          <div style={{ fontSize: 11, color: '#A89478', marginBottom: 14 }}>
            将记为 {currentMember.emoji} <strong style={{ color: currentMember.color }}>{currentMember.name}</strong> 的记录
          </div>

          {!selectedType && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {Object.entries(typeConfig).map(([key, t]) => (
                <button key={key} onClick={() => setSelectedType(key)} className="tap-area" style={{
                  background: t.bg, border: 'none', borderRadius: 14, padding: 14, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{t.emoji}</div>
                  <div style={{ fontSize: 12, color: t.color, fontWeight: 500 }}>{t.label}</div>
                </button>
              ))}
            </div>
          )}

          {selectedType === 'feed' && (
            <div className="pop">
              <FormField label="食物名称">
                <input placeholder="如:皇家狗粮" onChange={e => setData({ ...data, food: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="分量(克)">
                <input type="number" placeholder="120" onChange={e => setData({ ...data, amount: parseInt(e.target.value) || 0 })} style={inputStyle} />
              </FormField>
            </div>
          )}

          {selectedType === 'walk' && (
            <div className="pop">
              <FormField label="时长(分钟)">
                <input type="number" placeholder="30" onChange={e => setData({ ...data, duration: parseInt(e.target.value) || 0 })} style={inputStyle} />
              </FormField>
              <FormField label="地点">
                <input placeholder="如:楼下小公园" onChange={e => setData({ ...data, location: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          )}

          {selectedType === 'weight' && (
            <div className="pop">
              <FormField label="体重(kg)">
                <input type="number" step="0.1" placeholder="12.4" onChange={e => setData({ ...data, value: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              </FormField>
            </div>
          )}

          {selectedType === 'vaccine' && (
            <div className="pop">
              <FormField label="类型">
                <input placeholder="如:体内驱虫 / 狂犬疫苗" onChange={e => setData({ ...data, type: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="备注">
                <input placeholder="如:海乐妙" onChange={e => setData({ ...data, notes: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          )}

          {selectedType === 'health' && (
            <div className="pop">
              <FormField label="情况">
                <input placeholder="如:有点没精神 / 拉肚子了" onChange={e => setData({ ...data, issue: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="备注">
                <textarea placeholder="详细说说" onChange={e => setData({ ...data, notes: e.target.value })} style={{ ...inputStyle, minHeight: 60, fontFamily: 'inherit' }} />
              </FormField>
            </div>
          )}

          {selectedType === 'photo' && (
            <div className="pop">
              <FormField label="选个表情代替照片(正式版会支持上传)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['😄', '😴', '🤩', '🥺', '😋', '🐾', '🌸', '🎾', '🦴', '❤️'].map(e => (
                    <button key={e} onClick={() => setData({ ...data, emoji: e })} style={{
                      width: 44, height: 44, borderRadius: 10,
                      border: data.emoji === e ? '2px solid #E8825A' : '1px solid #F0E6D6',
                      background: '#FFFCF7', fontSize: 22, cursor: 'pointer',
                    }}>{e}</button>
                  ))}
                </div>
              </FormField>
              <FormField label="说点什么">
                <input placeholder="今天好像笑了!" onChange={e => setData({ ...data, caption: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          )}

          {selectedType && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setSelectedType(null)} style={{
                flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #F0E6D6',
                background: '#FFFCF7', color: '#8B7355', cursor: 'pointer', fontFamily: 'inherit',
              }}>返回</button>
              <button onClick={handleSubmit} style={{
                flex: 2, padding: '12px', borderRadius: 10, border: 'none',
                background: t.color, color: '#FFF', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
              }}>记一笔 {t.emoji}</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #F0E6D6',
  borderRadius: 8,
  fontSize: 13,
  background: '#FFFCF7',
  color: '#3D2B1F',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
