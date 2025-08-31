import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_blue_span.png';
import '../styles/StudentManagement.css';

interface Student {
  id: number;
  name: string;
  grade: string;
  school: string;
  subjects: string[];
  phone: string;
  parentPhone: string;
  address: string;
  birthDate: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  tuition: number;
  paymentStatus: 'paid' | 'unpaid' | 'overdue';
  teacher: string;
  attendance: number;
  averageScore: number;
  memo: string;
  createdAt: string;
}

const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: '김민수',
      grade: '중3',
      school: '서울중학교',
      subjects: ['수학', '영어'],
      phone: '010-1111-2222',
      parentPhone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      birthDate: '2008-05-15',
      enrollmentDate: '2024-03-01',
      status: 'active',
      tuition: 450000,
      paymentStatus: 'paid',
      teacher: '김수학',
      attendance: 95,
      averageScore: 87,
      memo: '수학에 특히 관심이 많고 성실한 학생입니다.',
      createdAt: '2024-03-01'
    },
    {
      id: 2,
      name: '박지영',
      grade: '고2',
      school: '강남고등학교',
      subjects: ['영어', '국어'],
      phone: '010-2222-3333',
      parentPhone: '010-2345-6789',
      address: '서울시 서초구 서초대로 456',
      birthDate: '2007-08-22',
      enrollmentDate: '2024-01-15',
      status: 'active',
      tuition: 500000,
      paymentStatus: 'unpaid',
      teacher: '박영어',
      attendance: 88,
      averageScore: 92,
      memo: '영어 실력이 우수하며 리더십이 있는 학생입니다.',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: '이준호',
      grade: '고3',
      school: '대치고등학교',
      subjects: ['수학', '영어', '국어'],
      phone: '010-3333-4444',
      parentPhone: '010-3456-7890',
      address: '서울시 강남구 삼성동 789',
      birthDate: '2006-11-03',
      enrollmentDate: '2023-09-01',
      status: 'graduated',
      tuition: 600000,
      paymentStatus: 'paid',
      teacher: '김수학',
      attendance: 98,
      averageScore: 95,
      memo: '목표 의식이 뚜렷하고 성실한 모범 학생입니다.',
      createdAt: '2023-09-01'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    school: '',
    subjects: [] as string[],
    phone: '',
    parentPhone: '',
    address: '',
    birthDate: '',
    enrollmentDate: '',
    status: 'active' as const,
    tuition: 0,
    paymentStatus: 'unpaid' as const,
    teacher: '',
    attendance: 0,
    averageScore: 0,
    memo: ''
  });

  const grades = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'];
  const subjects = ['수학', '영어', '국어', '사회', '과학', '한국사'];
  const teachers = ['김수학', '박영어', '이국어'];
  const paymentStatuses = ['paid', 'unpaid', 'overdue'];

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleCreateStudent = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      grade: '',
      school: '',
      subjects: [],
      phone: '',
      parentPhone: '',
      address: '',
      birthDate: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      tuition: 0,
      paymentStatus: 'unpaid',
      teacher: '',
      attendance: 0,
      averageScore: 0,
      memo: ''
    });
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      grade: student.grade,
      school: student.school,
      subjects: student.subjects,
      phone: student.phone,
      parentPhone: student.parentPhone,
      address: student.address,
      birthDate: student.birthDate,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
      tuition: student.tuition,
      paymentStatus: student.paymentStatus,
      teacher: student.teacher,
      attendance: student.attendance,
      averageScore: student.averageScore,
      memo: student.memo
    });
    setShowForm(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('이 학생 정보를 삭제하시겠습니까?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...formData }
          : student
      ));
    } else {
      const newStudent: Student = {
        id: Math.max(...students.map(s => s.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStudents([newStudent, ...students]);
    }
    
    setShowForm(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '재학';
      case 'inactive': return '휴학';
      case 'graduated': return '졸업';
      default: return '알 수 없음';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'graduated': return 'status-graduated';
      default: return 'status-unknown';
    }
  };

  const getPaymentLabel = (status: string) => {
    switch (status) {
      case 'paid': return '완납';
      case 'unpaid': return '미납';
      case 'overdue': return '연체';
      default: return '알 수 없음';
    }
  };

  const getPaymentClass = (status: string) => {
    switch (status) {
      case 'paid': return 'payment-paid';
      case 'unpaid': return 'payment-unpaid';
      case 'overdue': return 'payment-overdue';
      default: return 'payment-unknown';
    }
  };

  const handleSubjectChange = (subject: string) => {
    const newSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    setFormData({...formData, subjects: newSubjects});
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <img src={logoImage} alt="학원 로고" className="header-logo" />
          <h1>학생 관리</h1>
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

      <main className="student-main">
        <div className="student-controls">
          <div className="controls-left">
            <button onClick={handleCreateStudent} className="create-button">
              + 새 학생 등록
            </button>
            <div className="search-filters">
              <input
                type="text"
                placeholder="학생명, 학교명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">전체</option>
                <option value="active">재학</option>
                <option value="inactive">휴학</option>
                <option value="graduated">졸업</option>
              </select>
            </div>
          </div>
          <div className="student-stats">
            <span>전체 {students.length}명</span>
            <span>재학 {students.filter(s => s.status === 'active').length}명</span>
            <span>미납 {students.filter(s => s.paymentStatus === 'unpaid').length}명</span>
          </div>
        </div>

        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>학년</th>
                <th>학교</th>
                <th>수강과목</th>
                <th>담당선생님</th>
                <th>상태</th>
                <th>결제상태</th>
                <th>출석률</th>
                <th>평균점수</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className={student.status}>
                  <td className="student-name">{student.name}</td>
                  <td>{student.grade}</td>
                  <td>{student.school}</td>
                  <td>
                    <div className="subjects">
                      {student.subjects.map(subject => (
                        <span key={subject} className="subject-tag">{subject}</span>
                      ))}
                    </div>
                  </td>
                  <td>{student.teacher}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge ${getPaymentClass(student.paymentStatus)}`}>
                      {getPaymentLabel(student.paymentStatus)}
                    </span>
                  </td>
                  <td>{student.attendance}%</td>
                  <td>{student.averageScore}점</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => handleViewStudent(student)} className="view-button">
                        상세
                      </button>
                      <button onClick={() => handleEditStudent(student)} className="edit-button">
                        수정
                      </button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="delete-button">
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상세보기 모달 */}
        {selectedStudent && (
          <div className="detail-modal">
            <div className="detail-container">
              <div className="detail-header">
                <h2>{selectedStudent.name} 학생</h2>
                <button onClick={() => setSelectedStudent(null)} className="close-button">×</button>
              </div>
              
              <div className="detail-content">
                <div className="detail-section">
                  <h3>기본 정보</h3>
                  <div className="detail-grid">
                    <div><strong>이름:</strong> {selectedStudent.name}</div>
                    <div><strong>학년:</strong> {selectedStudent.grade}</div>
                    <div><strong>학교:</strong> {selectedStudent.school}</div>
                    <div><strong>생년월일:</strong> {selectedStudent.birthDate}</div>
                    <div><strong>입학일:</strong> {selectedStudent.enrollmentDate}</div>
                    <div><strong>상태:</strong> 
                      <span className={getStatusClass(selectedStudent.status)}>
                        {getStatusLabel(selectedStudent.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>연락처</h3>
                  <div className="detail-grid">
                    <div><strong>학생 전화:</strong> {selectedStudent.phone}</div>
                    <div><strong>학부모 전화:</strong> {selectedStudent.parentPhone}</div>
                    <div><strong>주소:</strong> {selectedStudent.address}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>수강 정보</h3>
                  <div className="detail-grid">
                    <div><strong>수강 과목:</strong> {selectedStudent.subjects.join(', ')}</div>
                    <div><strong>담당 선생님:</strong> {selectedStudent.teacher}</div>
                    <div><strong>수강료:</strong> {selectedStudent.tuition.toLocaleString()}원</div>
                    <div><strong>결제 상태:</strong> 
                      <span className={getPaymentClass(selectedStudent.paymentStatus)}>
                        {getPaymentLabel(selectedStudent.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>학습 현황</h3>
                  <div className="detail-grid">
                    <div><strong>출석률:</strong> {selectedStudent.attendance}%</div>
                    <div><strong>평균 점수:</strong> {selectedStudent.averageScore}점</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>메모</h3>
                  <p>{selectedStudent.memo || '메모가 없습니다.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 등록/수정 폼 모달 */}
        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>{editingStudent ? '학생 정보 수정' : '새 학생 등록'}</h2>
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
                    <label>학년</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      required
                    >
                      <option value="">학년 선택</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>학교</label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>담당 선생님</label>
                    <select
                      value={formData.teacher}
                      onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                      required
                    >
                      <option value="">선생님 선택</option>
                      {teachers.map(teacher => (
                        <option key={teacher} value={teacher}>{teacher}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>학생 전화번호</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>학부모 전화번호</label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>주소</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>생년월일</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>입학일</label>
                    <input
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => setFormData({...formData, enrollmentDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>수강 과목</label>
                  <div className="checkbox-group">
                    {subjects.map(subject => (
                      <label key={subject} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={() => handleSubjectChange(subject)}
                        />
                        {subject}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>수강료</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tuition}
                      onChange={(e) => setFormData({...formData, tuition: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>결제 상태</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({...formData, paymentStatus: e.target.value as any})}
                    >
                      <option value="unpaid">미납</option>
                      <option value="paid">완납</option>
                      <option value="overdue">연체</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>상태</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="active">재학</option>
                      <option value="inactive">휴학</option>
                      <option value="graduated">졸업</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>출석률 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.attendance}
                      onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>평균 점수</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.averageScore}
                    onChange={(e) => setFormData({...formData, averageScore: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>메모</label>
                  <textarea
                    value={formData.memo}
                    onChange={(e) => setFormData({...formData, memo: e.target.value})}
                    rows={3}
                    placeholder="학생에 대한 메모를 입력해주세요"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)}>취소</button>
                  <button type="submit">{editingStudent ? '수정' : '등록'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentManagement;