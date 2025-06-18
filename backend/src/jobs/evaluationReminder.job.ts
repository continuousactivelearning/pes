import cron from "node-cron";
import { Evaluation } from "../models/Evaluation.ts";
import { User } from "../models/User.ts";
import { sendReminderEmail } from "../utils/email.ts";

cron.schedule("0 21 * * *", async () => {
  console.log("Running evaluation reminder job...");
  try {
    const pendingEvaluations = await Evaluation.find({ status: "pending" });

    const evaluatorIds = [
      ...new Set(pendingEvaluations.map((ev) => ev.evaluator.toString())),
    ];

    const users = await User.find({ _id: { $in: evaluatorIds } });

    for (const user of users) {
      await sendReminderEmail(
        user.email,
        "Peer Evaluation Reminder",
        `Dear ${user.name},\n\nYou have pending peer evaluations. Please complete them as soon as possible.\n\nThank you!`
      );
      console.log(`Reminder sent to ${user.email}`);
    }
  } catch (error) {
    console.error("Error sending evaluation reminders:", error);
  }
});