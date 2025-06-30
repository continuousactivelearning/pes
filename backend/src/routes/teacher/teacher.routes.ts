console.log("✅ teacher.routes.ts loaded");

import { Router } from "express";
import { getTeacherCourses } from "../../controllers/teacher/getTeacherCourses.controller.ts";
import { getEscalatedTickets, resolveEscalatedTicket } from "../../controllers/teacher/teacherEscalatedTicket.controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";

const router = Router();

router.get("/courses", authMiddleware, getTeacherCourses);

router.get("/test", (req, res) => {
  console.log("/api/teacher/test HIT");
  res.send("Hello from teacher route");
});

// ✅ THIS WAS MISSING — ADD IT BACK:
router.get("/tickets/escalated", authMiddleware, getEscalatedTickets);

router.put("/tickets/:ticketId/resolve", authMiddleware, resolveEscalatedTicket);

export default router;
