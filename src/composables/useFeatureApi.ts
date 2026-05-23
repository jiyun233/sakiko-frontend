import { useClientId } from "./useClientId"

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api"

export interface FeatureItem {
  id: string
  title: string
  description: string
  status: "pending" | "approved" | "rejected"
  votes: number
  hasVoted: boolean
  createdAt: string
}

/** 后端实际返回的字段 */
interface BackendFeature {
  id: number
  title: string
  description: string
  status: string
  vote_count: number
  created_at: string
}

function mapFeature(raw: BackendFeature): FeatureItem {
  return {
    id: String(raw.id),
    title: raw.title,
    description: raw.description ?? "",
    status: (raw.status as FeatureItem["status"]) ?? "pending",
    votes: raw.vote_count ?? 0,
    hasVoted: false,
    createdAt: raw.created_at ?? "",
  }
}

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  try {
    return JSON.parse(text) as T
  } catch {
    const preview = text.slice(0, 100)
    throw new Error(
      `服务器返回了非 JSON 数据（${res.status}），请确认后端服务是否已启动。响应预览: ${preview}`,
    )
  }
}

export function useFeatureApi() {
  const { clientId } = useClientId()

  function apiHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-Client-ID": clientId.value,
    }
  }

  async function search(query: string): Promise<FeatureItem[]> {
    const res = await fetch(
      `${API_BASE}/features/search?q=${encodeURIComponent(query)}`,
      { headers: apiHeaders() },
    )
    if (!res.ok) throw new Error(`搜索失败 (${res.status})`)
    const data = await safeJson<{ features: BackendFeature[] }>(res)
    return (data.features ?? []).map(mapFeature)
  }

  async function list(status?: string): Promise<FeatureItem[]> {
    const params = status ? `?status=${encodeURIComponent(status)}` : ""
    const res = await fetch(`${API_BASE}/features${params}`, {
      headers: apiHeaders(),
    })
    if (!res.ok) throw new Error(`获取列表失败 (${res.status})`)
    const data = await safeJson<{ features: BackendFeature[] }>(res)
    return (data.features ?? []).map(mapFeature)
  }

  async function getById(id: string): Promise<FeatureItem> {
    const res = await fetch(
      `${API_BASE}/features/${encodeURIComponent(id)}`,
      { headers: apiHeaders() },
    )
    if (!res.ok) throw new Error(`获取详情失败 (${res.status})`)
    const raw = await safeJson<BackendFeature>(res)
    return mapFeature(raw)
  }

  async function checkSimilar(
    title: string,
  ): Promise<FeatureItem[]> {
    const res = await fetch(
      `${API_BASE}/features/similar?title=${encodeURIComponent(title)}`,
      { headers: apiHeaders() },
    )
    if (!res.ok) throw new Error(`查重失败 (${res.status})`)
    const data = await safeJson<{ features: BackendFeature[] }>(res)
    return (data.features ?? []).map(mapFeature)
  }

  async function submit(
    title: string,
    description: string,
  ): Promise<{
    conflict: boolean
    similar: FeatureItem[]
    feature?: FeatureItem
  }> {
    const res = await fetch(`${API_BASE}/features`, {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ title, description }),
    })
    if (res.status === 409) {
      const data = await safeJson<{ similar?: BackendFeature[] }>(res)
      return {
        conflict: true,
        similar: (data.similar ?? []).map(mapFeature),
      }
    }
    if (!res.ok) throw new Error(`提交失败 (${res.status})`)
    const raw = await safeJson<BackendFeature>(res)
    return { conflict: false, similar: [], feature: mapFeature(raw) }
  }

  async function vote(id: string): Promise<FeatureItem> {
    const res = await fetch(
      `${API_BASE}/features/${encodeURIComponent(id)}/vote`,
      { method: "POST", headers: apiHeaders() },
    )
    if (res.status === 409) throw new Error("您已经投过票了")
    if (!res.ok) throw new Error(`投票失败 (${res.status})`)
    const raw = await safeJson<BackendFeature>(res)
    return mapFeature(raw)
  }

  return { search, list, getById, checkSimilar, submit, vote }
}
