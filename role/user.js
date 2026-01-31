import express from " express" 
import { ensureauthenticated } from "../Middleware/autheriozation"

const router =express.Router()

router.use(ensureauthenticated)

router.get("  ")