import { getDoc, doc, updateDoc } from "firebase/firestore";
import db from "./firestore";

const getUserData = async (userId) => {
  try {
    // Fetch user data
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    const rankListdocRef = doc(db, "users", "ranksList");
    const rankListdocSnap = await getDoc(rankListdocRef);

    // Extract data
    let userData = docSnap.data();
    const rankData = rankListdocSnap.data();

    // Add rankData to userData under the 'rank' key
    userData = {
      ...userData,
      rank: rankData.ranks
    };

    console.log(userData);
    console.log("User data successfully fetched!");
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
