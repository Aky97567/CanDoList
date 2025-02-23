// src/shared/api/adapters/out/storage/firebase/FirebaseAdapter.ts
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { Task } from "@/entities";
import { TaskStorage } from "@/shared/api/ports/out/storage/";
import { db, CURRENT_USER_ID } from "./config";

export class FirebaseAdapter implements TaskStorage {
  private getCollectionPath() {
    return `users/${CURRENT_USER_ID}/tasks`;
  }

  async getTasks(): Promise<Task[]> {
    try {
      console.log(
        "FirebaseAdapter: Fetching tasks from path:",
        this.getCollectionPath()
      );

      const tasksQuery = query(
        collection(db, this.getCollectionPath()),
        orderBy("rank", "desc")
      );

      console.log("FirebaseAdapter: Executing query...");
      const snapshot = await getDocs(tasksQuery);

      console.log(
        "FirebaseAdapter: Got snapshot, document count:",
        snapshot.size
      );
      const tasks = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Task)
      );

      console.log("FirebaseAdapter: Mapped tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks from Firebase:", error);
      throw error;
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      console.log("FirebaseAdapter: Saving tasks:", tasks);
      const batch = writeBatch(db);
      const collectionPath = this.getCollectionPath();

      console.log("FirebaseAdapter: Getting existing tasks...");
      const existingSnapshot = await getDocs(collection(db, collectionPath));
      const existingIds = new Set(existingSnapshot.docs.map((doc) => doc.id));
      const newIds = new Set(tasks.map((task) => task.id));

      console.log("FirebaseAdapter: Existing IDs:", existingIds);
      console.log("FirebaseAdapter: New IDs:", newIds);

      existingSnapshot.docs.forEach((doc) => {
        if (!newIds.has(doc.id)) {
          console.log("FirebaseAdapter: Deleting task:", doc.id);
          batch.delete(doc.ref);
        }
      });

      tasks.forEach((task) => {
        console.log("FirebaseAdapter: Setting task:", task.id);
        const docRef = doc(db, collectionPath, task.id);
        batch.set(docRef, task);
      });

      console.log("FirebaseAdapter: Committing batch...");
      await batch.commit();
      console.log("FirebaseAdapter: Batch committed successfully");
    } catch (error) {
      console.error("Error saving tasks to Firebase:", error);
      throw error;
    }
  }

  async updateTaskRanks(taskIds: string[], ranks: string[]): Promise<void> {
    try {
      console.log("FirebaseAdapter: Updating ranks for tasks:", taskIds);
      const batch = writeBatch(db);
      const collectionPath = this.getCollectionPath();

      taskIds.forEach((taskId, index) => {
        console.log(
          `FirebaseAdapter: Setting rank ${ranks[index]} for task ${taskId}`
        );
        const docRef = doc(db, collectionPath, taskId);
        batch.update(docRef, { rank: ranks[index] });
      });

      console.log("FirebaseAdapter: Committing rank updates...");
      await batch.commit();
      console.log("FirebaseAdapter: Rank updates committed successfully");
    } catch (error) {
      console.error("Error updating task ranks in Firebase:", error);
      throw error;
    }
  }
}
