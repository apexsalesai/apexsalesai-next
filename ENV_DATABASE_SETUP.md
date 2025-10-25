# 🔧 DATABASE CONFIGURATION - NEON + PRISMA SETUP

## ⚠️ **CRITICAL: Add DIRECT_URL to .env.local**

Your `.env.local` file needs **TWO** database URLs to work with Neon + Prisma:

### **Required Configuration**

Add these lines to your `.env.local` file:

```env
# --- Neon pooled connection (runtime use) ---
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-misty-surf-adv6o1ws-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# --- Neon direct connection (Prisma migrations) ---
DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-misty-surf-adv6o1ws.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### **Key Differences**

| Variable | Host | Purpose | PgBouncer |
|----------|------|---------|-----------|
| `DATABASE_URL` | `ep-misty-surf-adv6o1ws-pooler` | Runtime queries | ✅ Yes |
| `DIRECT_URL` | `ep-misty-surf-adv6o1ws` | Migrations only | ❌ No |

**Notice:**
- `DIRECT_URL` removes `-pooler` from the hostname
- `DIRECT_URL` removes `&pgbouncer=true` from the query string

---

## 🚀 **Why This Fixes the Migration Error**

### **The Problem**
```
Error: P3014
Prisma Migrate could not create the shadow database.
Original error: Error code: P1017 - Server has closed the connection.
```

**Root Cause:**
- Prisma needs to create a temporary "shadow database" to compare schemas
- Neon's **pooled connection** (`-pooler`) uses PgBouncer, which doesn't allow `CREATE DATABASE`
- This causes the P1017 error

### **The Solution**
- `directUrl` in `schema.prisma` tells Prisma to use the **direct connection** for migrations
- The direct connection bypasses PgBouncer and allows shadow database creation
- Runtime queries still use the efficient pooled connection

---

## ✅ **Step-by-Step Setup**

### **1. Update .env.local**

Open `.env.local` and add/update these lines:

```env
# Pooled connection (keep existing)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-misty-surf-adv6o1ws-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Direct connection (add this)
DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-misty-surf-adv6o1ws.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Replace `YOUR_PASSWORD` with your actual Neon database password.**

---

### **2. Verify Prisma Schema** ✅

The `prisma/schema.prisma` file has already been updated with:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

### **3. Run Migration**

```bash
# Generate Prisma client
npx prisma generate

# Run migration (will use DIRECT_URL automatically)
npx prisma migrate dev --name phase8_career_engine
```

---

### **4. Verify Tables Created**

```bash
# Open Prisma Studio to view tables
npx prisma studio
```

**Expected Tables:**
- ✅ `career_profiles` (with `userId + label` unique constraint)
- ✅ `resumes`
- ✅ `job_analyses`

---

## 🧪 **Optional: Test Database Connections**

If you have `psql` installed, you can verify both connections:

### **Test Pooled Connection**
```powershell
$env:PGPASSWORD="YOUR_PASSWORD"
psql "host=ep-misty-surf-adv6o1ws-pooler.c-2.us-east-1.aws.neon.tech dbname=neondb user=neondb_owner sslmode=require" -c "SELECT 'pooled' as conn, current_user, current_database();"
```

### **Test Direct Connection**
```powershell
psql "host=ep-misty-surf-adv6o1ws.c-2.us-east-1.aws.neon.tech dbname=neondb user=neondb_owner sslmode=require" -c "SELECT 'direct' as conn, current_user, current_database();"
```

### **Check CREATE DATABASE Privilege**
```powershell
psql "host=ep-misty-surf-adv6o1ws.c-2.us-east-1.aws.neon.tech dbname=neondb user=neondb_owner sslmode=require" -c "SELECT has_database_privilege(current_user, current_database(), 'CREATE') as can_create_db;"
```

---

## 🔄 **Alternative: Shadow Database Override**

If Neon doesn't allow `CREATE DATABASE` privilege, use this approach:

### **1. Create Shadow Database in Neon Console**
- Log into Neon console
- Create a new database: `neondb_shadow`

### **2. Run Migration with Shadow Override**
```bash
npx prisma migrate dev --name phase8_career_engine --shadow-database-url="postgresql://neondb_owner:YOUR_PASSWORD@ep-misty-surf-adv6o1ws.c-2.us-east-1.aws.neon.tech/neondb_shadow?sslmode=require"
```

---

## 🚨 **Troubleshooting**

### **Error: "Environment variable not found: DIRECT_URL"**
**Solution:** Add `DIRECT_URL` to your `.env.local` file

### **Error: "P1017 - Server has closed the connection"**
**Solution:** Verify `DIRECT_URL` does NOT include `-pooler` or `pgbouncer=true`

### **Error: "Unique constraint violation on userId, label"**
**Solution:** This means you have duplicate `CareerProfile` records. Clean them up:
```sql
DELETE FROM career_profiles WHERE id NOT IN (
  SELECT MIN(id) FROM career_profiles GROUP BY userId, label
);
```

---

## 📋 **Post-Migration Checklist**

- [ ] `.env.local` has both `DATABASE_URL` and `DIRECT_URL`
- [ ] `DIRECT_URL` uses non-pooled hostname
- [ ] `prisma/schema.prisma` has `directUrl = env("DIRECT_URL")`
- [ ] Migration completed successfully
- [ ] New tables visible in Prisma Studio
- [ ] App starts without errors: `npm run dev`

---

## 🎯 **Next Steps After Migration**

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Update API Routes**
   - Remove mock IDs from Phase 8 APIs
   - Add real Prisma database calls

3. **Test End-to-End**
   - Upload resume → verify stored in DB
   - Ingest job → verify stored in DB
   - Analyze fit → verify results persisted

---

## 📞 **Support**

If migration still fails after following these steps:

1. Check Neon console for connection limits
2. Verify password is correct (no special characters causing issues)
3. Try the shadow database override method
4. Contact Neon support for `CREATE DATABASE` privilege

---

**This configuration is production-ready and follows Neon + Prisma best practices.** ✅
