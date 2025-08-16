/*!
 * 响应式处理类 - JavaScript响应式布局管理器
 * 提供断点检测、布局自动调整、设备适配等功能
 */

class ResponsiveHandler {
  constructor(options = {}) {
    // 默认配置
    this.config = {
      breakpoints: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1400
      },
      debounceDelay: 250,
      enableLogging: false,
      ...options
    };

    // 状态管理
    this.currentBreakpoint = null;
    this.previousBreakpoint = null;
    this.isInitialized = false;
    this.resizeTimer = null;
    this.orientationTimer = null;

    // 回调函数存储
    this.callbacks = {
      breakpointChange: [],
      resize: [],
      orientationChange: []
    };

    // 初始化
    this.init();
  }

  /**
   * 初始化响应式处理器
   */
  init() {
    if (this.isInitialized) return;

    this.log('ResponsiveHandler: 初始化开始');

    // 检测初始断点
    this.detectBreakpoint();

    // 绑定事件监听器
    this.bindEvents();

    // 初始化完成
    this.isInitialized = true;
    this.log('ResponsiveHandler: 初始化完成', {
      currentBreakpoint: this.currentBreakpoint,
      viewport: this.getViewportInfo()
    });

    // 触发初始化回调
    this.triggerCallbacks('resize', this.getViewportInfo());
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 窗口大小变化监听
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });

    // 设备方向变化监听
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this), { passive: true });

    // 页面可见性变化监听
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this), { passive: true });

    // DOM内容加载完成监听
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.handleDOMReady.bind(this));
    } else {
      this.handleDOMReady();
    }
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    // 防抖处理
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      const previousBreakpoint = this.currentBreakpoint;
      this.detectBreakpoint();

      const viewportInfo = this.getViewportInfo();
      this.log('窗口大小变化', viewportInfo);

      // 触发resize回调
      this.triggerCallbacks('resize', viewportInfo);

      // 如果断点发生变化，触发断点变化回调
      if (previousBreakpoint !== this.currentBreakpoint) {
        this.triggerCallbacks('breakpointChange', {
          from: previousBreakpoint,
          to: this.currentBreakpoint,
          viewport: viewportInfo
        });
      }

      // 自动调整布局
      this.autoAdjustLayout();
    }, this.config.debounceDelay);
  }

  /**
   * 处理设备方向变化
   */
  handleOrientationChange() {
    // 延迟处理，等待浏览器完成方向变化
    clearTimeout(this.orientationTimer);
    this.orientationTimer = setTimeout(() => {
      const orientationInfo = this.getOrientationInfo();
      this.log('设备方向变化', orientationInfo);

      // 触发方向变化回调
      this.triggerCallbacks('orientationChange', orientationInfo);

      // 重新检测断点
      this.handleResize();
    }, 100);
  }

  /**
   * 处理页面可见性变化
   */
  handleVisibilityChange() {
    if (!document.hidden) {
      // 页面重新可见时，重新检测布局
      setTimeout(() => {
        this.handleResize();
      }, 100);
    }
  }

  /**
   * 处理DOM准备就绪
   */
  handleDOMReady() {
    this.log('DOM内容加载完成');
    this.autoAdjustLayout();
    this.initializeResponsiveElements();
  }

  /**
   * 检测当前断点
   */
  detectBreakpoint() {
    const width = window.innerWidth;
    this.previousBreakpoint = this.currentBreakpoint;

    if (width >= this.config.breakpoints.xl) {
      this.currentBreakpoint = 'xl';
    } else if (width >= this.config.breakpoints.lg) {
      this.currentBreakpoint = 'lg';
    } else if (width >= this.config.breakpoints.md) {
      this.currentBreakpoint = 'md';
    } else if (width >= this.config.breakpoints.sm) {
      this.currentBreakpoint = 'sm';
    } else if (width >= this.config.breakpoints.xs) {
      this.currentBreakpoint = 'xs';
    } else {
      this.currentBreakpoint = 'xxs';
    }

    // 更新body类名
    this.updateBodyClasses();
  }

  /**
   * 更新body元素的断点类名
   */
  updateBodyClasses() {
    const body = document.body;
    const breakpointClasses = Object.keys(this.config.breakpoints).concat(['xxs']);
    
    // 移除所有断点类名
    breakpointClasses.forEach(bp => {
      body.classList.remove(`breakpoint-${bp}`);
    });
    
    // 添加当前断点类名
    body.classList.add(`breakpoint-${this.currentBreakpoint}`);
  }

  /**
   * 获取视口信息
   */
  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      breakpoint: this.currentBreakpoint,
      devicePixelRatio: window.devicePixelRatio || 1,
      orientation: this.getOrientationInfo()
    };
  }

  /**
   * 获取设备方向信息
   */
  getOrientationInfo() {
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    return {
      angle: orientation ? orientation.angle : window.orientation || 0,
      type: orientation ? orientation.type : (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    };
  }

  /**
   * 自动调整布局
   */
  autoAdjustLayout() {
    this.adjustNavigation();
    this.adjustImages();
    this.adjustIframes();
    this.adjustTables();
    this.adjustCards();
  }

  /**
   * 调整导航布局
   */
  adjustNavigation() {
    const nav = document.querySelector('.navbar, .responsive-nav');
    if (!nav) return;

    const isMobile = this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'xxs';
    const navMenu = nav.querySelector('.nav-menu, .navbar-nav');
    const navToggle = nav.querySelector('.nav-toggle, .navbar-toggle');

    if (navMenu) {
      if (isMobile) {
        navMenu.classList.add('mobile-nav');
      } else {
        navMenu.classList.remove('mobile-nav', 'active');
      }
    }

    if (navToggle) {
      navToggle.style.display = isMobile ? 'block' : 'none';
    }
  }

  /**
   * 调整图片响应式
   */
  adjustImages() {
    const images = document.querySelectorAll('img:not(.no-responsive)');
    images.forEach(img => {
      if (!img.classList.contains('responsive-img')) {
        img.classList.add('responsive-img');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }
    });
  }

  /**
   * 调整iframe响应式
   */
  adjustIframes() {
    const iframes = document.querySelectorAll('iframe:not(.no-responsive)');
    iframes.forEach(iframe => {
      if (!iframe.parentElement.classList.contains('responsive-media')) {
        this.wrapIframeInResponsiveContainer(iframe);
      }
    });
  }

  /**
   * 包装iframe到响应式容器中
   */
  wrapIframeInResponsiveContainer(iframe) {
    const wrapper = document.createElement('div');
    wrapper.className = 'responsive-media ratio-16-9';
    
    iframe.parentNode.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);
    
    // 移除iframe的固定尺寸
    iframe.style.width = '100%';
    iframe.style.height = '100%';
  }

  /**
   * 调整表格响应式
   */
  adjustTables() {
    const tables = document.querySelectorAll('table:not(.no-responsive)');
    tables.forEach(table => {
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        wrapper.style.overflowX = 'auto';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }

  /**
   * 调整卡片布局
   */
  adjustCards() {
    const cardContainers = document.querySelectorAll('.card-container, .posts-grid');
    cardContainers.forEach(container => {
      const isMobile = this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'xxs';
      if (isMobile) {
        container.style.gridTemplateColumns = '1fr';
      } else {
        container.style.gridTemplateColumns = '';
      }
    });
  }

  /**
   * 初始化响应式元素
   */
  initializeResponsiveElements() {
    // 初始化懒加载
    this.initLazyLoading();
    
    // 初始化触摸优化
    this.initTouchOptimization();
    
    // 初始化键盘导航
    this.initKeyboardNavigation();
  }

  /**
   * 初始化懒加载
   */
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * 初始化触摸优化
   */
  initTouchOptimization() {
    // 增加移动端按钮点击区域
    const buttons = document.querySelectorAll('button, .btn, a[role="button"]');
    buttons.forEach(button => {
      if (this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'xxs') {
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
      }
    });

    // 优化触摸滚动
    const scrollableElements = document.querySelectorAll('.scrollable, .sidebar');
    scrollableElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
    });
  }

  /**
   * 初始化键盘导航
   */
  initKeyboardNavigation() {
    // 确保所有交互元素都可以通过键盘访问
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'INPUT' && element.tagName !== 'SELECT' && element.tagName !== 'TEXTAREA') {
        element.setAttribute('tabindex', '0');
      }
    });
  }

  /**
   * 注册回调函数
   */
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  /**
   * 移除回调函数
   */
  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  /**
   * 触发回调函数
   */
  triggerCallbacks(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`ResponsiveHandler回调错误 (${event}):`, error);
        }
      });
    }
  }

  /**
   * 获取当前断点
   */
  getCurrentBreakpoint() {
    return this.currentBreakpoint;
  }

  /**
   * 检查是否为移动设备
   */
  isMobile() {
    return this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'xxs';
  }

  /**
   * 检查是否为平板设备
   */
  isTablet() {
    return this.currentBreakpoint === 'sm' || this.currentBreakpoint === 'md';
  }

  /**
   * 检查是否为桌面设备
   */
  isDesktop() {
    return this.currentBreakpoint === 'lg' || this.currentBreakpoint === 'xl';
  }

  /**
   * 强制重新检测和调整
   */
  refresh() {
    this.handleResize();
  }

  /**
   * 销毁响应式处理器
   */
  destroy() {
    // 移除事件监听器
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // 清除定时器
    clearTimeout(this.resizeTimer);
    clearTimeout(this.orientationTimer);
    
    // 重置状态
    this.isInitialized = false;
    this.callbacks = { breakpointChange: [], resize: [], orientationChange: [] };
    
    this.log('ResponsiveHandler: 已销毁');
  }

  /**
   * 日志输出
   */
  log(message, data = null) {
    if (this.config.enableLogging) {
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
    }
  }
}

// 全局实例
window.ResponsiveHandler = ResponsiveHandler;

// 自动初始化
if (typeof window !== 'undefined') {
  window.responsiveHandler = new ResponsiveHandler({
    enableLogging: false // 生产环境关闭日志
  });
}

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveHandler;
}