-- Insert categories
INSERT INTO category (id, name) VALUES
(1, 'General Discussion'),
(2, 'Hardware Discussions'),
(3, 'Gaming'),
(4, 'Software Development'),
(5, 'Off-topic'),
(6, 'Tech News & Reviews');

-- Insert subcategories for "General Discussion"
INSERT INTO subcategory (id, name, description, category_id) VALUES
(1, 'Introductions', 'Introduce yourself to the community.', 1),
(2, 'Community Chat', 'Casual discussions about anything and everything.', 1);

-- Insert subcategories for "Hardware Discussions"
INSERT INTO subcategory (id, name, description, category_id) VALUES
(3, 'PC Builds', 'Discuss and share your custom PC builds.', 2),
(4, 'Graphics Cards', 'Everything about GPUs, from performance to overclocking.', 2),
(5, 'Processors', 'Talk about CPUs, benchmarks, and upgrades.', 2),
(6, 'Cooling & Overclocking', 'Tips and tricks for keeping your system cool and running fast.', 2),
(7, 'Peripherals', 'Keyboards, mice, monitors, and other peripherals.', 2);

-- Insert subcategories for "Gaming"
INSERT INTO subcategory (id, name, description, category_id) VALUES
(8, 'PC Gaming', 'Discuss the latest and greatest in PC gaming.', 3),
(9, 'Console Gaming', 'Everything about PlayStation, Xbox, and Nintendo.', 3),
(10, 'VR & AR', 'Virtual and augmented reality gaming and hardware.', 3),
(11, 'Game Development', 'Share tips and tricks for creating games.', 3);

-- Insert subcategories for "Software Development"
INSERT INTO subcategory (id, name, description, category_id) VALUES
(12, 'General Programming', 'Programming concepts, tips, and tricks.', 4),
(13, 'Web Development', 'Frontend and backend web development topics.', 4),
(14, 'Game Development', 'Create games using Unity, Unreal, and other engines.', 4),
(15, 'AI & Machine Learning', 'Dive into artificial intelligence and machine learning.', 4),
(16, 'DevOps & Cloud Computing', 'Discuss automation, CI/CD, and cloud solutions.', 4),
(17, 'Tools & Resources', 'Share your favorite tools, libraries, and resources.', 4);

-- Insert subcategories for "Off-topic"
INSERT INTO subcategory (id, name, description, category_id) VALUES
(18, 'The Pub', 'A place to relax and have fun with the community.', 5),
(19, 'Random Discussions', 'Talk about anything that doesn’t fit elsewhere.', 5),
(20, 'Memes & Fun', 'Share your favorite memes and funny content.', 5);

-- Insert subcategories for "Tech News & Reviews"
INSERT INTO subcategory (id, name, description, category_id) VALUES
(21, 'Latest News', 'Stay updated with the latest in tech.', 6),
(22, 'Reviews', 'Read and share reviews of the latest gadgets.', 6),
(23, 'Rumors & Speculations', 'Discuss upcoming releases and industry rumors.', 6);
