-- Script to insert at least 3 answer options for each question in the questions_rows.csv file

-- Ensure UUID Extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- JavaScript Basics: "What is the output of 1 + "1" in JavaScript?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '064ee8fc-338f-4404-8810-d33c372bdd3e', '11', true, NOW()),
(uuid_generate_v4(), '064ee8fc-338f-4404-8810-d33c372bdd3e', '2', false, NOW()),
(uuid_generate_v4(), '064ee8fc-338f-4404-8810-d33c372bdd3e', 'Error', false, NOW()),
(uuid_generate_v4(), '064ee8fc-338f-4404-8810-d33c372bdd3e', 'undefined', false, NOW());

-- World History: "Who was the first President of the USA?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '2e1594c5-4819-475f-b1ba-69ddbb513c1c', 'George Washington', true, NOW()),
(uuid_generate_v4(), '2e1594c5-4819-475f-b1ba-69ddbb513c1c', 'Abraham Lincoln', false, NOW()),
(uuid_generate_v4(), '2e1594c5-4819-475f-b1ba-69ddbb513c1c', 'Thomas Jefferson', false, NOW()),
(uuid_generate_v4(), '2e1594c5-4819-475f-b1ba-69ddbb513c1c', 'John Adams', false, NOW());

-- UX/UI Design: "Which gas do plants absorb from the atmosphere?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '34753736-83fb-4d87-bab5-5ce56ad68c89', 'Carbon dioxide', true, NOW()),
(uuid_generate_v4(), '34753736-83fb-4d87-bab5-5ce56ad68c89', 'Oxygen', false, NOW()),
(uuid_generate_v4(), '34753736-83fb-4d87-bab5-5ce56ad68c89', 'Nitrogen', false, NOW()),
(uuid_generate_v4(), '34753736-83fb-4d87-bab5-5ce56ad68c89', 'Hydrogen', false, NOW());

-- Swift for iOS: "Which company developed the Java programming language?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '3edaee2f-b18f-4312-a718-b350916de820', 'Sun Microsystems', true, NOW()),
(uuid_generate_v4(), '3edaee2f-b18f-4312-a718-b350916de820', 'Microsoft', false, NOW()),
(uuid_generate_v4(), '3edaee2f-b18f-4312-a718-b350916de820', 'Apple', false, NOW()),
(uuid_generate_v4(), '3edaee2f-b18f-4312-a718-b350916de820', 'IBM', false, NOW());

-- Swift for iOS: "Who discovered gravity?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '62884da0-78f3-44e9-8d53-56f0ee14cb46', 'Isaac Newton', true, NOW()),
(uuid_generate_v4(), '62884da0-78f3-44e9-8d53-56f0ee14cb46', 'Albert Einstein', false, NOW()),
(uuid_generate_v4(), '62884da0-78f3-44e9-8d53-56f0ee14cb46', 'Galileo Galilei', false, NOW()),
(uuid_generate_v4(), '62884da0-78f3-44e9-8d53-56f0ee14cb46', 'Nikola Tesla', false, NOW());

-- Swift for iOS: "Which gas makes up the majority of Earth's atmosphere?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '62dc5377-a1c1-4638-888a-41fcf5a08bbc', 'Nitrogen', true, NOW()),
(uuid_generate_v4(), '62dc5377-a1c1-4638-888a-41fcf5a08bbc', 'Oxygen', false, NOW()),
(uuid_generate_v4(), '62dc5377-a1c1-4638-888a-41fcf5a08bbc', 'Carbon dioxide', false, NOW()),
(uuid_generate_v4(), '62dc5377-a1c1-4638-888a-41fcf5a08bbc', 'Argon', false, NOW());

-- UX/UI Design: "Which language runs in a web browser?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '79a7bd6e-4b6d-4a85-ae73-e44be4474341', 'JavaScript', true, NOW()),
(uuid_generate_v4(), '79a7bd6e-4b6d-4a85-ae73-e44be4474341', 'Java', false, NOW()),
(uuid_generate_v4(), '79a7bd6e-4b6d-4a85-ae73-e44be4474341', 'Python', false, NOW()),
(uuid_generate_v4(), '79a7bd6e-4b6d-4a85-ae73-e44be4474341', 'C++', false, NOW());

-- UX/UI Design: "Which country invented paper?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '816636b6-3797-4716-b6c0-b4f772eb8219', 'China', true, NOW()),
(uuid_generate_v4(), '816636b6-3797-4716-b6c0-b4f772eb8219', 'Egypt', false, NOW()),
(uuid_generate_v4(), '816636b6-3797-4716-b6c0-b4f772eb8219', 'India', false, NOW()),
(uuid_generate_v4(), '816636b6-3797-4716-b6c0-b4f772eb8219', 'Mesopotamia', false, NOW());

-- Marketing Strategies: "Which planet is known as the Red Planet?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '85654c35-0451-4148-b978-160c892affba', 'Mars', true, NOW()),
(uuid_generate_v4(), '85654c35-0451-4148-b978-160c892affba', 'Venus', false, NOW()),
(uuid_generate_v4(), '85654c35-0451-4148-b978-160c892affba', 'Jupiter', false, NOW()),
(uuid_generate_v4(), '85654c35-0451-4148-b978-160c892affba', 'Mercury', false, NOW());

-- Swift for iOS: "What is the capital city of Australia?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '88f3161b-ecfe-440a-85c0-a5f5040bbaeb', 'Canberra', true, NOW()),
(uuid_generate_v4(), '88f3161b-ecfe-440a-85c0-a5f5040bbaeb', 'Sydney', false, NOW()),
(uuid_generate_v4(), '88f3161b-ecfe-440a-85c0-a5f5040bbaeb', 'Melbourne', false, NOW()),
(uuid_generate_v4(), '88f3161b-ecfe-440a-85c0-a5f5040bbaeb', 'Perth', false, NOW());

-- UX/UI Design: "Who painted the Mona Lisa?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '935cba00-2fd2-4da1-b013-1e51fa314b5d', 'Leonardo da Vinci', true, NOW()),
(uuid_generate_v4(), '935cba00-2fd2-4da1-b013-1e51fa314b5d', 'Michelangelo', false, NOW()),
(uuid_generate_v4(), '935cba00-2fd2-4da1-b013-1e51fa314b5d', 'Raphael', false, NOW()),
(uuid_generate_v4(), '935cba00-2fd2-4da1-b013-1e51fa314b5d', 'Pablo Picasso', false, NOW());

-- Marketing Strategies: "What does HTML stand for?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '9e2c6f32-c6ae-4f4d-81a1-d1aca9a0fabf', 'Hypertext Markup Language', true, NOW()),
(uuid_generate_v4(), '9e2c6f32-c6ae-4f4d-81a1-d1aca9a0fabf', 'Hypertext Management Language', false, NOW()),
(uuid_generate_v4(), '9e2c6f32-c6ae-4f4d-81a1-d1aca9a0fabf', 'High-level Text Markup Language', false, NOW()),
(uuid_generate_v4(), '9e2c6f32-c6ae-4f4d-81a1-d1aca9a0fabf', 'Home Tool Markup Language', false, NOW());

-- UX/UI Design: "What is the hardest natural substance on Earth?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'aa991f01-95f6-4c20-b477-6f67fa255c26', 'Diamond', true, NOW()),
(uuid_generate_v4(), 'aa991f01-95f6-4c20-b477-6f67fa255c26', 'Titanium', false, NOW()),
(uuid_generate_v4(), 'aa991f01-95f6-4c20-b477-6f67fa255c26', 'Quartz', false, NOW()),
(uuid_generate_v4(), 'aa991f01-95f6-4c20-b477-6f67fa255c26', 'Steel', false, NOW());

-- UX/UI Design: "Which element has the chemical symbol "O"?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'acfd3349-521f-4f92-9f96-449f8241ed1f', 'Oxygen', true, NOW()),
(uuid_generate_v4(), 'acfd3349-521f-4f92-9f96-449f8241ed1f', 'Gold', false, NOW()),
(uuid_generate_v4(), 'acfd3349-521f-4f92-9f96-449f8241ed1f', 'Osmium', false, NOW()),
(uuid_generate_v4(), 'acfd3349-521f-4f92-9f96-449f8241ed1f', 'Oganesson', false, NOW());

-- Marketing Strategies: "Which programming language is known as the "mother of all languages"?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'b5b52ca6-8786-42f0-8e46-fa2e60e6df79', 'C', true, NOW()),
(uuid_generate_v4(), 'b5b52ca6-8786-42f0-8e46-fa2e60e6df79', 'COBOL', false, NOW()),
(uuid_generate_v4(), 'b5b52ca6-8786-42f0-8e46-fa2e60e6df79', 'FORTRAN', false, NOW()),
(uuid_generate_v4(), 'b5b52ca6-8786-42f0-8e46-fa2e60e6df79', 'Assembly', false, NOW());

-- Marketing Strategies: "What is 2 + 2?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'c6562ddd-3fb1-4fc2-91c3-97e98bd4688e', '4', true, NOW()),
(uuid_generate_v4(), 'c6562ddd-3fb1-4fc2-91c3-97e98bd4688e', '3', false, NOW()),
(uuid_generate_v4(), 'c6562ddd-3fb1-4fc2-91c3-97e98bd4688e', '5', false, NOW()),
(uuid_generate_v4(), 'c6562ddd-3fb1-4fc2-91c3-97e98bd4688e', '22', false, NOW());

-- UX/UI Design: "Which is the largest ocean on Earth?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'd4a85cb6-af5c-4258-8525-fb4b52d632f7', 'Pacific Ocean', true, NOW()),
(uuid_generate_v4(), 'd4a85cb6-af5c-4258-8525-fb4b52d632f7', 'Atlantic Ocean', false, NOW()),
(uuid_generate_v4(), 'd4a85cb6-af5c-4258-8525-fb4b52d632f7', 'Indian Ocean', false, NOW()),
(uuid_generate_v4(), 'd4a85cb6-af5c-4258-8525-fb4b52d632f7', 'Arctic Ocean', false, NOW());

-- Swift for iOS: "What is the tallest mountain in the world?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'eb6ea585-ee07-4cc1-af85-4f91afd266e7', 'Mount Everest', true, NOW()),
(uuid_generate_v4(), 'eb6ea585-ee07-4cc1-af85-4f91afd266e7', 'K2', false, NOW()),
(uuid_generate_v4(), 'eb6ea585-ee07-4cc1-af85-4f91afd266e7', 'Kangchenjunga', false, NOW()),
(uuid_generate_v4(), 'eb6ea585-ee07-4cc1-af85-4f91afd266e7', 'Lhotse', false, NOW());

-- UX/UI Design: "Who developed the Python programming language?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'ee7a65aa-3d2f-42cb-85fb-b7c77e9f027a', 'Guido van Rossum', true, NOW()),
(uuid_generate_v4(), 'ee7a65aa-3d2f-42cb-85fb-b7c77e9f027a', 'James Gosling', false, NOW()),
(uuid_generate_v4(), 'ee7a65aa-3d2f-42cb-85fb-b7c77e9f027a', 'Bjarne Stroustrup', false, NOW()),
(uuid_generate_v4(), 'ee7a65aa-3d2f-42cb-85fb-b7c77e9f027a', 'Brendan Eich', false, NOW());

-- UX/UI Design: "What year did World War II end?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'f16b9be4-6f66-4045-b85c-8cdeff0ea0c9', '1945', true, NOW()),
(uuid_generate_v4(), 'f16b9be4-6f66-4045-b85c-8cdeff0ea0c9', '1939', false, NOW()),
(uuid_generate_v4(), 'f16b9be4-6f66-4045-b85c-8cdeff0ea0c9', '1941', false, NOW()),
(uuid_generate_v4(), 'f16b9be4-6f66-4045-b85c-8cdeff0ea0c9', '1950', false, NOW());

-- Marketing Strategies: "What is the capital of France?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), 'ff583eca-6707-4d2f-8a40-d180be41081c', 'Paris', true, NOW()),
(uuid_generate_v4(), 'ff583eca-6707-4d2f-8a40-d180be41081c', 'Lyon', false, NOW()),
(uuid_generate_v4(), 'ff583eca-6707-4d2f-8a40-d180be41081c', 'Marseille', false, NOW()),
(uuid_generate_v4(), 'ff583eca-6707-4d2f-8a40-d180be41081c', 'Bordeaux', false, NOW());

-- UX/UI Design: "What does CSS stand for?"
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '98c16c70-4a5a-411f-be3e-84f131b7dbf0', 'Cascading Style Sheets', true, NOW()),
(uuid_generate_v4(), '98c16c70-4a5a-411f-be3e-84f131b7dbf0', 'Creative Style Sheets', false, NOW()),
(uuid_generate_v4(), '98c16c70-4a5a-411f-be3e-84f131b7dbf0', 'Computer Style Sheets', false, NOW()),
(uuid_generate_v4(), '98c16c70-4a5a-411f-be3e-84f131b7dbf0', 'Colorful Style Sheets', false, NOW());

-- Matching questions - creating answers for ordering questions and other types as needed
-- For MATCHING, ORDER, and OPEN questions, we'll create possible answer combinations or correct responses

-- MATCHING: "Match famous scientists with their discoveries."
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '0431f1f8-3dc7-4e20-aadf-e177f9a4a2b4', '{"Isaac Newton": "Law of Gravity", "Marie Curie": "Radioactivity", "Albert Einstein": "Theory of Relativity", "Charles Darwin": "Evolution"}', true, NOW()),
(uuid_generate_v4(), '0431f1f8-3dc7-4e20-aadf-e177f9a4a2b4', '{"Isaac Newton": "Theory of Relativity", "Marie Curie": "Law of Gravity", "Albert Einstein": "Radioactivity", "Charles Darwin": "Evolution"}', false, NOW()),
(uuid_generate_v4(), '0431f1f8-3dc7-4e20-aadf-e177f9a4a2b4', '{"Isaac Newton": "Law of Gravity", "Marie Curie": "Theory of Relativity", "Albert Einstein": "Radioactivity", "Charles Darwin": "Evolution"}', false, NOW());

-- ORDER: "Arrange the parts of a scientific method."
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '360675ad-d9d6-4d8b-ab4f-e0d71a2e7abf', '["Question", "Research", "Hypothesis", "Experiment", "Analysis", "Conclusion"]', true, NOW()),
(uuid_generate_v4(), '360675ad-d9d6-4d8b-ab4f-e0d71a2e7abf', '["Research", "Question", "Hypothesis", "Experiment", "Analysis", "Conclusion"]', false, NOW()),
(uuid_generate_v4(), '360675ad-d9d6-4d8b-ab4f-e0d71a2e7abf', '["Question", "Hypothesis", "Research", "Experiment", "Conclusion", "Analysis"]', false, NOW());

-- OPEN: "Describe the process of photosynthesis."
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '1b185c94-b7aa-4346-9bf0-e79705f93172', 'Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy. During photosynthesis, plants take in carbon dioxide (CO2) and water (H2O) from the air and soil. Within the plant cell, the water is oxidized, meaning it loses electrons, while the carbon dioxide is reduced, meaning it gains electrons. This transforms the water into oxygen and the carbon dioxide into glucose. The plant then releases the oxygen back into the air, and stores energy within the glucose molecules.', true, NOW()),
(uuid_generate_v4(), '1b185c94-b7aa-4346-9bf0-e79705f93172', 'Photosynthesis is when plants absorb sunlight to produce energy.', false, NOW()),
(uuid_generate_v4(), '1b185c94-b7aa-4346-9bf0-e79705f93172', 'Photosynthesis involves plants converting carbon dioxide to oxygen using sunlight.', false, NOW());

-- MATCHING: "Match the periodic table elements with their atomic numbers."
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '073f0340-d22f-4c8b-961c-674f2db3fa13', '{"Hydrogen": 1, "Oxygen": 8, "Carbon": 6, "Nitrogen": 7}', true, NOW()),
(uuid_generate_v4(), '073f0340-d22f-4c8b-961c-674f2db3fa13', '{"Hydrogen": 1, "Oxygen": 7, "Carbon": 8, "Nitrogen": 6}', false, NOW()),
(uuid_generate_v4(), '073f0340-d22f-4c8b-961c-674f2db3fa13', '{"Hydrogen": 2, "Oxygen": 8, "Carbon": 6, "Nitrogen": 7}', false, NOW());

-- ORDER: "Sort the steps in the water cycle correctly."
INSERT INTO answers (id, question_id, content, is_correct, created_at) VALUES
(uuid_generate_v4(), '4346e0be-830e-4849-90b0-e570dee5ca57', '["Evaporation", "Condensation", "Precipitation", "Collection"]', true, NOW()),
(uuid_generate_v4(), '4346e0be-830e-4849-90b0-e570dee5ca57', '["Condensation", "Evaporation", "Precipitation", "Collection"]', false, NOW()),
(uuid_generate_v4(), '4346e0be-830e-4849-90b0-e570dee5ca57', '["Precipitation", "Collection", "Evaporation", "Condensation"]', false, NOW());

-- Verify inserted answers count
SELECT COUNT(*) FROM answers;
