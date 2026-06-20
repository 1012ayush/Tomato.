import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Place Order
const placeOrder = async (req, res) => {
    const frontend_url = "https://tomato-frontend-05oc.onrender.com";

    try {
        // Validation check to prevent empty checkout errors
        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Save order structure to DB
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        // Clear user cart upon proceeding to gateway
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Map items to Stripe format
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100) // Math.round avoids floating-point issues
            },
            quantity: item.quantity
        }));

        // Append fixed delivery fee
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Charges" },
                unit_amount: 2 * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("PLACE ORDER ERROR →", error);
        res.status(500).json({ success: false, message: "Failed to process order" });
    }
};

// 2. Verify Order Payment Status
const verifyOrder = async (req, res) => {
    // Looks at both body and query fallback to prevent route configuration mismatches
    const orderId = req.body.orderId || req.query.orderId;
    const success = req.body.success || req.query.success;

    try {
        // Checks both boolean true and string literal "true"
        if (success === true || success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Paid" });
        } else {
            // Deletes the unpaid order record clean from DB
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("VERIFY ORDER ERROR →", error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

// 3. Fetch User-Specific Orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("USER ORDERS ERROR →", error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
    }
};

// 4. Admin Order Listing
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("LIST ORDERS ERROR →", error);
        res.status(500).json({ success: false, message: "Error listing orders" });
    }
};

// 5. Update Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("UPDATE STATUS ERROR →", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
