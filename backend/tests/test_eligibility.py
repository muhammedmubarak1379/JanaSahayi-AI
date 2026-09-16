from datetime import date
from app.services.eligibility import calculate_age
def test_calculate_age_before_birthday() -> None:
    date_of_birth = date(2000, 9, 20)
    today = date(2026, 9, 16)
    age = calculate_age(date_of_birth, today)

    assert age == 25


def test_calculate_age_on_birthday() -> None:
    date_of_birth = date(2000, 9, 16)
    today = date(2026, 9, 16)
    age = calculate_age(date_of_birth, today)
    assert age == 26


def test_calculate_age_after_birthday() -> None:
    date_of_birth = date(2000, 5, 20)
    today = date(2026, 9, 16)
    age = calculate_age(date_of_birth, today)
    assert age == 26