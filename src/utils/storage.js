import { STORAGE_KEYS, TOTAL_COUNT_BASE, MAX_IMAGE_CACHE } from './constants'

const MAX_HISTORY = 100

/** 获取累计识别总数（基准 + 增量） */
export function getTotalCount() {
  const increment = uni.getStorageSync(STORAGE_KEYS.TOTAL_COUNT) || 0
  return TOTAL_COUNT_BASE + increment
}

/** 每次识别成功后调用，计数 +1，返回最新值 */
export function incrementTotalCount() {
  const increment = (uni.getStorageSync(STORAGE_KEYS.TOTAL_COUNT) || 0) + 1
  uni.setStorageSync(STORAGE_KEYS.TOTAL_COUNT, increment)
  return TOTAL_COUNT_BASE + increment
}

export function isPrivacyAgreed() {
  return uni.getStorageSync(STORAGE_KEYS.PRIVACY_AGREED) === true
}

export function setPrivacyAgreed() {
  uni.setStorageSync(STORAGE_KEYS.PRIVACY_AGREED, true)
}

export function getHistory() {
  return uni.getStorageSync(STORAGE_KEYS.HISTORY) || []
}

export function saveHistory(record) {
  const list = getHistory()
  const saved = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...record,
  }
  list.unshift(saved)
  uni.setStorageSync(STORAGE_KEYS.HISTORY, list.slice(0, MAX_HISTORY))
  return saved
}

export function getHistoryById(id) {
  return getHistory().find((item) => item.id === id)
}

export function deleteHistory(id) {
  const list = getHistory().filter((item) => item.id !== id)
  uni.setStorageSync(STORAGE_KEYS.HISTORY, list)
}

export function clearHistory() {
  uni.removeStorageSync(STORAGE_KEYS.HISTORY)
}

// ==================== 图片分析缓存 ====================

/** 获取图片缓存结果 */
export function getCachedResult(imageHash) {
  const cache = uni.getStorageSync(STORAGE_KEYS.IMAGE_CACHE) || {}
  const result = cache[imageHash] || null
  console.log('[Cache] 查询缓存, hash:', imageHash, '命中:', !!result, '总数:', Object.keys(cache).length)
  return result
}

/** 设置图片缓存结果 */
export function setCachedResult(imageHash, result) {
  const cache = uni.getStorageSync(STORAGE_KEYS.IMAGE_CACHE) || {}
  cache[imageHash] = {
    ...result,
    cachedAt: new Date().toISOString(),
  }
  console.log('[Cache] 写入缓存, hash:', imageHash)
  // 限制缓存条数，删除最旧的
  const keys = Object.keys(cache)
  if (keys.length > MAX_IMAGE_CACHE) {
    keys.sort((a, b) => {
      const ta = new Date(cache[a].cachedAt || 0).getTime()
      const tb = new Date(cache[b].cachedAt || 0).getTime()
      return ta - tb
    })
    keys.slice(0, keys.length - MAX_IMAGE_CACHE).forEach((k) => delete cache[k])
  }
  uni.setStorageSync(STORAGE_KEYS.IMAGE_CACHE, cache)
}
