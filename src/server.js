const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const cookieParser = require('cookie-parser');

// 설정 및 데이터베이스
const swaggerDocument = require('./config/swagger');
const initDatabase = require('./database/init');

// 라우터
const sqlInjectionRoutes = require('./routes/sqlInjection');
const xssRoutes = require('./routes/xss');
const commandInjectionRoutes = require('./routes/commandInjection');
const pathTraversalRoutes = require('./routes/pathTraversal');
const idorRoutes = require('./routes/idor');
const weakAuthRoutes = require('./routes/weakAuth');
const dataExposureRoutes = require('./routes/dataExposure');
const ssrfRoutes = require('./routes/ssrf');
const massAssignmentRoutes = require('./routes/massAssignment');
const insecureDeserializationRoutes = require('./routes/insecureDeserialization');

const app = express();
const PORT = 3000;

// 데이터베이스 초기화
const db = initDatabase();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================================
// 일반 API 엔드포인트
// ========================================

app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, email FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ========================================
// 취약점 라우터 설정
// ========================================

app.use('/api/vulnerable', sqlInjectionRoutes(db));
app.use('/api/vulnerable', xssRoutes);
app.use('/api/vulnerable', commandInjectionRoutes);
app.use('/api/vulnerable', pathTraversalRoutes);
app.use('/api/vulnerable', idorRoutes(db));
app.use('/api/vulnerable/auth', weakAuthRoutes);
app.use('/api/vulnerable', dataExposureRoutes);
app.use('/api/vulnerable', ssrfRoutes);
app.use('/api/vulnerable', massAssignmentRoutes(db));
app.use('/api/vulnerable', insecureDeserializationRoutes);

// ========================================
// 서버 시작
// ========================================

app.listen(PORT, () => {
  console.log('========================================');
  console.log('🔒 보안 취약점 학습 서버');
  console.log('========================================');
  console.log(`🌐 서버: http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log('========================================');
  console.log('⚠️  경고: 교육 목적으로만 사용하세요!');
  console.log('========================================\n');
});
