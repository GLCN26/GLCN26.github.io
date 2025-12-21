// 这是Vercel云函数，完全免费
import crypto from 'crypto';

// 把"你的密码"改成真实密码，Vercel会自动加密保护
const PASSWORD_HASH = crypto.createHash('sha256').update('2525CN').digest('hex');

export default function handler(req, res) {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', 'https://你的github用户名.github.io');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只接受POST请求' });
  }

  try {
    const { password } = req.body;
    
    if (!password || password.length > 20) {
      return res.status(400).json({ error: '无效的密码格式' });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    
    if (hash === PASSWORD_HASH) {
      // 验证成功
      return res.status(200).json({ 
        success: true,
        message: '验证成功'
      });
    } else {
      // 验证失败
      return res.status(401).json({ 
        success: false, 
        message: '密码错误' 
      });
    }
  } catch (error) {
    console.error('验证错误:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
}
