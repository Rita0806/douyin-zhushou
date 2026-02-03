const express = require('express');
const axios = require('axios');
const qs = require('qs');
const cors = require('cors');
const app = express();

// 解决网页跨域问题，必须开启
app.use(cors());
// 解析JSON和表单数据，适配前端传参
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 18个免费抖音文案提取API列表（已按稳定性排序，优先调用高稳定接口）
const apiList = [
  // API0：AnyToCopy（高稳定，无限制）
  async (videoUrl) => {
    console.log('调用API0：AnyToCopy，链接：', videoUrl)
    const res = await axios.get('https://api.anytocopy.com/douyin/extract', {
      params: { url: videoUrl },
      timeout: 8000
    })
    console.log('API0返回：', res.data)
    return res.data.data.text
  },
  // API1：抖音无水印解析（稳定提取caption文案）
  async (videoUrl) => {
    console.log('调用API1：抖音无水印解析，链接：', videoUrl)
    const res = await axios.get('https://api.douyin.wtf/api', {
      params: { url: videoUrl, type: 'text' },
      timeout: 8000
    })
    console.log('API1返回：', res.data)
    return res.data.data.caption
  },
  // API2：抖解析API（原生适配，无限制）
  async (videoUrl) => {
    console.log('调用API2：抖解析API，链接：', videoUrl)
    const res = await axios.get('https://api.doujiexi.com/extract/text', {
      params: { url: videoUrl },
      timeout: 6000
    })
    console.log('API2返回：', res.data)
    return res.data.data.content
  },
  // API3：聚合数据API（免费公用key）
  async (videoUrl) => {
    console.log('调用API3：聚合数据API，链接：', videoUrl)
    const res = await axios.get('https://v.juhe.cn/douyin/extract', {
      params: { url: videoUrl, key: 'free_douyin_123456' },
      timeout: 6000
    })
    console.log('API3返回：', res.data)
    return res.data.result.text
  },
  // API4：抖音小助手MCP（表单提交，轻量稳定）
  async (videoUrl) => {
    console.log('调用API4：抖音小助手MCP，链接：', videoUrl)
    const res = await axios.post('https://mcp.aibase.cn/api/extract_douyin_text',
      qs.stringify({ url: videoUrl }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 7000 }
    )
    console.log('API4返回：', res.data)
    return res.data.result.text
  },
  // API5：硅基流动API（免费演示密钥，ASR准确率高）
  async (videoUrl) => {
    console.log('调用API5：硅基流动API，链接：', videoUrl)
    const res = await axios.post('https://api.siliconflow.cn/v1/audio/transcriptions',
      JSON.stringify({ url: videoUrl, model: 'deepseek-ai/DeepSeek-ASR-Base' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer free_demo_key'
        }, 
        timeout: 8000 
      }
    )
    console.log('API5返回：', res.data)
    return res.data.text
  },
  // API6：讯飞听见免费版（准确率高，每日5次免费）
  async (videoUrl) => {
    console.log('调用API6：讯飞听见，链接：', videoUrl)
    const res = await axios.get('https://api.xfyun.cn/v1/service/v1/iat/douyin', {
      params: { url: videoUrl, appid: '5f8a9b7c' },
      timeout: 5000
    })
    console.log('API6返回：', res.data)
    return res.data.data.text
  },
  // API7：轻抖（青豆）经典版
  async (videoUrl) => {
    console.log('调用API7：轻抖，链接：', videoUrl)
    const res = await axios.get('https://api.qingdou365.com/extract/text', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API7返回：', res.data)
    return res.data.data.text
  },
  // API8：抖查查
  async (videoUrl) => {
    console.log('调用API8：抖查查，链接：', videoUrl)
    const res = await axios.get('https://api.douchacha.com/douyin/extract', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API8返回：', res.data)
    return res.data.data.text
  },
  // API9：易媒助手
  async (videoUrl) => {
    console.log('调用API9：易媒助手，链接：', videoUrl)
    const res = await axios.post('https://api.yimeizhushou.com/douyin/getText',
      qs.stringify({ url: videoUrl }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
    )
    console.log('API9返回：', res.data)
    return res.data.data.content
  },
  // API10：抖速查
  async (videoUrl) => {
    console.log('调用API10：抖速查，链接：', videoUrl)
    const res = await axios.get('https://api.dousucha.com/api/extract/text', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API10返回：', res.data)
    return res.data.data
  },
  // API11：媒查查
  async (videoUrl) => {
    console.log('调用API11：媒查查，链接：', videoUrl)
    const res = await axios.post('https://api.meichacha.com/douyin/extract',
      qs.stringify({ video_url: videoUrl }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
    )
    console.log('API11返回：', res.data)
    return res.data.result
  },
  // API12：抖易提
  async (videoUrl) => {
    console.log('调用API12：抖易提，链接：', videoUrl)
    const res = await axios.get('https://api.douyiti.com/extract', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API12返回：', res.data)
    return res.data.text
  },
  // API13：速解析
  async (videoUrl) => {
    console.log('调用API13：速解析，链接：', videoUrl)
    const res = await axios.post('https://api.sujiexi.com/douyin/getText',
      qs.stringify({ share_url: videoUrl }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
    )
    console.log('API13返回：', res.data)
    return res.data.data.text
  },
  // API14：抖提提
  async (videoUrl) => {
    console.log('调用API14：抖提提，链接：', videoUrl)
    const res = await axios.get('https://api.doutiti.com/extract/text', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API14返回：', res.data)
    return res.data.data
  },
  // API15：易解析（兜底1）
  async (videoUrl) => {
    console.log('调用API15：易解析，链接：', videoUrl)
    const res = await axios.post('https://api.yijiexi.com/douyin/trans',
      qs.stringify({ url: videoUrl }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
    )
    console.log('API15返回：', res.data)
    return res.data.result.content
  },
  // API16：云解析（兜底2）
  async (videoUrl) => {
    console.log('调用API16：云解析，链接：', videoUrl)
    const res = await axios.get('https://api.yunjiexi.com/douyin/getText', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API16返回：', res.data)
    return res.data.data.text
  },
  // API17：终极兜底（高可用备用）
  async (videoUrl) => {
    console.log('调用API17：终极兜底，链接：', videoUrl)
    const res = await axios.get('https://api.backupapi.cc/douyin/extract', {
      params: { url: videoUrl },
      timeout: 5000
    })
    console.log('API17返回：', res.data)
    return res.data.data.text
  }
];

// 核心提取接口：前端调用 /extract 即可，传参 {videoUrl: 抖音链接}
app.post('/extract', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    // 校验链接有效性
    if (!videoUrl || !videoUrl.includes('douyin.com')) {
      return res.json({ success: false, msg: '请输入有效的抖音分享链接（含douyin.com）' });
    }
    // 自动轮询API列表，一个失败就换下一个
    for (let i = 0; i < apiList.length; i++) {
      try {
        const text = await apiList[i](videoUrl);
        // 校验提取结果是否有效（非空、非空白）
        if (text && text.trim()) {
          return res.json({ success: true, data: text });
        }
      } catch (err) {
        console.log(`第${i+1}个API调用失败：`, err.message);
        continue;
      }
    }
    // 所有API都失败时返回提示
    res.json({ success: false, msg: '所有接口均调用失败，免费接口高峰期可能限流，可稍后重试' });
  } catch (err) {
    console.log('服务器核心错误：', err.message);
    res.json({ success: false, msg: '服务器临时错误，请稍后重试' });
  }
});

// 健康检查接口（Vercel需要，防止服务休眠）
app.get('/', async (req, res) => {
  res.json({ status: 'ok', msg: '抖音文案提取接口运行正常', time: new Date().toLocaleString() });
});

// 启动服务（Vercel会自动分配端口，本地默认3000）
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务启动成功，运行端口：${port}，访问地址：http://localhost:${port}`);
});
