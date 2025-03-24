-- Ensure UUID Extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1️⃣ Insert Users
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(uuid_generate_v4(), 'Alice Smith', 'alice@example.com', 'hashed_password_1', 'ADMIN', NOW()),
(uuid_generate_v4(), 'Bob Johnson', 'bob@example.com', 'hashed_password_2', 'USER', NOW()),
(uuid_generate_v4(), 'Charlie Brown', 'charlie@example.com', 'hashed_password_3', 'CORRECTOR', NOW());

-- 2️⃣ Insert Quizzes
INSERT INTO quiz (id, title, category, difficulty, is_public, created_by, created_at) VALUES
(uuid_generate_v4(), 'JavaScript Basics', 'Programming', 'EASY', TRUE, (SELECT id FROM users WHERE name='Alice Smith'), NOW()),
(uuid_generate_v4(), 'World History', 'History', 'MEDIUM', FALSE, (SELECT id FROM users WHERE name='Bob Johnson'), NOW());

-- 3️⃣ Insert Questions
INSERT INTO questions (id, quiz_id, type, content, image_url, timer, created_at) VALUES
(uuid_generate_v4(), (SELECT id FROM quiz WHERE title='JavaScript Basics'), 'QCM', 'What is the output of 1 + "1" in JavaScript?', NULL, 30, NOW()),
(uuid_generate_v4(), (SELECT id FROM quiz WHERE title='World History'), 'QCM', 'Who was the first President of the USA?', NULL, 20, NOW());

-- 4️⃣ Insert Answers
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), (SELECT id FROM questions WHERE content='What is the output of 1 + "1" in JavaScript?'), '11', TRUE, NOW()),
(uuid_generate_v4(), (SELECT id FROM questions WHERE content='What is the output of 1 + "1" in JavaScript?'), '2', FALSE, NOW()),
(uuid_generate_v4(), (SELECT id FROM questions WHERE content='Who was the first President of the USA?'), 'George Washington', TRUE, NOW()),
(uuid_generate_v4(), (SELECT id FROM questions WHERE content='Who was the first President of the USA?'), 'Abraham Lincoln', FALSE, NOW());

-- 5️⃣ Insert Results
INSERT INTO results (id, user_id, quiz_id, score, time_taken, completed_at) VALUES
(uuid_generate_v4(), (SELECT id FROM users WHERE name='Bob Johnson'), (SELECT id FROM quiz WHERE title='JavaScript Basics'), 80, 120, NOW());

-- 6️⃣ Insert Challenges
INSERT INTO challenges (id, title, start_date, end_date, created_by) VALUES
(uuid_generate_v4(), 'JavaScript Speedrun', NOW(), NOW() + INTERVAL '1 day', (SELECT id FROM users WHERE name='Alice Smith'));

-- 7️⃣ Insert Challenge Participants
INSERT INTO challenge_participants (id, user_id, challenge_id, score, rank, completed_at) VALUES
(uuid_generate_v4(), (SELECT id FROM users WHERE name='Bob Johnson'), (SELECT id FROM challenges WHERE title='JavaScript Speedrun'), 75, 1, NOW());

-- 8️⃣ Insert Tests
INSERT INTO tests (id, title, quiz_id, corrector_id, created_at) VALUES
(uuid_generate_v4(), 'JavaScript Certification Test', (SELECT id FROM quiz WHERE title='JavaScript Basics'), (SELECT id FROM users WHERE name='Charlie Brown'), NOW());

-- 9️⃣ Insert Test Corrections
INSERT INTO test_corrections (id, test_id, corrector_id, score, feedback, validated_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tests WHERE title='JavaScript Certification Test'), (SELECT id FROM users WHERE name='Charlie Brown'), 90, 'Well done!', NOW());

-- 🔟 Insert Logs
INSERT INTO logs (id, user_id, action, timestamp) VALUES
(uuid_generate_v4(), (SELECT id FROM users WHERE name='Alice Smith'), 'User created a new quiz', NOW());
