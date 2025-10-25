# 🔧 PHASE 6 CRITICAL FIXES - IMPLEMENTATION PLAN

## 📊 **STATUS: AGREED WITH PHASE 6 DIRECTION + CRITICAL GAPS IDENTIFIED**

### ✅ **WHAT'S CORRECT IN PHASE 6 PLAN**
- AI Content Engine architecture (OpenAI/Azure integration)
- `GeneratedContent` database model
- Publishing layer concept
- B2B/B2C dual-market approach
- Agent orchestration framework

### ❌ **CRITICAL GAPS TO FIX IMMEDIATELY**

---

## 🎯 **1. CAREER COMPANION FIXES**

### **Issue 1A: Social Links Don't Work**
**Current:** Buttons are decorative only (lines 421-436 in `/app/career/page.tsx`)
**Fix:** Add actual URL navigation

```typescript
// BEFORE (decorative only)
<motion.button className={`p-3 bg-gradient-to-br ${social.color}`}>
  <social.icon className="w-5 h-5" />
</motion.button>

// AFTER (functional links)
<motion.a
  href={profile?.socialLinks?.[social.key] || '#'}
  target="_blank"
  rel="noopener noreferrer"
  className={`p-3 bg-gradient-to-br ${social.color} ${!profile?.socialLinks?.[social.key] && 'opacity-50 cursor-not-allowed'}`}
>
  <social.icon className="w-5 h-5" />
</motion.a>
```

**Update social links array:**
```typescript
const socialLinks = [
  { icon: Linkedin, color: 'from-blue-500 to-blue-600', label: 'LinkedIn', key: 'linkedin' },
  { icon: Github, color: 'from-gray-700 to-gray-800', label: 'GitHub', key: 'github' },
  { icon: Twitter, color: 'from-cyan-500 to-blue-500', label: 'Twitter', key: 'twitter' },
  { icon: Globe, color: 'from-purple-500 to-pink-500', label: 'Website', key: 'website' },
];
```

### **Issue 1B: Resume Upload Doesn't Work**
**Current:** No `/api/upload` endpoint exists
**Fix:** Create upload API with file storage

**New file:** `/app/api/career/upload-resume/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOC files allowed.' }, { status: 400 });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `resume-${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public', 'uploads', 'resumes', fileName);
    
    await writeFile(path, buffer);
    
    const resumeUrl = `/uploads/resumes/${fileName}`;

    // Update profile in database (mock for now)
    // await prisma.careerProfile.update({
    //   where: { userId: 'demo-user' },
    //   data: { resumeUrl }
    // });

    return NextResponse.json({ 
      success: true, 
      resumeUrl,
      message: 'Resume uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
}
```

**Update Career page to handle upload:**
```typescript
const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('resume', file);

  try {
    const res = await fetch('/api/career/upload-resume', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      alert('Resume uploaded successfully!');
      // Refresh profile
      fetchProfile();
    } else {
      alert(data.error || 'Upload failed');
    }
  } catch (error) {
    alert('Upload failed');
  }
};
```

### **Issue 1C: Skills Don't Load Properly**
**Current:** Skills are hardcoded in `skillCategories` but not synced with profile data
**Fix:** Load skills from profile API and allow dynamic categorization

```typescript
// Update fetchProfile to properly map skills
const fetchProfile = async () => {
  try {
    setLoading(true);
    const res = await fetch('/api/career/profile', {
      headers: { 'x-user-id': 'demo-user' },
    });
    const data = await res.json();
    if (data.success && data.profile) {
      setProfile(data.profile);
      setHeadline(data.profile.headline || '');
      setBio(data.profile.bio || '');
      setSkills(data.profile.skills || []);
      
      // Map skills to categories if metadata exists
      if (data.profile.skillCategories) {
        // Load categorized skills
      }
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  } finally {
    setLoading(false);
  }
};
```

### **Issue 1D: Multi-Profile Support (CRITICAL FEATURE)**
**Current:** Single profile only
**Fix:** Add profile switcher for different job goals

**New Prisma Model:**
```prisma
model CareerProfile {
  id              String   @id @default(cuid())
  userId          String
  profileType     String   @default("primary") // primary, technical, leadership, creative
  headline        String?
  bio             String?
  skills          Json?    // Array of skills
  skillCategories Json?    // Categorized skills
  portfolioUrls   Json?
  socialLinks     Json?
  resumeUrl       String?
  visibility      String   @default("public")
  targetRole      String?  // e.g., "Senior PM", "Tech Lead", "Designer"
  targetIndustry  String?  // e.g., "SaaS", "Healthcare", "Finance"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, profileType])
  @@index([userId])
}
```

**Add Profile Switcher UI:**
```typescript
const [profiles, setProfiles] = useState<CareerProfile[]>([]);
const [activeProfileId, setActiveProfileId] = useState<string>('');

// Profile switcher dropdown
<select 
  value={activeProfileId}
  onChange={(e) => switchProfile(e.target.value)}
  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg"
>
  {profiles.map(p => (
    <option key={p.id} value={p.id}>
      {p.profileType} - {p.targetRole || 'General'}
    </option>
  ))}
  <option value="new">+ Create New Profile</option>
</select>
```

---

## 📅 **2. PUBLISHING CALENDAR FIXES**

### **Issue 2A: Platform Connection Buttons Don't Work**
**Current:** LinkedIn/X buttons are static
**Fix:** Implement OAuth flow

**New file:** `/app/api/oauth/linkedin/authorize/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const state = crypto.randomUUID();
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`;
  
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.LINKEDIN_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', 'w_member_social r_liteprofile');

  // Store state in session/cookie for verification
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('oauth_state', state, { httpOnly: true, maxAge: 600 });
  
  return response;
}
```

**Update Publishing page button:**
```typescript
const handleConnectLinkedIn = () => {
  window.location.href = '/api/oauth/linkedin/authorize';
};

<button
  onClick={handleConnectLinkedIn}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
>
  Connect LinkedIn
</button>
```

### **Issue 2B: Calendar Needs Monthly View**
**Current:** Only weekly view exists
**Fix:** Add month/year views

```typescript
const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');

// Month view component
const MonthView = () => {
  const daysInMonth = getDaysInMonth(selectedMonth);
  return (
    <div className="grid grid-cols-7 gap-2">
      {daysInMonth.map(day => (
        <div key={day} className="p-4 bg-slate-800 rounded-lg">
          <div className="text-sm font-semibold">{format(day, 'd')}</div>
          {/* Show jobs for this day */}
        </div>
      ))}
    </div>
  );
};

// Year view for campaign planning
const YearView = () => {
  const months = Array.from({ length: 12 }, (_, i) => addMonths(startOfYear(new Date()), i));
  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map(month => (
        <div key={month.toString()} className="p-4 bg-slate-800 rounded-lg">
          <h3 className="font-semibold mb-2">{format(month, 'MMMM yyyy')}</h3>
          {/* Mini calendar for month */}
        </div>
      ))}
    </div>
  );
};
```

---

## 🤖 **3. CONTENT GENERATION FIXES**

### **Issue 3A: Content Not Being Created**
**Current:** API exists but not wired to UI properly
**Fix:** Verify complete flow

**Checklist:**
1. ✅ `/api/studio/generate/route.ts` exists (FIXED earlier)
2. ❌ UI modal not calling API correctly
3. ❌ Response not being displayed

**Debug steps:**
```typescript
// Add logging to generate function
const handleGenerate = async () => {
  console.log('🚀 Starting generation...', { goal, channel, tone, length });
  
  try {
    const res = await fetch('/api/studio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, channel, tone, length }),
    });
    
    console.log('📡 Response status:', res.status);
    const data = await res.json();
    console.log('📦 Response data:', data);
    
    if (data.output) {
      setOutput(data.output);
    } else if (data.error) {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('❌ Generation failed:', error);
    alert('Generation failed. Check console for details.');
  }
};
```

---

## 📋 **IMPLEMENTATION PRIORITY**

| Priority | Task | Est. Time | Impact |
|----------|------|-----------|--------|
| 🔥 **P0** | Fix content generation API connection | 30 min | HIGH - Core feature |
| 🔥 **P0** | Add functional social links | 15 min | HIGH - User trust |
| 🔥 **P0** | Implement resume upload | 1 hour | HIGH - Core feature |
| 🔴 **P1** | Add LinkedIn OAuth flow | 2 hours | HIGH - Publishing |
| 🔴 **P1** | Add monthly calendar view | 1 hour | MEDIUM - UX |
| 🟡 **P2** | Multi-profile support | 3 hours | MEDIUM - B2C value |
| 🟡 **P2** | Add X (Twitter) OAuth | 1 hour | MEDIUM - Publishing |
| 🟢 **P3** | Year view for planning | 2 hours | LOW - Nice-to-have |

---

## ✅ **NEXT STEPS**

1. **Immediate (Today):**
   - Fix content generation flow
   - Add functional social links
   - Implement resume upload

2. **This Week:**
   - LinkedIn OAuth integration
   - Monthly calendar view
   - Multi-profile database model

3. **Next Week:**
   - Full OAuth suite (X, Instagram)
   - Year planning view
   - Profile switcher UI

---

## 🎯 **AGREEMENT SUMMARY**

**✅ I AGREE** with the Phase 6 strategic direction from ChatGPT:
- AI Content Engine is the right architecture
- Publishing layer is essential
- B2B/B2C dual approach is correct
- Database models are sound

**❌ BUT** the current implementation has critical gaps:
- Career features are non-functional (links, upload, skills)
- Publishing connections are missing OAuth
- Calendar lacks monthly/yearly views
- Content generation needs debugging

**📊 RECOMMENDATION:**
Execute the fixes in this document **BEFORE** adding more features. Get the core functionality working first, then expand.

---

**Ready to implement? Let's start with P0 fixes.**
