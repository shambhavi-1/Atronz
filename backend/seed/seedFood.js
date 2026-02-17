const FoodItem = require("../models/FoodItem");

const seedFood = async () => {
  const foodItems = [
    // 🍕 Pizza
    {
      name: "Classic Margherita Delight",
      category: "Pizza",
      price: 120,
      stock: 50,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Mozzarella, tomato, basil",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Zesty Pepperoni Supreme",
      category: "Pizza",
      price: 150,
      stock: 45,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop&crop=center",
      description: "Pepperoni, cheese, tomato",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Fiery Inferno Chicken Pizza",
      category: "Pizza",
      price: 160,
      stock: 40,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop&crop=center",
      description: "Spicy chicken, jalapenos, cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Veggie Supreme Pizza",
      category: "Pizza",
      price: 140,
      stock: 55,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop&crop=center",
      description: "Veggies and cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "BBQ Chicken Pizza",
      category: "Pizza",
      price: 170,
      stock: 35,
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=300&h=200&fit=crop&crop=center",
      description: "BBQ chicken, onions, cilantro",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Hawaiian Pizza",
      category: "Pizza",
      price: 155,
      stock: 42,
      image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=300&h=200&fit=crop&crop=center",
      description: "Ham, pineapple, cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Meat Lovers Pizza",
      category: "Pizza",
      price: 180,
      stock: 38,
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=300&h=200&fit=crop&crop=center",
      description: "Pepperoni, sausage, bacon, ham",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "White Pizza",
      category: "Pizza",
      price: 145,
      stock: 48,
      image: "https://plus.unsplash.com/premium_photo-1667682939994-4c9e874dc175?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2hpdGUlMjBwaXp6YXxlbnwwfHwwfHx8MA%3D%3D",
      description: "Garlic, ricotta, mozzarella, herbs",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },

    // 🍔 Burgers
    {
      name: "Classic Beef Burger",
      category: "Burger",
      price: 100,
      stock: 80,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center",
      description: "Juicy beef patty, lettuce, tomato, cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Chicken Burger",
      category: "Burger",
      price: 90,
      stock: 70,
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Grilled chicken breast, fresh veggies",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Vegan Burger",
      category: "Burger",
      price: 85,
      stock: 60,
      image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      description: "Plant-based patty, avocado, sprouts",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Double Cheese Burger",
      category: "Burger",
      price: 130,
      stock: 65,
      image: "https://media.istockphoto.com/id/117150229/photo/double-bacon-cheeseburger.webp?a=1&b=1&s=612x612&w=0&k=20&c=drgJ_odJYLfdhSo7_9x1PomQ0NigaVYMxXKqR8Ouf2Y=",
      description: "Two beef patties, extra cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Bacon Cheese Burger",
      category: "Burger",
      price: 125,
      stock: 55,
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=200&fit=crop&crop=center",
      description: "Beef patty, crispy bacon, cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Mushroom Swiss Burger",
      category: "Burger",
      price: 115,
      stock: 50,
      image: "https://images.unsplash.com/photo-1551987840-f62d9c74ae78?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaHJvb20lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      description: "Beef patty, sautéed mushrooms, swiss cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Spicy Jalapeno Burger",
      category: "Burger",
      price: 110,
      stock: 45,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center",
      description: "Spicy beef patty, jalapenos, pepper jack",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Turkey Burger",
      category: "Burger",
      price: 95,
      stock: 40,
      image: "https://images.unsplash.com/photo-1633040243440-1226eaddb80d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHVya2V5JTIwYnVyZ2VyfGVufDB8fDB8fHww",
      description: "Lean turkey patty, cranberry mayo",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },

    // 🍝 Pasta
    {
      name: "Spaghetti Carbonara",
      category: "Pasta",
      price: 110,
      stock: 40,
      image: "https://plus.unsplash.com/premium_photo-1664472682525-0c0b50534850?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2V0dGklMjBjYXJib25hcmF8ZW58MHx8MHx8fDA%3D",
      description: "Creamy pasta, bacon, parmesan",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Pesto Pasta",
      category: "Pasta",
      price: 95,
      stock: 50,
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&h=200&fit=crop&crop=center",
      description: "Basil pesto, cherry tomatoes",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Gluten-Free Pasta",
      category: "Pasta",
      price: 105,
      stock: 35,
      image: "https://images.unsplash.com/photo-1679279726940-be5ce80c632c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Rice-based pasta, vegetables",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Alfredo Pasta",
      category: "Pasta",
      price: 115,
      stock: 45,
      image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&h=200&fit=crop&crop=center",
      description: "Creamy alfredo, grilled chicken",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Arrabbiata Pasta",
      category: "Pasta",
      price: 100,
      stock: 42,
      image: "https://media.istockphoto.com/id/2224586410/photo/pasta-arrabbiata-fusilli-with-burrata-cheese-and-fresh-basil-served-in-italian-outdoor.webp?a=1&b=1&s=612x612&w=0&k=20&c=CdBGrOnGXx2FjnMrse-7DAR8vSj10TDmrgsW1mSqtrA=",
      description: "Spicy tomato sauce, red chili flakes",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Mushroom Risotto",
      category: "Pasta",
      price: 125,
      stock: 38,
      image: "https://images.unsplash.com/photo-1609770424775-39ec362f2d94?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Creamy arborio rice, wild mushrooms",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Lasagna",
      category: "Pasta",
      price: 135,
      stock: 30,
      image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=200&fit=crop&crop=center",
      description: "Layered pasta, meat sauce, cheese",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Fettuccine Primavera",
      category: "Pasta",
      price: 120,
      stock: 36,
      image: "https://media.istockphoto.com/id/184966173/photo/spring-pasta.webp?a=1&b=1&s=612x612&w=0&k=20&c=y_tMHly9NET2Y4JyW9GsBfB_wAGSDbdp7XYUrPipU0U=",
      description: "Fresh seasonal vegetables, light sauce",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },

    // 🥗 Salads
    {
      name: "Caesar Salad",
      category: "Salad",
      price: 75,
      stock: 60,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop&crop=center",
      description: "Crisp romaine, caesar dressing, croutons",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1) // Random rating between 3.5-5.0
    },
    {
      name: "Greek Salad",
      category: "Salad",
      price: 80,
      stock: 55,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop&crop=center",
      description: "Feta cheese, olives, fresh vegetables",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Chicken Caesar Salad",
      category: "Salad",
      price: 95,
      stock: 50,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop&crop=center",
      description: "Grilled chicken on caesar salad",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Quinoa Salad",
      category: "Salad",
      price: 85,
      stock: 45,
      image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=300&h=200&fit=crop&crop=center",
      description: "Healthy quinoa, mixed greens, nuts",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },

    // 🥪 Snacks
    {
      name: "Veg Burger",
      category: "Burger",
      price: 50,
      stock: 150,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
      description: "Vegetable patty, fresh veggies, sauce",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "Samosa",
      category: "Snacks",
      price: 15,
      stock: 400,
      image: "https://images.unsplash.com/photo-1601050690294-397f3c324515?auto=format&fit=crop&w=800&q=80",
      description: "Crispy pastry, spiced potatoes, peas",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },
    {
      name: "French Fries",
      category: "Snacks",
      price: 60,
      stock: 200,
      image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
      description: "Golden crispy fries, sea salt",
      rating: (Math.random() * 1.5 + 3.5).toFixed(1)
    },

    // 🍳 Breakfast
    {
      name: "Masala Dosa",
      category: "Breakfast",
      price: 60,
      stock: 100,
      image: "https://images.unsplash.com/photo-1725483990122-802996d84699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Crispy crepe, spiced potato filling",
      rating: 4.3
    },
    {
      name: "Plain Dosa",
      category: "Breakfast",
      price: 50,
      stock: 120,
      image: "https://images.unsplash.com/photo-1694849789325-914b71ab4075?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Thin crispy crepe, chutneys",
      rating: 4.1
    },
    {
      name: "Idli Sambar",
      category: "Breakfast",
      price: 40,
      stock: 200,
      image: "https://images.unsplash.com/photo-1657196118354-f25f29fe636d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Steamed rice cakes, lentil soup",
      rating: 4.2
    },
    {
      name: "Pongal",
      category: "Breakfast",
      price: 55,
      stock: 90,
      image: "https://plus.unsplash.com/premium_photo-1664391850490-8e164423c3a7?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Creamy rice, lentil dish, ghee",
      rating: 4.0
    },

    // 🍛 Lunch
    {
      name: "Veg Fried Rice",
      category: "Lunch",
      price: 90,
      stock: 80,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
      description: "Veg fried rice",
      rating: 4.2
    },
    {
      name: "Paneer Butter Masala",
      category: "Lunch",
      price: 120,
      stock: 60,
      image: "https://plus.unsplash.com/premium_photo-1669831178095-005ed789250a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Paneer butter masala",
      rating: 4.6
    },
    {
      name: "Chicken Biryani",
      category: "Lunch",
      price: 150,
      stock: 70,
      image: "https://plus.unsplash.com/premium_photo-1694141251673-1758913ade48?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Chicken biryani",
      rating: 4.7
    },
    {
      name: "Veg Thali",
      category: "Lunch",
      price: 110,
      stock: 90,
      image: "https://media.istockphoto.com/id/1158623408/photo/indian-hindu-veg-thali-food-platter-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=WOCrpfQJRlyY9W84K4iAaIfJVCWbIs_UroFYKK9y1Qg=",
      description: "Veg thali",
      rating: 4.4
    },

    // ☕ Beverages
    {
      name: "Tea",
      category: "Beverages",
      price: 20,
      stock: 300,
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
      description: "Hot brewed tea, milk, spices",
      rating: 4.1
    },
    {
      name: "Coffee",
      category: "Beverages",
      price: 30,
      stock: 250,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      description: "Freshly brewed coffee, milk",
      rating: 4.3
    },
    {
      name: "Cold Coffee",
      category: "Beverages",
      price: 45,
      stock: 180,
      image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80",
      description: "Chilled coffee, ice cream",
      rating: 4.4
    },
    {
      name: "Fresh Lime Juice",
      category: "Beverages",
      price: 35,
      stock: 160,
      image: "https://images.unsplash.com/photo-1612078902883-77b82ae10aa7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Freshly squeezed lime juice, mint",
      rating: 4.2
    },

    // 🍰 Desserts
    {
      name: "Chocolate Cake",
      category: "Dessert",
      price: 70,
      stock: 50,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Rich chocolate cake, creamy frosting"
    },
    {
      name: "Gulab Jamun",
      category: "Dessert",
      price: 40,
      stock: 100,
      image: "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Sweet dumplings, rose-flavored syrup"
    },
    {
      name: "Ice Cream",
      category: "Dessert",
      price: 50,
      stock: 120,
      image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
      description: "Creamy vanilla ice cream scoop"
    },
    {
      name: "Fruit Salad",
      category: "Salad",
      price: 45,
      stock: 90,
      image: "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?auto=format&fit=crop&w=800&q=80",
      description: "Fresh seasonal fruits, honey dressing"
    },

    // 🔥 Snacks (formerly Craving)
    {
      name: "Loaded Nachos",
      category: "Snacks",
      price: 140,
      stock: 30,
      image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop&crop=center",
      description: "Tortilla chips, cheese, jalapeños, sour cream",
      rating: 4.8
    },
    {
      name: "Garlic Bread",
      category: "Snacks",
      price: 80,
      stock: 40,
      image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=300&h=200&fit=crop&crop=center",
      description: "Toasted bread, garlic butter, herbs",
      rating: 4.6
    },

    // ✨ Pasta (formerly New)
    {
      name: "Truffle Risotto",
      category: "Pasta",
      price: 180,
      stock: 20,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=200&fit=crop&crop=center",
      description: "Creamy arborio rice, black truffle, parmesan",
      rating: 4.9
    },

    // ✨ Salad (formerly New)
    {
      name: "Keto Bowl",
      category: "Salad",
      price: 130,
      stock: 35,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop&crop=center",
      description: "Low-carb veggies, grilled chicken, avocado",
      rating: 4.7
    },

    // ✨ Beverages (formerly New)
    {
      name: "Matcha Latte",
      category: "Beverages",
      price: 90,
      stock: 50,
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&h=200&fit=crop&crop=center",
      description: "Premium matcha, steamed milk, honey",
      rating: 4.5
    }
  ];

  for (const item of foodItems) {
    await FoodItem.findOneAndUpdate(
      { name: item.name },
      { ...item, isAvailable: true },
      { upsert: true, new: true }
    );
  }
  console.log("✅ 20+ menu items seeded/updated successfully");
};

module.exports = seedFood;
