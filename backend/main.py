from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ TEST ROUTE
@app.get("/")
def home():
    return {"message": "Backend is running"}

# ✅ SCAN API (THIS WAS MISSING ❌)
@app.post("/scan")
async def scan(data: dict):
    text = data.get("input_text", "")

    if "fake" in text or "login" in text:
        return {"risk": "CRITICAL"}
    elif "http" in text:
        return {"risk": "MEDIUM"}
    else:
        return {"risk": "LOW"}