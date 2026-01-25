# Phase 2-3 Item B: Studio Workspace UI Implementation

**Status:** 🟡 In Progress  
**Estimated Time:** 6-8 hours  
**Priority:** HIGH (Investor-visible)

---

## ✅ Completed (API Layer)

### API Routes Created
- ✅ `GET /api/studio/campaigns` - List campaigns with counts
- ✅ `POST /api/studio/campaigns` - Create campaign
- ✅ `GET /api/studio/campaigns/:id` - Campaign detail with tasks + assets
- ✅ `PATCH /api/studio/assets/:id` - Update asset with versioning support
  - Query param: `?newVersion=true` creates new version
  - Increments version number
  - Clones asset with parentId reference
- ✅ `GET /api/studio/assets/:id` - Get asset with version history

---

## 🚧 In Progress (UI Layer)

### Pages to Update

#### 1. `/studio` (Campaign List)
**File:** `app/studio/page.tsx`

**Current State:** Exists but needs Phase 2-3 updates

**Requirements:**
- Display campaigns with:
  - Title
  - Status (draft/running/completed)
  - Created date
  - Asset count (from `_count.assets`)
  - Task count (from `_count.tasks`)
- "New Campaign" button → modal or `/studio/create`
- Click campaign → navigate to `/studio/[id]`
- Real-time data from API (no mock data)

**Implementation:**
```tsx
// Fetch from GET /api/studio/campaigns
// Display in grid/table
// Show counts: {campaign._count.assets} assets, {campaign._count.tasks} tasks
```

---

#### 2. `/studio/[id]` (Workspace)
**File:** `app/studio/campaigns/[id]/page.tsx` OR create `app/studio/[id]/page.tsx`

**Current State:** Exists with mock data, needs complete rewrite

**Requirements:**

##### A) Header Section
- Campaign title
- Status badge
- Action menu:
  - "Run Agents" button → POST `/api/studio/agents/run`
  - "Publish" dropdown (future)
  - "Export" button (future)

##### B) Agent Timeline Component
- Display all AgentTasks for campaign
- Columns:
  - Agent Type (strategy, copy, visual, video, personalize)
  - Status (queued/running/done/error)
  - Duration (latencyMs formatted)
  - Tokens In
  - Tokens Out
  - Cost USD
  - Model
- Live refresh every 3s while any task is "running"
- Use polling: `GET /api/studio/campaigns/:id` or dedicated status endpoint

##### C) Content Tabs
- Tabs: Blog | Email | Social | Video | Prompts
- Filter assets by type
- Show asset list for selected tab
- Click asset → load in editor

##### D) Rich Editor Panel
**Features:**
- Target controls:
  - Presets: Short (300w) / Medium (800w) / Long (1500w)
  - Custom word count input
- Live counters:
  - Word count
  - Character count
  - Reading time (minutes)
- Save buttons:
  - "Save" - updates current version
  - "Save as New Version" - creates v2, v3, etc.
- Autosave: debounce 1.5s
- Optimistic UI updates
- Error toast on save failure

##### E) Version History Drawer
- Side panel showing all versions
- List format:
  - v3 (current) - 2 minutes ago
  - v2 - 1 hour ago
  - v1 - 2 hours ago
- Click version → load in editor (read-only or editable)
- Diff view: show character-level changes between versions (client-side)

---

### Components to Create

**Location:** `app/studio/components/`

#### 1. `CampaignList.tsx`
```tsx
interface Campaign {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  _count: {
    assets: number;
    tasks: number;
  };
}

// Grid/table display
// Click → navigate to /studio/[id]
```

#### 2. `AgentTimeline.tsx`
```tsx
interface AgentTask {
  id: string;
  agentType: string;
  status: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  model: string;
  costUsd: number;
  createdAt: string;
  completedAt?: string;
}

// Timeline with status chips
// Polling for live updates
// Format duration, cost, tokens
```

#### 3. `AssetTabs.tsx`
```tsx
// Tabs for Blog | Email | Social | Video | Prompts
// Filter assets by type
// Display asset list
// Click → load in editor
```

#### 4. `RichEditor.tsx`
```tsx
// Textarea or rich text editor
// Target controls (word count presets)
// Live counters (words, chars, reading time)
// Save / Save as New Version buttons
// Autosave with debounce
// Optimistic UI
```

#### 5. `VersionHistory.tsx`
```tsx
// Side drawer
// List all versions
// Click to load version
// Diff view (optional)
```

#### 6. `SocialCounters.tsx`
```tsx
// LinkedIn: 3000 char limit
// X (Twitter): 280 char limit
// Show remaining count
// Warning if exceeded
// "Trim to limit" helper button
```

---

## 📊 Data Flow

### Campaign List Page
```
/studio
  ↓
GET /api/studio/campaigns
  ↓
Display campaigns with counts
  ↓
Click campaign
  ↓
Navigate to /studio/[id]
```

### Workspace Page
```
/studio/[id]
  ↓
GET /api/studio/campaigns/:id
  ↓
Display: Header + Timeline + Tabs + Editor
  ↓
Select tab (e.g., Blog)
  ↓
Filter assets by type="blog"
  ↓
Click asset
  ↓
Load in editor
  ↓
Edit content
  ↓
Save or Save as New Version
  ↓
PATCH /api/studio/assets/:id?newVersion=true
  ↓
Refresh data
```

### Live Updates (Agent Timeline)
```
While any task.status === "running":
  Poll GET /api/studio/campaigns/:id every 3s
  Update timeline component
  Stop polling when all tasks done/error
```

---

## 🧪 Acceptance Tests

### Manual Testing Checklist
- [ ] Visit `/studio` → campaigns load
- [ ] Click "New Campaign" → creates campaign
- [ ] Click campaign → opens `/studio/[id]`
- [ ] Agent timeline shows real telemetry from Item A
- [ ] Select Blog tab → v1 content loads
- [ ] Edit blog content → word/char counters update
- [ ] Click "Save as New Version" → creates v2
- [ ] Refresh page → v2 persists, v1 in history
- [ ] Select Email tab → 4 variants visible
- [ ] Edit email → save → persists
- [ ] Select Social tab → LinkedIn + X posts visible
- [ ] Type >280 chars in X → warning shows
- [ ] Type >3000 chars in LinkedIn → warning shows
- [ ] Select Prompts tab → image prompts visible (read-only)
- [ ] No console errors
- [ ] No 500 errors
- [ ] UI remains responsive

### E2E Test (Playwright)
**File:** `e2e/studio.spec.ts`

```typescript
test('Studio workspace full flow', async ({ page }) => {
  // 1. Navigate to studio
  await page.goto('/studio');
  await expect(page.locator('h1')).toContainText('Studio');
  
  // 2. Click first campaign
  await page.locator('[data-testid="campaign-card"]').first().click();
  await expect(page).toHaveURL(/\/studio\/.+/);
  
  // 3. Verify timeline loads
  await expect(page.locator('[data-testid="agent-timeline"]')).toBeVisible();
  await expect(page.locator('[data-testid="agent-row"]')).toHaveCount(5);
  
  // 4. Switch to Blog tab
  await page.locator('[data-testid="tab-blog"]').click();
  await expect(page.locator('[data-testid="editor"]')).toBeVisible();
  
  // 5. Edit content
  await page.locator('[data-testid="editor"]').fill('Updated blog content v2');
  await expect(page.locator('[data-testid="word-count"]')).toContainText('4');
  
  // 6. Save as new version
  await page.locator('[data-testid="save-new-version"]').click();
  await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
  
  // 7. Reload page
  await page.reload();
  await expect(page.locator('[data-testid="editor"]')).toContainText('Updated blog content v2');
  
  // 8. Open version history
  await page.locator('[data-testid="version-history-btn"]').click();
  await expect(page.locator('[data-testid="version-item"]')).toHaveCount(2);
  
  // 9. Switch to Social tab
  await page.locator('[data-testid="tab-social"]').click();
  
  // 10. Test character limits
  const longText = 'a'.repeat(300);
  await page.locator('[data-testid="social-x-editor"]').fill(longText);
  await expect(page.locator('[data-testid="char-warning"]')).toBeVisible();
  
  // 11. Verify no errors
  const errors = await page.evaluate(() => {
    return (window as any).__errors || [];
  });
  expect(errors).toHaveLength(0);
});
```

---

## 🔧 Technical Implementation Notes

### 1. Polling for Live Updates
```typescript
useEffect(() => {
  const hasRunningTasks = tasks.some(t => t.status === 'running');
  
  if (!hasRunningTasks) return;
  
  const interval = setInterval(async () => {
    const res = await fetch(`/api/studio/campaigns/${id}`);
    const data = await res.json();
    setTasks(data.data.tasks);
  }, 3000);
  
  return () => clearInterval(interval);
}, [tasks, id]);
```

### 2. Autosave with Debounce
```typescript
const [content, setContent] = useState('');
const [saving, setSaving] = useState(false);

const debouncedSave = useMemo(
  () => debounce(async (value: string) => {
    setSaving(true);
    try {
      await fetch(`/api/studio/assets/${assetId}`, {
        method: 'PATCH',
        body: JSON.stringify({ body: value }),
      });
    } finally {
      setSaving(false);
    }
  }, 1500),
  [assetId]
);

useEffect(() => {
  if (content) debouncedSave(content);
}, [content, debouncedSave]);
```

### 3. Character Limit Warnings
```typescript
const LIMITS = {
  linkedin: 3000,
  x: 280,
};

function SocialEditor({ platform, value, onChange }) {
  const limit = LIMITS[platform];
  const remaining = limit - value.length;
  const exceeded = remaining < 0;
  
  return (
    <div>
      <textarea value={value} onChange={e => onChange(e.target.value)} />
      <div className={exceeded ? 'text-red-500' : 'text-gray-500'}>
        {remaining} characters remaining
      </div>
      {exceeded && (
        <button onClick={() => onChange(value.slice(0, limit))}>
          Trim to limit
        </button>
      )}
    </div>
  );
}
```

### 4. Version Diff (Client-Side)
```typescript
import { diffChars } from 'diff';

function VersionDiff({ oldContent, newContent }) {
  const diff = diffChars(oldContent, newContent);
  
  return (
    <div>
      {diff.map((part, i) => (
        <span
          key={i}
          className={
            part.added ? 'bg-green-500/20 text-green-400' :
            part.removed ? 'bg-red-500/20 text-red-400 line-through' :
            ''
          }
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}
```

---

## 📦 Dependencies Needed

```json
{
  "dependencies": {
    "swr": "^2.2.0", // For data fetching with revalidation
    "lodash.debounce": "^4.0.8", // For autosave
    "diff": "^5.1.0" // For version diff view
  }
}
```

---

## 🚀 Implementation Order

1. ✅ **API Routes** (DONE)
   - Campaign detail endpoint
   - Asset versioning endpoint

2. **Update Studio List Page** (1-2 hours)
   - Fetch real campaigns
   - Display with counts
   - Navigation to workspace

3. **Build Workspace Shell** (2-3 hours)
   - Header with campaign info
   - Agent Timeline component
   - Tab navigation
   - Layout structure

4. **Implement Editor + Tabs** (2-3 hours)
   - Rich editor with counters
   - Save / Save as New Version
   - Autosave
   - Tab filtering

5. **Add Version History** (1 hour)
   - Side drawer
   - Version list
   - Diff view

6. **Social Character Limits** (30 min)
   - Counter components
   - Warning UI
   - Trim helper

7. **E2E Tests** (1 hour)
   - Playwright test suite
   - CI integration

8. **Polish & Bug Fixes** (1 hour)
   - Error handling
   - Loading states
   - Responsive design

---

## 🎯 Success Criteria

- [ ] All API endpoints working
- [ ] Campaign list loads real data
- [ ] Workspace shows agent timeline with telemetry
- [ ] Editor supports save + versioning
- [ ] Social tabs enforce character limits
- [ ] Version history functional
- [ ] E2E tests pass
- [ ] No console errors
- [ ] Investor-ready UI quality

---

**Next Steps:** Continue with UI implementation following the order above.
