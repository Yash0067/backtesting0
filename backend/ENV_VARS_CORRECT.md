# ✅ Correct Environment Variables Setup

## The Error You're Seeing

The error "Environment variable keys must consist of alphabetic characters, digits, '_', or '.', and must not start with a digit" means you're putting the URL in the **KEY** field instead of the **VALUE** field.

## ✅ Correct Setup

### For Vercel/Render:

**Environment Variable 1:**
- **KEY**: `ALLOWED_ORIGINS`
- **VALUE**: `https://frontend-nu-ten-75.vercel.app`

**Environment Variable 2 (Optional):**
- **KEY**: `PYTHON_VERSION`
- **VALUE**: `3.11.0`

**Environment Variable 3 (Optional - if using MongoDB):**
- **KEY**: `MONGODB_URI`
- **VALUE**: `mongodb+srv://user:pass@cluster.mongodb.net/`

**Environment Variable 4 (Optional):**
- **KEY**: `MONGODB_DB`
- **VALUE**: `trading_strategy_db`

## ❌ Common Mistakes

**WRONG:**
- KEY: `https://frontend-nu-ten-75.vercel.app` ❌ (This is a URL, not a variable name!)
- VALUE: `ALLOWED_ORIGINS` ❌

**CORRECT:**
- KEY: `ALLOWED_ORIGINS` ✅ (Variable name)
- VALUE: `https://frontend-nu-ten-75.vercel.app` ✅ (The actual URL)

## Quick Reference

| Platform | Key Field | Value Field |
|----------|-----------|-------------|
| Variable Name | `ALLOWED_ORIGINS` | `https://frontend-nu-ten-75.vercel.app` |
| Variable Name | `PYTHON_VERSION` | `3.11.0` |

## Step-by-Step

1. Click "Add Environment Variable"
2. In the **left field (KEY)**: Type `ALLOWED_ORIGINS`
3. In the **right field (VALUE)**: Type `https://frontend-nu-ten-75.vercel.app`
4. Click Save/Add
5. Repeat for other variables if needed

That's it! The KEY is the variable name, VALUE is what it contains.

