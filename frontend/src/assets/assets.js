import basket_icon from './basket_icon.png'
import header_img from './header_img.png'
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'
import search_icon from './search_icon.png'

import food_1 from './food_1.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_2 from './food_2.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import food_23 from './food_23.png'
import food_24 from './food_24.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_27 from './food_27.png'
import food_28 from './food_28.png'
import food_29 from './food_29.png'
import food_3 from './food_3.png'
import food_30 from './food_30.png'
import food_31 from './food_31.png'
import food_32 from './food_32.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_8 from './food_8.png'
import food_9 from './food_9.png'

import add_icon_green from './add_icon_green.png'
import add_icon_white from './add_icon_white.png'
import app_store from './app_store.png'
import bag_icon from './bag_icon.png'
import cross_icon from './cross_icon.png'
import facebook_icon from './facebook_icon.png'
import HH_logo from './HH_logo.png'
import linkedin_icon from './linkedin_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import play_store from './play_store.png'
import profile_icon from './profile_icon.png'
import rating_starts from './rating_starts.png'
import remove_icon_red from './remove_icon_red.png'
import res1 from './res1.jpg'
import res2 from './res2.jpg'
import res3 from './res3.jpg'
import res4 from './res4.jpg'
import res5 from './res5.jpg'
import res6 from './res6.jpg'
import selector_icon from './selector_icon.png'
import twitter_icon from './twitter_icon.png'

// Base64 encoded simple image for "not found"
export const not_found = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgC...";
export const assets = {
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon,
    HH_logo,
    res1,
    res2,
    res3,
    res4,
    res5,
    res6,
    not_found,
    food_1,
    food_2,
    food_3,
    food_4,
    food_5,
    food_6,
    food_7,
    food_8,
    food_9,
    food_10,
    food_11,
    food_12,
    food_13,
    food_14,
    food_15,
    food_16,
    food_17,
    food_18,
    food_19,
    food_20,
    food_21,
    food_22,
    food_23,
    food_24,
    food_25,
    food_26,
    food_27,
    food_28,
    food_29,
    food_30,
    food_31,
    food_32
    

}

export const menu_list = [
    {
        menu_name: "All",
        menu_image: header_img
    },
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Rolls",
        menu_image: menu_2
    },
    {
        menu_name: "Deserts",
        menu_image: menu_3
    },
    {
        menu_name: "Sandwich",
        menu_image: menu_4
    },
    {
        menu_name: "Cake",
        menu_image: menu_5
    },
    {
        menu_name: "Pure Veg",
        menu_image: menu_6
    },
    {
        menu_name: "Pasta",
        menu_image: menu_7
    },
    {
        menu_name: "Noodles",
        menu_image: menu_8
    }
]

export const food_list = [
    {
        _id: "1",
        name: "Greek salad",
        image: food_1,
        price: 12,
        description: "Fresh mix of crisp lettuce, cucumbers, tomatoes, olives, feta cheese and a zesty Mediterranean dressing",
        category: "Salad",
        popular: true
    },
    {
        _id: "2",
        name: "Veg salad",
        image: food_2,
        price: 18,
        description: "Colorful medley of seasonal vegetables with a light vinaigrette dressing for a refreshing experience",
        category: "Salad"
    }, {
        _id: "3",
        name: "Clover Salad",
        image: food_3,
        price: 16,
        description: "Unique blend of microgreens, avocado, and special clover dressing for a nutrient-rich meal",
        category: "Salad"
    }, {
        _id: "4",
        name: "Chicken Salad",
        image: food_4,
        price: 24,
        description: "Tender grilled chicken strips on a bed of fresh greens with cherry tomatoes and house dressing",
        category: "Salad",
        popular: true
    }, {
        _id: "5",
        name: "Lasagna Rolls",
        image: food_5,
        price: 14,
        description: "Rolled lasagna noodles filled with ricotta cheese and marinara sauce, baked to perfection",
        category: "Rolls"
    }, {
        _id: "6",
        name: "Peri Peri Rolls",
        image: food_6,
        price: 12,
        description: "Spicy peri-peri flavored chicken wrapped in a soft tortilla with fresh vegetables",
        category: "Rolls",
        popular: true
    }, {
        _id: "7",
        name: "Chicken Rolls",
        image: food_7,
        price: 20,
        description: "Tender chicken pieces with fresh vegetables and special sauce wrapped in a flaky pastry",
        category: "Rolls"
    }, {
        _id: "8",
        name: "Veg Rolls",
        image: food_8,
        price: 15,
        description: "Crispy rolls filled with seasoned mixed vegetables and aromatic spices",
        category: "Rolls"
    }, {
        _id: "9",
        name: "Ripple Ice Cream",
        image: food_9,
        price: 14,
        description: "Creamy vanilla ice cream with swirls of chocolate or fruit ripples for a delightful treat",
        category: "Deserts",
        popular: true
    }, {
        _id: "10",
        name: "Fruit Ice Cream",
        image: food_10,
        price: 22,
        description: "Refreshing ice cream made with real fruit chunks for a natural sweetness and flavor",
        category: "Deserts"
    }, {
        _id: "11",
        name: "Jar Ice Cream",
        image: food_11,
        price: 10,
        description: "Artisanal layered ice cream served in a jar with cookie crumbles and sauce",
        category: "Deserts"
    }, {
        _id: "12",
        name: "Vanilla Ice Cream",
        image: food_12,
        price: 12,
        description: "Classic smooth and creamy vanilla ice cream made with premium ingredients",
        category: "Deserts"
    },
    {
        _id: "13",
        name: "Chicken Sandwich",
        image: food_13,
        price: 12,
        description: "Grilled chicken breast with lettuce, tomato, and mayonnaise on freshly baked bread",
        category: "Sandwich",
        popular: true
    },
    {
        _id: "14",
        name: "Vegan Sandwich",
        image: food_14,
        price: 18,
        description: "Plant-based delight with hummus, avocado, and fresh vegetables on whole grain bread",
        category: "Sandwich"
    }, {
        _id: "15",
        name: "Grilled Sandwich",
        image: food_15,
        price: 16,
        description: "Toasted sandwich with melted cheese and your choice of fillings for a warm comfort meal",
        category: "Sandwich"
    }, {
        _id: "16",
        name: "Bread Sandwich",
        image: food_16,
        price: 24,
        description: "Classic sandwich with premium fillings between slices of artisanal bread",
        category: "Sandwich"
    }, {
        _id: "17",
        name: "Cup Cake",
        image: food_17,
        price: 14,
        description: "Moist and fluffy small cake topped with creamy frosting and decorative sprinkles",
        category: "Cake",
        popular: true
    }, {
        _id: "18",
        name: "Vegan Cake",
        image: food_18,
        price: 12,
        description: "Egg-free and dairy-free cake that's just as delicious as traditional varieties",
        category: "Cake"
    }, {
        _id: "19",
        name: "Butterscotch Cake",
        image: food_19,
        price: 20,
        description: "Rich cake with caramelized brown sugar flavor and butterscotch chips throughout",
        category: "Cake",
        popular: true
    }, {
        _id: "20",
        name: "Sliced Cake",
        image: food_20,
        price: 15,
        description: "Perfect individual portion of our signature cake for a quick sweet treat",
        category: "Cake"
    }, {
        _id: "21",
        name: "Garlic Mushroom ",
        image: food_21,
        price: 14,
        description: "Sautéed mushrooms in a rich garlic butter sauce, a perfect vegetarian delicacy",
        category: "Pure Veg"
    }, {
        _id: "22",
        name: "Fried Cauliflower",
        image: food_22,
        price: 22,
        description: "Crispy cauliflower florets with a flavorful batter and spice blend",
        category: "Pure Veg",
        popular: true
    }, {
        _id: "23",
        name: "Mix Veg Pulao",
        image: food_23,
        price: 10,
        description: "Fragrant rice cooked with mixed vegetables and aromatic spices for a complete meal",
        category: "Pure Veg"
    }, {
        _id: "24",
        name: "Rice Zucchini",
        image: food_24,
        price: 12,
        description: "Light and healthy zucchini spirals with seasoned rice for a modern vegetarian dish",
        category: "Pure Veg"
    },
    {
        _id: "25",
        name: "Cheese Pasta",
        image: food_25,
        price: 12,
        description: "Creamy pasta with a rich cheese sauce, perfect for comfort food cravings",
        category: "Pasta",
        popular: true
    },
    {
        _id: "26",
        name: "Tomato Pasta",
        image: food_26,
        price: 18,
        description: "Classic pasta in a fresh tomato sauce with herbs and a touch of olive oil",
        category: "Pasta"
    }, {
        _id: "27",
        name: "Creamy Pasta",
        image: food_27,
        price: 16,
        description: "Pasta in a smooth, velvety cream sauce with a blend of Italian seasonings",
        category: "Pasta"
    }, {
        _id: "28",
        name: "Chicken Pasta",
        image: food_28,
        price: 24,
        description: "Hearty pasta with tender chicken pieces in a flavorful sauce for a satisfying meal",
        category: "Pasta",
        popular: true
    }, {
        _id: "29",
        name: "Butter Noodles",
        image: food_29,
        price: 14,
        description: "Simple yet delicious noodles tossed in butter and herbs for a comforting dish",
        category: "Noodles"
    }, {
        _id: "30",
        name: "Veg Noodles",
        image: food_30,
        price: 12,
        description: "Stir-fried noodles with crisp vegetables and savory sauce for a quick meal",
        category: "Noodles",
        popular: true
    }, {
        _id: "31",
        name: "Somen Noodles",
        image: food_31,
        price: 20,
        description: "Thin Japanese wheat noodles served chilled with a dipping sauce for a refreshing option",
        category: "Noodles"
    }, {
        _id: "32",
        name: "Cooked Noodles",
        image: food_32,
        price: 15,
        description: "Perfectly cooked noodles ready to be paired with your choice of sauce or toppings",
        category: "Noodles"
    }
]

// Popular food items (for featured sections)
export const popular_food = food_list.filter(item => item.popular === true);

// Restaurant data
export const restaurant_list = [
    {
        id: 1,
        name: "The Urban Kitchen",
        image: res1,
        rating: 4.8,
        delivery_time: "25-30 min",
        distance: "1.2 km",
        categories: ["Italian", "Continental"]
    },
    {
        id: 2,
        name: "Spice Garden",
        image: res2,
        rating: 4.6,
        delivery_time: "30-40 min",
        distance: "2.5 km",
        categories: ["Indian", "Chinese"]
    },
    {
        id: 3,
        name: "Green Bistro",
        image: res3,
        rating: 4.7,
        delivery_time: "20-25 min",
        distance: "1.8 km",
        categories: ["Healthy", "Vegan"]
    },
    {
        id: 4,
        name: "Burger House",
        image: res4,
        rating: 4.5,
        delivery_time: "15-20 min",
        distance: "0.8 km",
        categories: ["Fast Food", "American"]
    },
    {
        id: 5,
        name: "Sushi Kingdom",
        image: res5,
        rating: 4.9,
        delivery_time: "25-35 min",
        distance: "3.2 km",
        categories: ["Japanese", "Asian"]
    },
    {
        id: 6,
        name: "Mexican Fiesta",
        image: res6,
        rating: 4.4,
        delivery_time: "30-40 min",
        distance: "2.7 km",
        categories: ["Mexican", "Latin American"]
    }
];

export default assets;