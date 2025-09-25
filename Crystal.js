//@Yxpillow
//@version 1.0.0
//滢小枕
//本文件为Crystal.js 负责样式控制扩展 
let updatewebview = "/浏览器需要更新"
let logcolor = "#66CCFF"

// ========== 新增实用功能模块 ========== //

// Markdown 支持模块
const MarkdownRenderer = {
    // 简单的 Markdown 解析器
    parse(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // 标题
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // 粗体
        html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
        
        // 斜体
        html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
        html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
        
        // 代码块
        html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
        
        // 行内代码
        html = html.replace(/`(.*?)`/gim, '<code>$1</code>');
        
        // 链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
        
        // 换行
        html = html.replace(/\n/gim, '<br>');
        
        return html;
    },
    
    // 渲染 Markdown 到指定元素
    render(element, markdown) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.innerHTML = this.parse(markdown);
            element.classList.add('markdown-content');
        }
    }
};

// 代码展示模块
const CodeShowcase = {
    // 从文件加载代码示例
    async loadExample(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('加载代码示例失败:', error);
            return '<!-- 加载失败 -->';
        }
    },
    
    // 创建代码展示容器
    createShowcase(options = {}) {
        const {
            title = '代码示例',
            language = 'html',
            showPreview = true,
            showLineNumbers = false,
            enableCopy = true
        } = options;
        
        const showcase = document.createElement('div');
        showcase.className = 'code-showcase';
        
        // 创建头部
        const header = document.createElement('div');
        header.className = 'code-header';
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'code-title';
        titleElement.textContent = title;
        
        const languageTag = document.createElement('span');
        languageTag.className = 'code-language';
        languageTag.textContent = language;
        
        header.appendChild(titleElement);
        header.appendChild(languageTag);
        
        // 创建标签页（如果需要预览）
        if (showPreview) {
            const tabs = document.createElement('div');
            tabs.className = 'code-tabs';
            
            const previewTab = document.createElement('button');
            previewTab.className = 'code-tab active';
            previewTab.textContent = '预览';
            previewTab.onclick = () => this.switchTab(showcase, 'preview');
            
            const codeTab = document.createElement('button');
            codeTab.className = 'code-tab';
            codeTab.textContent = '代码';
            codeTab.onclick = () => this.switchTab(showcase, 'code');
            
            tabs.appendChild(previewTab);
            tabs.appendChild(codeTab);
            showcase.appendChild(tabs);
        }
        
        // 创建预览区域
        if (showPreview) {
            const preview = document.createElement('div');
            preview.className = 'code-preview code-tab-content active';
            showcase.appendChild(preview);
        }
        
        // 创建代码内容区域
        const codeContent = document.createElement('div');
        codeContent.className = `code-content code-tab-content ${!showPreview ? 'active' : ''}`;
        
        if (showLineNumbers) {
            codeContent.classList.add('with-line-numbers');
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'code-line-numbers';
            codeContent.appendChild(lineNumbers);
        }
        
        // 添加复制按钮
        if (enableCopy) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.textContent = '复制';
            copyBtn.onclick = () => this.copyCode(codeContent, copyBtn);
            codeContent.appendChild(copyBtn);
        }
        
        showcase.appendChild(header);
        showcase.appendChild(codeContent);
        
        return showcase;
    },
    
    // 切换标签页
    switchTab(showcase, tabType) {
        const tabs = showcase.querySelectorAll('.code-tab');
        const contents = showcase.querySelectorAll('.code-tab-content');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        if (tabType === 'preview') {
            tabs[0].classList.add('active');
            contents[0].classList.add('active');
        } else {
            tabs[1].classList.add('active');
            contents[1].classList.add('active');
        }
    },
    
    // 复制代码
    async copyCode(codeElement, button) {
        const code = codeElement.textContent.replace('复制', '').trim();
        
        try {
            await navigator.clipboard.writeText(code);
            button.textContent = '已复制';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = '复制';
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.textContent = '已复制';
            setTimeout(() => {
                button.textContent = '复制';
            }, 2000);
        }
    },
    
    // 语法高亮
    highlightSyntax(code, language = 'html') {
        let highlighted = code;
        
        switch (language.toLowerCase()) {
            case 'html':
                highlighted = highlighted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>');
                highlighted = highlighted.replace(/(&lt;\/?[^&gt;]+&gt;)/g, '<span class="tag">$1</span>');
                highlighted = highlighted.replace(/(\w+)=/g, '<span class="attribute">$1</span>=');
                highlighted = highlighted.replace(/"([^"]*)"/g, '"<span class="string">$1</span>"');
                break;
                
            case 'css':
                highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
                highlighted = highlighted.replace(/([.#]?[\w-]+)\s*{/g, '<span class="selector">$1</span> {');
                highlighted = highlighted.replace(/([\w-]+):/g, '<span class="property">$1</span>:');
                highlighted = highlighted.replace(/:\s*([^;]+);/g, ': <span class="string">$1</span>;');
                break;
                
            case 'javascript':
            case 'js':
                highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>');
                highlighted = highlighted.replace(/\b(function|var|let|const|if|else|for|while|return|class|extends)\b/g, '<span class="keyword">$1</span>');
                highlighted = highlighted.replace(/'([^']*)'/g, "'<span class=\"string\">$1</span>'");
                highlighted = highlighted.replace(/"([^"]*)"/g, '"<span class="string">$1</span>"');
                highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
                break;
        }
        
        return highlighted;
    },
    
    // 设置代码内容
    setCode(showcase, code, language = 'html') {
        const codeContent = showcase.querySelector('.code-content');
        const preview = showcase.querySelector('.code-preview');
        
        if (codeContent) {
            // 转义HTML
            const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const highlightedCode = this.highlightSyntax(escapedCode, language);
            
            // 更新行号
            if (codeContent.classList.contains('with-line-numbers')) {
                const lineNumbers = codeContent.querySelector('.code-line-numbers');
                const lines = code.split('\n');
                lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('\n');
            }
            
            // 设置代码内容（保留复制按钮）
            const copyBtn = codeContent.querySelector('.code-copy-btn');
            codeContent.innerHTML = highlightedCode;
            if (copyBtn) {
                codeContent.appendChild(copyBtn);
            }
        }
        
        // 设置预览内容
        if (preview && language === 'html') {
            preview.innerHTML = code;
        }
    },
    
    // 从文件加载并创建展示
    async loadAndCreate(filePath, options = {}) {
        const code = await this.loadExample(filePath);
        const showcase = this.createShowcase(options);
        this.setCode(showcase, code, options.language || 'html');
        return showcase;
    }
};

// 工具提示管理器
const TooltipManager = {
    activeTooltip: null,
    
    // 初始化工具提示
    init() {
        // 为所有带有data-tooltip属性的元素添加事件监听
        document.addEventListener('mouseenter', (e) => {
            if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-tooltip')) {
                this.show(e.target);
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-tooltip')) {
                this.hide();
            }
        }, true);
        
        // 移动设备支持
        document.addEventListener('touchstart', (e) => {
            if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-tooltip')) {
                this.show(e.target);
                setTimeout(() => this.hide(), 2000);
            }
        }, true);
    },
    
    // 显示工具提示
    show(element) {
        const text = element.getAttribute('data-tooltip');
        if (!text) return;
        
        this.hide(); // 先隐藏之前的提示
        
        const tooltip = document.createElement('div');
        tooltip.className = 'crystal-tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // 计算位置
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;
        
        // 边界检查
        if (left < 8) left = 8;
        if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        if (top < 8) {
            top = rect.bottom + 8;
            tooltip.classList.add('bottom');
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        
        this.activeTooltip = tooltip;
        
        // 添加显示动画
        setTimeout(() => tooltip.classList.add('show'), 10);
    },
    
    // 隐藏工具提示
    hide() {
        if (this.activeTooltip) {
            this.activeTooltip.classList.remove('show');
            setTimeout(() => {
                if (this.activeTooltip && this.activeTooltip.parentNode) {
                    this.activeTooltip.parentNode.removeChild(this.activeTooltip);
                }
                this.activeTooltip = null;
            }, 200);
        }
    }
};

// 模态框管理器
const ModalManager = {
    activeModal: null,
    
    // 创建模态框
    create(options = {}) {
        const {
            title = '提示',
            content = '',
            showClose = true,
            backdrop = true,
            size = 'medium', // small, medium, large
            className = ''
        } = options;
        
        const modal = document.createElement('div');
        modal.className = `crystal-modal ${className}`;
        
        modal.innerHTML = `
            <div class="modal-backdrop ${backdrop ? 'clickable' : ''}"></div>
            <div class="modal-dialog modal-${size}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        ${showClose ? '<button class="modal-close" type="button">×</button>' : ''}
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-cancel">取消</button>
                        <button class="btn btn-primary modal-confirm">确定</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 事件绑定
        const backdropEl = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const confirmBtn = modal.querySelector('.modal-confirm');
        
        const closeModal = () => this.close(modal);
        
        if (backdropEl && backdropEl.classList.contains('clickable')) {
            backdropEl.addEventListener('click', closeModal);
        }
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // ESC键关闭
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        return {
            modal,
            show: () => this.show(modal),
            close: () => closeModal(),
            onConfirm: (callback) => {
                if (confirmBtn) {
                    confirmBtn.addEventListener('click', () => {
                        callback();
                        closeModal();
                    });
                }
            },
            onCancel: (callback) => {
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        callback();
                        closeModal();
                    });
                }
            }
        };
    },
    
    // 显示模态框
    show(modal) {
        if (this.activeModal) {
            this.close(this.activeModal);
        }
        
        this.activeModal = modal;
        document.body.classList.add('modal-open');
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        HapticFeedbackManager.light();
    },
    
    // 关闭模态框
    close(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            if (this.activeModal === modal) {
                this.activeModal = null;
            }
        }, 300);
    },
    
    // 快速确认对话框
    confirm(message, title = '确认') {
        return new Promise((resolve) => {
            const modalInstance = this.create({
                title,
                content: `<p>${message}</p>`,
                size: 'small'
            });
            
            this.show(modalInstance.modal);
            
            modalInstance.onConfirm(() => resolve(true));
            modalInstance.onCancel(() => resolve(false));
        });
    },
    
    // 快速提示对话框
    alert(message, title = '提示') {
        return new Promise((resolve) => {
            const modalInstance = this.create({
                title,
                content: `<p>${message}</p>`,
                size: 'small'
            });
            
            // 隐藏取消按钮
            const modal = modalInstance.modal;
            const cancelBtn = modal.querySelector('.modal-cancel');
            if (cancelBtn) cancelBtn.style.display = 'none';
            
            this.show(modal);
            
            modalInstance.onConfirm(() => resolve(true));
        });
    }
};

// 加载状态管理器
const LoadingManager = {
    activeLoaders: new Map(),
    
    // 显示加载状态
    show(options = {}) {
        const {
            type = 'spinner', // spinner, dots, bar
            message = '加载中...',
            overlay = true,
            target = null,
            id = 'default'
        } = options;
        
        // 如果已存在相同ID的加载器，先移除
        if (this.activeLoaders.has(id)) {
            this.hide(id);
        }
        
        const loader = document.createElement('div');
        loader.className = `crystal-loader ${overlay ? 'overlay' : ''}`;
        loader.dataset.loaderId = id;
        
        let loaderHTML = '';
        switch (type) {
            case 'spinner':
                loaderHTML = `
                    <div class="loader-spinner"></div>
                    <div class="loader-message">${message}</div>
                `;
                break;
            case 'dots':
                loaderHTML = `
                    <div class="loader-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                    <div class="loader-message">${message}</div>
                `;
                break;
            case 'bar':
                loaderHTML = `
                    <div class="loader-bar">
                        <div class="bar-fill"></div>
                    </div>
                    <div class="loader-message">${message}</div>
                `;
                break;
        }
        
        loader.innerHTML = loaderHTML;
        
        if (target) {
            target.appendChild(loader);
        } else {
            document.body.appendChild(loader);
        }
        
        this.activeLoaders.set(id, loader);
        
        // 添加显示动画
        setTimeout(() => loader.classList.add('show'), 10);
        
        return id;
    },
    
    // 隐藏加载状态
    hide(id = 'default') {
        const loader = this.activeLoaders.get(id);
        if (loader) {
            loader.classList.remove('show');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                this.activeLoaders.delete(id);
            }, 300);
        }
    },
    
    // 隐藏所有加载状态
    hideAll() {
        this.activeLoaders.forEach((loader, id) => {
            this.hide(id);
        });
    },
    
    // 显示页面覆盖加载
    showOverlay(message = '加载中...') {
        return this.show({
            type: 'spinner',
            message,
            overlay: true,
            id: 'overlay'
        });
    },
    
    // 隐藏页面覆盖加载
    hideOverlay() {
        this.hide('overlay');
    }
};

// 表单验证器
const FormValidator = {
    // 验证规则
    rules: {
        required: (value) => value.trim() !== '',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => /^1[3-9]\d{9}$/.test(value),
        url: (value) => /^https?:\/\/.+/.test(value),
        number: (value) => !isNaN(value) && value !== '',
        integer: (value) => Number.isInteger(Number(value)),
        minLength: (value, min) => value.length >= min,
        maxLength: (value, max) => value.length <= max,
        min: (value, min) => Number(value) >= min,
        max: (value, max) => Number(value) <= max,
        pattern: (value, pattern) => new RegExp(pattern).test(value)
    },
    
    // 错误消息
    messages: {
        required: '此字段为必填项',
        email: '请输入有效的邮箱地址',
        phone: '请输入有效的手机号码',
        url: '请输入有效的网址',
        number: '请输入有效的数字',
        integer: '请输入整数',
        minLength: '长度不能少于 {min} 个字符',
        maxLength: '长度不能超过 {max} 个字符',
        min: '值不能小于 {min}',
        max: '值不能大于 {max}',
        pattern: '格式不正确'
    },
    
    // 验证单个字段
    validateField(field, rules) {
        const value = field.value;
        const errors = [];
        
        for (const rule of rules) {
            const [ruleName, ...params] = rule.split(':');
            const ruleFunc = this.rules[ruleName];
            
            if (ruleFunc) {
                const isValid = params.length > 0 
                    ? ruleFunc(value, ...params.map(p => isNaN(p) ? p : Number(p)))
                    : ruleFunc(value);
                
                if (!isValid) {
                    let message = this.messages[ruleName] || '验证失败';
                    // 替换参数占位符
                    params.forEach((param, index) => {
                        message = message.replace(`{${['min', 'max'][index] || 'param'}}`, param);
                    });
                    errors.push(message);
                    break; // 只显示第一个错误
                }
            }
        }
        
        return errors;
    },
    
    // 显示字段错误
    showFieldError(field, errors) {
        this.clearFieldError(field);
        
        if (errors.length > 0) {
            field.classList.add('error');
            
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.textContent = errors[0];
            
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    },
    
    // 清除字段错误
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },
    
    // 验证表单
    validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;
        
        fields.forEach(field => {
            const rules = field.dataset.validate.split('|');
            const errors = this.validateField(field, rules);
            
            this.showFieldError(field, errors);
            
            if (errors.length > 0) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    // 初始化表单验证
    init(form) {
        if (typeof form === 'string') {
            form = document.querySelector(form);
        }
        
        if (!form) return;
        
        const fields = form.querySelectorAll('[data-validate]');
        
        // 实时验证
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                const rules = field.dataset.validate.split('|');
                const errors = this.validateField(field, rules);
                this.showFieldError(field, errors);
            });
            
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    const rules = field.dataset.validate.split('|');
                    const errors = this.validateField(field, rules);
                    if (errors.length === 0) {
                        this.clearFieldError(field);
                    }
                }
            });
        });
        
        // 表单提交验证
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                NotificationManager.show('请检查表单中的错误', 'error', 3000);
                HapticFeedbackManager.vibrate('error');
            }
        });
    }
};

// 暗色模式管理器
const DarkModeManager = {
    // 存储键名
    storageKey: 'crystal-dark-mode',
    
    // 检查是否为暗色模式
    isDark() {
        return localStorage.getItem(this.storageKey) === 'true';
    },
    
    // 设置暗色模式
    setDark(isDark) {
        localStorage.setItem(this.storageKey, isDark.toString());
        this.updateTheme();
        console.log(`%c暗色模式: ${isDark ? '开启' : '关闭'}`, `background: ${logcolor}; color: white; padding: 8px; border-radius: 6px; font-weight: bold;`);
    },
    
    // 切换暗色模式
    toggle() {
        const newState = !this.isDark();
        this.setDark(newState);
        return newState;
    },
    
    // 更新主题
    updateTheme() {
        const isDark = this.isDark();
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        // 更新所有暗色模式切换按钮的状态
        const toggles = document.querySelectorAll('.dark-mode-toggle');
        toggles.forEach(toggle => {
            if (toggle.type === 'checkbox') {
                toggle.checked = isDark;
            }
        });
    },
    
    // 初始化暗色模式
    init() {
        this.updateTheme();
        
        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => {
                // 如果用户没有手动设置过，则跟随系统
                if (localStorage.getItem(this.storageKey) === null) {
                    this.updateTheme();
                }
            });
        }
        
        // 为所有暗色模式切换按钮添加事件监听
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('dark-mode-toggle')) {
                this.toggle();
                HapticFeedbackManager.switch();
            }
        });
    }
};

// 触控反馈管理器
const HapticFeedbackManager = {
    // 存储键名
    storageKey: 'crystal-haptic-enabled',
    
    // 用户交互状态
    hasUserInteracted: false,
    
    // 震动模式定义
    patterns: {
        light: 20,          // 轻触反馈
        medium: 50,         // 中等反馈
        strong: 100,        // 强烈反馈
        success: [50, 50, 50],  // 成功反馈（三次短震）
        error: [100, 100, 100], // 错误反馈（三次长震）
        notification: [30, 30, 60], // 通知反馈
        button: 30,         // 按钮点击
        switch: 40,         // 开关切换
        slide: 25,          // 滑动反馈
        longPress: [50, 100, 50], // 长按反馈
        heartbeat: [100, 50, 100, 50], // 心跳模式
        pulse: [20, 20, 20, 20, 20] // 脉冲模式
    },
    
    // 初始化用户交互监听
    init() {
        // 监听用户首次交互
        const events = ['click', 'touchstart', 'keydown', 'mousedown'];
        const markInteraction = () => {
            this.hasUserInteracted = true;
            // 移除监听器，只需要标记一次
            events.forEach(event => {
                document.removeEventListener(event, markInteraction, true);
            });
        };
        
        events.forEach(event => {
            document.addEventListener(event, markInteraction, true);
        });
    },
    
    // 检查是否启用触控反馈
    isEnabled() {
        return localStorage.getItem(this.storageKey) !== 'false'; // 默认启用
    },
    
    // 设置触控反馈状态
    setEnabled(enabled) {
        localStorage.setItem(this.storageKey, enabled.toString());
        console.log(`%c触控反馈: ${enabled ? '启用' : '禁用'}`, `background: ${logcolor}; color: white; padding: 8px; border-radius: 6px; font-weight: bold;`);
    },
    
    // 切换触控反馈状态
    toggle() {
        const newState = !this.isEnabled();
        this.setEnabled(newState);
        return newState;
    },
    
    // 检查设备是否支持震动
    isSupported() {
        return 'vibrate' in navigator;
    },
    
    // 执行震动反馈
    vibrate(pattern = 'medium') {
        // 检查是否启用和支持
        if (!this.isEnabled() || !this.isSupported()) {
            return false;
        }
        
        // 检查用户是否已经与页面交互过
        if (!this.hasUserInteracted) {
            // 静默失败，不显示警告
            return false;
        }
        
        try {
            let vibratePattern;
            
            // 如果传入的是预定义模式名称
            if (typeof pattern === 'string' && this.patterns[pattern]) {
                vibratePattern = this.patterns[pattern];
            } 
            // 如果传入的是数字或数组
            else if (typeof pattern === 'number' || Array.isArray(pattern)) {
                vibratePattern = pattern;
            } 
            // 默认使用中等强度
            else {
                vibratePattern = this.patterns.medium;
            }
            
            navigator.vibrate(vibratePattern);
            return true;
        } catch (error) {
            console.warn('触控反馈执行失败:', error);
            return false;
        }
    },
    
    // 停止震动
    stop() {
        if (this.isSupported()) {
            navigator.vibrate(0);
        }
    },
    
    // 便捷方法
    light() { return this.vibrate('light'); },
    medium() { return this.vibrate('medium'); },
    strong() { return this.vibrate('strong'); },
    success() { return this.vibrate('success'); },
    error() { return this.vibrate('error'); },
    notification() { return this.vibrate('notification'); },
    button() { return this.vibrate('button'); },
    switch() { return this.vibrate('switch'); },
    slide() { return this.vibrate('slide'); },
    longPress() { return this.vibrate('longPress'); },
    heartbeat() { return this.vibrate('heartbeat'); },
    pulse() { return this.vibrate('pulse'); }
};

// 通知管理器
const NotificationManager = {
    notifications: [],
    
    // 初始化通知系统
    init() {
        // 创建通知容器
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    },
    
    // 显示通知
    show(message, type = 'info', duration = 5000) {
        const container = document.querySelector('.notification-container') || this.createContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        this.notifications.push(notification);
        
        // 添加显示动画
        setTimeout(() => notification.classList.add('show'), 10);
        
        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.close(notification));
        
        // 自动关闭
        if (duration > 0) {
            setTimeout(() => this.close(notification), duration);
        }
        
        // 触控反馈
        HapticFeedbackManager.notification();
        
        return notification;
    },
    
    // 关闭通知
    close(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 400);
        }
    },
    
    // 清除所有通知
    clearAll() {
        this.notifications.forEach(notification => {
            this.close(notification);
        });
    },
    
    // 创建通知容器
    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }
};

// 评论系统
const CommentManager = {
    comments: [],
    
    // 初始化评论区
    init(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;
        
        container.innerHTML = `
            <div class="comment-input-area">
                <textarea class="comment-input" placeholder="写下你的评论..."></textarea>
                <div class="comment-actions">
                    <span class="comment-count">字数: 0</span>
                    <button class="comment-submit">发表评论</button>
                </div>
            </div>
            <div class="comment-list"></div>
        `;
        
        const input = container.querySelector('.comment-input');
        const submit = container.querySelector('.comment-submit');
        const count = container.querySelector('.comment-count');
        const list = container.querySelector('.comment-list');
        
        // 字数统计
        input.addEventListener('input', () => {
            count.textContent = `字数: ${input.value.length}`;
        });
        
        // 提交评论
        submit.addEventListener('click', () => {
            const content = input.value.trim();
            if (content) {
                this.addComment(content, list);
                input.value = '';
                count.textContent = '字数: 0';
                NotificationManager.show('评论发表成功！', 'success', 3000);
            } else {
                NotificationManager.show('请输入评论内容', 'warning', 3000);
            }
        });
        
        // 回车提交
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                submit.click();
            }
        });
    },
    
    // 添加评论
    addComment(content, listContainer) {
        const comment = {
            id: Date.now(),
            content: content,
            author: '匿名用户',
            time: new Date().toLocaleString()
        };
        
        this.comments.unshift(comment);
        this.renderComment(comment, listContainer);
    },
    
    // 渲染评论
    renderComment(comment, listContainer) {
        if (!listContainer) return;
        
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.style.opacity = '0';
        commentElement.style.transform = 'translateY(-20px)';
        commentElement.style.transition = 'all 0.3s ease';
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-time">${comment.time}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
        `;
        
        listContainer.insertBefore(commentElement, listContainer.firstChild);
        
        // 添加动画
        setTimeout(() => {
            commentElement.style.opacity = '1';
            commentElement.style.transform = 'translateY(0)';
        }, 100);
    }
};

// 开关按钮管理器
const SwitchManager = {
    // 初始化所有开关
    init() {
        const switches = document.querySelectorAll('.switch input[type="checkbox"]');
        switches.forEach(switchElement => {
            switchElement.addEventListener('change', (e) => {
                // 触控反馈
                HapticFeedbackManager.switch();
                
                // 触发自定义事件
                const event = new CustomEvent('switchToggle', {
                    detail: {
                        element: e.target,
                        checked: e.target.checked
                    }
                });
                document.dispatchEvent(event);
            });
        });
    }
};

// 轮播图管理器
const CarouselManager = {
    carousels: new Map(),
    
    // 初始化轮播图
    init(selector, options = {}) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!element) return null;
        
        const config = {
            autoPlay: true,
            interval: 5000,
            showDots: true,
            showArrows: true,
            loop: true,
            ...options
        };
        
        const carousel = {
            element,
            config,
            currentIndex: 0,
            slides: element.querySelectorAll('.carousel-slide'),
            timer: null,
            
            // 切换到指定幻灯片
            goTo(index) {
                if (index < 0 || index >= this.slides.length) return;
                
                this.slides[this.currentIndex].classList.remove('active');
                this.currentIndex = index;
                this.slides[this.currentIndex].classList.add('active');
                
                // 更新指示器
                const dots = element.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                // 触控反馈
                HapticFeedbackManager.slide();
            },
            
            // 下一张
            next() {
                const nextIndex = this.config.loop 
                    ? (this.currentIndex + 1) % this.slides.length
                    : Math.min(this.currentIndex + 1, this.slides.length - 1);
                this.goTo(nextIndex);
            },
            
            // 上一张
            prev() {
                const prevIndex = this.config.loop
                    ? (this.currentIndex - 1 + this.slides.length) % this.slides.length
                    : Math.max(this.currentIndex - 1, 0);
                this.goTo(prevIndex);
            },
            
            // 开始自动播放
            startAutoPlay() {
                if (this.config.autoPlay && this.slides.length > 1) {
                    this.timer = setInterval(() => this.next(), this.config.interval);
                }
            },
            
            // 停止自动播放
            stopAutoPlay() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }
        };
        
        // 设置初始状态
        if (carousel.slides.length > 0) {
            carousel.slides[0].classList.add('active');
        }
        
        // 添加控制按钮
        if (config.showArrows && carousel.slides.length > 1) {
            const prevBtn = element.querySelector('.carousel-prev') || this.createArrowButton('prev');
            const nextBtn = element.querySelector('.carousel-next') || this.createArrowButton('next');
            
            prevBtn.addEventListener('click', () => carousel.prev());
            nextBtn.addEventListener('click', () => carousel.next());
            
            if (!element.querySelector('.carousel-prev')) element.appendChild(prevBtn);
            if (!element.querySelector('.carousel-next')) element.appendChild(nextBtn);
        }
        
        // 添加指示器
        if (config.showDots && carousel.slides.length > 1) {
            const dotsContainer = element.querySelector('.carousel-dots') || this.createDotsContainer();
            dotsContainer.innerHTML = '';
            
            carousel.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => carousel.goTo(index));
                dotsContainer.appendChild(dot);
            });
            
            if (!element.querySelector('.carousel-dots')) element.appendChild(dotsContainer);
        }
        
        // 鼠标悬停暂停自动播放
        element.addEventListener('mouseenter', () => carousel.stopAutoPlay());
        element.addEventListener('mouseleave', () => carousel.startAutoPlay());
        
        // 开始自动播放
        carousel.startAutoPlay();
        
        this.carousels.set(element, carousel);
        return carousel;
    },
    
    // 创建箭头按钮
    createArrowButton(direction) {
        const button = document.createElement('button');
        button.className = `carousel-${direction}`;
        button.innerHTML = direction === 'prev' ? '‹' : '›';
        return button;
    },
    
    // 创建指示器容器
    createDotsContainer() {
        const container = document.createElement('div');
        container.className = 'carousel-dots';
        return container;
    },
    
    // 获取轮播图实例
    get(selector) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        return this.carousels.get(element);
    },
    
    // 销毁轮播图
    destroy(selector) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        const carousel = this.carousels.get(element);
        if (carousel) {
            carousel.stopAutoPlay();
            this.carousels.delete(element);
        }
    }
};

// 音乐播放器管理器
const MusicPlayerManager = {
    players: new Map(),
    
    // 初始化音乐播放器
    init(selector, options = {}) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!element) return null;
        
        const audio = element.querySelector('audio');
        if (!audio) return null;
        
        const config = {
            showPlaylist: true,
            showProgress: true,
            showVolume: true,
            autoPlay: false,
            loop: false,
            ...options
        };
        
        const player = {
            element,
            audio,
            config,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            
            // 播放/暂停
            togglePlay() {
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            },
            
            // 播放
            play() {
                this.audio.play();
                this.isPlaying = true;
                this.updatePlayButton();
                HapticFeedbackManager.button();
            },
            
            // 暂停
            pause() {
                this.audio.pause();
                this.isPlaying = false;
                this.updatePlayButton();
                HapticFeedbackManager.button();
            },
            
            // 设置音量
            setVolume(volume) {
                this.volume = Math.max(0, Math.min(1, volume));
                this.audio.volume = this.volume;
                this.updateVolumeDisplay();
            },
            
            // 跳转到指定时间
            seekTo(time) {
                this.audio.currentTime = time;
                this.updateProgress();
                HapticFeedbackManager.slide();
            },
            
            // 更新播放按钮
            updatePlayButton() {
                const playBtn = element.querySelector('.music-play-btn');
                if (playBtn) {
                    playBtn.textContent = this.isPlaying ? '⏸' : '▶';
                }
            },
            
            // 更新进度条
            updateProgress() {
                const progress = element.querySelector('.music-progress');
                const currentTimeEl = element.querySelector('.music-current-time');
                const durationEl = element.querySelector('.music-duration');
                
                if (progress) {
                    const percentage = (this.audio.currentTime / this.audio.duration) * 100;
                    progress.style.width = `${percentage}%`;
                }
                
                if (currentTimeEl) {
                    currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
                }
                
                if (durationEl) {
                    durationEl.textContent = this.formatTime(this.audio.duration);
                }
            },
            
            // 更新音量显示
            updateVolumeDisplay() {
                const volumeSlider = element.querySelector('.music-volume-slider');
                if (volumeSlider) {
                    volumeSlider.value = this.volume;
                }
            },
            
            // 格式化时间
            formatTime(seconds) {
                if (isNaN(seconds)) return '0:00';
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        };
        
        // 音频事件监听
        audio.addEventListener('loadedmetadata', () => {
            player.duration = audio.duration;
            player.updateProgress();
        });
        
        audio.addEventListener('timeupdate', () => {
            player.currentTime = audio.currentTime;
            player.updateProgress();
        });
        
        audio.addEventListener('ended', () => {
            player.isPlaying = false;
            player.updatePlayButton();
            if (config.loop) {
                player.play();
            }
        });
        
        // 控制按钮事件
        const playBtn = element.querySelector('.music-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => player.togglePlay());
        }
        
        const progressBar = element.querySelector('.music-progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                player.seekTo(percentage * audio.duration);
            });
        }
        
        const volumeSlider = element.querySelector('.music-volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                player.setVolume(e.target.value);
            });
        }
        
        this.players.set(element, player);
        return player;
    },
    
    // 获取播放器实例
    get(selector) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        return this.players.get(element);
    }
};

// 视频播放器管理器
const VideoPlayerManager = {
    players: new Map(),
    
    // 初始化视频播放器
    init(selector, options = {}) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!element) return null;
        
        const video = element.querySelector('video');
        if (!video) return null;
        
        const config = {
            showControls: true,
            showProgress: true,
            showVolume: true,
            showFullscreen: true,
            autoPlay: false,
            loop: false,
            ...options
        };
        
        const player = {
            element,
            video,
            config,
            isPlaying: false,
            isFullscreen: false,
            
            // 播放/暂停
            togglePlay() {
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            },
            
            // 播放
            play() {
                this.video.play();
                this.isPlaying = true;
                this.updatePlayButton();
                HapticFeedbackManager.button();
            },
            
            // 暂停
            pause() {
                this.video.pause();
                this.isPlaying = false;
                this.updatePlayButton();
                HapticFeedbackManager.button();
            },
            
            // 跳转到指定时间
            seekTo(time) {
                this.video.currentTime = time;
                HapticFeedbackManager.slide();
            },
            
            // 设置音量
            setVolume(volume) {
                this.video.volume = Math.max(0, Math.min(1, volume));
                this.updateVolumeDisplay();
            },
            
            // 静音/取消静音
            toggleMute() {
                this.video.muted = !this.video.muted;
                this.updateMuteButton();
                HapticFeedbackManager.button();
            },
            
            // 全屏/退出全屏
            toggleFullscreen() {
                if (!this.isFullscreen) {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            },
            
            // 更新播放按钮
            updatePlayButton() {
                const playBtn = element.querySelector('.video-play-btn');
                if (playBtn) {
                    playBtn.textContent = this.isPlaying ? '⏸' : '▶';
                }
            },
            
            // 更新静音按钮
            updateMuteButton() {
                const muteBtn = element.querySelector('.video-mute-btn');
                if (muteBtn) {
                    muteBtn.textContent = this.video.muted ? '🔇' : '🔊';
                }
            },
            
            // 更新进度条
            updateProgress() {
                const progress = element.querySelector('.video-progress');
                const currentTimeEl = element.querySelector('.video-current-time');
                const durationEl = element.querySelector('.video-duration');
                
                if (progress) {
                    const percentage = (this.video.currentTime / this.video.duration) * 100;
                    progress.style.width = `${percentage}%`;
                }
                
                if (currentTimeEl) {
                    currentTimeEl.textContent = this.formatTime(this.video.currentTime);
                }
                
                if (durationEl) {
                    durationEl.textContent = this.formatTime(this.video.duration);
                }
            },
            
            // 更新音量显示
            updateVolumeDisplay() {
                const volumeSlider = element.querySelector('.video-volume-slider');
                if (volumeSlider) {
                    volumeSlider.value = this.video.volume;
                }
            },
            
            // 格式化时间
            formatTime(seconds) {
                if (isNaN(seconds)) return '0:00';
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        };
        
        // 视频事件监听
        video.addEventListener('loadedmetadata', () => {
            player.updateProgress();
        });
        
        video.addEventListener('timeupdate', () => {
            player.updateProgress();
        });
        
        video.addEventListener('play', () => {
            player.isPlaying = true;
            player.updatePlayButton();
        });
        
        video.addEventListener('pause', () => {
            player.isPlaying = false;
            player.updatePlayButton();
        });
        
        video.addEventListener('ended', () => {
            player.isPlaying = false;
            player.updatePlayButton();
            if (config.loop) {
                player.play();
            }
        });
        
        // 全屏事件监听
        document.addEventListener('fullscreenchange', () => {
            player.isFullscreen = document.fullscreenElement === element;
        });
        
        // 控制按钮事件
        const playBtn = element.querySelector('.video-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => player.togglePlay());
        }
        
        const progressBar = element.querySelector('.video-progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                player.seekTo(percentage * video.duration);
            });
        }
        
        const volumeSlider = element.querySelector('.video-volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                player.setVolume(e.target.value);
            });
        }
        
        const muteBtn = element.querySelector('.video-mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => player.toggleMute());
        }
        
        const fullscreenBtn = element.querySelector('.video-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => player.toggleFullscreen());
        }
        
        this.players.set(element, player);
        return player;
    },
    
    // 获取播放器实例
    get(selector) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        return this.players.get(element);
    }
};

// Crystal框架主对象
const CrystalFramework = {
    // 管理器对象
    DarkMode: DarkModeManager,
    Haptic: HapticFeedbackManager,
    Notification: NotificationManager,
    Comment: CommentManager,
    Switch: SwitchManager,
    Carousel: CarouselManager,
    MusicPlayer: MusicPlayerManager,
    VideoPlayer: VideoPlayerManager,
    Tooltip: TooltipManager,
    Modal: ModalManager,
    Loading: LoadingManager,
    FormValidator: FormValidator,
    
    // 初始化方法
    init() {
        console.log(`%cCrystal Framework 初始化开始...`, `background: ${logcolor}; color: white; padding: 8px; border-radius: 6px; font-weight: bold;`);
        
        // 初始化各个管理器
        HapticFeedbackManager.init?.();
        DarkModeManager.init();
        SwitchManager.init();
        CarouselManager.init?.();
        CommentManager.init?.();
        
        console.log(`%cCrystal Framework 初始化完成！`, `background: ${logcolor}; color: white; padding: 8px; border-radius: 6px; font-weight: bold;`);
    }
};

// 全局Crystal对象，提供便捷访问
window.Crystal = {
    // 管理器对象
    DarkMode: DarkModeManager,
    Haptic: HapticFeedbackManager,
    Notification: NotificationManager,
    Comment: CommentManager,
    Switch: SwitchManager,
    Carousel: CarouselManager,
    MusicPlayer: MusicPlayerManager,
    VideoPlayer: VideoPlayerManager,
    Tooltip: TooltipManager,
    Modal: ModalManager,
    Loading: LoadingManager,
    FormValidator: FormValidator,
    
    // 直接方法
    darkMode: {
        toggle: () => DarkModeManager.toggle(),
        set: (isDark) => DarkModeManager.setDark(isDark),
        get: () => DarkModeManager.isDark()
    },
    
    haptic: {
        vibrate: (pattern) => HapticFeedbackManager.vibrate(pattern),
        light: () => HapticFeedbackManager.light(),
        medium: () => HapticFeedbackManager.medium(),
        strong: () => HapticFeedbackManager.strong(),
        success: () => HapticFeedbackManager.success(),
        error: () => HapticFeedbackManager.error()
    },
    
    notify: (message, type, duration) => NotificationManager.show(message, type, duration),
    
    // 工具方法
    utils: {
        formatTime: (seconds) => {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
};

// 添加到CrystalFramework对象
CrystalFramework.MusicPlayer = MusicPlayerManager;
CrystalFramework.VideoPlayer = VideoPlayerManager;
CrystalFramework.Tooltip = TooltipManager;
CrystalFramework.Modal = ModalManager;
CrystalFramework.Loading = LoadingManager;
CrystalFramework.FormValidator = FormValidator;
CrystalFramework.Notification = NotificationManager;

// 初始化函数
function initCrystalFramework() {
    console.log(`%cCrystal Framework 正在初始化...`, `background: ${logcolor}; color: white; padding: 8px; border-radius: 6px; font-weight: bold;`);
    
    // 初始化各个管理器
    DarkModeManager.init();
    HapticFeedbackManager.init?.();
    NotificationManager.init();
    TooltipManager.init();
    
    // 添加CSS样式
    addCrystalStyles();
    
    console.log(`%cCrystal Framework 初始化完成！`, `background: ${logcolor}; color: white; padding: 8px; border-radius: 6px; font-weight: bold;`);
}

// 添加CSS样式函数
function addCrystalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 工具提示样式 */
        .crystal-tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.2s ease;
        }
        
        .crystal-tooltip.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .crystal-tooltip.bottom {
            transform: translateY(5px);
        }
        
        .crystal-tooltip.bottom.show {
            transform: translateY(0);
        }
        
        /* 模态框样式 */
        .crystal-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .crystal-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .modal-dialog {
            position: relative;
            margin: 50px auto;
            max-width: 500px;
            transform: translateY(-50px);
            transition: transform 0.3s ease;
        }
        
        .crystal-modal.show .modal-dialog {
            transform: translateY(0);
        }
        
        .modal-dialog.modal-small { max-width: 300px; }
        .modal-dialog.modal-large { max-width: 800px; }
        
        .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .modal-header {
            padding: 20px 24px 16px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .modal-close:hover {
            background: #f3f4f6;
        }
        
        .modal-body {
            padding: 20px 24px;
        }
        
        .modal-footer {
            padding: 16px 24px 20px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        
        .modal-open {
            overflow: hidden;
        }
        
        /* 加载器样式 */
        .crystal-loader {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.9);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .crystal-loader.overlay {
            position: fixed;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .crystal-loader.show {
            opacity: 1;
        }
        
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .loader-dots {
            display: flex;
            gap: 8px;
        }
        
        .loader-dots .dot {
            width: 12px;
            height: 12px;
            background: #3b82f6;
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite both;
        }
        
        .loader-dots .dot:nth-child(1) { animation-delay: -0.32s; }
        .loader-dots .dot:nth-child(2) { animation-delay: -0.16s; }
        
        .loader-bar {
            width: 200px;
            height: 4px;
            background: #f3f4f6;
            border-radius: 2px;
            overflow: hidden;
        }
        
        .bar-fill {
            height: 100%;
            background: #3b82f6;
            border-radius: 2px;
            animation: loading 2s ease-in-out infinite;
        }
        
        .loader-message {
            margin-top: 16px;
            color: #6b7280;
            font-size: 14px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
            } 40% {
                transform: scale(1);
            }
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
        
        /* 表单验证样式 */
        .form-input.error,
        .form-select.error,
        .form-textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .field-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 4px;
            display: block;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .modal-dialog {
                margin: 20px;
                max-width: none;
            }
            
            .modal-header,
            .modal-body,
            .modal-footer {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrystalFramework);
} else {
    initCrystalFramework();
}

// 导出全局函数
window.CrystalFramework = CrystalFramework;
window.initCrystalFramework = initCrystalFramework;

// 向后兼容的Crystal对象
window.Crystal = {
    // 通知相关
    showNotification: (type, message, duration = 5000) => {
        // 正确的参数顺序：type, message, duration
        return NotificationManager.show(message, type, duration);
    },
    
    // 暗黑模式相关
    toggleDarkMode: () => DarkModeManager.toggle(),
    
    // 评论相关
    addComment: (containerId) => {
        const container = document.getElementById(containerId) || document.querySelector(containerId);
        if (container) {
            CommentManager.init(container);
        }
    },
    
    // 模态框相关
    Modal: ModalManager,
    
    // 加载器相关
    Loading: LoadingManager,
    
    // 表单验证相关
    FormValidator: FormValidator,
    
    // 其他管理器的快捷访问
    DarkMode: DarkModeManager,
    Notification: NotificationManager,
    Comment: CommentManager,
    Haptic: HapticFeedbackManager,
    
    // 新增模块的快捷访问
    Markdown: MarkdownRenderer,
    CodeShowcase: CodeShowcase
};

const _0x3d2790=_0x283f;function _0x283f(_0x2920b1,_0x1f4c81){const _0x391b49=_0x391b();return _0x283f=function(_0x283fb4,_0x4ed646){_0x283fb4=_0x283fb4-0x1bd;let _0x47ac74=_0x391b49[_0x283fb4];return _0x47ac74;},_0x283f(_0x2920b1,_0x1f4c81);}function _0x391b(){const _0x5ce946=['exports','getNum','1xXoSEG','%c正在跳转...','11931380evADxr','18800eEkczU','1379nvuBMh','%c万类霜天竞自由','href','instantiate','3474215EEdhBU',`background:\x20${logcolor};\x20color:\x20white;\x20padding:\x2010px;\x20border-radius:\x208px;\x20font-weight:\x20bold;\x20font-size:\x2016px;\x20text-shadow:\x201px\x201px\x202px\x20rgba(0,0,0,0.3);`,'catch','秒后跳转到更新页面...','110907gRJbQO','log','36258ciWCCs','秒后跳转...','41161615TZjbtZ','592MQeOYC','1292008kfkNse','375AyutXQ',`background:\x20${logcolor};\x20color:\x20white;\x20padding:\x2010px;\x20border-radius:\x208px;\x20font-weight:\x20bold;\x20font-size:\x2016px;\x20text-shadow:\x201px\x201px\x202px\x20rgba(0,0,0,0.3);`,'%c浪遏飞舟'];_0x391b=function(){return _0x5ce946;};return _0x391b();}(function(_0x4233ad,_0x5ec0f5){const _0x5222d4=_0x283f,_0x36eb2c=_0x4233ad();while(!![]){try{const _0x454c7e=parseInt(_0x5222d4(0x1c6))/0x1*(-parseInt(_0x5222d4(0x1c0))/0x2)+-parseInt(_0x5222d4(0x1c1))/0x3*(parseInt(_0x5222d4(0x1c9))/0x4)+-parseInt(_0x5222d4(0x1ce))/0x5+parseInt(_0x5222d4(0x1d4))/0x6*(-parseInt(_0x5222d4(0x1ca))/0x7)+-parseInt(_0x5222d4(0x1bf))/0x8*(parseInt(_0x5222d4(0x1d2))/0x9)+parseInt(_0x5222d4(0x1c8))/0xa+parseInt(_0x5222d4(0x1be))/0xb;if(_0x454c7e===_0x5ec0f5)break;else _0x36eb2c['push'](_0x36eb2c['shift']());}catch(_0x439a9d){_0x36eb2c['push'](_0x36eb2c['shift']());}}}(_0x391b,0xdccbf));const wasmCode=new Uint8Array([0x0,0x61,0x73,0x6d,0x1,0x0,0x0,0x0,0x1,0x5,0x1,0x60,0x0,0x1,0x7f,0x3,0x2,0x1,0x0,0x7,0xa,0x1,0x6,0x67,0x65,0x74,0x4e,0x75,0x6d,0x0,0x0,0xa,0x6,0x1,0x4,0x0,0x41,0x2a,0xb]);WebAssembly[_0x3d2790(0x1cd)](wasmCode)['then'](_0x31034b=>{const _0x3ecc11=_0x3d2790,_0x1d88ad=_0x31034b['instance'],_0x288404=_0x1d88ad[_0x3ecc11(0x1c4)][_0x3ecc11(0x1c5)],_0x582f84=_0x288404();_0x582f84===0x2a&&console['log'](_0x3ecc11(0x1cb),_0x3ecc11(0x1cf));})[_0x3d2790(0x1d0)](_0x335a47=>{const _0x4b72a4=_0x3d2790;console[_0x4b72a4(0x1d3)](_0x4b72a4(0x1c3),`background:\x20${logcolor};\x20color:\x20white;\x20padding:\x2010px;\x20border-radius:\x208px;\x20font-weight:\x20bold;\x20font-size:\x2016px;\x20text-shadow:\x201px\x201px\x202px\x20rgba(0,0,0,0.3);`);let _0x15eb92=0x5;console[_0x4b72a4(0x1d3)]('%c'+_0x15eb92+_0x4b72a4(0x1d1),_0x4b72a4(0x1c2));const _0x1ec0ad=setInterval(()=>{const _0x43dab3=_0x4b72a4;_0x15eb92--,_0x15eb92>0x0?console['log']('%c'+_0x15eb92+_0x43dab3(0x1bd),`background:\x20${logcolor};\x20color:\x20white;\x20padding:\x2010px;\x20border-radius:\x208px;\x20font-weight:\x20bold;\x20font-size:\x2016px;\x20text-shadow:\x201px\x201px\x202px\x20rgba(0,0,0,0.3);`):(clearInterval(_0x1ec0ad),console[_0x43dab3(0x1d3)](_0x43dab3(0x1c7),_0x43dab3(0x1c2)),window['location'][_0x43dab3(0x1cc)]=updatewebview);},0x3e8);});

