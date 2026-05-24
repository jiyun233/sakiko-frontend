<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useDebounceFn } from "@vueuse/core"
import {
  Search,
  Plus,
  ThumbsUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Lightbulb,
} from "@lucide/vue"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useFeatureApi, type FeatureItem } from "@/composables/useFeatureApi"

const api = useFeatureApi()

type StatusFilter = "all" | "pending" | "approved" | "rejected"

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof Clock }
> = {
  pending: { label: "待审核", variant: "secondary", icon: Clock },
  approved: { label: "已采纳", variant: "default", icon: CheckCircle2 },
  rejected: { label: "已拒绝", variant: "destructive", icon: XCircle },
}

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待审核" },
  { key: "approved", label: "已采纳" },
  { key: "rejected", label: "已拒绝" },
]

// ── State ──
const features = ref<FeatureItem[]>([])
const loading = ref(false)
const error = ref("")
const searchQuery = ref("")
const activeFilter = ref<StatusFilter>("all")
const voting = ref<Record<string, boolean>>({})
const sheetOpen = ref(false)

// ── Submit form ──
const formTitle = ref("")
const formDescription = ref("")
const formSubmitting = ref(false)
const formError = ref("")
const similarFeatures = ref<FeatureItem[]>([])
const similarLoading = ref(false)
const submissionConflict = ref(false)

// ── Computed ──
const filteredFeatures = computed(() => {
  let list = features.value
  if (activeFilter.value !== "all") {
    list = list.filter((f) => f.status === activeFilter.value)
  }
  return list
})

const searchPlaceholder = "搜索功能建议..."

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = Date.now()
  const diff = now - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "刚刚"
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  return d.toLocaleDateString("zh-CN")
}

// ── Data fetching ──
async function loadFeatures() {
  loading.value = true
  error.value = ""
  try {
    features.value = await api.list()
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载失败，请重试"
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(async () => {
  const q = searchQuery.value.trim()
  if (!q) {
    loadFeatures()
    return
  }
  loading.value = true
  error.value = ""
  try {
    features.value = await api.search(q)
  } catch (e) {
    error.value = e instanceof Error ? e.message : "搜索失败"
  } finally {
    loading.value = false
  }
}, 350)

watch(searchQuery, () => {
  debouncedSearch()
})

// ── Similarity check ──
const debouncedCheckSimilar = useDebounceFn(async () => {
  const title = formTitle.value.trim()
  if (!title || title.length < 2) {
    similarFeatures.value = []
    return
  }
  similarLoading.value = true
  try {
    similarFeatures.value = await api.checkSimilar(title)
  } catch {
    similarFeatures.value = []
  } finally {
    similarLoading.value = false
  }
}, 500)

watch(formTitle, () => {
  submissionConflict.value = false
  debouncedCheckSimilar()
})

// ── Vote ──
const voteError = ref("")

async function handleVote(feature: FeatureItem) {
  if (voting.value[feature.id]) return
  voteError.value = ""
  voting.value[feature.id] = true
  try {
    await api.vote(feature.id)
    await loadFeatures()
  } catch (e) {
    voteError.value = e instanceof Error ? e.message : "投票失败"
    setTimeout(() => { voteError.value = "" }, 3000)
  } finally {
    voting.value[feature.id] = false
  }
}

// ── Submit ──
async function handleSubmit() {
  formError.value = ""
  if (!formTitle.value.trim()) {
    formError.value = "请输入功能标题"
    return
  }

  formSubmitting.value = true
  try {
    const result = await api.submit(
      formTitle.value.trim(),
      formDescription.value.trim(),
    )
    if (result.conflict) {
      submissionConflict.value = true
      similarFeatures.value = result.similar
    } else {
      formTitle.value = ""
      formDescription.value = ""
      similarFeatures.value = []
      sheetOpen.value = false
      await loadFeatures()
    }
  } catch (e) {
    formError.value = e instanceof Error ? e.message : "提交失败，请重试"
  } finally {
    formSubmitting.value = false
  }
}

function openSubmitSheet() {
  formTitle.value = ""
  formDescription.value = ""
  formError.value = ""
  similarFeatures.value = []
  submissionConflict.value = false
  sheetOpen.value = true
}

// ── Init ──
loadFeatures()
</script>

<template>
  <section class="min-h-screen px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <!-- Back -->
      <a href="#"
        class="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-4" />
        返回首页
      </a>

      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          功能投票
        </h1>
        <p class="mt-3 text-muted-foreground">
          提交新功能建议，或为已有功能投票来帮助改进 Sakiko
        </p>
      </div>

      <!-- Toolbar: Search + Submit -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row">
        <div
          class="flex flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-primary/20">
          <Search class="size-5 shrink-0 text-muted-foreground" />
          <input v-model="searchQuery" type="text" :placeholder="searchPlaceholder"
            class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
        </div>
        <Sheet v-model:open="sheetOpen">
          <SheetTrigger as-child>
            <Button
              class="gap-2 rounded-xl px-5 transition-all duration-300 ease-spring hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              @click="openSubmitSheet">
              <Plus class="size-4" />
              提交新功能
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-full sm:max-w-md flex flex-col">
            <SheetHeader>
              <SheetTitle>提交新功能建议</SheetTitle>
              <SheetDescription>
                描述你希望 Sakiko 新增的功能
              </SheetDescription>
            </SheetHeader>

            <div class="mt-6 flex flex-1 flex-col gap-5 p-4">
              <!-- Title -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">功能名称</label>
                <input v-model="formTitle" type="text" placeholder="期望的触发命令"
                  class="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-shadow duration-300 focus:ring-2 focus:ring-primary/20" />
              </div>

              <!-- Description -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">详细描述</label>
                <textarea v-model="formDescription" rows="4" placeholder="请详细描述这个功能的需求，以及调用方式..."
                  class="resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-shadow duration-300 focus:ring-2 focus:ring-primary/20" />
              </div>

              <!-- Similar features hint -->
              <div v-if="similarFeatures.length && !submissionConflict"
                class="rounded-lg border border-amber-500/20 bg-amber-50 px-4 py-3 dark:bg-amber-950/20">
                <p class="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <AlertCircle class="size-4" />
                  发现相似功能，请确认是否重复
                </p>
                <ul class="mt-2 space-y-1">
                  <li v-for="s in similarFeatures" :key="s.id" class="text-xs text-amber-600 dark:text-amber-500">
                    {{ s.title }}
                  </li>
                </ul>
              </div>

              <!-- Conflict warning -->
              <div v-if="submissionConflict"
                class="rounded-lg border border-red-500/20 bg-red-50 px-4 py-3 dark:bg-red-950/20">
                <p class="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
                  <AlertCircle class="size-4" />
                  已存在相似功能，请为已有功能投票
                </p>
                <ul class="mt-2 space-y-1">
                  <li v-for="s in similarFeatures" :key="s.id" class="text-xs text-red-600 dark:text-red-500">
                    {{ s.title }}
                  </li>
                </ul>
              </div>

              <!-- Form error -->
              <div v-if="formError"
                class="rounded-lg border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
                {{ formError }}
              </div>
            </div>

            <SheetFooter class="mt-6">
              <Button variant="outline" class="rounded-xl" @click="sheetOpen = false">
                取消
              </Button>
              <Button class="rounded-xl gap-2 transition-all duration-300 ease-spring hover:scale-105"
                :disabled="formSubmitting" @click="handleSubmit">
                <Loader2 v-if="formSubmitting" class="size-4 animate-spin" />
                提交建议
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <!-- Vote error toast -->
      <div v-if="voteError"
        class="mb-4 rounded-lg border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400 animate-fade-in">
        {{ voteError }}
      </div>

      <!-- Filter tabs -->
      <div class="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button v-for="tab in FILTER_TABS" :key="tab.key"
          class="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-spring" :class="activeFilter === tab.key
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
            " @click="activeFilter = tab.key">
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center gap-4 py-20">
        <AlertCircle class="size-10 text-red-400" />
        <p class="text-muted-foreground">{{ error }}</p>
        <Button variant="outline" class="rounded-xl" @click="loadFeatures">
          重试
        </Button>
      </div>

      <!-- Empty -->
      <div v-else-if="!filteredFeatures.length" class="flex flex-col items-center justify-center gap-4 py-20">
        <Lightbulb class="size-12 text-muted-foreground/30" />
        <p class="text-muted-foreground">
          {{ searchQuery ? "未找到匹配的功能建议" : "暂无功能建议，快来提交第一个吧！" }}
        </p>
        <Button v-if="!searchQuery" class="gap-2 rounded-xl transition-all duration-300 ease-spring hover:scale-105"
          @click="openSubmitSheet">
          <Plus class="size-4" />
          提交新功能
        </Button>
      </div>

      <!-- Feature cards grid -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="feature in filteredFeatures" :key="feature.id"
          class="group border-border/50 transition duration-500 ease-spring-gentle hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/20">
          <CardHeader>
            <div class="flex items-start justify-between gap-2">
              <CardTitle class="text-base transition-colors duration-300 group-hover:text-primary">
                {{ feature.title }}
              </CardTitle>
              <Badge :variant="STATUS_CONFIG[feature.status]?.variant ?? 'secondary'" class="shrink-0">
                <component :is="STATUS_CONFIG[feature.status]?.icon ?? Clock" class="mr-1 size-3" />
                {{ STATUS_CONFIG[feature.status]?.label ?? feature.status }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription v-if="feature.description" class="line-clamp-3 text-sm leading-relaxed">
              {{ feature.description }}
            </CardDescription>
            <CardDescription v-else class="italic">
              暂无详细描述
            </CardDescription>
          </CardContent>
          <CardFooter class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">
              {{ formatTime(feature.createdAt) }}
            </span>
            <button
              class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-spring"
              :class="feature.hasVoted
                ? 'bg-primary/10 text-primary cursor-default'
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105'
                " :disabled="feature.hasVoted || voting[feature.id]" @click="handleVote(feature)">
              <Loader2 v-if="voting[feature.id]" class="size-4 animate-spin" />
              <ThumbsUp v-else class="size-4" />
              {{ feature.votes }}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
</template>
