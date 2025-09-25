# Crystal CSS Framework

<div align="center">

  
  [![GitHub release](https://img.shields.io/github/release/Yxpillow/crystalcss.svg)](https://github.com/Yxpillow/crystalcss/releases)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![GitHub issues](https://img.shields.io/github/issues/Yxpillow/crystalcss.svg)](https://github.com/Yxpillow/crystalcss/issues)
  [![GitHub stars](https://img.shields.io/github/stars/Yxpillow/crystalcss.svg)](https://github.com/Yxpillow/crystalcss/stargazers)
</div>

一个现代化的CSS框架，采用毛玻璃效果和简约设计理念，提供丰富的UI组件和响应式布局系统。

## ✨ 特性

- 🌟 **毛玻璃效果** - 内置多种毛玻璃效果，营造现代化的视觉体验
- 📱 **完全响应式** - 适配各种屏幕尺寸，从移动设备到桌面端
- 🌙 **暗黑模式** - 原生支持暗黑模式，自动适配系统主题
- ⚡ **流畅动画** - 精心设计的过渡动画，提升用户体验
- 🎨 **丰富组件** - 50+ UI组件，覆盖常见开发需求
- 🔧 **易于使用** - 语义化的类名设计，易于理解和使用
- 📦 **轻量级** - 核心体积仅200KB，加载快速

## 🚀 快速开始

### CDN 引入

**国际CDN:**
```html
<link rel="stylesheet" href="https://cdn.yxpil.com/crystal.css">
<script src="https://cdn.yxpil.com/crystal.js"></script>
```

**国内CDN (推荐):**
```html
<link rel="stylesheet" href="https://xianmoxukong.top/cdn/crystal.css">
<script src="https://xianmoxukong.top/cdn/crystal.js"></script>
```

### 本地安装

```bash
git clone https://github.com/Yxpillow/crystalcss.git
```

### 基础使用

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crystal CSS Demo</title>
    <link rel="stylesheet" href="crystal.css">
</head>
<body>
    <div class="container">
        <h1>Hello Crystal CSS!</h1>
        <button class="btn btn-primary">开始使用</button>
    </div>
    <script src="crystal.js"></script>
</body>
</html>
```

## 📊 统计信息

- 🎯 **50+** UI组件
- 📱 **100%** 响应式设计
- 💾 **200KB** 核心体积
- 📄 **MIT** 开源协议

## 📚 文档与示例

- 📖 [完整文档](docs.html) - 详细的组件文档和API参考
- 🎨 [在线演示](demo.html) - 实时预览所有组件效果
- 🔗 [GitHub仓库](https://github.com/Yxpillow/crystalcss) - 源码、问题反馈

## 🎨 组件预览

### 按钮组件
```html
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-success">成功按钮</button>
<button class="btn btn-warning">警告按钮</button>
<button class="btn btn-danger">危险按钮</button>
```

### 毛玻璃卡片
```html
<div class="card glass">
    <div class="card-header">
        <h3 class="card-title">毛玻璃卡片</h3>
    </div>
    <div class="card-body">
        <p>这是一个带有毛玻璃效果的卡片组件。</p>
    </div>
</div>
```

### 响应式网格
```html
<div class="grid grid-cols-3 gap-4">
    <div class="card">网格项 1</div>
    <div class="card">网格项 2</div>
    <div class="card">网格项 3</div>
</div>
```

## 🌈 主题支持

Crystal CSS 支持亮色和暗色两种主题，可以通过JavaScript自动切换：

```javascript
// 切换暗黑模式
Crystal.toggleDarkMode();

// 设置指定主题
document.documentElement.setAttribute('data-theme', 'dark');
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！

1. Fork 这个仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-01)
- 🎉 首次发布
- ✨ 支持50+UI组件
- 🌙 暗黑模式支持
- 📱 完全响应式设计
- 🎨 毛玻璃效果系统

## 📄 许可证

该项目使用 [MIT](LICENSE) 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有贡献者的努力
- 感谢开源社区的支持
- 特别感谢 [Font Awesome](https://fontawesome.com/) 提供的图标支持

## 📞 联系我们

- 🐛 [报告问题](https://github.com/Yxpillow/crystalcss/issues)
- 💬 [讨论区](https://github.com/Yxpillow/crystalcss/discussions)
- 📧 [联系作者](mailto:hi@yxpil.com)

---

<div align="center">
  <p>用 ❤️ 制作 by <a href="https://github.com/Yxpillow">Yxpillow</a></p>
  <p>⭐ 如果这个项目对您有帮助，请给我们一个星标！</p>
</div>
