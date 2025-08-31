import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_blue_span.png';
import '../styles/AdminMain.css';

const AdminMain: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const menuItems = [
    // 학원 운영 관리
    { 
      title: '학생 관리', 
      description: '학생 등록, 수정, 조회', 
      icon: '👥',
      category: '학원운영',
      path: '/admin/students'
    },
    { 
      title: '선생님 관리', 
      description: '강사진 등록, 프로필 관리', 
      icon: '👨‍🏫',
      category: '학원운영',
      path: '/admin/teachers'
    },
    { 
      title: '수업 관리', 
      description: '수업 일정, 커리큘럼 관리', 
      icon: '📚',
      category: '학원운영',
      path: '/admin/classes'
    },
    { 
      title: '결제 관리', 
      description: '수강료, 결제 내역 관리', 
      icon: '💳',
      category: '학원운영',
      path: '/admin/payments'
    },
    { 
      title: '성적 관리', 
      description: '시험 성적, 평가 관리', 
      icon: '📊',
      category: '학원운영',
      path: '/admin/grades'
    },
    { 
      title: '출석 관리', 
      description: '출석 체크, 통계', 
      icon: '✅',
      category: '학원운영',
      path: '/admin/attendance'
    },
    
    // 홈페이지 관리
    { 
      title: '공지사항 관리', 
      description: '공지사항 작성, 수정, 삭제', 
      icon: '📢',
      category: '홈페이지',
      path: '/admin/notices'
    },
    { 
      title: '팝업 관리', 
      description: '팝업 생성, 노출 설정', 
      icon: '🔔',
      category: '홈페이지',
      path: '/admin/popups'
    },
    { 
      title: '홈페이지 콘텐츠', 
      description: '메인 화면, 페이지 내용 관리', 
      icon: '🌐',
      category: '홈페이지',
      path: '/admin/content'
    },
    { 
      title: '갤러리 관리', 
      description: '사진, 동영상 갤러리 관리', 
      icon: '📷',
      category: '홈페이지',
      path: '/admin/gallery'
    },
    
    // 시스템
    { 
      title: '통계', 
      description: '학원 운영 통계', 
      icon: '📈',
      category: '시스템',
      path: '/admin/statistics'
    },
    { 
      title: '설정', 
      description: '시스템 설정', 
      icon: '⚙️',
      category: '시스템',
      path: '/admin/settings'
    }
  ];

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <img src={logoImage} alt="학원 로고" className="header-logo" />
          <h1>관리자 시스템</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">관리자님 환영합니다</span>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>전체 학생</h3>
              <p className="stat-number">245</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>진행 수업</h3>
              <p className="stat-number">18</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>이번 달 매출</h3>
              <p className="stat-number">₩15,420,000</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>출석률</h3>
              <p className="stat-number">94%</p>
            </div>
          </div>
        </div>

        <div className="menu-sections">
          {['학원운영', '홈페이지', '시스템'].map((category) => (
            <div key={category} className="menu-section">
              <h2 className="section-title">{category} 관리</h2>
              <div className="menu-grid">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item, index) => (
                    <div 
                      key={index} 
                      className="menu-card"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="menu-icon">{item.icon}</div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminMain;