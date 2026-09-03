from sqlalchemy import select
from sqlalchemy.orm import Session
from getpass import getpass
from app.core.security import hash_password
from app.db.engine import engine
from app.db.model import User

def main()->None:
    email=input("Admin email: ").strip().lower()
    password=getpass("Admin password: ")
    password_confirmation=getpass("Confirm password: ")
    if password != password_confirmation:
        print("password do not match ")
        return
    if len(password)<12:
        print("passwoord must contain atleast 12 character")
        return
    with Session(engine) as session:
        statement=select(User).where(User.email==email)
        existing_email=session.scalar(statement)
        if existing_email is not None:
            print("An account with this mail is already exists")
            return
    admin=User(email=email,hashed_password=hash_password(password),role="admin",)
    session.add(admin)
    session.commit()
    session.refresh(admin)
    print(f"Administrator created with ID: {admin.id}")

if __name__=="__main__":
    main()