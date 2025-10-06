import { db } from "../src/db";
import { agents, users } from "../src/drizzle/schema";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🔍 Checking agents in database...\n");

  const allAgents = await db.select().from(agents);
  const allUsers = await db.select().from(users);

  console.log(`📊 Found ${allUsers.length} users and ${allAgents.length} agent records\n`);

  for (const agent of allAgents) {
    const user = allUsers.find((u) => u.id === agent.userId);
    console.log(`Agent ID: ${agent.id}`);
    console.log(`  User: ${user?.name || user?.email || "Unknown"}`);
    console.log(`  ElevenLabs Agent ID: ${agent.agentId}`);
    console.log(`  Created: ${agent.createdAt}`);
    console.log(`  Updated: ${agent.updatedAt}`);
    console.log("");
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
