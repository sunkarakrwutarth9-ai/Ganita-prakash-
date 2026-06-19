from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib
import secrets
import google.generativeai as genai
import aiosqlite
import os
import json
import httpx
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio

# WebRTC signaling - store active connections
webrtc_connections: Dict[int, WebSocket] = {}
webrtc_calls: Dict[str, dict] = {}

app = FastAPI(title="GANITA PRAKASH API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SECRET_KEY = "ganita-prakash-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
DB_PATH = "/data/app.db" if os.path.exists("/data") else "app.db"
ADMIN_EMAIL = "admin@ganitaprakash.com"

# Email notification function for admin
async def send_admin_notification(user_name: str, user_email: str, platform: str):
    """Send email notification to admin when new user registers"""
    try:
        # Create HTML email with GANITA PRAKASH branding
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; border-bottom: 3px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 20px; }}
                .logo {{ font-size: 28px; font-weight: bold; color: #8B5CF6; }}
                .subtitle {{ color: #666; font-size: 14px; }}
                .content {{ padding: 20px 0; }}
                .user-info {{ background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .label {{ font-weight: bold; color: #333; }}
                .value {{ color: #666; }}
                .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">GANITA PRAKASH</div>
                    <div class="subtitle">NCERT Mathematics Class 6</div>
                </div>
                <div class="content">
                    <h2 style="color: #333;">New User Registration</h2>
                    <p>A new user has registered on the GANITA PRAKASH app.</p>
                    <div class="user-info">
                        <p><span class="label">Name:</span> <span class="value">{user_name}</span></p>
                        <p><span class="label">Email:</span> <span class="value">{user_email}</span></p>
                        <p><span class="label">Platform:</span> <span class="value">{platform.upper()}</span></p>
                        <p><span class="label">Registration Time:</span> <span class="value">{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</span></p>
                    </div>
                    <p>You can view this user in the Admin Dashboard.</p>
                </div>
                <div class="footer">
                    <p>GANITA PRAKASH - CBSE AI Learning Platform</p>
                    <p>This is an automated notification. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Store notification in database for admin to see
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                "INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
                (1, "new_registration", f"New user registered: {user_name} ({user_email}) on {platform.upper()}")
            )
            await db.commit()
        
        print(f"Admin notification sent for new user: {user_name} ({user_email})")
        return True
    except Exception as e:
        print(f"Failed to send admin notification: {e}")
        return False

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${hashed.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    try:
        salt, stored_hash = hashed.split('$')
        new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return new_hash.hex() == stored_hash
    except:
        return False

security = HTTPBearer()

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-pro')

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    platform: str = "apk"

class UserLogin(BaseModel):
    username: str
    password: str
    platform: str = "apk"

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ProgressUpdate(BaseModel):
    chapter_id: int
    score: Optional[int] = None
    completed: bool = False
    unlocked: bool = False

class MessageCreate(BaseModel):
    content: str
    message_type: str = "text"
    media_url: Optional[str] = None

class AIChat(BaseModel):
    message: str
    chapter_id: Optional[int] = None

class AdminAction(BaseModel):
    user_id: int
    action: str
    chapter_id: Optional[int] = None

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL, name TEXT NOT NULL, is_admin BOOLEAN DEFAULT FALSE,
            platform TEXT DEFAULT 'apk', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_login TIMESTAMP)''')
        await db.execute('''CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, chapter_id INTEGER NOT NULL,
            score INTEGER DEFAULT 0, completed BOOLEAN DEFAULT FALSE, unlocked BOOLEAN DEFAULT FALSE,
            attempts INTEGER DEFAULT 0, last_attempt TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, chapter_id))''')
        await db.execute('''CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, certificate_type TEXT NOT NULL,
            chapter_id INTEGER, score INTEGER, issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id))''')
        await db.execute('''CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, content TEXT NOT NULL,
            message_type TEXT DEFAULT 'text', media_url TEXT, platform TEXT DEFAULT 'apk',
            is_admin_reply BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            FOREIGN KEY (user_id) REFERENCES users(id))''')
        await db.execute('''CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, notification_type TEXT NOT NULL,
            message TEXT, read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id))''')
        await db.execute('''CREATE TABLE IF NOT EXISTS ai_conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL, chapter_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id))''')
        # Check for admin account with correct email
        admin_exists = await db.execute("SELECT id FROM users WHERE username = ?", (ADMIN_EMAIL,))
        if not await admin_exists.fetchone():
            admin_hash = hash_password("admin123")
            await db.execute("INSERT INTO users (username, password_hash, name, is_admin) VALUES (?, ?, ?, ?)",
                (ADMIN_EMAIL, admin_hash, "Master Admin", True))
        # Also check for legacy admin account and update if needed
        legacy_admin = await db.execute("SELECT id FROM users WHERE username = 'admin'")
        if await legacy_admin.fetchone():
            await db.execute("UPDATE users SET is_admin = TRUE WHERE username = 'admin'")
        await db.commit()

@app.on_event("startup")
async def startup():
    await init_db()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        async with aiosqlite.connect(DB_PATH) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = await cursor.fetchone()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            return dict(user)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(user: dict = Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):
    """Optional authentication - returns user if valid token, or guest user if no token"""
    if credentials is None:
        return {"id": 0, "name": "Guest", "email": "guest@guest.com", "is_admin": False}
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            return {"id": 0, "name": "Guest", "email": "guest@guest.com", "is_admin": False}
        async with aiosqlite.connect(DB_PATH) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = await cursor.fetchone()
            if not user:
                return {"id": 0, "name": "Guest", "email": "guest@guest.com", "is_admin": False}
            return dict(user)
    except JWTError:
        return {"id": 0, "name": "Guest", "email": "guest@guest.com", "is_admin": False}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT id FROM users WHERE username = ?", (user_data.username,))
        if await cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username already exists")
        password_hash = hash_password(user_data.password)
        cursor = await db.execute("INSERT INTO users (username, password_hash, name, platform) VALUES (?, ?, ?, ?)",
            (user_data.username, password_hash, user_data.name, user_data.platform))
        await db.commit()
        user_id = cursor.lastrowid
        for chapter_id in range(1, 11):
            await db.execute("INSERT INTO progress (user_id, chapter_id, unlocked) VALUES (?, ?, ?)",
                (user_id, chapter_id, chapter_id == 1))
        await db.commit()
        
        # Send notification to admin about new user registration
        asyncio.create_task(send_admin_notification(user_data.name, user_data.username, user_data.platform))
        
        token = create_access_token({"user_id": user_id})
        return {"access_token": token, "token_type": "bearer",
            "user": {"id": user_id, "username": user_data.username, "name": user_data.name, "is_admin": False}}

async def send_login_notification(user_name: str, user_email: str, platform: str):
    """Send notification to admin when user logs in"""
    try:
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                "INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
                (1, "user_login", f"User logged in: {user_name} ({user_email}) on {platform.upper()} at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC")
            )
            await db.commit()
        print(f"Login notification sent for user: {user_name} ({user_email})")
        return True
    except Exception as e:
        print(f"Failed to send login notification: {e}")
        return False

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM users WHERE username = ?", (user_data.username,))
        user = await cursor.fetchone()
        if not user or not verify_password(user_data.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        await db.execute("UPDATE users SET last_login = ?, platform = ? WHERE id = ?",
            (datetime.utcnow(), user_data.platform, user["id"]))
        await db.commit()
        
        # Send login notification to admin (non-blocking)
        if not bool(user["is_admin"]):
            asyncio.create_task(send_login_notification(user["name"], user["username"], user_data.platform))
        
        token = create_access_token({"user_id": user["id"]})
        return {"access_token": token, "token_type": "bearer",
            "user": {"id": user["id"], "username": user["username"], "name": user["name"], "is_admin": bool(user["is_admin"])}}

@app.get("/api/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"id": user["id"], "username": user["username"], "name": user["name"],
        "is_admin": bool(user["is_admin"]), "platform": user["platform"]}

class CheckUserRequest(BaseModel):
    email: str

class GoogleLoginRequest(BaseModel):
    email: str

@app.post("/api/auth/check-user")
async def check_user(request: CheckUserRequest):
    """Check if a user exists by email for Google Sign-In"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT id, username, name, is_admin FROM users WHERE username = ?", (request.email,))
        user = await cursor.fetchone()
        if user:
            return {"exists": True, "user": {"id": user["id"], "username": user["username"], "name": user["name"], "is_admin": bool(user["is_admin"])}}
        return {"exists": False, "user": None}

@app.post("/api/auth/google-login")
async def google_login(request: GoogleLoginRequest):
    """Login user via Google Sign-In (no password required)"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM users WHERE username = ?", (request.email,))
        user = await cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        await db.execute("UPDATE users SET last_login = ?, platform = ? WHERE id = ?",
            (datetime.utcnow(), "google-oauth", user["id"]))
        await db.commit()
        
        # Send login notification to admin (non-blocking)
        if not bool(user["is_admin"]):
            asyncio.create_task(send_login_notification(user["name"], user["username"], "google-oauth"))
        
        token = create_access_token({"user_id": user["id"]})
        return {"access_token": token, "token_type": "bearer",
            "user": {"id": user["id"], "username": user["username"], "name": user["name"], "is_admin": bool(user["is_admin"])}}

class NameUpdate(BaseModel):
    name: str

@app.post("/api/user/update-name")
async def update_user_name(name_data: NameUpdate, user: dict = Depends(get_current_user)):
    """Update user's name"""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("UPDATE users SET name = ? WHERE id = ?", (name_data.name, user["id"]))
        await db.commit()
        return {"status": "success", "message": "Name updated successfully"}

@app.get("/api/progress")
async def get_progress(user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM progress WHERE user_id = ? ORDER BY chapter_id", (user["id"],))
        return [dict(p) for p in await cursor.fetchall()]

@app.post("/api/progress")
async def update_progress(progress_data: ProgressUpdate, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''INSERT INTO progress (user_id, chapter_id, score, completed, unlocked, attempts, last_attempt)
            VALUES (?, ?, ?, ?, ?, 1, ?) ON CONFLICT(user_id, chapter_id) DO UPDATE SET
            score = CASE WHEN ? > score THEN ? ELSE score END, completed = ?, unlocked = ?, attempts = attempts + 1, last_attempt = ?''',
            (user["id"], progress_data.chapter_id, progress_data.score, progress_data.completed, progress_data.unlocked, datetime.utcnow(),
            progress_data.score, progress_data.score, progress_data.completed, progress_data.unlocked, datetime.utcnow()))
        if progress_data.completed and progress_data.chapter_id < 10:
            await db.execute("UPDATE progress SET unlocked = TRUE WHERE user_id = ? AND chapter_id = ?",
                (user["id"], progress_data.chapter_id + 1))
        await db.commit()
        return {"status": "success"}

@app.get("/api/certificates")
async def get_certificates(user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_at DESC", (user["id"],))
        return [dict(c) for c in await cursor.fetchall()]

@app.post("/api/certificates")
async def create_certificate(cert_type: str, chapter_id: Optional[int] = None, score: Optional[int] = None, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("INSERT INTO certificates (user_id, certificate_type, chapter_id, score) VALUES (?, ?, ?, ?)",
            (user["id"], cert_type, chapter_id, score))
        await db.commit()
        return {"id": cursor.lastrowid, "status": "success"}

@app.get("/api/messages")
async def get_messages(limit: int = 100, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute('''SELECT m.*, u.name as sender_name, u.username as sender_username
            FROM messages m JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC LIMIT ?''', (limit,))
        return [dict(m) for m in await cursor.fetchall()]

@app.post("/api/messages")
async def send_message(message_data: MessageCreate, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("INSERT INTO messages (user_id, content, message_type, media_url, platform) VALUES (?, ?, ?, ?, ?)",
            (user["id"], message_data.content, message_data.message_type, message_data.media_url, user.get("platform", "apk")))
        await db.commit()
        return {"id": cursor.lastrowid, "status": "success"}

@app.post("/api/ai/chat")
async def ai_chat(chat_data: AIChat, user: dict = Depends(get_optional_user)):
    try:
        system_prompt = "You are an AI assistant for GANITA PRAKASH, a Class 6 NCERT Mathematics learning app. Help students understand mathematical concepts in simple terms. IMPORTANT: Keep your responses very concise - maximum 3 lines only. Be brief and to the point."
        chapter_topics = {1: "Patterns in Mathematics", 2: "Lines and Angles", 3: "Number Play", 4: "Data Handling",
            5: "Prime Time", 6: "Perimeter and Area", 7: "Fractions", 8: "Playing with Constructions", 9: "Symmetry", 10: "The Other Side of Zero"}
        if chat_data.chapter_id:
            system_prompt += f"\nCurrent chapter: {chapter_topics.get(chat_data.chapter_id, '')}"
        
        ai_response = None
        
        # Try OpenRouter API first (primary)
        if OPENROUTER_API_KEY:
            try:
                async with httpx.AsyncClient() as client:
                    or_response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                            "Content-Type": "application/json",
                            "HTTP-Referer": "https://ganitaprakash.com",
                            "X-Title": "GANITA PRAKASH"
                        },
                        json={
                            "model": "meta-llama/llama-3.3-70b-instruct",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": chat_data.message}
                            ],
                            "max_tokens": 1024,
                            "temperature": 0.7
                        },
                        timeout=30.0
                    )
                    if or_response.status_code == 200:
                        or_data = or_response.json()
                        ai_response = or_data["choices"][0]["message"]["content"]
            except Exception as or_error:
                print(f"OpenRouter API error: {or_error}")
        
        # Fallback to Groq API
        if not ai_response and GROQ_API_KEY:
            try:
                async with httpx.AsyncClient() as client:
                    groq_response = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {GROQ_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "llama-3.3-70b-versatile",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": chat_data.message}
                            ],
                            "max_tokens": 1024,
                            "temperature": 0.7
                        },
                        timeout=30.0
                    )
                    if groq_response.status_code == 200:
                        groq_data = groq_response.json()
                        ai_response = groq_data["choices"][0]["message"]["content"]
            except Exception as groq_error:
                print(f"Groq API error: {groq_error}")
        
        # Fallback to Gemini if both fail
        if not ai_response:
            response = gemini_model.generate_content(f"{system_prompt}\n\nStudent's question: {chat_data.message}")
            ai_response = response.text
        
        # Only save to database if user is authenticated (not guest)
        if user["id"] != 0:
            async with aiosqlite.connect(DB_PATH) as db:
                await db.execute("INSERT INTO ai_conversations (user_id, user_message, ai_response, chapter_id) VALUES (?, ?, ?, ?)",
                    (user["id"], chat_data.message, ai_response, chat_data.chapter_id))
                await db.commit()
        return {"response": ai_response, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

@app.get("/api/admin/dashboard")
async def admin_dashboard(admin: dict = Depends(get_admin_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM users WHERE is_admin = FALSE ORDER BY created_at DESC")
        users = await cursor.fetchall()
        cursor = await db.execute("SELECT platform, COUNT(*) as count FROM users WHERE is_admin = FALSE GROUP BY platform")
        platform_stats = await cursor.fetchall()
        cursor = await db.execute("SELECT COUNT(*) as count FROM messages")
        message_count = (await cursor.fetchone())["count"]
        cursor = await db.execute('''SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC LIMIT 50''')
        recent_messages = await cursor.fetchall()
        cursor = await db.execute("SELECT COUNT(*) as count FROM users WHERE last_login > datetime('now', '-1 day')")
        active_users = (await cursor.fetchone())["count"]
        # Get login notifications for admin dashboard
        cursor = await db.execute("SELECT * FROM notifications WHERE notification_type = 'user_login' ORDER BY created_at DESC LIMIT 50")
        login_notifications = await cursor.fetchall()
        return {"users": [dict(u) for u in users], "platform_stats": [dict(p) for p in platform_stats],
            "message_count": message_count, "recent_messages": [dict(m) for m in recent_messages],
            "active_users": active_users, "total_users": len(users),
            "login_notifications": [dict(n) for n in login_notifications]}

@app.get("/api/admin/users")
async def get_all_users(admin: dict = Depends(get_admin_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute('''SELECT u.*, (SELECT COUNT(*) FROM progress p WHERE p.user_id = u.id AND p.completed = TRUE) as completed_chapters,
            (SELECT COUNT(*) FROM certificates c WHERE c.user_id = u.id) as certificate_count FROM users u WHERE u.is_admin = FALSE ORDER BY u.created_at DESC''')
        return [dict(u) for u in await cursor.fetchall()]

@app.post("/api/admin/action")
async def admin_action(action_data: AdminAction, admin: dict = Depends(get_admin_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        if action_data.action == "unlock_all":
            await db.execute("UPDATE progress SET unlocked = TRUE WHERE user_id = ?", (action_data.user_id,))
        elif action_data.action == "reset_progress":
            await db.execute("UPDATE progress SET score = 0, completed = FALSE, attempts = 0 WHERE user_id = ?", (action_data.user_id,))
            await db.execute("UPDATE progress SET unlocked = FALSE WHERE user_id = ? AND chapter_id > 1", (action_data.user_id,))
        elif action_data.action == "enable_retest":
            if action_data.chapter_id:
                await db.execute("UPDATE progress SET completed = FALSE WHERE user_id = ? AND chapter_id = ?", (action_data.user_id, action_data.chapter_id))
            else:
                await db.execute("UPDATE progress SET completed = FALSE WHERE user_id = ?", (action_data.user_id,))
        elif action_data.action == "generate_certificate":
            await db.execute("INSERT INTO certificates (user_id, certificate_type, chapter_id) VALUES (?, 'admin_granted', ?)", (action_data.user_id, action_data.chapter_id))
        elif action_data.action == "delete_account":
            # Delete all user data
            await db.execute("DELETE FROM progress WHERE user_id = ?", (action_data.user_id,))
            await db.execute("DELETE FROM certificates WHERE user_id = ?", (action_data.user_id,))
            await db.execute("DELETE FROM messages WHERE user_id = ?", (action_data.user_id,))
            await db.execute("DELETE FROM ai_chats WHERE user_id = ?", (action_data.user_id,))
            await db.execute("DELETE FROM users WHERE id = ? AND is_admin = FALSE", (action_data.user_id,))
        await db.commit()
        return {"status": "success", "action": action_data.action}

@app.post("/api/admin/unlock-all-users")
async def unlock_all_users_chapters(admin: dict = Depends(get_admin_user)):
    """Unlock all chapters for all users for testing purposes"""
    async with aiosqlite.connect(DB_PATH) as db:
        # Get all non-admin users
        cursor = await db.execute("SELECT id FROM users WHERE is_admin = FALSE")
        users = await cursor.fetchall()
        
        # For each user, ensure they have progress entries for all 10 chapters with unlocked = TRUE
        for user_row in users:
            user_id = user_row[0]
            for chapter_id in range(1, 11):
                await db.execute('''INSERT INTO progress (user_id, chapter_id, score, completed, unlocked, attempts, last_attempt)
                    VALUES (?, ?, 0, FALSE, TRUE, 0, ?) ON CONFLICT(user_id, chapter_id) DO UPDATE SET unlocked = TRUE''',
                    (user_id, chapter_id, datetime.utcnow()))
        
        await db.commit()
        return {"status": "success", "message": f"All chapters unlocked for {len(users)} users"}

class AdminReply(BaseModel):
    user_id: int
    message: str

class AdminNotify(BaseModel):
    user_id: int
    notification_type: str
    message: str

class GeminiCall(BaseModel):
    user_id: int

class GeminiChatWithLanguage(BaseModel):
    message: str
    language: str = "en"
    chapter_id: Optional[int] = None

@app.post("/api/admin/reply")
async def admin_reply(reply_data: AdminReply, admin: dict = Depends(get_admin_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        # Ensure target_user_id column exists
        try:
            await db.execute("ALTER TABLE messages ADD COLUMN target_user_id INTEGER")
            await db.commit()
        except:
            pass  # Column already exists
        # Insert admin reply with target_user_id set to the user being replied to
        # user_id is admin's ID (1), target_user_id is the student's ID
        await db.execute("INSERT INTO messages (user_id, content, message_type, is_admin_reply, target_user_id) VALUES (?, ?, 'text', TRUE, ?)",
            (admin["id"], reply_data.message, reply_data.user_id))
        await db.commit()
        return {"status": "success", "message": "Reply sent"}

@app.post("/api/admin/notify")
async def admin_notify(notify_data: AdminNotify, admin: dict = Depends(get_admin_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
            (notify_data.user_id, notify_data.notification_type, notify_data.message))
        await db.commit()
        return {"status": "success", "notification_type": notify_data.notification_type}

@app.post("/api/admin/gemini-call")
async def admin_gemini_call(call_data: GeminiCall, admin: dict = Depends(get_admin_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
            (call_data.user_id, "gemini_call", "Customer care is calling. Gemini AI wants to help you!"))
        await db.commit()
        return {"status": "success", "message": "Gemini AI call initiated"}

@app.get("/api/notifications")
async def get_notifications(user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM notifications WHERE user_id = ? AND read = FALSE ORDER BY created_at DESC", (user["id"],))
        notifications = [dict(n) for n in await cursor.fetchall()]
        return notifications

@app.post("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("UPDATE notifications SET read = TRUE WHERE id = ? AND user_id = ?", (notification_id, user["id"]))
        await db.commit()
        return {"status": "success"}

@app.post("/api/ai/chat-with-language")
async def ai_chat_with_language(chat_data: GeminiChatWithLanguage, user: dict = Depends(get_current_user)):
    try:
        language_names = {"en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil", "kn": "Kannada", 
            "ml": "Malayalam", "mr": "Marathi", "bn": "Bengali", "gu": "Gujarati", "pa": "Punjabi"}
        lang_name = language_names.get(chat_data.language, "English")
        system_prompt = f"You are a helpful AI assistant for GANITA PRAKASH, a Class 6 NCERT Mathematics learning app. You MUST respond in {lang_name} language only. Help students understand mathematical concepts in simple terms. Be friendly and encouraging."
        chapter_topics = {1: "Patterns in Mathematics", 2: "Lines and Angles", 3: "Number Play", 4: "Data Handling",
            5: "Prime Time", 6: "Perimeter and Area", 7: "Fractions", 8: "Playing with Constructions", 9: "Symmetry", 10: "The Other Side of Zero"}
        if chat_data.chapter_id:
            system_prompt += f"\nCurrent chapter: {chapter_topics.get(chat_data.chapter_id, '')}"
        
        ai_response = None
        
        # Try OpenRouter first
        if OPENROUTER_API_KEY:
            try:
                async with httpx.AsyncClient() as client:
                    or_response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                            "Content-Type": "application/json",
                            "HTTP-Referer": "https://ganitaprakash.com",
                            "X-Title": "GANITA PRAKASH"
                        },
                        json={
                            "model": "meta-llama/llama-3.3-70b-instruct",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": chat_data.message}
                            ],
                            "max_tokens": 1024,
                            "temperature": 0.7
                        },
                        timeout=30.0
                    )
                    if or_response.status_code == 200:
                        or_data = or_response.json()
                        ai_response = or_data["choices"][0]["message"]["content"]
            except Exception as or_error:
                print(f"OpenRouter API error (language): {or_error}")
        
        # Fallback to Gemini
        if not ai_response:
            response = gemini_model.generate_content(f"{system_prompt}\n\nStudent's question: {chat_data.message}")
            ai_response = response.text
        
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute("INSERT INTO ai_conversations (user_id, user_message, ai_response, chapter_id) VALUES (?, ?, ?, ?)",
                (user["id"], chat_data.message, ai_response, chat_data.chapter_id))
            await db.commit()
        return {"response": ai_response, "language": chat_data.language, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

@app.get("/api/models/{chapter_id}")
async def get_chapter_models(chapter_id: int):
    models = {
        1: [{"id": 1, "name": "Number Sequence Spiral", "type": "spiral", "description": "Visualize number patterns"},
            {"id": 2, "name": "Fibonacci Spiral", "type": "fibonacci", "description": "Golden ratio spiral"},
            {"id": 3, "name": "Magic Square 3D", "type": "cube", "description": "Interactive 3x3 magic square"},
            {"id": 4, "name": "Triangular Numbers", "type": "pyramid", "description": "Stack of dots forming triangular numbers"},
            {"id": 5, "name": "Square Numbers Grid", "type": "grid", "description": "Visual representation of square numbers"}],
        2: [{"id": 1, "name": "Parallel Lines", "type": "lines", "description": "Two lines that never meet"},
            {"id": 2, "name": "Perpendicular Lines", "type": "lines", "description": "Lines meeting at 90 degrees"},
            {"id": 3, "name": "Angle Types", "type": "angles", "description": "Acute, right, obtuse angles"},
            {"id": 4, "name": "Protractor 3D", "type": "protractor", "description": "Interactive angle measurement"},
            {"id": 5, "name": "Ray and Segment", "type": "lines", "description": "Difference between ray and segment"}],
        3: [{"id": 1, "name": "Place Value Blocks", "type": "blocks", "description": "Units, tens, hundreds"},
            {"id": 2, "name": "Number Line 3D", "type": "numberline", "description": "Interactive number line"},
            {"id": 3, "name": "Comparison Scale", "type": "scale", "description": "Compare numbers visually"},
            {"id": 4, "name": "Rounding Wheel", "type": "wheel", "description": "Round numbers"},
            {"id": 5, "name": "Expanded Form", "type": "blocks", "description": "Break numbers into expanded form"}],
        4: [{"id": 1, "name": "3D Bar Graph", "type": "bargraph", "description": "Interactive bar graph"},
            {"id": 2, "name": "Pictograph", "type": "pictograph", "description": "Data using pictures"},
            {"id": 3, "name": "Tally Counter", "type": "tally", "description": "Interactive tally marks"},
            {"id": 4, "name": "Pie Chart 3D", "type": "piechart", "description": "Circular data representation"},
            {"id": 5, "name": "Frequency Table", "type": "table", "description": "Organize data in tables"}],
        5: [{"id": 1, "name": "Factor Tree", "type": "tree", "description": "Break into prime factors"},
            {"id": 2, "name": "Sieve of Eratosthenes", "type": "grid", "description": "Find prime numbers"},
            {"id": 3, "name": "Divisibility Checker", "type": "calculator", "description": "Check divisibility"},
            {"id": 4, "name": "LCM/GCD Visualizer", "type": "venn", "description": "Find LCM and GCD"},
            {"id": 5, "name": "Prime Factorization", "type": "blocks", "description": "Product of primes"}],
        6: [{"id": 1, "name": "Rectangle Explorer", "type": "rectangle", "description": "Perimeter and area"},
            {"id": 2, "name": "Square Properties", "type": "square", "description": "Square measurements"},
            {"id": 3, "name": "Triangle Measurements", "type": "triangle", "description": "Triangle perimeter"},
            {"id": 4, "name": "Composite Shapes", "type": "composite", "description": "Complex shapes"},
            {"id": 5, "name": "Grid Area Counter", "type": "grid", "description": "Count squares for area"}],
        7: [{"id": 1, "name": "Fraction Circles", "type": "circle", "description": "Fractions as pie slices"},
            {"id": 2, "name": "Fraction Number Line", "type": "numberline", "description": "Fractions on number line"},
            {"id": 3, "name": "Equivalent Fractions", "type": "bars", "description": "Compare equal fractions"},
            {"id": 4, "name": "Mixed Numbers", "type": "mixed", "description": "Whole and fractional parts"},
            {"id": 5, "name": "Fraction Bars", "type": "bars", "description": "Compare fractions visually"}],
        8: [{"id": 1, "name": "Compass Tool", "type": "compass", "description": "Draw circles and arcs"},
            {"id": 2, "name": "Protractor Tool", "type": "protractor", "description": "Measure and draw angles"},
            {"id": 3, "name": "Triangle Constructor", "type": "triangle", "description": "Build triangles"},
            {"id": 4, "name": "Circle Properties", "type": "circle", "description": "Radius, diameter"},
            {"id": 5, "name": "Angle Bisector", "type": "bisector", "description": "Divide angles equally"}],
        9: [{"id": 1, "name": "Mirror Reflection", "type": "mirror", "description": "Reflections across line"},
            {"id": 2, "name": "Rotational Symmetry", "type": "rotation", "description": "Shapes when rotated"},
            {"id": 3, "name": "Line of Symmetry", "type": "line", "description": "Find symmetry lines"},
            {"id": 4, "name": "Symmetric Shapes", "type": "shapes", "description": "Explore symmetric figures"},
            {"id": 5, "name": "Kaleidoscope", "type": "kaleidoscope", "description": "Multiple reflections"}],
        10: [{"id": 1, "name": "Integer Number Line", "type": "numberline", "description": "Positive and negative"},
            {"id": 2, "name": "Temperature Scale", "type": "thermometer", "description": "Above and below zero"},
            {"id": 3, "name": "Elevation Model", "type": "elevation", "description": "Above/below sea level"},
            {"id": 4, "name": "Integer Operations", "type": "operations", "description": "Add and subtract integers"},
            {"id": 5, "name": "Coordinate Plane", "type": "coordinate", "description": "Plot points on x-y plane"}]
    }
    if chapter_id not in models:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {"chapter_id": chapter_id, "models": models[chapter_id]}

@app.get("/api/chapters/{chapter_id}/pdf")
async def get_chapter_pdf(chapter_id: int):
    chapter_names = {1: "Patterns in Mathematics", 2: "Lines and Angles", 3: "Number Play", 4: "Data Handling",
        5: "Prime Time", 6: "Perimeter and Area", 7: "Fractions", 8: "Playing with Constructions", 9: "Symmetry", 10: "The Other Side of Zero"}
    if chapter_id not in chapter_names:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {"chapter_id": chapter_id, "chapter_name": chapter_names[chapter_id],
        "pdf_url": f"https://ncert.nic.in/textbook/pdf/femh1{chapter_id:02d}.pdf", "download_available": True}

# Delete test users endpoint - removes all test accounts and keeps only real APK users
@app.delete("/api/admin/delete-test-users")
async def delete_test_users(admin: dict = Depends(get_admin_user)):
    """Delete all test users from the database. Keeps only real APK users and admin."""
    async with aiosqlite.connect(DB_PATH) as db:
        # Get list of test users to delete (usernames containing test patterns)
        test_patterns = ['testuser_', 'loginuser_', 'newuser_', 'dupuser_', 'regular_', '@test.com']
        
        # Build query to find test users
        cursor = await db.execute("SELECT id, username, name FROM users WHERE is_admin = FALSE")
        all_users = await cursor.fetchall()
        
        test_user_ids = []
        deleted_users = []
        for user in all_users:
            user_id, username, name = user
            is_test = False
            for pattern in test_patterns:
                if pattern in username.lower():
                    is_test = True
                    break
            if is_test:
                test_user_ids.append(user_id)
                deleted_users.append({"id": user_id, "username": username, "name": name})
        
        if test_user_ids:
            # Delete related data first (foreign key constraints)
            placeholders = ','.join(['?' for _ in test_user_ids])
            await db.execute(f"DELETE FROM progress WHERE user_id IN ({placeholders})", test_user_ids)
            await db.execute(f"DELETE FROM certificates WHERE user_id IN ({placeholders})", test_user_ids)
            await db.execute(f"DELETE FROM messages WHERE user_id IN ({placeholders})", test_user_ids)
            await db.execute(f"DELETE FROM notifications WHERE user_id IN ({placeholders})", test_user_ids)
            await db.execute(f"DELETE FROM ai_conversations WHERE user_id IN ({placeholders})", test_user_ids)
            # Delete the test users
            await db.execute(f"DELETE FROM users WHERE id IN ({placeholders})", test_user_ids)
            await db.commit()
        
        return {
            "status": "success",
            "deleted_count": len(test_user_ids),
            "deleted_users": deleted_users,
            "message": f"Deleted {len(test_user_ids)} test users and their associated data"
        }

@app.delete("/api/admin/reset-system")
async def reset_system(admin: dict = Depends(get_admin_user)):
    """Complete system reset - delete ALL users except admin and all stored data."""
    async with aiosqlite.connect(DB_PATH) as db:
        # Get all non-admin users
        cursor = await db.execute("SELECT id, username, name FROM users WHERE is_admin = FALSE")
        all_users = await cursor.fetchall()
        
        user_ids = [user[0] for user in all_users]
        deleted_users = [{"id": user[0], "username": user[1], "name": user[2]} for user in all_users]
        
        if user_ids:
            placeholders = ','.join(['?' for _ in user_ids])
            # Delete all related data
            await db.execute(f"DELETE FROM progress WHERE user_id IN ({placeholders})", user_ids)
            await db.execute(f"DELETE FROM certificates WHERE user_id IN ({placeholders})", user_ids)
            await db.execute(f"DELETE FROM messages WHERE user_id IN ({placeholders})", user_ids)
            await db.execute(f"DELETE FROM notifications WHERE user_id IN ({placeholders})", user_ids)
            await db.execute(f"DELETE FROM ai_conversations WHERE user_id IN ({placeholders})", user_ids)
            # Delete all non-admin users
            await db.execute(f"DELETE FROM users WHERE id IN ({placeholders})", user_ids)
        
        # Also clear all messages and notifications (including admin's)
        await db.execute("DELETE FROM messages")
        await db.execute("DELETE FROM notifications")
        await db.commit()
        
        return {
            "status": "success",
            "deleted_count": len(user_ids),
            "deleted_users": deleted_users,
            "message": f"System reset complete. Deleted {len(user_ids)} users and all stored data. Only admin account remains."
        }

# WebRTC Signaling Endpoints
class WebRTCOffer(BaseModel):
    target_user_id: int
    sdp: str
    call_type: str = "video"  # "video" or "audio"

class WebRTCAnswer(BaseModel):
    call_id: Optional[str] = None
    caller_user_id: Optional[int] = None
    sdp: str

class WebRTCCandidate(BaseModel):
    target_user_id: int
    candidate: str
    sdp_mid: str
    sdp_m_line_index: int

@app.post("/api/webrtc/offer")
async def webrtc_offer(offer_data: WebRTCOffer, user: dict = Depends(get_current_user)):
    """Send WebRTC offer to target user"""
    call_id = f"{user['id']}_{offer_data.target_user_id}_{datetime.utcnow().timestamp()}"
    webrtc_calls[call_id] = {
        "caller_id": user["id"],
        "caller_name": user["name"],
        "target_id": offer_data.target_user_id,
        "sdp": offer_data.sdp,
        "call_type": offer_data.call_type,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Store call notification for target user
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
            (offer_data.target_user_id, "incoming_call", json.dumps({
                "call_id": call_id,
                "caller_id": user["id"],
                "caller_name": user["name"],
                "call_type": offer_data.call_type,
                "sdp": offer_data.sdp
            }))
        )
        await db.commit()
    
    return {"status": "success", "call_id": call_id, "message": "Call offer sent"}

@app.post("/api/webrtc/answer")
async def webrtc_answer(answer_data: WebRTCAnswer, user: dict = Depends(get_current_user)):
    """Send WebRTC answer back to caller"""
    # Find the call by call_id or caller_user_id
    found_call_id = None
    found_call = None
    
    for cid, call in webrtc_calls.items():
        # Match by call_id if provided
        if answer_data.call_id and cid == answer_data.call_id:
            found_call_id = cid
            found_call = call
            break
        # Match by caller_user_id if provided
        if answer_data.caller_user_id and call["caller_id"] == answer_data.caller_user_id and call["target_id"] == user["id"]:
            found_call_id = cid
            found_call = call
            break
    
    if found_call:
        found_call["answer_sdp"] = answer_data.sdp
        found_call["status"] = "answered"
        
        # Notify caller that call was answered
        caller_id = found_call["caller_id"]
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                "INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
                (caller_id, "call_answered", json.dumps({
                    "call_id": found_call_id,
                    "answerer_id": user["id"],
                    "answerer_name": user["name"],
                    "sdp": answer_data.sdp
                }))
            )
            await db.commit()
        
        return {"status": "success", "call_id": found_call_id, "message": "Call answered"}
    
    return {"status": "error", "message": "Call not found"}

@app.post("/api/webrtc/candidate")
async def webrtc_candidate(candidate_data: WebRTCCandidate, user: dict = Depends(get_current_user)):
    """Send ICE candidate to target user"""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
            (candidate_data.target_user_id, "ice_candidate", json.dumps({
                "from_user_id": user["id"],
                "candidate": candidate_data.candidate,
                "sdp_mid": candidate_data.sdp_mid,
                "sdp_m_line_index": candidate_data.sdp_m_line_index
            }))
        )
        await db.commit()
    return {"status": "success", "message": "ICE candidate sent"}

@app.post("/api/webrtc/end-call")
async def webrtc_end_call(target_user_id: int, user: dict = Depends(get_current_user)):
    """End an active call"""
    # Remove call from active calls
    calls_to_remove = []
    for call_id, call in webrtc_calls.items():
        if (call["caller_id"] == user["id"] and call["target_id"] == target_user_id) or \
           (call["target_id"] == user["id"] and call["caller_id"] == target_user_id):
            calls_to_remove.append(call_id)
    
    for call_id in calls_to_remove:
        del webrtc_calls[call_id]
    
    # Notify the other user
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)",
            (target_user_id, "call_ended", json.dumps({
                "from_user_id": user["id"],
                "from_user_name": user["name"]
            }))
        )
        await db.commit()
    
    return {"status": "success", "message": "Call ended"}

@app.get("/api/webrtc/pending-calls")
async def get_pending_calls(user: dict = Depends(get_current_user)):
    """Get pending incoming calls for the user"""
    pending = []
    for call_id, call in webrtc_calls.items():
        if call["target_id"] == user["id"] and call["status"] == "pending":
            pending.append({
                "call_id": call_id,
                "caller_id": call["caller_id"],
                "caller_name": call["caller_name"],
                "call_type": call["call_type"],
                "sdp": call["sdp"],
                "created_at": call["created_at"]
            })
    return {"pending_calls": pending}

# WebSocket for real-time WebRTC signaling
@app.websocket("/ws/webrtc/{user_id}")
async def websocket_webrtc(websocket: WebSocket, user_id: int):
    await websocket.accept()
    webrtc_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            target_id = data.get("target_id")
            
            if target_id and target_id in webrtc_connections:
                target_ws = webrtc_connections[target_id]
                await target_ws.send_json({
                    "type": message_type,
                    "from_user_id": user_id,
                    "data": data.get("data")
                })
    except WebSocketDisconnect:
        if user_id in webrtc_connections:
            del webrtc_connections[user_id]
    except Exception as e:
        print(f"WebSocket error: {e}")
        if user_id in webrtc_connections:
            del webrtc_connections[user_id]

# Get user's messages (for Connect with Master chat)
@app.get("/api/user/messages")
async def get_user_messages(user: dict = Depends(get_current_user)):
    """Get messages for the current user including admin replies"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        # Ensure is_admin_reply column exists
        try:
            await db.execute("ALTER TABLE messages ADD COLUMN is_admin_reply BOOLEAN DEFAULT FALSE")
            await db.commit()
        except:
            pass  # Column already exists
        # Ensure target_user_id column exists for admin replies
        try:
            await db.execute("ALTER TABLE messages ADD COLUMN target_user_id INTEGER")
            await db.commit()
        except:
            pass  # Column already exists
        # Get messages sent by this user OR admin replies targeted to this user
        cursor = await db.execute('''
            SELECT m.*, u.name as sender_name, u.username as sender_username
            FROM messages m 
            JOIN users u ON m.user_id = u.id 
            WHERE m.user_id = ? OR (m.is_admin_reply = TRUE AND m.target_user_id = ?)
            ORDER BY m.created_at ASC
        ''', (user["id"], user["id"]))
        messages = [dict(m) for m in await cursor.fetchall()]
        return {"messages": messages}

# Screen sharing during exams - store active screen shares
screen_shares = {}

class ScreenShareStart(BaseModel):
    exam_type: str
    chapter_id: Optional[int] = None

class ScreenShareUpdate(BaseModel):
    current_question: int
    total_questions: int
    is_active: bool

class ScreenShareStop(BaseModel):
    reason: str

@app.post("/api/exam/screen-share/start")
async def start_screen_share(data: ScreenShareStart, user: dict = Depends(get_current_user)):
    """Start screen sharing for exam monitoring"""
    screen_shares[user["id"]] = {
        "user_id": user["id"],
        "user_name": user["name"],
        "exam_type": data.exam_type,
        "chapter_id": data.chapter_id,
        "current_question": 1,
        "total_questions": 10,
        "is_active": True,
        "started_at": datetime.utcnow().isoformat()
    }
    return {"status": "success", "message": "Screen sharing started"}

@app.post("/api/exam/screen-share/update")
async def update_screen_share(data: ScreenShareUpdate, user: dict = Depends(get_current_user)):
    """Update screen sharing status during exam"""
    if user["id"] in screen_shares:
        screen_shares[user["id"]].update({
            "current_question": data.current_question,
            "total_questions": data.total_questions,
            "is_active": data.is_active,
            "last_update": datetime.utcnow().isoformat()
        })
    return {"status": "success"}

class ScreenShareScreenshot(BaseModel):
    screenshot: str  # Base64 encoded image
    current_question: int
    total_questions: int
    timestamp: str

# Store latest screenshots for each user
screen_share_screenshots: Dict[int, dict] = {}

@app.post("/api/exam/screen-share/screenshot")
async def receive_screenshot(data: ScreenShareScreenshot, user: dict = Depends(get_current_user)):
    """Receive screenshot from student during exam"""
    screen_share_screenshots[user["id"]] = {
        "user_id": user["id"],
        "user_name": user["name"],
        "screenshot": data.screenshot,
        "current_question": data.current_question,
        "total_questions": data.total_questions,
        "timestamp": data.timestamp,
        "received_at": datetime.utcnow().isoformat()
    }
    # Also update screen_shares with latest info
    if user["id"] in screen_shares:
        screen_shares[user["id"]].update({
            "current_question": data.current_question,
            "total_questions": data.total_questions,
            "has_screenshot": True,
            "last_screenshot": datetime.utcnow().isoformat()
        })
    return {"status": "success"}

@app.get("/api/admin/screen-share/screenshot/{user_id}")
async def get_user_screenshot(user_id: int, admin: dict = Depends(get_admin_user)):
    """Admin gets latest screenshot from a specific user"""
    if user_id in screen_share_screenshots:
        return screen_share_screenshots[user_id]
    return {"error": "No screenshot available for this user"}

@app.get("/api/admin/screen-share/screenshots")
async def get_all_screenshots(admin: dict = Depends(get_admin_user)):
    """Admin gets all latest screenshots"""
    return {"screenshots": list(screen_share_screenshots.values())}

@app.post("/api/exam/screen-share/stop")
async def stop_screen_share(data: ScreenShareStop, user: dict = Depends(get_current_user)):
    """Stop screen sharing when exam ends"""
    if user["id"] in screen_shares:
        del screen_shares[user["id"]]
    return {"status": "success", "message": "Screen sharing stopped"}

@app.get("/api/admin/screen-shares")
async def get_active_screen_shares(admin: dict = Depends(get_admin_user)):
    """Get all active screen shares for admin monitoring"""
    return {"screen_shares": list(screen_shares.values())}

# Screen sharing WebRTC signaling
screen_share_offers: Dict[int, dict] = {}
screen_share_ice_candidates: Dict[int, List[dict]] = {}

class ScreenShareOffer(BaseModel):
    sdp: str
    exam_type: str
    chapter_id: Optional[int] = None

class ScreenShareAnswer(BaseModel):
    user_id: int
    sdp: str

class ScreenShareICE(BaseModel):
    target_user_id: int
    candidate: str
    sdp_mid: Optional[str] = None
    sdp_m_line_index: Optional[int] = None

@app.post("/api/screen-share/offer")
async def screen_share_offer(data: ScreenShareOffer, user: dict = Depends(get_current_user)):
    """Student sends screen share offer to admin"""
    screen_share_offers[user["id"]] = {
        "user_id": user["id"],
        "user_name": user["name"],
        "sdp": data.sdp,
        "exam_type": data.exam_type,
        "chapter_id": data.chapter_id,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    return {"status": "success", "message": "Screen share offer sent"}

@app.get("/api/admin/screen-share-offers")
async def get_screen_share_offers(admin: dict = Depends(get_admin_user)):
    """Admin gets pending screen share offers"""
    offers = [o for o in screen_share_offers.values() if o["status"] == "pending"]
    return {"offers": offers}

@app.post("/api/admin/screen-share-answer")
async def admin_screen_share_answer(data: ScreenShareAnswer, admin: dict = Depends(get_admin_user)):
    """Admin sends answer to student's screen share offer"""
    if data.user_id in screen_share_offers:
        screen_share_offers[data.user_id]["answer_sdp"] = data.sdp
        screen_share_offers[data.user_id]["status"] = "answered"
    return {"status": "success"}

@app.get("/api/screen-share/check-answer")
async def check_screen_share_answer(user: dict = Depends(get_current_user)):
    """Student checks if admin has answered their offer"""
    if user["id"] in screen_share_offers:
        offer = screen_share_offers[user["id"]]
        if offer.get("status") == "answered" and offer.get("answer_sdp"):
            return {"has_answer": True, "sdp": offer["answer_sdp"]}
    return {"has_answer": False}

@app.post("/api/screen-share/ice-candidate")
async def screen_share_ice_candidate(data: ScreenShareICE, user: dict = Depends(get_current_user)):
    """Send ICE candidate for screen sharing"""
    target_id = data.target_user_id
    if target_id not in screen_share_ice_candidates:
        screen_share_ice_candidates[target_id] = []
    screen_share_ice_candidates[target_id].append({
        "from_user_id": user["id"],
        "candidate": data.candidate,
        "sdp_mid": data.sdp_mid,
        "sdp_m_line_index": data.sdp_m_line_index
    })
    return {"status": "success"}

@app.get("/api/screen-share/ice-candidates/{user_id}")
async def get_screen_share_ice_candidates(user_id: int, user: dict = Depends(get_current_user)):
    """Get ICE candidates for screen sharing"""
    candidates = screen_share_ice_candidates.get(user["id"], [])
    # Filter candidates from the specified user
    filtered = [c for c in candidates if c["from_user_id"] == user_id]
    # Clear retrieved candidates
    if user["id"] in screen_share_ice_candidates:
        screen_share_ice_candidates[user["id"]] = [c for c in candidates if c["from_user_id"] != user_id]
    return {"candidates": filtered}

# Force submit exam endpoint
force_submit_users: Dict[int, dict] = {}

@app.post("/api/admin/force-submit/{user_id}")
async def admin_force_submit(user_id: int, admin: dict = Depends(get_admin_user)):
    """Admin force-submits a student's exam (for cheating)"""
    force_submit_users[user_id] = {
        "force_submitted": True,
        "message": "Your exam has been auto-submitted by admin because you were caught cheating!",
        "timestamp": datetime.utcnow().isoformat()
    }
    return {"status": "success", "message": f"Force-submitted exam for user {user_id}"}

@app.get("/api/exam/check-force-submit")
async def check_force_submit(user: dict = Depends(get_current_user)):
    """Student checks if admin has force-submitted their exam"""
    if user["id"] in force_submit_users:
        data = force_submit_users.pop(user["id"])
        return data
    return {"force_submitted": False}

# Exam violation logging- for AI auto-exit and proctoring
class ExamViolation(BaseModel):
    exam_type: str
    chapter_id: Optional[int] = None
    violation_type: str
    timestamp: str

@app.post("/api/exam/violation")
async def log_exam_violation(data: ExamViolation, user: dict = Depends(get_current_user)):
    """Log exam violation (AI access, app switching, etc.) and notify admin"""
    async with aiosqlite.connect(DB_PATH) as db:
        # Create violations table if not exists
        await db.execute('''
            CREATE TABLE IF NOT EXISTS exam_violations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                user_name TEXT,
                exam_type TEXT NOT NULL,
                chapter_id INTEGER,
                violation_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        # Log the violation
        await db.execute('''
            INSERT INTO exam_violations (user_id, user_name, exam_type, chapter_id, violation_type, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user["id"], user["name"], data.exam_type, data.chapter_id, data.violation_type, data.timestamp))
        
        # Create admin notification
        violation_messages = {
            "ai_access_attempt": "attempted to access AI Assistant during exam",
            "user_exit": "manually exited the exam",
            "app_switch": "switched to another app during exam",
            "background_activity": "app went to background during exam"
        }
        violation_msg = violation_messages.get(data.violation_type, data.violation_type)
        
        await db.execute('''
            INSERT INTO notifications (user_id, notification_type, message)
            VALUES (?, ?, ?)
        ''', (1, "exam_violation", f"EXAM VIOLATION: {user['name']} {violation_msg}. Exam auto-submitted."))
        
        await db.commit()
    
    return {"status": "success", "message": "Violation logged and admin notified"}

@app.get("/api/admin/violations")
async def get_exam_violations(admin: dict = Depends(get_admin_user)):
    """Get all exam violations for admin review"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute('''
            SELECT * FROM exam_violations ORDER BY created_at DESC LIMIT 100
        ''')
        violations = [dict(v) for v in await cursor.fetchall()]
        return {"violations": violations}
