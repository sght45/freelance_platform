from fastapi import Depends, FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import Column, Integer, String
from contextlib import asynccontextmanager
import uvicorn

# Создаем асинхронный движок для SQLite
DATABASE_URL = "sqlite+aiosqlite:///./test.db"
engine = create_async_engine(DATABASE_URL, echo=True)

# Создаем фабрику сессий
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Базовый класс для моделей
class Base(DeclarativeBase):
    pass

# Модель пользователя
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)

# Создаем таблицы при старте
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаем таблицы при запуске
    await create_tables()
    print("✅ Таблицы созданы")
    yield
    # Закрываем соединения при завершении
    await engine.dispose()
    print("🔌 Соединения закрыты")

app = FastAPI(lifespan=lifespan)

# Монтируем статические файлы (CSS, JS, изображения)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Настраиваем шаблоны Jinja2
templates = Jinja2Templates(directory="templates")

# Зависимость для получения сессии БД
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# ========== HTML СТРАНИЦЫ ==========

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/jobs", response_class=HTMLResponse)
async def jobs_page(request: Request):
    return templates.TemplateResponse("jobs.html", {"request": request})

@app.get("/post-project", response_class=HTMLResponse)
async def post_project_page(request: Request):
    return templates.TemplateResponse("post_project.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

# ========== ПРОСТЫЕ API (без форм) ==========

@app.get("/health")
async def health_check():
    return {"status": "ok", "python_version": "3.12"}

@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import text
    result = await db.execute(text("SELECT 1"))
    value = result.scalar()
    return {"database_test": value == 1}

if __name__ == "__main__":
   uvicorn.run(app, host="127.0.0.1", port=8001, reload=False)