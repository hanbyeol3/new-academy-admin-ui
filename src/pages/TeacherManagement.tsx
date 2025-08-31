import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_blue_span.png';
import '../styles/TeacherManagement.css';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  phone: string;
  email: string;
  hireDate: string;
  experience: number;
  education: string;
  introduction: string;
  profileImage?: string;
  status: 'active' | 'inactive' | 'leave';
  salary: number;
  workDays: string[];
  workHours: string;
  classes: string[];
  students: number;
  createdAt: string;
}

const TeacherManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      name: '김수학',
      subject: '수학',
      phone: '010-1234-5678',
      email: 'kim.math@academy.com',
      hireDate: '2023-03-01',
      experience: 5,
      education: '서울대학교 수학과 석사',
      introduction: '중고등학교 수학 전문 강사입니다. 학생 개개인의 수준에 맞춘 맞춤형 지도로 성적 향상을 이끌어냅니다.',
      profileImage: '',
      status: 'active',
      salary: 3500000,
      workDays: ['월', '화', '수', '목', '금'],
      workHours: '14:00-22:00',
      classes: ['중3 수학', '고1 수학', '고2 수학'],
      students: 45,
      createdAt: '2023-03-01'
    },
    {
      id: 2,
      name: '박영어',
      subject: '영어',
      phone: '010-2345-6789',
      email: 'park.english@academy.com',
      hireDate: '2022-09-01',
      experience: 8,
      education: '연세대학교 영문학과 학사, TESOL 자격증',
      introduction: '원어민 수준의 영어 실력으로 회화와 문법을 동시에 지도합니다.',
      profileImage: '',
      status: 'active',
      salary: 3800000,
      workDays: ['월', '수', '금', '토'],
      workHours: '15:00-21:00',
      classes: ['중2 영어', '중3 영어', '고1 영어'],
      students: 38,
      createdAt: '2022-09-01'
    },
    {
      id: 3,
      name: '이국어',
      subject: '국어',
      phone: '010-3456-7890',
      email: 'lee.korean@academy.com',
      hireDate: '2021-01-15',
      experience: 12,
      education: '고려대학교 국어국문학과 박사',
      introduction: '문학과 비문학, 문법까지 국어의 모든 영역을 체계적으로 지도합니다.',
      profileImage: '',
      status: 'leave',
      salary: 4200000,
      workDays: ['화', '목', '토'],
      workHours: '13:00-19:00',
      classes: ['고2 국어', '고3 국어'],
      students: 0,
      createdAt: '2021-01-15'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    phone: '',
    email: '',
    hireDate: '',
    experience: 0,
    education: '',
    introduction: '',
    profileImage: '',
    status: 'active' as const,
    salary: 0,
    workDays: [] as string[],
    workHours: '',
    classes: [] as string[]
  });

  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const subjects = ['수학', '영어', '국어', '사회', '과학', '한국사', '기타'];

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleCreateTeacher = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      subject: '',
      phone: '',
      email: '',
      hireDate: new Date().toISOString().split('T')[0],
      experience: 0,
      education: '',
      introduction: '',
      profileImage: '',
      status: 'active',
      salary: 0,
      workDays: [],
      workHours: '',
      classes: []
    });
    setShowForm(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      phone: teacher.phone,
      email: teacher.email,
      hireDate: teacher.hireDate,
      experience: teacher.experience,
      education: teacher.education,
      introduction: teacher.introduction,
      profileImage: teacher.profileImage || '',
      status: teacher.status,
      salary: teacher.salary,
      workDays: teacher.workDays,
      workHours: teacher.workHours,
      classes: teacher.classes
    });
    setShowForm(true);
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleDeleteTeacher = (id: number) => {
    if (confirm('이 선생님 정보를 삭제하시겠습니까?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTeacher) {
      setTeachers(teachers.map(teacher => 
        teacher.id === editingTeacher.id 
          ? { ...teacher, ...formData, students: teacher.students }
          : teacher
      ));
    } else {
      const newTeacher: Teacher = {
        id: Math.max(...teachers.map(t => t.id)) + 1,
        ...formData,
        students: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTeachers([newTeacher, ...teachers]);
    }
    
    setShowForm(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '재직중';
      case 'inactive': return '휴직중';
      case 'leave': return '퇴사';
      default: return '알 수 없음';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'leave': return 'status-leave';
      default: return 'status-unknown';
    }
  };

  const handleWorkDayChange = (day: string) => {
    const newWorkDays = formData.workDays.includes(day)
      ? formData.workDays.filter(d => d !== day)
      : [...formData.workDays, day];
    setFormData({...formData, workDays: newWorkDays});
  };

  const handleClassAdd = (className: string) => {
    if (className && !formData.classes.includes(className)) {
      setFormData({...formData, classes: [...formData.classes, className]});
    }
  };

  const handleClassRemove = (className: string) => {
    setFormData({...formData, classes: formData.classes.filter(c => c !== className)});
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <img src={logoImage} alt="학원 로고" className="header-logo" />
          <h1>선생님 관리</h1>
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

      <main className="teacher-main">
        <div className="teacher-controls">
          <button onClick={handleCreateTeacher} className="create-button">
            + 새 선생님 등록
          </button>
          <div className="teacher-stats">
            <span>전체 {teachers.length}명</span>
            <span>재직중 {teachers.filter(t => t.status === 'active').length}명</span>
            <span>총 학생 {teachers.reduce((sum, t) => sum + t.students, 0)}명</span>
          </div>
        </div>

        <div className="teacher-grid">
          {teachers.map((teacher) => (
            <div key={teacher.id} className={`teacher-card ${teacher.status}`}>
              <div className="teacher-avatar">
                {teacher.profileImage ? (
                  <img src={teacher.profileImage} alt={teacher.name} />
                ) : (
                  <div className="avatar-placeholder">👨‍🏫</div>
                )}
              </div>
              
              <div className="teacher-info">
                <h3 className="teacher-name">{teacher.name}</h3>
                <p className="teacher-subject">{teacher.subject} 전담</p>
                <p className="teacher-experience">경력 {teacher.experience}년</p>
                
                <div className="teacher-meta">
                  <span className="student-count">👥 {teacher.students}명</span>
                  <span className={`status-badge ${getStatusClass(teacher.status)}`}>
                    {getStatusLabel(teacher.status)}
                  </span>
                </div>
                
                <div className="teacher-actions">
                  <button onClick={() => handleViewTeacher(teacher)} className="view-button">
                    상세보기
                  </button>
                  <button onClick={() => handleEditTeacher(teacher)} className="edit-button">
                    수정
                  </button>
                  <button onClick={() => handleDeleteTeacher(teacher.id)} className="delete-button">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 상세보기 모달 */}
        {selectedTeacher && (
          <div className="detail-modal">
            <div className="detail-container">
              <div className="detail-header">
                <h2>{selectedTeacher.name} 선생님</h2>
                <button onClick={() => setSelectedTeacher(null)} className="close-button">×</button>
              </div>
              
              <div className="detail-content">
                <div className="detail-section">
                  <h3>기본 정보</h3>
                  <div className="detail-grid">
                    <div><strong>담당 과목:</strong> {selectedTeacher.subject}</div>
                    <div><strong>경력:</strong> {selectedTeacher.experience}년</div>
                    <div><strong>입사일:</strong> {selectedTeacher.hireDate}</div>
                    <div><strong>상태:</strong> <span className={getStatusClass(selectedTeacher.status)}>{getStatusLabel(selectedTeacher.status)}</span></div>
                    <div><strong>급여:</strong> {selectedTeacher.salary.toLocaleString()}원</div>
                    <div><strong>담당 학생:</strong> {selectedTeacher.students}명</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>연락처</h3>
                  <div className="detail-grid">
                    <div><strong>전화번호:</strong> {selectedTeacher.phone}</div>
                    <div><strong>이메일:</strong> {selectedTeacher.email}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>근무 정보</h3>
                  <div className="detail-grid">
                    <div><strong>근무일:</strong> {selectedTeacher.workDays.join(', ')}</div>
                    <div><strong>근무시간:</strong> {selectedTeacher.workHours}</div>
                    <div><strong>담당 반:</strong> {selectedTeacher.classes.join(', ')}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>학력</h3>
                  <p>{selectedTeacher.education}</p>
                </div>
                
                <div className="detail-section">
                  <h3>소개</h3>
                  <p>{selectedTeacher.introduction}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 등록/수정 폼 모달 */}
        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>{editingTeacher ? '선생님 정보 수정' : '새 선생님 등록'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>이름</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>담당 과목</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    >
                      <option value="">과목 선택</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>전화번호</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>이메일</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>입사일</label>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>경력 (년)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>급여</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>상태</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="active">재직중</option>
                      <option value="inactive">휴직중</option>
                      <option value="leave">퇴사</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>학력</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    placeholder="예: 서울대학교 수학과 석사"
                  />
                </div>
                
                <div className="form-group">
                  <label>근무시간</label>
                  <input
                    type="text"
                    value={formData.workHours}
                    onChange={(e) => setFormData({...formData, workHours: e.target.value})}
                    placeholder="예: 14:00-22:00"
                  />
                </div>
                
                <div className="form-group">
                  <label>근무일</label>
                  <div className="checkbox-group">
                    {weekDays.map(day => (
                      <label key={day} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.workDays.includes(day)}
                          onChange={() => handleWorkDayChange(day)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>소개</label>
                  <textarea
                    value={formData.introduction}
                    onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                    rows={4}
                    placeholder="선생님 소개를 입력해주세요"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)}>취소</button>
                  <button type="submit">{editingTeacher ? '수정' : '등록'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherManagement;