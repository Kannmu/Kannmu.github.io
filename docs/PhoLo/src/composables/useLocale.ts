import { computed, ref } from 'vue'
import type { UiLocale } from '../types'

const copy = {
  en: {
    appName: 'PhoLo', appTag: 'Photo layout studio', add: 'Add photos', demo: 'Try demo', reset: 'Clear all', language: 'Language',
    drop: 'Drop visual assets here', local: 'Processed locally', needAnother: 'Add one more image', assets: 'Photos', adjust: 'Adjust', export: 'Export',
    separation: 'Separation', balance: 'Size uniformity', ratio: 'Frame', auto: 'Auto', square: 'Square', cinema: 'Cinema', budget: 'Search depth',
    download: 'Download', format: 'Format', resolution: 'Resolution', originalSize: 'Original', smallSize: 'Small', copyImage: 'Copy image', inspector: 'Inspector', alternative: 'Find another arrangement', close: 'Close', remove: 'Remove', include: 'Include', exclude: 'Exclude',
    searching: 'Searching', ready: 'Layout ready', empty: 'Waiting for photos', uploadFailed: 'Some files could not be read', duplicate: 'Duplicate photos skipped',
    layoutFailed: 'The layout engine could not start', retry: 'Retry',
    uniformity: 'Uniformity', sizeSpread: 'Size spread', fill: 'Frame fill', aspectDrift: 'Aspect drift', elapsed: 'Elapsed', evaluations: 'Evaluations',
    png: 'PNG', jpeg: 'JPEG', webp: 'WebP', svg: 'SVG', exporting: 'Rendering', exportReady: 'Download ready', exportFailed: 'Export failed', copyReady: 'Copied to clipboard', copyFailed: 'Copy failed',
    editValue: 'Edit value', dragValue: 'Drag horizontally to adjust', clearConfirm: 'Clear photo library', clearPrompt: 'Clear all photos from this workspace?',
    noneSelected: 'No photos are included', reviewPhotos: 'Review photos', workspaceTools: 'Workspace tools', demoLabel: 'Demo set', userLabel: 'Your photos',
  },
  'zh-CN': {
    appName: 'PhoLo', appTag: '图片排版工作台', add: '添加图片', demo: '试用示例', reset: '清空', language: '语言',
    drop: '拖入图片', local: '仅在本机处理', needAnother: '再添加一张图片', assets: '图片', adjust: '调整', export: '导出',
    separation: '间距', balance: '尺寸均一度', ratio: '画幅', auto: '自动', square: '方形', cinema: '宽银幕', budget: '搜索深度',
    download: '下载', format: '格式', resolution: '分辨率', originalSize: '原始', smallSize: '小尺寸', copyImage: '复制图片', inspector: '检查器', alternative: '寻找另一种排版', close: '关闭', remove: '移除', include: '参与排版', exclude: '暂不参与',
    searching: '正在搜索', ready: '排版完成', empty: '等待图片', uploadFailed: '部分文件无法读取', duplicate: '已忽略重复图片',
    layoutFailed: '排版引擎无法启动', retry: '重试',
    uniformity: '均匀度', sizeSpread: '尺寸倍率', fill: '画面填充', aspectDrift: '画幅偏差', elapsed: '耗时', evaluations: '评估次数',
    png: 'PNG', jpeg: 'JPEG', webp: 'WebP', svg: 'SVG', exporting: '正在渲染', exportReady: '下载已生成', exportFailed: '导出失败', copyReady: '已复制到剪贴板', copyFailed: '复制失败',
    editValue: '编辑数值', dragValue: '左右拖动调整', clearConfirm: '清空图片库', clearPrompt: '确定清空工作区中的全部图片？',
    noneSelected: '当前没有参与排版的图片', reviewPhotos: '检查图片', workspaceTools: '工作区工具', demoLabel: '示例图片', userLabel: '我的图片',
  },
} as const

export type CopyKey = keyof typeof copy.en
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('pholo-locale') : null
const detected: UiLocale = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
const locale = ref<UiLocale>(stored === 'zh-CN' || stored === 'en' ? stored : detected)

export function useLocale() {
  const t = (key: CopyKey): string => copy[locale.value][key]
  const toggleLocale = () => {
    locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
    localStorage.setItem('pholo-locale', locale.value)
    document.documentElement.lang = locale.value
  }
  const localeLabel = computed(() => locale.value === 'zh-CN' ? 'EN' : '中')
  return { locale, localeLabel, t, toggleLocale }
}
