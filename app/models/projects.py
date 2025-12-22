from typing import TYPE_CHECKING, List
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

if TYPE_CHECKING:
    from app.models.users import UserModel
    from app.models.proposals import ProposalModel


class ProjectModel(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    budget: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="open")  # open, in_progress, closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    client: Mapped["UserModel"] = relationship(back_populates="projects")

    proposals: Mapped[List["ProposalModel"]] = relationship(back_populates="project")