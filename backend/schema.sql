-- Single table: recipes (SQLite)
CREATE TABLE IF NOT EXISTS recipes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT    NOT NULL,
  category         TEXT,
  ingredients      TEXT,
  instructions     TEXT,
  prep_time_minutes INTEGER,
  servings         INTEGER,
  created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 10 sample records
INSERT INTO recipes (title, category, ingredients, instructions, prep_time_minutes, servings) VALUES
('Nshima with Kapenta', 'Main', 'Maize meal, water, kapenta, tomatoes, onion, oil, salt', 'Boil water, stir in maize meal until thick. Fry kapenta with onion and tomato. Serve together.', 40, 4),
('Chicken Stew', 'Main', 'Chicken, tomatoes, onion, garlic, carrots, oil, salt', 'Brown the chicken, add onion, garlic and tomato, then simmer with carrots until tender.', 60, 4),
('Vegetable Rice', 'Side', 'Rice, carrots, peas, green pepper, oil, salt', 'Saute vegetables, add rice and water, cook until fluffy.', 30, 4),
('Pancakes', 'Breakfast', 'Flour, eggs, milk, sugar, baking powder, butter', 'Mix batter, pour onto a hot pan, flip when bubbles form.', 20, 3),
('Beef Samosas', 'Snack', 'Minced beef, flour, onion, curry powder, oil', 'Cook spiced beef, fold into pastry triangles and deep fry until golden.', 50, 6),
('Fruit Salad', 'Dessert', 'Banana, mango, orange, pineapple, honey', 'Chop all fruit, mix with honey and chill.', 10, 4),
('Ifisashi (Greens in Peanut Sauce)', 'Main', 'Pumpkin leaves, groundnut flour, tomatoes, onion, salt', 'Cook greens with onion and tomato, stir in groundnut paste and simmer.', 35, 4),
('Tomato Soup', 'Starter', 'Tomatoes, onion, garlic, stock, cream, basil', 'Saute onion and garlic, add tomatoes and stock, simmer, blend smooth.', 35, 4),
('Scrambled Eggs on Toast', 'Breakfast', 'Eggs, bread, butter, salt, pepper', 'Whisk eggs, cook gently in butter, serve on toast.', 10, 2),
('Banana Bread', 'Dessert', 'Ripe bananas, flour, sugar, eggs, butter, baking soda', 'Mash bananas, mix with remaining ingredients and bake at 175C for 55 minutes.', 70, 8);
