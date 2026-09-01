import { Schema, type Query } from "mongoose";

// Adds `deletedAt` + filters it out of read/update queries by default, so
// every model in the Category -> Project -> ProjectSection -> Media chain
// gets the same soft-delete semantics without repeating the logic 4x.
// Callers that need soft-deleted docs back can pass `{ deletedAt: ... }`
// explicitly in their own filter to opt out of the default exclusion.
export function softDeletePlugin(schema: Schema): void {
  schema.add({ deletedAt: { type: Date, default: null } });
  schema.index({ deletedAt: 1 });

  // This Mongoose version's query pre-hooks are promise-based (this, opts?) =>
  // void | Promise<void> — no next() callback, unlike older Mongoose.
  schema.pre(
    ["find", "findOne", "findOneAndUpdate", "countDocuments"],
    function (this: Query<unknown, unknown>) {
      if (this.getFilter().deletedAt === undefined) {
        this.where({ deletedAt: null });
      }
    }
  );
}
