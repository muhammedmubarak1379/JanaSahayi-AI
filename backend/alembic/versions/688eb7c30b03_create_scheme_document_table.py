"""create scheme document table

Revision ID: 688eb7c30b03
Revises: 27f138e6682c
Create Date: 2026-09-08 13:33:29.142861

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '688eb7c30b03'
down_revision: Union[str, Sequence[str], None] = '27f138e6682c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Create the scheme_document table."""

    op.create_table(
        "scheme_document",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "scheme_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.String(length=300),
            nullable=False,
        ),
        sa.Column(
            "source_url",
            sa.String(length=1000),
            nullable=True,
        ),
        sa.Column(
            "content",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["scheme_id"],
            ["scheme.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_scheme_document_scheme_id"),
        "scheme_document",
        ["scheme_id"],
        unique=False,
    )


def downgrade() -> None:
    """Remove the scheme_document table."""

    op.drop_index(
        op.f("ix_scheme_document_scheme_id"),
        table_name="scheme_document",
    )

    op.drop_table("scheme_document")