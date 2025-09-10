import { verifyWebhook } from "@clerk/express/webhooks"
import User from "../models/user.model.js"
import { getAuth } from "@clerk/express"

// Parse Clerk webhook payloads
export const webhookHandler = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);

    const data = evt.data
    const { id } = evt.data
    const eventType = evt.type

    if (eventType === "user.created") {
      const newUser = await User.create({
        clerkId: id,
        email: data.email_addresses[0]?.email_address,
        name: data.username,
        tokenBalance: 3,
      })
    }

    return res.send("Webhook received")
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return res.status(400).send("Error verifying webhook")
  }
}

export const getMe = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Clerk session found",
      })
    }

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unable to fetch user",
      })
    }

    return res.status(200).json({
      success: true,
      message: "User Fetched successfully",
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching user",
    })
  }
}
