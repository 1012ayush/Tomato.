import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => { // Destructure the prop properly
    const { food_list } = useContext(StoreContext)
    
    // Debug logging
    console.log('Food List:', food_list);
    console.log('Selected Category:', category);
    
    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    console.log('Item Category:', item.category, 'Selected Category:', category);
                    
                    // Use more flexible comparison
                    if (category === "All" || !category || category === item.category) {
                        return (
                            <FoodItem 
                                key={index} 
                                id={item._id} 
                                name={item.name} 
                                description={item.description}  
                                price={item.price} 
                                image={item.image}
                            />
                        )
                    }
                    return null; // Important: return null for items that don't match
                })}
            </div>
        </div>
    )
}

export default FoodDisplay