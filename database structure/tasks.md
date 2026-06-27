# Database Build & Maintenance Checklist

## 1️⃣ Schema Enhancements & Accuracy
- [ ] **Add proper foreign‑key constraints** (`complaints.category_id → categories.id`, `complaints.location_id → locations.id`).
- [ ] **Create indexes** on frequently queried columns:
  - `complaints.submission_time`
  - `complaints.category_id`
  - `complaints.location_id`
  - `complaint_priority.rank_score`
- [ ] **Introduce ENUM tables** for `severity` and `input_type` to enforce allowed values and allow easy extensions.
- [ ] **Add NOT NULL constraints** where appropriate (e.g., `input_type`, `content`).
- [ ] **Add CHECK constraints** for numeric ranges (e.g., `affected_count >= 0`).
- [ ] **Add timestamp columns** (`created_at`, `updated_at`) with default `CURRENT_TIMESTAMP` on all tables for auditability.
- [ ] **Create audit (history) tables** or triggers to track changes to `complaints` and related tables.

## 2️⃣ Data Integrity & Validation
- [ ] **Implement database‑level triggers** to keep `complaint_priority` view consistent when `severity` or `affected_count` changes.
- [ ] **Validate geo‑coordinates** (`latitude` between -90 and 90, `longitude` between -180 and 180).
- [ ] **Sanitize text fields** via parameterised queries in the application layer to prevent injection.

## 3️⃣ Performance Optimisation
- [ ] **Analyze and vacuum** the DB after bulk inserts.
- [ ] **Partition tables** (if using PostgreSQL) by date for large `complaints` tables.
- [ ] **Cache frequently accessed views** (e.g., materialised view for `complaint_priority`).

## 4️⃣ Migration & Version Control
- [ ] Set up a migration tool (e.g., `Flyway`, `Liquibase`, or `Alembic`).
- [ ] Write initial migration script to create the schema.
- [ ] Add subsequent migration scripts for each schema change (indexes, triggers, ENUM tables).
- [ ] Store migration files in `database/migrations/` directory.

## 5️⃣ Seed & Test Data
- [ ] Create a **seed script** (`seed.sql`) with realistic example rows for each table.
- [ ] Write **unit tests** for CRUD operations and integrity constraints.
- [ ] Generate **sample data** for performance testing (e.g., 10k‑20k complaints).

## 6️⃣ Documentation
- [ ] Document the schema in a `README.md` inside the `database` folder, including an ER diagram.
- [ ] Provide an **SQL diagram** (e.g., using dbdiagram.io) and embed it as an image.
- [ ] Explain each table, column, and relationship.

## 7️⃣ Backup & Recovery
- [ ] Schedule **regular backups** (daily full, hourly incremental) using appropriate dump tools.
- [ ] Test **restore procedures** on a staging environment.
- [ ] Store backups in a secure, versioned location (e.g., Azure Blob, S3).

## 8️⃣ Security
- [ ] Use **least‑privilege DB users**: one for app reads/writes, one for admin migrations.
- [ ] Enable **encryption at rest** if supported by the DB engine.
- [ ] Ensure all connections use **TLS**.

## 9️⃣ CI/CD Integration
- [ ] Add database linting (e.g., `sqlfluff`) to CI pipeline.
- [ ] Run migration tests on pull requests.
- [ ] Deploy migrations automatically on successful merges to `main`.

## 🔟 Monitoring & Alerting
- [ ] Set up **query performance monitoring** (slow query logs).
- [ ] Alert on **failed migrations** or **backup failures**.
- [ ] Track table growth metrics for capacity planning.

---
*This checklist provides a step‑by‑step roadmap to evolve the simple schema into a production‑grade, accurate, and maintainable database for the AI Governance Intelligence Platform.*
