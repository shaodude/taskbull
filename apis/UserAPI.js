import {
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "./firestore";

const getUserData = async (userId) => {
  try {
    // Fetch user data
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    const userData = docSnap.data();
    return userData;
  } catch (e) {
    console.error("Error fetching user details:", e);
    throw e;
  }
};

const postUserData = async (userId, data) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, data);
    console.log("User data successfully updated!");
  } catch (e) {
    console.error("Error updating user data: ", e);
  }
};

export { getUserData, postUserData };
