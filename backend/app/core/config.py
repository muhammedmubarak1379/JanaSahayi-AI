from pydantic_settings import BaseSettings,SettingsConfigDict
from pydantic import SecretStr
from pathlib import Path

CONFIG_FILE = Path(__file__).resolve()
PROJECT_ROOT = CONFIG_FILE.parents[3]
ENV_FILE = PROJECT_ROOT / ".env"

class Settings(BaseSettings):
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PORT: int
    POSTGRES_PASSWORD: SecretStr
    POSTGRES_HOST: str = "127.0.0.1"
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
        hide_input_in_errors=True,)

settings = Settings()