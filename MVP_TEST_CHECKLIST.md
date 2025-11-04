# ✅ MVP TEST CHECKLIST - ApexSalesAI

**Date:** October 24, 2025  
**Version:** 1.0 MVP  
**Status:** Ready for Testing

---

## 🔧 **PRE-FLIGHT CHECKS**

### **1. Environment Setup**
- [x] OPENAI_API_KEY added to `.env.local` ✅
- [ ] Database migrations up to date
- [ ] Upload directories exist
- [ ] Dev server running on port 3003

**Run these commands:**
```bash
# Check database
npx prisma migrate status

# Create upload directories (if needed)
mkdir -p public/uploads/resumes
mkdir -p public/uploads/exports
mkdir -p public/uploads/temp

# Start dev server
npm run dev
```

---

## 🎯 **CORE FEATURES TEST**

### **A. Content Generation (Studio)**

#### **Test 1: B2B LinkedIn Post**
**URL:** `http://localhost:3003/studio/create`

**Steps:**
1. Select "B2B Enterprise" mode
2. Select "💼 LinkedIn Post"
3. Enter goal: "Write about how AI is transforming B2B sales"
4. Select tone: "Professional"
5. Select length: "Medium (500-800 words)"
6. Add keywords: "AI, sales, automation, ROI"
7. Click "✨ Generate Content"

**Expected Result:**
- ✅ Loading animation appears
- ✅ Content generates in 3-5 seconds
- ✅ Word count displays (500-800 words)
- ✅ Character count displays
- ✅ Content is professional and relevant
- ✅ "📋 Copy" button works

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

#### **Test 2: B2C Resume**
**URL:** `http://localhost:3003/studio/create`

**Steps:**
1. Select "B2C Personal" mode
2. Select "📋 Resume"
3. Enter goal: "Create a resume for a Senior Product Manager in AI/ML"
4. Fill in Career Details:
   - Job Title: "Senior Product Manager"
   - Industry: "AI/ML, SaaS"
   - Experience: "8+ years"
5. Select tone: "Professional"
6. Select length: "Long (1000-1500 words)"
7. Click "✨ Generate Content"

**Expected Result:**
- ✅ Loading animation appears
- ✅ Resume generates in 5-8 seconds
- ✅ Word count displays (1000-1500 words)
- ✅ Content includes:
  - Professional summary
  - Experience section
  - Skills section
  - Education section
- ✅ ATS-friendly format

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

#### **Test 3: Video Script with Duration**
**URL:** `http://localhost:3003/studio/create`

**Steps:**
1. Select any mode
2. Select "🎬 Video Script"
3. Enter goal: "Create a 2-minute explainer video about our AI sales platform"
4. Select length: "Medium (500-800 words)"
5. Click "✨ Generate Content"

**Expected Result:**
- ✅ Content generates successfully
- ✅ Word count displays
- ✅ **Video duration estimate displays** (~3-5 min based on 150 words/min)
- ✅ Script includes:
  - Hook/opening
  - Key points
  - Call to action

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **B. Career Companion**

#### **Test 4: Resume Upload & Parsing**
**URL:** `http://localhost:3003/career`

**Steps:**
1. Scroll to "Resume" section
2. Click "📤 Upload Resume" button
3. Select a PDF resume file (< 5MB)
4. Wait for upload

**Expected Result:**
- ✅ File uploads successfully
- ✅ Parsing animation appears
- ✅ Resume data displays in "Resume Data" tab:
  - Name extracted
  - Title extracted
  - Skills list (with badges)
  - Experience count
  - Education count
- ✅ ATS score displays (0-100)
- ✅ No errors in console

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

#### **Test 5: Job Description Parsing**
**URL:** `http://localhost:3003/career`

**Steps:**
1. Click "Job Target" tab
2. Paste a job description (e.g., from LinkedIn)
3. Click "Parse Job Description"

**Expected Result:**
- ✅ Parsing animation appears
- ✅ Job data displays:
  - Role title
  - Seniority level
  - Required skills (badges)
  - Nice-to-have skills
  - Keywords
- ✅ Success message appears

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

#### **Test 6: Fit Analysis**
**URL:** `http://localhost:3003/career`

**Prerequisites:** Resume uploaded + Job parsed

**Steps:**
1. Click "Tailor & Generate" tab
2. Click "Analyze Fit" button
3. Wait for analysis

**Expected Result:**
- ✅ Analysis completes in 3-5 seconds
- ✅ Fit score displays (0-100%)
- ✅ Radar chart displays with:
  - Matching skills (green)
  - Missing skills (red)
- ✅ Recommendations display
- ✅ "Generate Tailored Content" button appears

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

#### **Test 7: Content Generation (Career)**
**URL:** `http://localhost:3003/career`

**Prerequisites:** Resume uploaded + Job parsed + Fit analyzed

**Steps:**
1. In "Tailor & Generate" tab
2. Click "Generate Tailored Content"
3. Wait for generation

**Expected Result:**
- ✅ Generation completes in 5-10 seconds
- ✅ Three artifacts display:
  - Tailored Resume (preview)
  - Cover Letter (preview)
  - LinkedIn About (preview)
- ✅ Export buttons appear (PDF, DOCX, TXT)

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

#### **Test 8: Export Functionality**
**URL:** `http://localhost:3003/career`

**Prerequisites:** Content generated

**Steps:**
1. Click "Export PDF" button
2. Wait for download
3. Open downloaded file

**Expected Result:**
- ✅ File downloads successfully
- ✅ Filename includes timestamp
- ✅ PDF opens correctly
- ✅ Content is formatted properly
- ✅ No encoding issues

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

## 🔍 **ERROR HANDLING TESTS**

### **Test 9: Missing API Key Error**
**Steps:**
1. Temporarily remove OPENAI_API_KEY from `.env.local`
2. Restart server
3. Try to generate content

**Expected Result:**
- ✅ Helpful error message displays:
  - "AI service not configured"
  - Hint about adding API key
- ✅ No cryptic errors
- ✅ No console crashes

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 10: Invalid File Upload**
**Steps:**
1. Try to upload a non-PDF file (e.g., .txt, .jpg)
2. Try to upload a file > 5MB

**Expected Result:**
- ✅ Error message displays:
  - "Invalid file type" or "File too large"
- ✅ Helpful hint provided
- ✅ No server crash

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 11: Empty/Invalid Input**
**Steps:**
1. Try to generate content with empty goal field
2. Try to analyze fit without uploading resume

**Expected Result:**
- ✅ Validation error displays
- ✅ Button is disabled or shows error
- ✅ Helpful message guides user

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

## 📱 **UI/UX TESTS**

### **Test 12: Responsive Design**
**Steps:**
1. Open site on mobile (or use DevTools mobile view)
2. Test all pages: Home, Studio, Career
3. Try generating content on mobile

**Expected Result:**
- ✅ Layout adapts to mobile
- ✅ All buttons are tappable
- ✅ Text is readable
- ✅ No horizontal scroll
- ✅ Forms work on mobile

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 13: Loading States**
**Steps:**
1. Generate content
2. Observe loading animations

**Expected Result:**
- ✅ Loading spinner/animation appears
- ✅ Button text changes to "Generating..."
- ✅ Button is disabled during generation
- ✅ No double-submit possible

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 14: Copy to Clipboard**
**Steps:**
1. Generate content
2. Click "📋 Copy" button
3. Paste into a text editor

**Expected Result:**
- ✅ Content copies successfully
- ✅ Confirmation message appears
- ✅ Formatting is preserved

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

## ⚡ **PERFORMANCE TESTS**

### **Test 15: Generation Speed**
**Measure:**
- Short content (200-400 words): _____ seconds
- Medium content (500-800 words): _____ seconds
- Long content (1000-1500 words): _____ seconds

**Expected:**
- Short: < 3 seconds
- Medium: < 5 seconds
- Long: < 10 seconds

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 16: Page Load Speed**
**Measure:**
- Home page: _____ seconds
- Studio page: _____ seconds
- Career page: _____ seconds

**Expected:**
- All pages: < 2 seconds

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

## 🎨 **VISUAL TESTS**

### **Test 17: Animations**
**Check:**
- [ ] Framer Motion animations work
- [ ] No janky transitions
- [ ] Hover effects work
- [ ] Loading animations smooth
- [ ] No layout shifts

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 18: Dark Mode**
**Check:**
- [ ] All text is readable
- [ ] Contrast is sufficient
- [ ] Colors are consistent
- [ ] No white flashes

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

## 🔐 **SECURITY TESTS**

### **Test 19: API Key Protection**
**Check:**
- [ ] OPENAI_API_KEY not exposed in client-side code
- [ ] No API keys in console logs
- [ ] No API keys in error messages
- [ ] .env.local is gitignored

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

### **Test 20: File Upload Security**
**Check:**
- [ ] Only allowed file types accepted
- [ ] File size limits enforced
- [ ] Files stored securely
- [ ] No path traversal vulnerabilities

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________

---

## 📊 **TEST SUMMARY**

### **Results**
- **Total Tests:** 20
- **Passed:** _____
- **Failed:** _____
- **Skipped:** _____

### **Critical Issues Found**
1. _______________________
2. _______________________
3. _______________________

### **Minor Issues Found**
1. _______________________
2. _______________________
3. _______________________

### **Recommendations**
1. _______________________
2. _______________________
3. _______________________

---

## ✅ **MVP READY CHECKLIST**

**Before launching to first 1000 users:**

- [ ] All 20 tests pass
- [ ] No critical bugs
- [ ] Error messages are helpful
- [ ] Performance is acceptable
- [ ] Mobile responsive
- [ ] API key is configured
- [ ] Database is seeded
- [ ] Documentation is complete
- [ ] Backup plan exists
- [ ] Support email is set up

---

## 🚀 **NEXT STEPS AFTER MVP**

1. **Week 1:** Monitor usage, fix bugs
2. **Week 2:** Add analytics tracking
3. **Week 3:** Build publishing features
4. **Week 4:** Add payment integration

---

## 📞 **SUPPORT**

**If tests fail:**
1. Check console for errors
2. Verify OPENAI_API_KEY is set
3. Restart dev server
4. Clear browser cache
5. Check `FOUNDATION_ANALYSIS.md` for troubleshooting

**Critical issues:** Fix immediately  
**Minor issues:** Document and prioritize

---

**Good luck with testing! 🎉**
