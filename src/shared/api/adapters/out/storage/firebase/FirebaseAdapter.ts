// src/shared/api/adapters/out/storage/firebase/FirebaseAdapter.ts
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  orderBy,
  where,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { Task } from "@/entities";
import { TaskStorage } from "@/shared/api/ports/out/storage/";
import { db, CURRENT_USER_ID } from "./config";

export class FirebaseAdapter implements TaskStorage {
  private getCollectionPath() {
    return `users/${CURRENT_USER_ID}/tasks`;
  }

  private getArchiveCollectionPath() {
    return `users/${CURRENT_USER_ID}/archive`;
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

  async archiveTask(taskId: string): Promise<void> {
    try {
      console.log("FirebaseAdapter: Archiving task with ID:", taskId);
      const batch = writeBatch(db);
      const collectionPath = this.getCollectionPath();
      const taskDocRef = doc(db, collectionPath, taskId);

      // First, get the task data
      const taskSnapshot = await getDoc(taskDocRef);

      if (!taskSnapshot.exists()) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      const taskData = taskSnapshot.data();

      // Add completion date and other metadata
      const archivedTaskData = {
        ...taskData,
        completedDate: new Date().toISOString(),
        archivedAt: Timestamp.now(),
      };

      // Store in archive collection
      const archiveCollectionPath = this.getArchiveCollectionPath();
      const archiveDocRef = doc(db, archiveCollectionPath, taskId);

      // Add the task to the archive with its data including completion date
      batch.set(archiveDocRef, archivedTaskData);

      // Delete the original task
      batch.delete(taskDocRef);

      console.log("FirebaseAdapter: Committing batch...");
      await batch.commit();
      console.log("FirebaseAdapter: Task archived successfully");
    } catch (error) {
      console.error("Error archiving task in Firebase:", error);
      throw error;
    }
  }

  async getArchivedTasks(): Promise<Record<string, Task[]>> {
    try {
      console.log("FirebaseAdapter: Fetching archived tasks");

      const archiveQuery = query(
        collection(db, this.getArchiveCollectionPath()),
        orderBy("completedDate", "desc")
      );

      const snapshot = await getDocs(archiveQuery);
      console.log(
        "FirebaseAdapter: Got archived tasks snapshot, count:",
        snapshot.size
      );

      // Initialize result object
      const tasksByDate: Record<string, Task[]> = {};

      // Group tasks by date
      snapshot.docs.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() } as Task & {
          completedDate: string;
        };

        // Extract just the date part (YYYY-MM-DD) from the ISO string
        const dateOnly = task.completedDate.split("T")[0];

        if (!tasksByDate[dateOnly]) {
          tasksByDate[dateOnly] = [];
        }

        tasksByDate[dateOnly].push(task as Task);
      });

      return tasksByDate;
    } catch (error) {
      console.error("Error fetching archived tasks from Firebase:", error);
      throw error;
    }
  }

  async getArchivedTasksForDate(date: string): Promise<Task[]> {
    try {
      console.log(`FirebaseAdapter: Fetching archived tasks for date: ${date}`);

      // Create start and end timestamps for the given date
      const startDate = new Date(`${date}T00:00:00.000Z`).toISOString();
      const endDate = new Date(`${date}T23:59:59.999Z`).toISOString();

      const archiveQuery = query(
        collection(db, this.getArchiveCollectionPath()),
        orderBy("completedDate", "asc"),
        where("completedDate", ">=", startDate),
        where("completedDate", "<=", endDate)
      );

      const snapshot = await getDocs(archiveQuery);
      console.log(
        `FirebaseAdapter: Got archived tasks for ${date}, count:`,
        snapshot.size
      );

      const tasks = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Task)
      );

      return tasks;
    } catch (error) {
      console.error(`Error fetching archived tasks for date ${date}:`, error);
      throw error;
    }
  }

  async getArchivedTasksForDateRange(
    startDate: string,
    endDate: string
  ): Promise<Task[]> {
    try {
      console.log(
        `FirebaseAdapter: Fetching archived tasks from ${startDate} to ${endDate}`
      );

      // Create start and end timestamps
      const startTimestamp = new Date(
        `${startDate}T00:00:00.000Z`
      ).toISOString();
      const endTimestamp = new Date(`${endDate}T23:59:59.999Z`).toISOString();

      const archiveQuery = query(
        collection(db, this.getArchiveCollectionPath()),
        orderBy("completedDate", "asc"),
        where("completedDate", ">=", startTimestamp),
        where("completedDate", "<=", endTimestamp)
      );

      const snapshot = await getDocs(archiveQuery);
      console.log(
        `FirebaseAdapter: Got archived tasks from ${startDate} to ${endDate}, count:`,
        snapshot.size
      );

      const tasks = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Task)
      );

      return tasks;
    } catch (error) {
      console.error(
        `Error fetching archived tasks from ${startDate} to ${endDate}:`,
        error
      );
      throw error;
    }
  }
}
