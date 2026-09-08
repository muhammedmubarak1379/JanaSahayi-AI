"""create scheme chunk table

Revision ID: cbf80800e1c7
Revises: 688eb7c30b03
Create Date: 2026-09-08 15:42:25.916377
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# Revision identifiers used by Alembic.
revision: str = "cbf80800e1c7"
down_revision: Union[str, Sequence[str], None] = "688eb7c30b03"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the scheme_chunk table."""

    op.create_table(
        "scheme_chunk",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "document_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "chunk_index",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "content",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "embedding",
            Vector(1024),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["scheme_document.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "document_id",
            "chunk_index",
            name="uq_scheme_chunk_document_position",
        ),
    )

    op.create_index(
        op.f("ix_scheme_chunk_document_id"),
        "scheme_chunk",
        ["document_id"],
        unique=False,
    )


def downgrade() -> None:
    """Remove the scheme_chunk table."""

    op.drop_index(
        op.f("ix_scheme_chunk_document_id"),
        table_name="scheme_chunk",
    )

    op.drop_table("scheme_chunk")