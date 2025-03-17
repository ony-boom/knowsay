-- Script to add dummy descriptions to quizzes with missing descriptions

-- Update Quiz Descriptions where they are NULL or empty
UPDATE quizzes SET description = 'An exploration of modern art movements throughout history, from Impressionism to Contemporary art.' 
WHERE id = '089ff45a-7e37-464e-be4f-22fb9b7f9c68';

UPDATE quizzes SET description = 'Learn essential principles of User Experience and User Interface design to create effective digital products.'
WHERE id = '0f8f8473-8f21-42f2-bfcc-15cee1c165bd';

UPDATE quizzes SET description = 'Discover the fundamental concepts of sociology and how they help explain social behaviors and institutions.'
WHERE id = '105be497-bbd8-4dbe-b918-f93f55029395';

UPDATE quizzes SET description = 'Journey through the history of space exploration, from the first satellites to modern Mars missions.'
WHERE id = '1077f4e1-8057-43ed-8dff-c69fbc82c64d';

UPDATE quizzes SET description = 'Analyze poetic works through various lenses and understand techniques used by renowned poets.'
WHERE id = '33f60394-1b98-4124-95b6-222aab5fdfa7';

UPDATE quizzes SET description = 'Explore the interdisciplinary field of cognitive science, blending psychology, neuroscience, and computer science.'
WHERE id = '36cc7416-fca2-406a-be6c-4bdb24e3a5c5';

UPDATE quizzes SET description = 'Learn the basics of stock market investment, trading strategies, and financial market analysis.'
WHERE id = '37852bfa-0bf9-48ab-8c5e-a2bb5dc16bb9';

UPDATE quizzes SET description = 'Dive into the exciting field of Artificial Intelligence and its applications in the modern world.'
WHERE id = '443decdf-7436-4480-b8b6-d0d8d29fbda0';

UPDATE quizzes SET description = 'Master essential public speaking techniques to deliver impactful and persuasive presentations.'
WHERE id = '530ffa4b-f823-496a-b582-58e62ff2bc09';

UPDATE quizzes SET description = 'Develop key leadership skills to effectively manage teams and drive organizational success.'
WHERE id = '57ef7ff6-5e0d-4cee-af70-d6fb84c4920c';

UPDATE quizzes SET description = 'Understand the history, causes, and consequences of the French Revolution and its impact on modern governance.'
WHERE id = '5de5a79d-59d1-445b-bf11-50cc926989df';

UPDATE quizzes SET description = 'Learn about encryption, decryption, and security protocols in the digital age.'
WHERE id = '68cff930-b1c5-4fbe-b0c4-907a852e9b64';

UPDATE quizzes SET description = 'Explore effective marketing strategies to build brands, engage customers, and drive business growth.'
WHERE id = '7111d7a9-b68a-40cc-9328-bd65d29002f4';

UPDATE quizzes SET description = 'Master the art of photographic composition, including rule of thirds, leading lines, and visual storytelling.'
WHERE id = '8651c2a1-ac50-4c9e-bb2b-6fd5bc9e215b';

UPDATE quizzes SET description = 'Learn the fundamentals of music theory, including notes, scales, chords, and composition principles.'
WHERE id = '940f7a56-30d4-4fb7-be84-08fe7bb73e89';

UPDATE quizzes SET description = 'Understand computer networking concepts, protocols, and infrastructure configurations.'
WHERE id = '96523a6d-918c-4304-aeb4-288948dd37e6';

UPDATE quizzes SET description = 'Explore celestial objects, astronomical phenomena, and the latest discoveries in space science.'
WHERE id = '9efa9697-40d2-48fa-bb6b-ee9911cb610d';

UPDATE quizzes SET description = 'Dive into ancient Greek mythology, exploring gods, heroes, and mythological narratives.'
WHERE id = 'a8a4618e-f87b-4481-8b9b-2f4477144ee1';

UPDATE quizzes SET description = 'Learn essential Linux administration skills for managing servers and networks effectively.'
WHERE id = 'b149c535-8a3c-4a27-80ef-11e5945711fa';

UPDATE quizzes SET description = 'Master Swift programming language fundamentals for developing iOS applications.'
WHERE id = 'b46ebdfc-d9a0-4109-a4bc-f2193ab000cc';

UPDATE quizzes SET description = 'Learn the fundamentals of entrepreneurship, from ideation to launching and growing a successful business.'
WHERE id = 'c41d4dd7-7cf5-403f-83e0-28c3c0b745fd';

UPDATE quizzes SET description = 'Understand cybersecurity concepts, common threats, and protection strategies for digital systems.'
WHERE id = 'c52df962-8825-412c-b084-078b9feac4e8';

UPDATE quizzes SET description = 'Learn the essentials of photography, including camera settings, lighting, and composition techniques.'
WHERE id = 'c9c6e01a-1c62-4f22-a93f-53477b7daa4e';

UPDATE quizzes SET description = 'Explore the works of William Shakespeare and their impact on literature and culture.'
WHERE id = 'd1864093-e67b-4be7-951b-d286baa076e8';

UPDATE quizzes SET description = 'Understand fundamental psychological theories, human behavior, and mental processes.'
WHERE id = 'd3bc5309-eb4e-4c85-bdc4-28203aa7b116';

UPDATE quizzes SET description = 'Master core Java programming concepts, syntax, and object-oriented development principles.'
WHERE id = 'da458080-b312-4ea5-830f-f1cfea423b75';

UPDATE quizzes SET description = 'Learn business strategy frameworks to analyze competition, create value, and achieve sustainable growth.'
WHERE id = 'db19399f-f880-4db5-81b9-62082c7ec984';

UPDATE quizzes SET description = 'Explore environmental concepts, ecosystems, climate, and sustainable development practices.'
WHERE id = 'e5c342d7-408c-4133-b496-d1c9ac91526e';

UPDATE quizzes SET description = 'Understand key economic principles, market dynamics, and policy impacts on society.'
WHERE id = 'e8df1a9c-e2ba-43dc-b6b9-0f42fbbda096';

UPDATE quizzes SET description = 'Journey through the evolution of cinema, influential movements, and groundbreaking filmmakers.'
WHERE id = 'f0687111-ab7c-4654-aa42-2f30f6095b95';

UPDATE quizzes SET description = 'Explore the fascinating world of quantum physics, including wave-particle duality and quantum mechanics principles.'
WHERE id = 'fe618ca1-f893-49d7-b8eb-91c0c891fef2';

-- Optional: Add a description for "Calculus for Beginners" which seems to be missing
UPDATE quizzes SET description = 'Learn the fundamental concepts of calculus, including limits, derivatives, and integrals with practical applications.'
WHERE id = '074d6c4d-c94e-422c-909f-5baaa6c481db';

-- Verify updates
SELECT id, title, description FROM quizzes WHERE description IS NOT NULL ORDER BY title;
