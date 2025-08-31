import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_blue_span.png';
import '../styles/NoticeManagement.css';

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'normal' | 'important' | 'urgent';
  isActive: boolean;
  views: number;
}

const NoticeManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: '2025년 봄 학기 등록 안내',
      content: '2025년 봄 학기 수강 등록이 시작됩니다. 자세한 내용은 공지사항을 확인해주세요.',
      author: '관리자',
      createdAt: '2025-01-15',
      priority: 'important',
      isActive: true,
      views: 156
    },
    {
      id: 2,
      title: '겨울방학 특강 프로그램 안내',
      content: '겨울방학 동안 진행되는 특강 프로그램에 대한 안내입니다.',
      author: '관리자',
      createdAt: '2025-01-10',
      priority: 'normal',
      isActive: true,
      views: 89
    },
    {
      id: 3,
      title: '시설 정기 점검 안내',
      content: '학원 시설 정기 점검으로 인한 휴원 안내입니다.',
      author: '관리자',
      createdAt: '2025-01-05',
      priority: 'urgent',
      isActive: false,
      views: 234
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal' as const,
    isActive: true
  });

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleCreateNotice = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      isActive: true
    });
    setShowForm(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      isActive: notice.isActive
    });
    setShowForm(true);
  };

  const handleDeleteNotice = (id: number) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      setNotices(notices.filter(notice => notice.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNotice) {
      setNotices(notices.map(notice => 
        notice.id === editingNotice.id 
          ? { ...notice, ...formData }
          : notice
      ));
    } else {
      const newNotice: Notice = {
        id: Math.max(...notices.map(n => n.id)) + 1,
        ...formData,
        author: '관리자',
        createdAt: new Date().toISOString().split('T')[0],
        views: 0
      };
      setNotices([newNotice, ...notices]);
    }
    
    setShowForm(false);
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '긴급';
      case 'important': return '중요';
      default: return '일반';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'important': return 'priority-important';
      default: return 'priority-normal';
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <img src={logoImage} alt="학원 로고" className="header-logo" />
          <h1>공지사항 관리</h1>
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

      <main className="notice-main">
        <div className="notice-controls">
          <button onClick={handleCreateNotice} className="create-button">
            + 새 공지사항
          </button>
          <div className="notice-stats">
            <span>전체 {notices.length}개</span>
            <span>활성 {notices.filter(n => n.isActive).length}개</span>
          </div>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>{editingNotice ? '공지사항 수정' : '새 공지사항'}</h2>
              <form onSubmit={handleSubmit}>
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
                  <label>내용</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={10}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>우선순위</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    >
                      <option value="normal">일반</option>
                      <option value="important">중요</option>
                      <option value="urgent">긴급</option>
                    </select>
                  </div>
                  
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
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)}>취소</button>
                  <button type="submit">{editingNotice ? '수정' : '등록'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="notice-list">
          {notices.map((notice) => (
            <div key={notice.id} className={`notice-card ${!notice.isActive ? 'inactive' : ''}`}>
              <div className="notice-header">
                <div className="notice-meta">
                  <span className={`priority-badge ${getPriorityClass(notice.priority)}`}>
                    {getPriorityLabel(notice.priority)}
                  </span>
                  <span className="notice-date">{notice.createdAt}</span>
                  <span className="notice-views">👁 {notice.views}</span>
                </div>
                <div className="notice-actions">
                  <button onClick={() => handleEditNotice(notice)} className="edit-button">
                    수정
                  </button>
                  <button onClick={() => handleDeleteNotice(notice.id)} className="delete-button">
                    삭제
                  </button>
                </div>
              </div>
              
              <h3 className="notice-title">{notice.title}</h3>
              <p className="notice-content">{notice.content}</p>
              
              <div className="notice-footer">
                <span className="notice-author">작성자: {notice.author}</span>
                <span className={`status-badge ${notice.isActive ? 'active' : 'inactive'}`}>
                  {notice.isActive ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NoticeManagement;