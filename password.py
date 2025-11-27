from passlib.hash import pbkdf2_sha256

password = "user123"

hashed = pbkdf2_sha256.hash(password)
print("Generated hash:")
print(hashed)
