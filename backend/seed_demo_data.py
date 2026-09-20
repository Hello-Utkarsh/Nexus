import asyncio
import logging
from app.seed.demo_seed import seed_database

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )
    print("==================================================")
    print("CHAKRAVYUH 2.0: SEEDING SYNTHETIC DEMO DATA")
    print("All entities, bank accounts, phones & cases are fictional.")
    print("==================================================")
    asyncio.run(seed_database())
    print("[SUCCESS] DEMO_DATA seed completed successfully.")
