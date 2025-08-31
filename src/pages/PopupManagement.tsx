import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_blue_span.png';
import '../styles/PopupManagement.css';

interface Popup {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate: string;
  endDate: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isActive: boolean;
  showOnce: boolean;
  width: number;
  height: number;
  priority: number;
  createdAt: string;
}

const PopupManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const [popups, setPopups] = useState<Popup[]>([
    {
      id: 1,
      title: '신규 수강생 모집',
      content: '2025년 봄 학기 신규 수강생을 모집합니다!\n수학, 영어, 국어 전 과목 수강 가능',
      imageUrl: '',
      linkUrl: '/enrollment',
      startDate: '2025-01-01',
      endDate: '2025-02-28',
      position: 'center',
      isActive: true,
      showOnce: false,
      width: 400,
      height: 300,
      priority: 1,
      createdAt: '2025-01-01'
    },
    {
      id: 2,
      title: '겨울방학 특강 안내',
      content: '겨울방학 집중 특강 프로그램을 운영합니다.',
      imageUrl: '',
      linkUrl: '/special-class',
      startDate: '2025-01-15',
      endDate: '2025-01-31',
      position: 'top-right',
      isActive: false,
      showOnce: true,
      width: 350,
      height: 250,
      priority: 2,
      createdAt: '2025-01-10'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    startDate: '',
    endDate: '',
    position: 'center' as const,
    isActive: true,
    showOnce: false,
    width: 400,
    height: 300,
    priority: 1
  });

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleCreatePopup = () => {
    setEditingPopup(null);
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      linkUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      position: 'center',
      isActive: true,
      showOnce: false,
      width: 400,
      height: 300,
      priority: 1
    });
    setShowForm(true);
  };

  const handleEditPopup = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      content: popup.content,
      imageUrl: popup.imageUrl || '',
      linkUrl: popup.linkUrl || '',
      startDate: popup.startDate,
      endDate: popup.endDate,
      position: popup.position,
      isActive: popup.isActive,
      showOnce: popup.showOnce,
      width: popup.width,
      height: popup.height,
      priority: popup.priority
    });
    setShowForm(true);
  };

  const handleDeletePopup = (id: number) => {
    if (confirm('이 팝업을 삭제하시겠습니까?')) {
      setPopups(popups.filter(popup => popup.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPopup) {
      setPopups(popups.map(popup => 
        popup.id === editingPopup.id 
          ? { ...popup, ...formData }
          : popup
      ));
    } else {
      const newPopup: Popup = {
        id: Math.max(...popups.map(p => p.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPopups([newPopup, ...popups]);
    }
    
    setShowForm(false);
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'center': return '중앙';
      case 'top-left': return '좌상단';
      case 'top-right': return '우상단';
      case 'bottom-left': return '좌하단';
      case 'bottom-right': return '우하단';
      default: return '중앙';
    }
  };

  const togglePopupStatus = (id: number) => {
    setPopups(popups.map(popup => 
      popup.id === id 
        ? { ...popup, isActive: !popup.isActive }
        : popup
    ));
  };

  const isPopupActive = (popup: Popup) => {
    const now = new Date();
    const start = new Date(popup.startDate);
    const end = new Date(popup.endDate);
    return popup.isActive && now >= start && now <= end;
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <img src={logoImage} alt="학원 로고" className="header-logo" />
          <h1>팝업 관리</h1>
        </div>
        <div className="header-right">
          <button onClick={() => navigate('/admin')} className="back-button">
            ← 메인으로
          </button>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </header>

      <main className="popup-main">
        <div className="popup-controls">
          <button onClick={handleCreatePopup} className="create-button">
            + 새 팝업
          </button>
          <div className="popup-stats">
            <span>전체 {popups.length}개</span>
            <span>활성 {popups.filter(p => isPopupActive(p)).length}개</span>
            <span>예약 {popups.filter(p => p.isActive && new Date(p.startDate) > new Date()).length}개</span>
          </div>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>{editingPopup ? '팝업 수정' : '새 팝업 생성'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>제목</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>우선순위</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>내용</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>이미지 URL (선택사항)</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>링크 URL (선택사항)</label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                      placeholder="/page-url 또는 https://external.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>시작일</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>종료일</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>위치</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value as any})}
                    >
                      <option value="center">중앙</option>
                      <option value="top-left">좌상단</option>
                      <option value="top-right">우상단</option>
                      <option value="bottom-left">좌하단</option>
                      <option value="bottom-right">우하단</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>크기</label>
                    <div className="size-inputs">
                      <input
                        type="number"
                        min="200"
                        max="800"
                        value={formData.width}
                        onChange={(e) => setFormData({...formData, width: parseInt(e.target.value)})}
                        placeholder="너비"
                      />
                      <span>×</span>
                      <input
                        type="number"
                        min="150"
                        max="600"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                        placeholder="높이"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      />
                      활성화
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.showOnce}
                        onChange={(e) => setFormData({...formData, showOnce: e.target.checked})}
                      />
                      하루에 한번만 표시
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)}>취소</button>
                  <button type="submit">{editingPopup ? '수정' : '생성'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="popup-list">
          {popups.map((popup) => (
            <div key={popup.id} className={`popup-card ${isPopupActive(popup) ? 'active' : 'inactive'}`}>
              <div className="popup-header">
                <div className="popup-meta">
                  <h3 className="popup-title">{popup.title}</h3>
                  <div className="popup-badges">
                    <span className="priority-badge">우선순위: {popup.priority}</span>
                    <span className="position-badge">{getPositionLabel(popup.position)}</span>
                    {popup.showOnce && <span className="once-badge">1회성</span>}
                  </div>
                </div>
                <div className="popup-actions">
                  <button 
                    onClick={() => togglePopupStatus(popup.id)} 
                    className={`toggle-button ${popup.isActive ? 'active' : 'inactive'}`}
                  >
                    {popup.isActive ? '비활성화' : '활성화'}
                  </button>
                  <button onClick={() => handleEditPopup(popup)} className="edit-button">
                    수정
                  </button>
                  <button onClick={() => handleDeletePopup(popup.id)} className="delete-button">
                    삭제
                  </button>
                </div>
              </div>
              
              <div className="popup-content">
                <p className="popup-text">{popup.content}</p>
                {popup.imageUrl && (
                  <div className="popup-image">
                    <img src={popup.imageUrl} alt={popup.title} />
                  </div>
                )}
                {popup.linkUrl && (
                  <p className="popup-link">링크: <code>{popup.linkUrl}</code></p>
                )}
              </div>
              
              <div className="popup-details">
                <div className="popup-dates">
                  <span>📅 {popup.startDate} ~ {popup.endDate}</span>
                  <span>📐 {popup.width} × {popup.height}px</span>
                </div>
                <div className="popup-status">
                  <span className={`status-indicator ${isPopupActive(popup) ? 'running' : 'stopped'}`}>
                    {isPopupActive(popup) ? '🟢 진행중' : '🔴 중지됨'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PopupManagement;