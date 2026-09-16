from app.core.security import hash_password, verify_password
def test_password()->None:
    plain_password = "StrongTestPassword123!"
    hashed_password = hash_password(plain_password)
    assert hashed_password != plain_password
    assert verify_password(
        plain_password,
        hashed_password,
    ) is True
    assert verify_password(
        "WrongPassword123!",
        hashed_password,
    ) is False