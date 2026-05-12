# 选择终结者 (Choice Terminator)

一个帮助用户做出决策的 Web 应用，通过淘汰赛、命运转盘和直觉探测器三种方式帮助用户在多个选项中做出最终选择。

## 功能特点

### 1. 初始化页面
- 用户可以输入 4-10 个纠结的选项
- 动态添加/删除选项
- 表单验证确保至少有 4 个选项

### 2. 淘汰赛阶段
- 每次从选项池中随机选取两个选项进行对比
- 用户点击选择更倾向的选项
- 败者触发破碎/掉落动画
- 胜者继续与下一个选项比拼
- 直到只剩 3 个选项

### 3. 决策圈
- 展示最终的 3 个选项
- 提供两种决策方式选择

### 4. 命运转盘
- 将 3 个选项绘制成转盘
- 点击 Spin 按钮开始旋转
- 随机减速并停在一个选项上
- **反悔机制**：
  - 3 分钟倒计时
  - 提供文本输入框让用户写下反悔理由
  - 如果写下理由，可以重新旋转
  - 可以直接确认锁定结果
  - 倒计时结束自动锁定

### 5. 直觉探测器
- 依次对 3 个选项进行盲测
- 每个选项展示 2 秒
- 然后屏幕模糊并出现视觉噪声
- 询问用户身体感觉（紧绷/收缩 vs 放松/舒展）
- 最后汇总结果，推荐让身体感到放松的选项

## 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

## 安装和运行

### 前置要求

确保你的系统已安装 Node.js（推荐 v16 或更高版本）

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build

# 或使用 pnpm
pnpm build
```

### 预览生产版本

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview

# 或使用 pnpm
pnpm preview
```

## 设计风格

- **极简风格**：类似 Notion 的设计理念
- **深色模式**：优先使用深色主题
- **流畅动画**：使用 Framer Motion 实现丝滑的页面切换和交互效果
- **沉浸体验**：重点放在用户的沉浸感和交互体验上

## 项目结构

```
XZZJZ/
├── src/
│   ├── components/
│   │   ├── InitialPage.jsx       # 初始化页面
│   │   ├── EliminationPage.jsx    # 淘汰赛页面
│   │   ├── DecisionCirclePage.jsx # 决策圈页面
│   │   ├── WheelPage.jsx          # 命运转盘页面
│   │   └── IntuitionPage.jsx      # 直觉探测器页面
│   ├── App.jsx                    # 主应用组件
│   ├── main.jsx                   # 应用入口
│   └── index.css                  # 全局样式
├── index.html                     # HTML 模板
├── package.json                   # 项目配置
├── vite.config.js                 # Vite 配置
├── tailwind.config.js             # Tailwind 配置
└── postcss.config.js              # PostCSS 配置
```

## 核心功能实现

### 页面流转
- 使用 React state 管理当前页面状态
- 通过 props 传递数据和回调函数
- 使用 Framer Motion 的 AnimatePresence 实现页面切换动画

### 动画效果
- **页面切换**：淡入淡出 + 平移效果
- **淘汰赛**：败者破碎/掉落动画
- **转盘旋转**：使用 SVG + CSS transform 实现平滑旋转
- **直觉探测器**：屏幕模糊 + 视觉噪声效果

### 状态管理
- 选项数据在组件间传递
- 淘汰赛维护待比拼池
- 转盘维护旋转角度和选中状态
- 直觉探测器维护测试进度和响应结果

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari
- 其他现代浏览器

## 许可证

MIT License